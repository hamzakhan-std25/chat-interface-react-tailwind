const { WebSocketServer } = require('ws')
const GeminiService = require('../services/geminiService');
const geminiService = require('../services/geminiService');




function configureWebsockets(server) {
    const wss = new WebSocketServer({ server });



    const userSessions = new Map();

    wss.on('connection', (ws) => {
        console.log("➕ client connected");



        const sessionId = Date.now().toString();
        const chatHistory = [];
        console.log('created sesison id :', sessionId)



        userSessions.set(sessionId, {
            ws,
            chatHistory,
            isProcessing: false
        });


        // console.log(userSessions)


        // ws.on("message", async (data) => {

        //     const strData = data.toString('utf8')
        //     const jsonData = JSON.parse(strData);


        //     console.log("📩 from client:", jsonData);

        //     ws.send(JSON.stringify({ type: 'ai', message: jsonData.message }));

        // });

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                if (data.type === 'message') {
                    await handleUserMessage(sessionId, data, chatHistory);
                }

                if (data.type === 'clear_history') {
                    chatHistory.length = 0;
                    ws.send(JSON.stringify({
                        type: 'history_cleared',
                        message: 'Chat history cleared'
                    }));
                }

            } catch (error) {
                console.error('Error processing message:', error);
                sendError(ws, 'Invalid message format');
            }
        });




        ws.on("close", () => console.log("👋 client disconnected"));





        ws.send(JSON.stringify({
            type: 'ai',
            sender: 'Assitent',
            message: "Hello! I'm your AI assistant. How can I help you today?",
            timestamp: new Date().toISOString()
        }));

    });





    
    async function handleUserMessage(sessionId, data, chatHistory) {
        const session = userSessions.get(sessionId);
        if (!session || session.isProcessing) return;

        session.isProcessing = true;
        const { ws } = session;
        const userMessage = data.message;

        try {
            // Add user message to history
            chatHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // Send typing indicator
            ws.send(JSON.stringify({
                type: 'typing_start',
                message: 'AI is thinking...'
            }));

            // console.log('chat history is :',chatHistory[0].parts[0].text)

            // console.log('chat history is : ', chatHistory);

            chatHistory.forEach(element => {
                console.log(element);
                
            });






            // Generate response with streaming
            await GeminiService.generateResponseStream(
                chatHistory,
                // onChunk callback
                (chunkText, fullText) => {
                    ws.send(JSON.stringify({
                        type: 'message_chunk',
                        chunk: chunkText,
                        message: fullText,
                        isComplete: false,
                        timestamp: new Date().toISOString()
                    }));
                },
                // onComplete callback
                (fullResponse) => {
                    // Add AI response to history
                    chatHistory.push({
                        role: 'model',
                        parts: [{ text: fullResponse }]
                    });

                    ws.send(JSON.stringify({
                        type: 'message_complete',
                        sender: 'ai',
                        message: fullResponse,
                        isComplete: true,
                        timestamp: new Date().toISOString()
                    }));



                },
                // onError callback
                (error) => {
                    console.error('Streaming error:', error);
                    sendError(ws, 'Sorry, I encountered an error while generating response.');
                }




            );


            // const result = await geminiService.generateResponse(chatHistory);

            // ws.send(JSON.stringify({
            //     type : 'ai',
            //     message:result
            // }))




        } catch (error) {
            console.error('Error:', error);
            sendError(ws, 'Sorry, I encountered an error. Please try again.');
        } finally {
            session.isProcessing = false;
        }
    }



    function sendError(ws, message) {
        ws.send(JSON.stringify({
            type: 'error',
            message,
            timestamp: new Date().toISOString()
        }));
    }








}
module.exports = configureWebsockets;
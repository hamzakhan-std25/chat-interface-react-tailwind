const { WebSocketServer } = require('ws')
const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()
const GeminiService = require('../services/geminiService');




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



        ws.on('message', async (message, isbinary) => {



            try {
                if (isbinary) {

                    
                    
                    // Create message object
                    const data = {
                        type: 'message',
                        message: "reply back :-- i am sorry i can't access your voice content. please try to communicate in chat--",
                        userId: 333333,
                    };
                    await handleUserMessage(sessionId, data, chatHistory),

                    
                    console.log('voice message is deliver form client ')
                    await handleUserVoice(sessionId, message, chatHistory); // the message is buffer of voice 

                }
                else {
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
                }


            } catch (error) {
                console.error('Error processing message:', error);
                sendError(ws, 'Invalid message format : ' + error);
            }


        });


        ws.on("close", () => console.log("👋 client disconnected"));

    });






    async function handleUserMessage(sessionId, data, chatHistory) {
        const session = userSessions.get(sessionId);
        if (!session || session.isProcessing) return;

        session.isProcessing = true;
        const { ws } = session;
        const userMessage = data.message;

        try {
            console.log('New msg : ', data.message)
            // Add user message to history
            chatHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // // Send typing indicator
            // ws.send(JSON.stringify({
            //     type: 'typing_start',
            //     message: 'AI is thinking...'
            // }));



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

            // print all msgs in chatHistory that sent to ai as context
            chatHistory.forEach(element => {
                console.log(element);
            });


        } catch (error) {
            console.error('Error:', error);
            sendError(ws, 'Sorry, I encountered an error. Please try again.');
        } finally {
            session.isProcessing = false;
        }
    }

    async function handleUserVoice(sessionId, message, chatHistory) {
        const session = userSessions.get(sessionId);
        if (!session || session.isProcessing) return;

        session.isProcessing = true;
        const { ws } = session;

        // for checking the vice buffer is delever ok
        const buffer = Buffer.from(message);

        console.log('Received audio data:', {
            size: buffer.length,
            bytes: buffer.length,

        });

        // 1. Save the buffer to temp file
        const tempPath = `./temp-${Date.now()}.webm`;
        fs.writeFileSync(tempPath, buffer);


        try {

            // 2. Prepare FormData
            const form = new FormData();
            form.append("audio", fs.createReadStream(tempPath));

            // 3. Call your existing /upload route
            const response = await axios.post("http://localhost:8080/upload", form, {
                //todo: need to change url
                headers: form.getHeaders(),
            });

            // 4. Get URL from response and text from speech
            const { url } = response.data;
            console.log('URL index > configurew.. > hanleUserVoice :', url)

            // todo: before sending back url 
            // todo: need to call speech to text 
            // todo: and forward to handleUserMessage


            // 5. Send URL back to WebSocket client
            ws.send(JSON.stringify({ type: "audio_url", url, message: "text from speech will be provided as soon as posible" }));


        } catch (error) {
            console.error("Error transcribing:", error.response?.data || error.message);
            throw error;
        } finally {
            // 4. Cleanup temp file
            fs.unlinkSync(tempPath);
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
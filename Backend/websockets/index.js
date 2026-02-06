const { WebSocketServer } = require('ws')
const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()
const GeminiService = require('../services/geminiService');
const { saveMessage, getMessages } = require('../services/chatService');
const { v4: uuidv4 } = require("uuid");
const MAX_HISTORY = 5;
let userId;






function configureWebsockets(server) {
    const wss = new WebSocketServer({ server });



    const userSessions = new Map();
    // Track cancel flags per session for in-flight generations
    const cancelFlags = new Map();



    function logActiveSessions() {
        console.log("===== Active Sessions =====");
        for (const [sessionId, session] of userSessions.entries()) {
            console.log(`Session: ${sessionId}`);
            console.log(` - IsProcessing: ${session.isProcessing}`);
            console.log(` - Messages in memory: ${session.chatHistory.length}`);
            console.log(` - WebSocket open: ${session.ws.readyState === 1}`);
        }
        console.log("===========================");
    }





    wss.on('connection', (ws) => {
        console.log("➕ client connected");
        logActiveSessions();
        let sessionId;
        let chatHistory = [];



        ws.on('message', async (message, isbinary) => {
            try {
                if (isbinary) {

                    console.log('voice message is deliver form client ')
                    await handleUserVoice(sessionId, message, chatHistory); // the message is buffer of voice 



                    return
                }

                const data = JSON.parse(message);


                // --- init handshake ---
                if (data.type === "init") {
                    // console.log('init send:', data.sessionId)
                    userId = data.userId || 'anonymous';
                    sessionId = data.sessionId;

                    if (sessionId && userSessions.has(sessionId)) {
                        // Reuse existing session
                        ws.sessionId = sessionId;
                        userSessions.get(sessionId).ws = ws;
                        console.log("🔄 Rejoined session:", sessionId);
                    } else {
                        // Create new session
                        sessionId = uuidv4();
                        ws.sessionId = sessionId;
                        userSessions.set(sessionId, {
                            ws,
                            chatHistory,
                            isProcessing: false
                        });
                        console.log("🆕 Created session:", sessionId);
                    }

                    // Reply to client with active sessionId
                    ws.send(JSON.stringify({
                        type: "session_ready",
                        sessionId
                    }));
                    return;
                }



                // --- handle chat messages ---
                if (data.type === "message") {
                    const session = userSessions.get(ws.sessionId);
                    if (!session) throw new Error("Session not found");

                    await handleUserMessage(ws.sessionId, data, session.chatHistory);
                }

                // --- handle cancel generation ---
                if (data.type === 'cancel') {
                    cancelFlags.set(ws.sessionId, true);
                    // Optionally acknowledge cancel
                    ws.send(JSON.stringify({ type: 'canceled' }));
                }

                if (data.type === "clear_history") {
                    const session = userSessions.get(ws.sessionId);
                    if (session) session.chatHistory.length = 0;

                    ws.send(JSON.stringify({
                        type: 'history_cleared',
                        message: 'Chat history cleared'
                    }));
                }


            } catch (error) {
                console.error('Error processing message:', error);
                sendError(ws, 'Invalid message format : ' + error);
            }


        });


        ws.on("close", () => {
            // cleanup cancel flag on disconnect
            cancelFlags.delete(ws.sessionId);
            console.log("👋 client disconnected");
        });

    });








    async function handleUserMessage(sessionId, data, chatHistory) {
        const session = userSessions.get(sessionId);
        if (!session || session.isProcessing) return;

        session.isProcessing = true;
        const { ws } = session;
        const userMessage = data.message;


        try {

            // Add user msg and update chathistory
            chatHistory.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });

            // trim old messages
            if (session.chatHistory.length > MAX_HISTORY) {
                session.chatHistory.shift(); // remove oldest 1
                session.chatHistory.shift(); // remove oldest 2
            }


            // add new message in database
            const newMessage = await saveMessage({
                user_id: data.userId,
                user_name: "NA",
                session_id: sessionId,
                role: "user",
                message_text: userMessage,
                url: data.url || null
            });


            // console.log("Saved:", newMessage);


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
                async (fullResponse) => {
                    // Add AI response to history
                    chatHistory.push({
                        role: 'model',
                        parts: [{ text: fullResponse }]
                    });

                    //add ai respose to database
                    const newMessage = await saveMessage({
                        user_id: data.userId,
                        user_name: "NA",
                        session_id: sessionId,
                        role: "ai",
                        message_text: fullResponse
                    });


                    // console.log("Saved:", newMessage);


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
                },
                // options
                {
                    shouldCancel: () => cancelFlags.get(sessionId) === true
                }
            );

            // reset cancel flag for next turn
            cancelFlags.set(sessionId, false);


            // print all msgs in chatHistory that sent to ai as context
            // chatHistory.forEach(element => {
            //     console.log(element);
            // });
            
            console.log("Total messages in context:", chatHistory.length);


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
            const response = await axios.post("https://chatbothm-ddggvlhj.b4a.run/upload", form, {
            // const response = await axios.post("http://localhost:8080/upload", form, {
                headers: form.getHeaders(),
            });


            // 4. Get URL from response and text from speech
            const { url } = response.data;
            
            
            // 4. Cleanup temp file
            fs.unlinkSync(tempPath);

            session.isProcessing = false;
            
            // Create message object
            const data = {
                type: 'message',
                message: "reply me back : 'can't able to hear your vice! try to chat.' ",
                userId: userId,
                url: url
            };
    
            // 5. Send URL back to WebSocket client
            ws.send(JSON.stringify({ type: "audio_url", url : url, message: "text from speech will be provided as soon as posible" }));
            
            
            //send to gemini for voice reply
            await handleUserMessage(sessionId, data, chatHistory)
            
            
            
                        // todo: before sending back url 
                        // todo: need to call speech to text 
                        // todo: and forward to handleUserMessage
            

        } catch (error) {

            console.error("Error transcribing:", error.message);
            session.isProcessing = false;
            fs.unlinkSync(tempPath);
            throw error;

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
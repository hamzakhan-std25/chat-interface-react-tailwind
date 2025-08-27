require('dotenv').config(); 
const { WebSocketServer } = require('ws')
const LOCAL_HOST = process.env.NODE_LOCAL_HOST;
const VERCEL_DOMAIN = process.env.NODE_VERCEL_DOMAIN;
const VERCEL_CURR_DEPLOY = process.env.NODE_VERCEL_CURR_DEPLOY;



// Configure WebSocket with proper origin validation
function configureWebsockets(server) {
  const wss = new WebSocketServer({ 
    server,
    // Add client validation to avoid connection errors
    verifyClient: (info, callback) => {
      const allowedOrigins = [
        LOCAL_HOST,
        VERCEL_DOMAIN,
        VERCEL_CURR_DEPLOY
      ];
      
      if (allowedOrigins.includes(info.origin)) {
        callback(true);
      } else {
        console.log('Blocked connection from origin:', info.origin);
        callback(false, 401, 'Unauthorized');
      }
    }
  });

  wss.on('connection', (ws, request) => {
    console.log("➕ client connected from:", request.headers.origin);


    
    ws.on("message", (data) => {

      try {
        const strData = data.toString('utf8');
        const jsonData = JSON.parse(strData);

        console.log("📩 from client:", jsonData.message);

        // Send back message (echo for now - replace with Gemini API)
        ws.send(JSON.stringify({ 
          type: 'bot_response', 
          message: `Echo: ${jsonData.message}` 
        }));

      } catch (error) {
        console.error('Error processing message:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format' 
        }));
      }
    });

    ws.on("close", () => console.log("👋 client disconnected"));
    ws.on("error", (error) => console.error("WebSocket error:", error));
  });
}

module.exports = configureWebsockets;
const app = require('./app')
const http = require('http')
const configureWebsockets = require('./websockets')
require('dotenv').config();

// CRITICAL: IIS provides the port/pipe. If process.env.PORT is undefined, it defaults to 3000
const PORT = process.env.PORT || 7860;

const server = http.createServer(app);

configureWebsockets(server);

// REMOVE "0.0.0.0" - Let the environment handle the binding

server.listen(port, '0.0.0.0', () => {
    console.log(' ✅ Server is running on port :', PORT)
});

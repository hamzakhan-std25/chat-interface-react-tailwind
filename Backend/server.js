const app = require('./app')
const http = require('http')
const configureWebsockets = require('./websockets')
require('dotenv').config();
const PORT= process.env.PORT;


const server = http.createServer(app);

configureWebsockets(server);

server.listen(PORT, ()=>{
    console.log(' ✅ Server is running on port :', PORT)
})
















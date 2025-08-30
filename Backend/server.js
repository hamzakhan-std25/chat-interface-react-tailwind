const app = require('./app')
const http = require('http')
const configureWebsockets = require('./websockets')
const PORT= 8080; 


const server = http.createServer(app);

configureWebsockets(server);

server.listen(PORT, ()=>{
    console.log(' ✅ Server is running on port :', PORT)
})



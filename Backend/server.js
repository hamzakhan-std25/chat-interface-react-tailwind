const app = require('./app')
const http = require('http')
const configureWebsockets = require('./routes/websockets')
const PORT= 3000;


const server = http.createServer(app);

configureWebsockets(server);



server.listen(PORT, ()=>{
    console.log(' ✅ Server is running on port :', PORT)
})



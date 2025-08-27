const app = require('./app')
const http = require('http')
const configureWebsockets = require('./routes/websockets')
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT;
const LOCAL_HOST = process.env.NODE_LOCAL_HOST;
const VERCEL_DOMAIN = process.env.NODE_VERCEL_DOMAIN;
const VERCEL_CURR_DEPLOY = process.env.NODE_VERCEL_CURR_DEPLOY;




// Enable CORS for all routes
app.use(cors({
    origin: [
        LOCAL_HOST,
        VERCEL_DOMAIN,
        VERCEL_CURR_DEPLOY
    ],
    credentials: true
}));


const server = http.createServer(app);

configureWebsockets(server);



server.listen(PORT, () => {
    console.log(' ✅ Server is running on port :', PORT)
})
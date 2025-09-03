const express = require('express')
const app = express();
const cors = require('cors');


app.use(express.json());

app.use(cors());

// Middleware to handle raw binary data
app.use("/upload/transcribe", express.raw({ type: "application/octet-stream", limit: "50mb" }));
// const apiRoutes = require('./routes/api')
// app.use('/api',apiRoutes);

const chatRoutes = require('./routes/Chats.js')
app.use('/chats', chatRoutes);

const uploadRoutes = require('./routes/Upload.js')
app.use('/upload', uploadRoutes)





app.get('/status', (req, res) => {

    console.log('status checking from client side...')

    res.status(200).json({ status: "API is running..." })
});




app.use('/', (req, res) => {
    res.send('root of api ')
})


module.exports = app;


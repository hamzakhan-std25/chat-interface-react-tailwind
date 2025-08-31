const express = require('express')
const app = express();

app.use(express.json());

// const apiRoutes = require('./routes/api')
// app.use('/api',apiRoutes);

const chatRoutes= require('./routes/Chats.js')
app.use('/chats', chatRoutes);




app.get('/status', (req, res) => {
    
    console.log('status checking from client side...')

    res.status(200).json({ status: "API is running..." })
});




app.use('/', (req, res) => {
res.send('root of api ')
})


module.exports = app;


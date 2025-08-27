const express = require('express')
const app = express();

app.use(express.json());

// const apiRoutes = require('./routes/api')
// app.use('/api',apiRoutes);




app.get('/status', (req, res) => {
    
    console.log('status checking from client side...')
    console.log('feature  branch backend ^^^^^')

    res.status(200).json({ status: "API is running..." })
});

app.post('/data', (req, res) => {
    
    console.log('data is send through post request to path /data')
    res.status(200).json({ message: "data recievd! Soon we will redirect routes" })
})


app.use('/', (req, res) => {
res.send('root of api ')
})


module.exports = app;


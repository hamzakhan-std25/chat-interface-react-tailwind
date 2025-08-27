
// console.log('sever.js executing....')














// const express = require('express');

// const app = express();

// app.use(express.json);

// app.get('/',(req, res)=>{
//     console.log('some one request');
//     res.send('server is reciving data')
    
// });


// app.listen(3000,()=>{
//     console.log('server is runing')
// })























// const express = require('express')
// const app = express();
// // const PORT = process.env.PORT || 5000;
// const PORT = 3000;



// // Middleware to parse JSON bodies
// app.use(express.json());

// // // Import routes
// // const apiRoutes = require('./routes/api');
// // app.use('/api', apiRoutes);




// // Basic route for testing if server is live
// app.get('/', (req, res) => {
//   res.send('Server is running!');
// });




// app.listen(PORT, () => {
//     console.log(' ✅ Express app is listening on port :', PORT);
// })














// const { WebSocketServer } = require("ws");


// import {WebSocketServer} from 'ws';


// const wss = new WebSocketServer({ port: 8080 });
// console.log("✅ WS server running at ws://localhost:8080");



// wss.on("connection", (ws) => {
//   console.log("➕ client connected");
//   ws.send(JSON.stringify({ type: "welcome", message: "user is Connected." }));



//   ws.on("message", (data) => {
//     const text = data.toString();
//     console.log("📩 from client:", text);

//     // Echo back to the sender
//     ws.send(JSON.stringify({ type: "you send :", message: text }));

//     // (Optional) Broadcast to all clients:
//     // for (const client of wss.clients) {
//     //   if (client.readyState === 1) client.send(JSON.stringify({ type: "broadcast", message: text }));
//     // }
//   });

//   ws.on("close", () => console.log("👋 client disconnected"));
  
// });





    // routers/tours.js
    // const express = require('express');
    // const toursRouter = express.Router();
    // const reviewsRouter = require('./reviews'); // Assuming reviews router exists

    // toursRouter.get('/:tourId', (req, res) => {
    //     res.send(`Tour details for ID: ${req.params.tourId}`);
    // });

    // // Mount reviewsRouter under /:tourId/reviews, allowing access to tourId param
    // toursRouter.use('/:tourId/reviews', reviewsRouter);

    // module.exports = toursRouter;

    // // routers/reviews.js
    // const express = require('express');
    // const reviewsRouter = express.Router({ mergeParams: true }); // Important!

    // reviewsRouter.get('/', (req, res) => {
    //     // Access tourId from parent router
    //     res.send(`Reviews for tour ID: ${req.params.tourId}`);
    // });

    // module.exports = reviewsRouter;
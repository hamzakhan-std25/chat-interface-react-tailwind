// const { WebSocketServer, Server } = require('ws')

// function configureWebServer(sever) {
//     const wss = WebSocketServer(Server);
    

//     wss.on('connection', (ws) => {
//         console.log("➕ client connected");



//         // function timerFun() {
//         //     setTimeout(() => {
//         //         ws.send(JSON.stringify({ type: ' this msg from : ', message: 'time funtion and data is :' }));
//         //     }, 10000);

//         // }

//         ws.on("message", (data) => {
//             const text = data.toString();
//             console.log("📩 from client:", text);


//             // send back message with you send ...
//             ws.send(JSON.stringify({ type: ' you send ', message: text }));

//             // timerFun();



//         });

//         //this enabale bidirectional msges send and recive at once 








//         ws.on("close", () => console.log("👋 client disconnected"));


//     })

// }



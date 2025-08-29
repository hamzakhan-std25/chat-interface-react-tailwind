const { WebSocketServer } = require('ws')



function configureWebsockets(server) {
    const wss = new WebSocketServer({ server });



    wss.on('connection', (ws) => {
        console.log("➕ client connected");

           function timerFuntion(m){
            setTimeout(()=>{
                
                ws.send(JSON.stringify({ type: 'ai', message: "msg from timer funtion and msg :"+m }));
            },5000)
           }
         

        
        ws.on("message", (data) => {



            const strData = data.toString('utf8')
            const jsonData= JSON.parse(strData);

            console.log("📩 from client:", jsonData);


            // send back message ...
            // ws.send(JSON.stringify({ type: 'bot_response', message: jsonData.message }));
            timerFuntion(jsonData.message)

        });




        ws.on("close", () => console.log("👋 client disconnected"));

    });






}
module.exports = configureWebsockets;
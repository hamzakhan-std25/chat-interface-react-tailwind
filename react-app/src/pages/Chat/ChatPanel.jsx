import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
// import './ChatBot.css'

const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = "221";
  const ws = useRef(null);
  const messagesEndRef = useRef(null);



  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);






  // WebSocket connection setup
  useEffect(() => {

    ws.current = new WebSocket('wss://chat-bot-production-b1e8.up.railway.app/:8080'); 
    // ws.current = new WebSocket('ws://localhost:8080');




    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true)
      // addMessage({sender: 'System', chunk: 'Connected to chat server !', type:'system', isCompleted : true, timestamp : Date.now()})
    };

    ws.current.onmessage = (event) => {

      try {

        const data = JSON.parse(event.data);

        if (data.type == 'message_chunk' || data.type == 'message_complete') {
          setIsLoading(false)

          console.log('message-chunk is recived------------------');
          console.log(data)

          addMessage(data);


        }

      } catch (error) {
        console.error('Error parsing message:', error);
        addMessage({ sender: 'System', chunk: 'Error: Please Check the console', type: 'error', isCompleted: true, timestamp: new Date().toISOString() });
      }

    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);

      // addMessage({sender: 'System', chunk: 'Disconnected from server. Trying to reconnect...', type:'system', isCompleted : true, timestamp : Date.now()});
    };


    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      // addMessage({sender: 'System', chunk: 'Connection error occurred', type:'error', isCompleted : true, timestamp : Date.now()});

    };

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  }, []);

  const addMessage = (data) => {

    
    
    setMessages((prev) => {
      
      if (prev.length == 0 || prev[prev.length - 1].isCompleted) {
        
        return [...prev, {
          id: new Date().toISOString(),
          sender: data.sender || 'Assistant',
          text: data.chunk,
          isCompleted: data.isCompleted,
          type: data.type,
          timestamp: data.timestamp
        }]
        
        
      }
      
      
      else {
        const last = prev[prev.length - 1];
        let updatedlast;

      if(data.type== "message_complete"){
       updatedlast = { ...last, text:data.message, isCompleted: true,}
      }
      else{
         updatedlast = { ...last, text: last.text+data.chunk}
      }
        return [...prev.slice(0, -1), updatedlast];
      }



    });
  };

  const sendMessage = () => {

    if (inputMessage.trim() && ws.current && isConnected && !isLoading) {
      // Create message object
      const messageData = {
        type: 'message',
        message: inputMessage.trim(),
        userId: userId,
      };




      // Send message through WebSocket
      ws.current.send(JSON.stringify(messageData));

      // Add message to local state immediately for instant feedback
      addMessage(
        { sender: 'You', chunk: inputMessage.trim(), type: 'user', isCompleted: true, timestamp: new Date().toISOString()}


        
      );
      setIsLoading(true)
      // Clear input field
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reconnect = () => {
    if (ws.current) {
      ws.current.close();
      // The useEffect will automatically try to reconnect
    }
  };



  return (



    <div className="flex flex-col h-screen mx-auto w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
        <h3 className=" px-12 text-lg font-semibold">Chat with Gemini AI</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 ring-2 ring-green-400/30' : 'bg-red-400 ring-2 ring-red-400/30'}`}></span>
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          {!isConnected && (
            <button
              onClick={reconnect}
              className="px-3 py-1 text-xs bg-white/20 border border-white/30 text-white rounded hover:bg-white/30 transition-colors"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8 italic">
            <p>Welcome! Start a conversation with the AI assistant.</p>
            <p>Try asking: "What can you help me with?"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <ChatMessage key={message.id}  message={message}/>
            ))}
          </div>
        )}




        {isLoading && (
          <div className=" flex space-x-1 animate-pulse  mt-8">
            <span className='w-2 h-2 bg-blue-500 rounded-full animate-bounce'></span>
            <span className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: "200ms" }}></span>
            <span className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{ animationDelay: "400ms" }}></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            disabled={!isConnected}
            rows={3}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || !isConnected || isLoading
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span className="text-sm">➤</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
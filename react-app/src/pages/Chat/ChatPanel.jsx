import React, { useState, useRef, useEffect } from 'react';
import formateTime from '../../utilities/formateTime';

const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`);
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
    // Connect to your backend WebSocket server
    ws.current = new WebSocket('ws://chat-bot-production-b1e8.up.railway.app'); // Change to your backend URL

    //chat-bot-production-b1e8.up.railway.app

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    //   addMessage('System', 'Connected to chat server!', 'system');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'bot_response') {
          addMessage('Gemini Bot', data.message, 'bot');
        } else if (data.type === 'error') {
          addMessage('System', data.message, 'error');
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    //   addMessage('System', 'Disconnected from server. Trying to reconnect...', 'system');
    };


    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    //   addMessage('System', 'Connection error occurred', 'error');
    };

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const addMessage = (sender, text, type = 'user') => {
    const newMessage = {
      id: Date.now(),
      sender,
      text,
      type, // 'user', 'bot', 'system', 'error'
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = () => {
    if (inputMessage.trim() && ws.current && isConnected) {
      // Create message object
      const messageData = {
        message: inputMessage.trim(),
        userId: userId
      };

      // Send message through WebSocket
      ws.current.send(JSON.stringify(messageData));

      // Add message to local state immediately for instant feedback
      addMessage('You', inputMessage.trim(), 'user');

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

  // Helper function to get message styling based on type
  const getMessageStyles = (type) => {
    switch (type) {
      case 'user':
        return 'bg-blue-400 text-white ml-8 border-br-4';
      case 'bot':
        return 'bg-white text-gray-800 border border-gray-200 mr-8 border-bl-4';
      case 'system':
        return 'bg-gray-100 text-gray-600 italic text-center mx-4';
      case 'error':
        return 'bg-red-50 text-red-600 italic text-center mx-4';
      default:
        return 'bg-white text-gray-800 border border-gray-200';
    }
  };

  return (


    
    <div className="flex flex-col h-screen mx-auto w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold">Chat with Gemini AI</h3>
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
              <div 
                key={message.id} 
                className={`animate-fadeIn ${getMessageStyles(message.type)} p-3 rounded-lg`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-700 text-sm">{message.sender}</span>
                  <span className="text-gray-800 text-xs">{formateTime(message.timestamp)}</span>
                </div>
                <div className="text-sm leading-relaxed">
                  {message.text}
                </div>
              </div>
            ))}
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
            disabled={!inputMessage.trim() || !isConnected}
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
// components/ChatBotStr.jsx
import React, { useState, useRef, useEffect } from 'react';
import { geminiStrService } from '../../Services/geminiStrServices';

const ChatBotStr = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamId, setCurrentStreamId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    // Add user message
    const userMessageObj = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
      isComplete: true
    };

    setMessages(prev => [...prev, userMessageObj]);

    // Create a temporary AI message for streaming
    const streamId = Date.now() + 1;
    setCurrentStreamId(streamId);
    
    const aiMessageObj = {
      id: streamId,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isComplete: false,
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMessageObj]);

    // Start streaming
    geminiStrService.sendMessageStream(
      userMessage,
      // onStreamUpdate callback
      (fullText, newText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === streamId 
            ? { ...msg, text: fullText }
            : msg
        ));
      },
      // onComplete callback
      (fullText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === streamId 
            ? { ...msg, text: fullText, isComplete: true, isStreaming: false }
            : msg
        ));
        setIsLoading(false);
        setIsStreaming(false);
        setCurrentStreamId(null);
      },
      // onError callback
      (error) => {
        setMessages(prev => prev.map(msg => 
          msg.id === streamId 
            ? { 
                ...msg, 
                text: 'Sorry, I encountered an error. Please try again.',
                isComplete: true, 
                isStreaming: false,
                isError: true 
              }
            : msg
        ));
        setIsLoading(false);
        setIsStreaming(false);
        setCurrentStreamId(null);
      },
      // onStart callback
      () => {
        console.log('Stream started');
      }
    );
  };

  const stopStreaming = () => {
    geminiStrService.abortRequest();
    if (currentStreamId) {
      setMessages(prev => prev.map(msg => 
        msg.id === currentStreamId 
          ? { ...msg, isStreaming: false }
          : msg
      ));
      setIsLoading(false);
      setIsStreaming(false);
      setCurrentStreamId(null);
    }
  };

  const clearChat = () => {
    setMessages([]);
    geminiStrService.clearHistory();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const TypingIndicator = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold">Gemini Chat</h1>
          </div>
          <button
            onClick={clearChat}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Gemini Chat</h2>
            <p className="text-gray-500">Start a conversation by typing a message below</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-md border border-gray-100'
                }`}
              >
                <div className="flex flex-col">
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  {message.isStreaming && (
                    <div className="mt-2">
                      <TypingIndicator />
                    </div>
                  )}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                  {message.isStreaming && ' • Typing...'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-3 text-gray-400 text-sm">
              {inputMessage.length}/2000
            </div>
          </div>
          
          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z"/>
              </svg>
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
              <span>Send</span>
            </button>
          )}
        </form>
        
        {/* Quick Suggestions */}
        {messages.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "What can you help me with?",
              "Tell me a joke",
              "How does AI work?",
              "Write a poem about technology"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBotStr;
import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { FiArrowUp, FiMic } from 'react-icons/fi';
import VoiceRecorderModal from './VoiceRecorderModal';
import { useAuth } from '../../contexts/authContext'
import NotificationSystem from '../../components/Notification';
// import './ChatBot.css'

const ChatPanel = (
  {
    selectedSessionId,
    addNotification
  }

) => {

  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState('record');
  const [textToSpeech, setTextToSpeech] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reconnecting, setReconnecting] = useState(0);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const userId = user?.uid ?? null;
  const prevCount = useRef(messages.length);




  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if(messages.length > prevCount.current || !messages[messages.length -1]?.isCompleted ){
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCount.current = messages.length;
  }, [messages]);


  function loadMessages() {
    setIsLoading(true);
    setMessages([]);
    if (selectedSessionId) {
      fetch(`https://chat-bot-production-b1e8.up.railway.app/chats/getMessages/${selectedSessionId}`)
        .then(res => res.json())
        .then(data => {


          // ✅ Map Supabase rows → your custom object format (safer defaults)
          const mappedMessages = (data.response || []).map((msg, idx) => ({
            id: msg.id ?? `${msg.created_at ?? Date.now()}-${idx}`,
            sender: msg.role === 'ai' ? 'Assistant' : 'You',
            text: msg.message_text || msg.chunk || "",
            url: msg.url ?? null,
            isCompleted: msg.isCompleted ?? true,
            type: msg.role === 'ai' ? 'assistant' : 'user',
            liked: msg.liked ?? false,
            disLiked: msg.disLiked ?? false,
            timestamp: msg.created_at ? new Date(msg.created_at).toISOString() : new Date().toISOString(),
          }));


          // console.log('Messages loaded for session:', selectedSessionId, data.response);
          // console.log('Mapped Messages:', mappedMessages);

          setMessages(mappedMessages);
          setIsLoading(false);
        })
        .catch(error => {
          
          addNotification('Error loading messages!')  
          console.error("Error loading messages:", error);
          setIsLoading(false);
        });

    } else {
      setMessages([]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [selectedSessionId]);











  // WebSocket connection setup
  useEffect(() => {

    ws.current = new WebSocket('wss://chat-bot-production-b1e8.up.railway.app/:8080');
    // ws.current = new WebSocket('ws://localhost:8080');



    ws.current.onopen = () => {
      console.log('Connected to WebSocket server!');
      addNotification("Connected to chat server !");
      setIsConnected(true);

      ws.current.send(JSON.stringify({
        type: "init",
        sessionId: selectedSessionId || null   // null = new session
      }));

      // addMessage({sender: 'System', chunk: 'Connected to chat server !', type:'system', isCompleted : true, timestamp : Date.now()})
    };

    ws.current.onmessage = (event) => {

      try {
        const data = JSON.parse(event.data);

        // console.log('data is receved from server :');
        // console.log(data);



        if (data.type == 'message_chunk' || data.type == 'message_complete') {
          setIsLoading(false)
          addMessage(data);
        }

        else {

          if (data.type == "audio_url") {
            // setIsLoading(true)
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              const updatedlast = { ...last, isCompleted: true, url: data.url }
              return [...prev.slice(0, -1), updatedlast];
            })

            // console.log('voice uploaded to cloudinary:  ✅ ')
          }


        }


      } catch (error) {
        console.error('Error parsing message:', error);
        addMessage({ sender: 'System', chunk: 'Error: Please Check the console', type: 'error', isCompleted: true, timestamp: new Date().toISOString() });
      }

    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setIsLoading(false);

      addNotification('Disconnected from WebSocket server')
 

      // addMessage({sender: 'System', chunk: 'Disconnected from server. Trying to reconnect...', type:'system', isCompleted : true, timestamp : Date.now()});
    };


    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      addNotification("WebSocket error occurred. Check console.");
      setIsConnected(false);
      setIsLoading(false);
      // Optionally, you can close the socket on error
      // ws.current.close();
      // addMessage({sender: 'System', chunk: 'Connection error occurred', type:'error', isCompleted : true, timestamp : Date.now()});

    };


    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  }, [selectedSessionId,reconnecting]);

  const addMessage = (data) => {
    setMessages((prev) => {

      if (prev.length == 0 || prev[prev.length - 1].isCompleted) {

        return [...prev, {
          id: new Date().toISOString(),
          sender: data.sender || 'Assistant',
          text: data.chunk,
          url: data.url,
          isCompleted: data.isCompleted,
          type: data.type,
          liked: data.liked || false,
          disLiked: data.disLiked || false,
          timestamp: data.timestamp,
        }]


      }


      else {
        const last = prev[prev.length - 1];
        let updatedlast;

        if (data.type == "message_complete") {
          updatedlast = { ...last, text: data.message, isCompleted: true }
        }
        else {
          updatedlast = { ...last, text: last.text + data.chunk }
        }
        return [...prev.slice(0, -1), updatedlast];
      }

    });
  };






  const sendMessage = () => {
    // guard early if conditions not met
    if (
      !inputMessage.trim() ||
      !ws.current ||
      !isConnected ||
      isLoading ||
      ws.current.readyState !== WebSocket.OPEN
    ) return;

    // Create message object
    const messageData = {
      type: 'message',
      message: inputMessage.trim(),
      userId: userId,
    };

    // Send message through WebSocket (guarded)
    try {
      ws.current.send(JSON.stringify(messageData));
    } catch (err) {
      console.error('WebSocket send error:', err);
      setIsLoading(false);
    }

    // Add message to local state immediately for instant feedback
    addMessage({ sender: 'You', chunk: inputMessage.trim(), type: 'user', isCompleted: true, timestamp: new Date().toISOString() });
    setIsLoading(true);
    // Clear input field
    setInputMessage('');
  };

  const sendVoice = async (blob) => {
    setIsLoading(true);

    const url = URL.createObjectURL(blob);
    // First add voice to sending msg instantly
    addMessage({ sender: 'You', type: 'user', url: url, isCompleted: true, timestamp: new Date().toISOString() });

    // create binary data
    const arrayBuffer = await blob.arrayBuffer();
    const sizeInKB = (arrayBuffer.byteLength / 1024).toFixed(2);

    // Send binary on websocket (only when open)
    try {
      if (ws.current && isConnected && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(arrayBuffer);
        // console.log(`Audio sent: ${arrayBuffer.byteLength} bytes! : (${sizeInKB} KB) ✅`);
      } else {
        console.error('WebSocket is not open. Cannot send audio.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error sending audio over WebSocket:', err);
      setIsLoading(false);
    }

  };



  // prefer onKeyDown for reliable Enter detection
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reconnect = () => {
    console.log('Attempting to reconnect...');
    if (ws.current) {
      ws.current.close();
      // The useEffect will automatically try to reconnect
    }
    setReconnecting(prev => prev + 1);
  };





  const openRecording = () => {
    setMode('record')
    setIsRecording(true)
  }



  return (

    <>
      <div className="flex flex-col h-screen mx-auto w-full border border-gray-200 overflow-hidden bg-white shadow-lg">
        {/* Chat Header */}
        <div className="px-2 pl-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center h-fit">
         <div>
           <h3 className="text-lg font-semibold px-2">Chat with AI</h3>
          <p className="text-sm text-white mt-2">Designed & Built by <code>Hamza khan</code></p>
         </div>
          <div className="flex items-center gap-2 mr-2">
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
                <ChatMessage key={message.id} message={message} 
                speak={() => setIsRecording(true)} 
                changeMode={() => setMode('speech')} 
                setText={(txt) => setTextToSpeech(txt)} 
                addNotification={addNotification}
                setMessages={setMessages} />
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
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Enter to send)"
              disabled={!isConnected}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={inputMessage.trim() ? sendMessage : openRecording}
              disabled={!isConnected || isLoading
              }
              className=" p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <span className="text-sm">{inputMessage.trim() ? <FiArrowUp className='text-2xl' /> : <FiMic className='text-2xl' />}</span>
            </button>
          </div>
        </div>
      </div>
      <VoiceRecorderModal
        isOpen={isRecording}
        onClose={() => setIsRecording(false)}
        mode={mode}
        onSend={sendVoice}
        textToSpeech={textToSpeech}
      />
    </>

  );
};

export default ChatPanel;
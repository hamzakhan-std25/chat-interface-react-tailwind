import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { FiArrowUp, FiMic } from 'react-icons/fi';
import VoiceRecorderModal from './VoiceRecorderModal';
import { useAuth } from '../../contexts/authContext'
import NotificationSystem from '../../components/Notification';
import { FiRepeat } from 'react-icons/fi';
// import './ChatBot.css'

const ChatPanel = (
  {
    selectedSessionId,
    addNotification,
    setSideIn
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
    if (messages.length > prevCount.current || !messages[messages.length - 1]?.isCompleted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCount.current = messages.length;
  }, [messages]);


  function loadMessages() {
    setIsLoading(true);
    setMessages([]);
    if (selectedSessionId) {
      fetch(`https://hamzakhan25-chat-bot-hm.hf.space/chats/getMessages/${selectedSessionId}`)
        // fetch(`http://localhost:8080/chats/getMessages/${selectedSessionId}`)
        .then(res => res.json())
        .then(data => {
          console.log("-----------------------------------")
          console.log("data from localhost/chats/getMessages: ", data)


          // ✅ Map Supabase rows → your custom object format (safer defaults)
          const mappedMessages = (data.response || []).map((msg, idx) => ({
            id: msg.id ?? `${msg.created_at ?? Date.now()}-${idx}`,
            sender: msg.role === 'ai' ? 'Assistant' : 'You',
            text: msg.message_text || msg.chunk || "",
            url: msg.url ?? null,
            isCompleted: msg.isCompleted ?? true,
            type: msg.role === 'ai' ? 'assistant' : 'user',
            liked: (msg.liked === true ? true : msg.liked === false ? false : null),
            timestamp: msg.created_at ? new Date(msg.created_at).toISOString() : new Date().toISOString(),
          }));


          // console.log('Messages loaded for session:', selectedSessionId, data.response);
          console.log('Mapped Messages:', mappedMessages);

          setMessages(mappedMessages);
          setIsLoading(false);
        })
        .catch(error => {

          addNotification('Error msg loading!')
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

    ws.current = new WebSocket('wss://hamzakhan25-chat-bot-hm.hf.space//:8080');
    // ws.current = new WebSocket('ws://localhost:8080');



    ws.current.onopen = () => {
      console.log('Connected to WebSocket server!');
      addNotification("Connected!");
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
      console.log('Disconnected!');
      setIsConnected(false);
      setIsLoading(false);

      addNotification('Disconnected!')


      // addMessage({sender: 'System', chunk: 'Disconnected from server. Trying to reconnect...', type:'system', isCompleted : true, timestamp : Date.now()});
    };


    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      addNotification("Ws error");
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

  }, [selectedSessionId, reconnecting]);

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
          liked: (data.liked === true ? true : data.liked === false ? false : null),
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



  const stopGenerating = () => {
    try {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'cancel' }));
      }
    } catch (e) {
      console.error('WebSocket cancel error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // prefer onKeyDown for reliable Enter detection
  const handleKeyDown = (e) => {
    // Ctrl/Cmd+Enter to send
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage();
      return;
    }
    // Enter to send, Shift+Enter for newline
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

  const sendButtonAria = inputMessage.trim() ? 'Send message' : 'Record voice';
  const sendDisabledTitle = !isConnected ? 'Disconnected' : (isLoading ? 'Generating response...' : '');

  return (

    <>
      <div className="flex flex-col h-screen mx-auto w-full border border-gray-200 overflow-hidden bg-white shadow-lg">
        {/* Chat Header */}
        <div className="px-2 pl-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex justify-between items-center h-fit ">
          <div className='flex items-center justify-center  md:flex-col sm:items-start'>
            <button
              aria-label="Open sidebar"
              title="Open sidebar"
              onClick={()=>setSideIn(true)} 
              className='flex justify-center items-center md:hidden p-2 hover:bg-indigo-400 hover:-translate-y-1 bg-indigo-600 rounded-2xl transition-all'
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(1.25)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.17922 18.9754 7.55292 18.9882 8 18.9943V5.0057C7.55292 5.01184 7.17922 5.02462 6.85424 5.05118ZM10 5V19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H10Z" fill="currentColor"></path>
                </g>
              </svg>
            </button>
            <h3 className="text-lg font-semibold px-2 self-center">Chat with AI</h3>
            <p className="text-sm text-white mt-2 hidden md:flex">Designed & Built by <code>Hamza khan</code></p>
          </div>
          <div className="flex items-center gap-2 mr-2" aria-live="polite">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 ring-2 ring-green-400/30' : 'bg-red-400 ring-2 ring-red-400/30'}`}></span>
            <span className="text-sm hidden md:flex">{isConnected ? 'Connected' : 'Disconnected'}</span>
            {!isConnected && (
              <button
                onClick={reconnect}
                className="px-3 py-1 text-xs bg-white/20 border border-white/30 text-white rounded hover:bg-white/30 transition-colors"
              >
                <FiRepeat/>
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
            <div className="mr-8 border border-gray-200 bg-white rounded-lg p-3 animate-pulse max-w-[75ch]">
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2 items-end">
            <textarea
              aria-label="Message input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'; }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={!isConnected}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ maxHeight: '200px', overflowY: 'auto' }}
            />
            {isLoading && (
              <button
                onClick={stopGenerating}
                aria-label="Stop generating"
                title="Stop generating"
                className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Stop
              </button>
            )}
            <button
              aria-label={sendButtonAria}
              title={!isConnected ? 'Disconnected' : (isLoading ? 'Generating response...' : sendButtonAria)}
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
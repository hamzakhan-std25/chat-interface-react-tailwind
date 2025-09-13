import { formateTime } from '../../utils/formateTime';
import ReactMarkdown from 'react-markdown'
import './chat.css'
import { FiCopy, FiHeadphones, FiLoader, FiPenTool, FiPercent, FiSpeaker, FiThumbsDown, FiThumbsUp, FiVolume2 } from 'react-icons/fi';
import { Pencil } from 'lucide-react';


export default function ChatMessage(
    { message,
        speak,
        changeMode,
        setText,
        setMessages,
        addNotification
    }
) {

    // Helper function to get message styling based on type
    const getMessageStyles = (type) => {
        switch (type) {
            case 'user':
                return 'bg-blue-400 text-white ml-8 border-br-4';
            case 'assistent':
                return 'bg-white text-gray-800 border border-gray-200 mr-8 border-bl-4';
            case 'system':
                return 'bg-gray-100 text-gray-600 italic text-center mx-4';
            case 'error':
                return 'bg-red-50 text-red-600 italic text-center mx-4';
            default:
                return 'bg-white text-gray-800 border border-gray-200';
        }
    };

    const handleCopy = async (text) => {

        try {
            await navigator.clipboard.writeText(text);
            addNotification("Copied to clipboard")
        } catch (err) {
            addNotification("Failed to copy!")
        }

    }

    const handleThumbsUp = (id) => {
        setMessages(prevMessages => prevMessages.map(msg => {
            if (msg.id === id) {
                return { ...msg, liked: !msg.liked }; // Toggle thumbsUp and reset thumbsDown
            }
            return msg;
        }));
    }
    const handleThumbsDown = (id) => {

        setMessages(prevMessages => prevMessages.map(msg => {
            if (msg.id === id) {
                return { ...msg, disliked: !msg.disliked }; // Toggle thumbsDown 
            }
            return msg;
        }));
    }

    const speakText = (text) => {
        changeMode();
        setText(text);
        speak();
    };



    return (
        <div
            key={message.id}
            className={` ${getMessageStyles(message.type)} p-3 rounded-lg `
            }
        >
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700 text-sm">{message.sender}</span>
                <span className="text-gray-800 text-xs">{formateTime(message.timestamp)}</span>
            </div>
            <div className="text-sm leading-relaxed bubble">
                {
                    message.url ?
                        <audio className='w-full  sm:w-sm inline-block' controls src={message.url}></audio>
                        : <ReactMarkdown>
                            {message.text}
                        </ReactMarkdown>
                }
                <div className='flex items-center pt-2 gap-2 [&>*]:cursor-pointer'>
                    {message.isCompleted ?
                        <> {message.text &&
                            <FiCopy
                                className='active:text-blue-500'
                                onClick={() => handleCopy(message.text)}
                            />}
                            {  message.sender == "Assistant"  &&

                                <>

                                   { !message.disliked &&
                                     <FiThumbsUp className={message.liked ? 'text-blue-500' : ''}
                                        onClick={() => handleThumbsUp(message.id)}
                                    />
                                   }
                                   { !message.liked &&
                                    <FiThumbsDown className={message.disliked ? 'text-blue-500' : ''}
                                        onClick={() => handleThumbsDown(message.id)}
                                    />}
                                    {message.text &&
                                        <FiVolume2
                                            onClick={() => speakText(message.text)}
                                        />}


                                </>
                            }


                            {message.type == 'user' &&
                                <Pencil onClick={() => addNotification("Can't Edit right now!")}
                                    className=' w-4 h-4 active:text-blue-500' />}

                        </> :
                        <FiLoader
                        />} </div>
            </div>


        </div>
    )
}


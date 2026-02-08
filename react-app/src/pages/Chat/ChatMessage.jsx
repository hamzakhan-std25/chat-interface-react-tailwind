import { formateTime } from '../../utils/formateTime';
import ReactMarkdown from 'react-markdown'
import './chat.css'
import { FiCopy, FiLoader, FiThumbsDown, FiThumbsUp, FiVolume2 } from 'react-icons/fi';
import { Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';



export default function ChatMessage(
    { message,
        speak,
        changeMode,
        setText,
        setMessages
    }
) {

    // Helper function to get message styling based on type
    const getMessageStyles = (type) => {
        switch (type) {
            case 'user':
                return 'bg-blue-500 text-white ml-8 border-br-4';
            case 'assistant':
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
            toast.success("Copied!")
        } catch (err) {
            toast.error("Failed!")
        }

    }

    // Reactions: mutually exclusive like/dislike using a single tri-state
    const handleThumbsUp = (id) => {
        setMessages(prevMessages => prevMessages.map(msg => {
            if (msg.id === id) {
                // liked: true means upvoted, false means downvoted, null means none
                const newLiked = msg.liked === true ? null : true;
                return { ...msg, liked: newLiked };
            }
            return msg;
        }));
    }
    const handleThumbsDown = (id) => {
        setMessages(prevMessages => prevMessages.map(msg => {
            if (msg.id === id) {
                const newLiked = msg.liked === false ? null : false;
                return { ...msg, liked: newLiked };
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
            className={` ${getMessageStyles(message.type)} p-3 rounded-lg max-w-[75ch]`}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700 text-sm">{message.sender}</span>
                <span className="text-gray-800 text-xs">{formateTime(message.timestamp)}</span>
            </div>
            <div className="text-sm leading-relaxed bubble">
                {
                    message.url ? (
                        <audio className='w-full sm:w-sm inline-block' controls src={message.url} aria-label="Voice message"></audio>
                    ) : (
                        <ReactMarkdown>
                            {message.text}
                        </ReactMarkdown>
                    )
                }
                <div className='flex items-center pt-2 gap-3 [&>*]:cursor-pointer opacity-80 hover:opacity-100'>
                    {message.isCompleted ? (
                        <>
                            {message.text && (
                                <button aria-label="Copy message" title="Copy" onClick={() => handleCopy(message.text)}>
                                    <FiCopy className='active:text-blue-500' />
                                </button>
                            )}

                            {message.sender === 'Assistant' && (
                                <>
                                    <button aria-label="Like" title="Like" onClick={() => handleThumbsUp(message.id)}>
                                        <FiThumbsUp className={message.liked === true ? 'text-blue-500' : ''} />
                                    </button>
                                    <button aria-label="Dislike" title="Dislike" onClick={() => handleThumbsDown(message.id)}>
                                        <FiThumbsDown className={message.liked === false ? 'text-blue-500' : ''} />
                                    </button>
                                    {message.text && (
                                        <button aria-label="Speak message" title="Listen" onClick={() => speakText(message.text)}>
                                            <FiVolume2 />
                                        </button>
                                    )}
                                </>
                            )}

                            {message.type === 'user' && (
                                <button aria-label="Edit message" title="Edit" onClick={() => toast.error("Can't Edit!")}>
                                    <Pencil className='w-4 h-4 active:text-blue-500' />
                                </button>
                            )}
                        </>
                    ) : (
                        <FiLoader aria-label="Loading" className='animate-spin' />
                    )}
                </div>
            </div>


        </div>
    )
}


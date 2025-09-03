
import formateTime from '../../utils/formateTime';
import ReactMarkdown from 'react-markdown'
import './chat.css'
import { FiCopy, FiHeadphones, FiLoader, FiSpeaker, FiThumbsDown, FiThumbsUp, FiVolume2 } from 'react-icons/fi';

export default function ChatMessage({ message, speak, changeMode, setText }) {


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
            alert('Copied!');
        } catch (err) {
            alert('Failed to copy!');
            console.error('Failed to copy text: ', err);
        }

    }
    const handleThumbsUp = (id) => {
        console.log("thumbsUp click on chat that have id :", id);
    }
    const handleThumbsDown = (id) => {
        console.log("thumbsDown click on chat that have id :", id);
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
                    message.text ?
                        <ReactMarkdown>
                            {message.text}
                        </ReactMarkdown>
                        : <audio className=' inline-block' controls src={message.url}></audio>
                }
                <div className='flex items-center pt-2 gap-2 [&>*]:cursor-pointer'>{message.isCompleted ? <> {message.text && <FiCopy onClick={() => handleCopy(message.text)} />}  <FiThumbsUp onClick={() => handleThumbsUp(message.id)} /> <FiThumbsDown onClick={() => handleThumbsDown(message.id)} /> {message.text && <FiVolume2 onClick={() => speakText(message.text)} />} </> : <FiLoader />} </div>
            </div>

        </div>
    )
}


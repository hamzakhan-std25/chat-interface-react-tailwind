
import formateTime from '../../utils/formateTime';
import ReactMarkdown from 'react-markdown'
import './chat.css'

export default function ChatMessage({ message }) {


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
                <ReactMarkdown>
                    {message.text}

                </ReactMarkdown>
            </div>
        </div>
    )
}

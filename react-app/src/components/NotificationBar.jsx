import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from "react-router-dom";

const NotificationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Optimized messages
  const message = location.pathname === '/' || '/login'
    ? "🚀 Quick Access: You can use a dummy email to register and test the chatbot!"
    : "✨ No registration required? Use a dummy email to sign up and try our chatbot instantly!";

  const showBar = ['/', '/signup','/login'].includes(location.pathname);
  if (!showBar) return null;

  return (
    <div className="w-full bg-blue-600 text-white h-12 py-1.5 shadow-md  flex justify-center items-center">
      <marquee direction="left" scrollamount="7" className="font-medium text-sm md:text-base">
        <button
          onClick={() => navigate('/about')}
          className='bg-orange-400 p-2 cursor-pointer  rounded-2xl my-1 hover:bg-green-300 '>
          About Chat-bot
        </button>
        {message}
      </marquee>
    </div>
  );
};


export default NotificationBar;

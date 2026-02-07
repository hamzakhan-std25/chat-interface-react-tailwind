import { Link } from 'react-router-dom';

function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-40px)] bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <p className="text-2xl font-semibold text-gray-800 mt-4">Oops! Page not found</p>
      <p className="text-gray-600 mt-2">The page you are looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;  

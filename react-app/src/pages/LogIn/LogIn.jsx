import { useState } from "react";
import { login, loginWithGoogle, loginWithGithub } from "../../Services/authServices";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-600">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please log in to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition bg-gray-50"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition bg-gray-50"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-500 text-white font-semibold shadow-md hover:bg-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={loginWithGoogle}
            className="flex items-center justify-center gap-3 px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={loginWithGithub}
            className="flex items-center justify-center gap-3 px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.37 0 0 5.52 0 12.34c0 5.45 3.44 10.07 8.21 11.7.6.11.82-.27.82-.6 
              0-.3-.01-1.1-.02-2.16-3.34.74-4.04-1.66-4.04-1.66-.55-1.43-1.34-1.81-1.34-1.81-1.1-.77.08-.76.08-.76 
              1.22.09 1.87 1.28 1.87 1.28 1.08 1.9 2.84 1.35 3.54 1.03.11-.81.42-1.35.77-1.66-2.67-.31-5.48-1.38-5.48-6.16 
              0-1.36.46-2.48 1.23-3.35-.12-.31-.53-1.57.12-3.27 0 0 1.01-.33 3.3 1.28a11.2 11.2 0 0 1 6 0c2.3-1.61 3.3-1.28 
              3.3-1.28.65 1.7.24 2.96.12 3.27.77.87 1.23 1.99 1.23 3.35 0 4.79-2.81 5.84-5.49 6.15.43.38.82 1.12.82 2.26 
              0 1.64-.02 2.96-.02 3.37 0 .33.22.72.83.6C20.56 22.4 24 17.78 24 12.34 24 5.52 18.63 0 12 0z"
              />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-500 font-medium hover:text-indigo-700 transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

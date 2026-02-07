import { useState } from "react";
import { register } from "../../Services/authServices";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-40px)] bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-600">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us today and get started 🚀</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition bg-gray-50"
            type="email"
            name="email"            // CRITICAL: Browsers look for 'name'
            id="email"              // Good practice for accessibility
            autoComplete="username" // Tells browser "this is the user's ID"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-gray-700 font-medium mb-1">Password</label>
          {/* <input
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition bg-gray-50"
            type="password"
            name="new-password"
            id="password"
            autoComplete="new-password" // Tells browser "this is the saved password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> */}

          <div className="relative w-full max-w-sm">
            <input
              // Switch type based on showPassword state
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition bg-gray-50"
              placeholder="********"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Toggle Button */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-indigo-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>


          <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>

          <div className="relative w-full max-w-sm">
            <input
              // Switch type based on showPassword state
              type={showPassword2 ? "text" : "password"}
              className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition bg-gray-50"
              name="new-password"
              id="password"
              autoComplete="new-password" // Tells browser "this is the saved password"
              placeholder="********"
              value={conPassword}
              onChange={(e) => {
                setConPassword(e.target.value)
                if (e.target.value !== password) {
                  e.target.setCustomValidity("Passwords do not match");
                } else {
                  e.target.setCustomValidity("");
                }
              }
              }
              required
            />

            {/* Toggle Button */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600 hover:text-indigo-500"
              onClick={() => setShowPassword2(!showPassword2)}
              aria-label={showPassword2 ? "Hide password" : "Show password"}
            >
              {showPassword2 ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>



          {/* CTA Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-500 text-white font-semibold shadow-md hover:bg-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Extra links */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-500 font-medium hover:text-indigo-700 transition"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

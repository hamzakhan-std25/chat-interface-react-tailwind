import { useState } from "react";
import { login, loginWithGoogle, loginWithGithub } from "../../Services/authServices";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
    <div className="max-w-lg m-auto border p-4 rounded-2xl mt-4 min-h-[95vh]  bg-violet-100  ">
      <div className="flex flex-col justify-center items-center gap-4 py-8 ">
        <div>
          <h1 className="p-2 text-2xl px-6 font-bold italic text-center text-indigo-600 line-clamp-5">Welcome Please Input <br /> your Account Cridentials</h1>
        </div>
        <h2 className="text-2xl font-bold text-indigo-600 p-2 px-4 ">Log in</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input className="text-lg  bg-stone-300 p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="text-lg  bg-stone-300 p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="p-2">I do not have an account! <Link to='/signup'><span className="text-blue-500 cursor-pointer hover:text-blue-800 transition">Sign Up</span></Link></p>
          <button className=" cursor-pointer self-center p-2 px-4 rounded-2xl bg-blue-300 w-40 hover:bg-blue-400  font-semibold shadow-md
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5" type="submit">Log in</button>
        </form>
        <button
          onClick={loginWithGoogle}
          className="
        flex items-center justify-center gap-3
        sm:w-auto
        px-6 py-3
        text-gray-700 font-medium
        border border-gray-300 rounded-lg
        bg-white shadow-md
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        active:scale-95
      "
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
          className="
        flex items-center justify-center gap-3
        sm:w-auto
        px-6 py-3
        text-gray-700 font-medium
        border border-gray-300 rounded-lg
        bg-white shadow-md
        transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        active:scale-95
      "
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
    </div>
  );
}

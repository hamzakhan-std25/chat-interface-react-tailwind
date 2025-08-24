import { useState } from "react";
import { login, loginWithGoogle } from "../../Services/authServices";
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
        <input className="text-lg  bg-stone-300 p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="text-lg  bg-stone-300 p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <p className="p-2">I do not have an account! <Link to='/signup'><span className="text-blue-500 cursor-pointer hover:text-blue-800 transition">Sign Up</span></Link></p>
        <button className=" cursor-pointer self-center shadow p-2 px-4 rounded-2xl bg-blue-300 w-40 hover:bg-blue-400 transition-colors font-semibold" type="submit">Log in</button>
      </form>
      <button  className=" cursor-pointer shadow p-2 px-4 rounded-2xl bg-blue-300 w-40 hover:bg-blue-400 transition-colors font-semibold" onClick={loginWithGoogle}><span className="text-sm text-gray-600">Login with</span> Google</button>
      </div>
    </div>
  );
}

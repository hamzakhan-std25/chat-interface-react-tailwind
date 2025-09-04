import { useState } from "react";
import { register } from "../../Services/authServices";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="max-w-lg m-auto border p-4 rounded-2xl mt-4 min-h-[95vh]  bg-violet-100  ">
      <div className="flex flex-col justify-center items-center gap-4 py-8 ">
        <div>
          <h1 className="p-2 text-2xl px-6 font-bold italic text-center text-indigo-600"> Create Your Account </h1>
        </div>
        <h2 className="text-2xl font-bold text-indigo-600 p-2 px-4 ">Sign Up</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input className="text-lg bg-stone-300 p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="text-lg bg-stone-300 p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="p-2">I have already an account! <Link to="/login"><span className="text-blue-500 cursor-pointer hover:text-blue-800 transition">Log In</span></Link></p>
          <button className=" cursor-pointer self-center shadow p-2 px-4 rounded-2xl bg-blue-300 w-40 hover:bg-blue-400  font-semibold transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5" type="submit">Sign Up</button>

        </form>
      </div>
    </div>
  );
}

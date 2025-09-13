import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Cpu, MessageSquare, Users, GitBranch } from 'lucide-react';

// local hero assets (fallback to remote if missing)
import hero1 from '../../assets/images/splash1.jpg';
import hero2 from '../../assets/images/splash2.jpg';
import hero3 from '../../assets/images/splash3.jpg';
import hero4 from '../../assets/images/splash4.jpg';

const localImages = [hero1, hero2, hero3, hero4];
const fallbackImages = [
  "https://source.unsplash.com/1200x600/?ai,technology",
  "https://source.unsplash.com/1200x600/?chat,robot",
  "https://source.unsplash.com/1200x600/?coding,abstract",
  "https://source.unsplash.com/1200x600/?websocket,server",
];

const images = localImages.map((imp, i) => imp ?? fallbackImages[i]);

export default function LandingPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const featuresRef = useRef(null);

  // Hero carousel auto-change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // simple reveal-on-scroll using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-6');
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = featuresRef.current?.querySelectorAll('.reveal') || [];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center bg-gray-900 text-white overflow-hidden">
        <img
          src={images[currentImage]}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 transform-gpu scale-105 hover:scale-100 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 "></div>
        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            AI Chatbot Powered by Gemini API
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Real-time conversations with advanced AI. WebSocket-based,
            responsive, and portfolio-ready.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/chat"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition transform hover:-translate-y-1 hover:scale-105"
            >
              Try Demo
            </Link>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium shadow-md transition hover:bg-gray-100 transform hover:-translate-y-1"
            >
              Create Account
            </Link>
          </div>
          <p className="mt-6 text-sm italic">Created by Hamza Khan</p>
        </div>
      </section>

      {/* Current Features */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Current / In-progress Functionalities
        </h2>
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Real-time Chat with AI",
              desc: "Send & receive messages via WebSocket with auto-scroll and message interactions.",
              icon: <MessageSquare className="w-6 h-6 text-blue-500" />
            },
            {
              title: "Notification System",
              desc: "Custom animated notifications with auto-dismiss, triggered dynamically.",
              icon: <Users className="w-6 h-6 text-indigo-500" />
            },
            {
              title: "User Accounts",
              desc: "Signup & Login pages built in React + Tailwind, integrated with chatbot access.",
              icon: <Cpu className="w-6 h-6 text-green-500" />
            },
            {
              title: "Landing Page",
              desc: "Portfolio-style branding with clear CTAs to Login, Signup, and About.",
              icon: <GitBranch className="w-6 h-6 text-purple-500" />
            },
            {
              title: "WebSocket Management",
              desc: "Connection setup with useEffect, manual reconnect, and working toward auto-reconnect.",
              icon: <MessageSquare className="w-6 h-6 text-yellow-500" />
            },
            {
              title: "Message Interaction",
              desc: "Like/Dislike system with state updates that avoid unnecessary scroll jumps.",
              icon: <Users className="w-6 h-6 text-pink-500" />
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white shadow-md p-6 rounded-xl hover:shadow-lg transition transform reveal opacity-0 translate-y-6 hover:-translate-y-1 hover:scale-102"
            >
              <div className="flex items-center gap-3 mb-3">{f.icon}<h3 className="font-semibold text-xl">{f.title}</h3></div>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planned Features */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Planned / Upcoming Features
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          {[
            "🔒 Protected Chat Page (only for logged-in users)",
            "📌 Session Management (session-aware reconnects)",
            "🎨 Custom Branding (name + tagline)",
            "📱 Responsive UI (mobile-friendly chat + forms)",
            "⚠️ Error Handling (reconnect attempts, invalid inputs)",
          ].map((item, i) => (
            <li
              key={i}
              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* About Section */}
      <section className="py-16 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold mb-6">About This Project</h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          This chatbot is powered by <span className="font-semibold">Gemini API</span>,
          built as a portfolio project using React, Tailwind, and WebSocket.
          It demonstrates real-time AI integration, user management, and a
          clean, responsive UI.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-white rounded-lg shadow hover:bg-gray-100 transition"
          >
            Back to Home
          </Link>
          <a
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Experience Gemini-Powered AI in Real Time
        </h2>
        <Link
          to="/chat"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
        >
          Start Chat Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-white text-center">
        <p>© {new Date().getFullYear()} Hamza Khan. Built with Gemini API.</p>
      </footer>
    </div>
  );
}


        // <Link to="/login">
        //   <div className=' inline-block bg-lime-600 p-2 px-6 cursor-pointer hover:bg-lime-700 transition-colors text-white font-bold  rounded-2xl'>
        //     Log In
        //   </div>
        // </Link>
        // <Link to="/signup">
        //   <div className=' inline-block bg-lime-600 p-2 px-6 cursor-pointer hover:bg-lime-700 transition-colors text-white font-bold  rounded-2xl'>
        //     Sign Up
        //   </div>
        // </Link>
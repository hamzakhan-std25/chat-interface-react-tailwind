import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Cpu, MessageSquare, Users, GitBranch } from 'lucide-react';

// local hero assets (fallback to remote if missing)
import hero1 from '../../assets/images/splash1.jpg';
import hero2 from '../../assets/images/splash2.jpg';
import hero3 from '../../assets/images/splash3.jpg';
import hero4 from '../../assets/images/splash4.jpg';

import chat_interface from '../../assets/images/Chat-interface.png';
import about from '../../assets/images/exp.jpg';







const localImages = [hero1, hero2, hero3, hero4];
const fallbackImages = [
  "https://source.unsplash.com/1200x600/?ai,technology",
  "https://source.unsplash.com/1200x600/?chat,robot",
  "https://source.unsplash.com/1200x600/?coding,abstract",
  "https://source.unsplash.com/1200x600/?websocket,server",
];

const images = localImages.map((imp, i) => imp ?? fallbackImages[i]);

export default function About() {
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
            Real-time AI Chatbot, Polished UX
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Streaming Gemini-powered responses with accessible controls, keyboard shortcuts,
            and a mobile-friendly drawer. Built for speed and clarity.
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
          Current Feature Set
        </h2>
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Real-time Chat with AI",
              desc: "Streaming via WebSocket with assistant-side skeleton placeholder for stable UI.",
              icon: <MessageSquare className="w-6 h-6 text-blue-500" />
            },
            {
              title: "Stop Generating",
              desc: "Abort long generations mid-stream and keep partial content in place.",
              icon: <Cpu className="w-6 h-6 text-indigo-500" />
            },
            {
              title: "Accessible Controls",
              desc: "Aria labels, keyboard shortcuts (Enter / Shift+Enter / Ctrl or Cmd+Enter), focus states.",
              icon: <Users className="w-6 h-6 text-green-500" />
            },
            {
              title: "Auto-growing Input",
              desc: "Textarea expands up to a sensible max height then scrolls.",
              icon: <GitBranch className="w-6 h-6 text-purple-500" />
            },
            {
              title: "Session Sidebar",
              desc: "Mobile drawer with ESC to close, body-scroll lock, and sticky New Chat.",
              icon: <MessageSquare className="w-6 h-6 text-yellow-500" />
            },
            {
              title: "Message Actions",
              desc: "Copy text, tri-state like/dislike, speak aloud (TTS).",
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
          Roadmap
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          {[
            "📚 RAG: Knowledge Base + Embeddings + Vector Search + Retrieval",
            "🔗 Citations in answers with source links",
            "🗂 Session rename/delete/export from sidebar",
            "🔁 Robust reconnection with heartbeats",
            "🎨 Brand voice tuning for marketing tone",
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
        <h2 className="text-3xl font-bold mb-6">About This Project </h2>
        <p className="max-w-2xl mx-auto text-lg mb-6">
          This chatbot is powered by <span className="font-semibold">Gemini API </span>
           and a Node.js WebSocket backend. It demonstrates real-time streaming,
          cancelable generations, voice upload, and a clean, accessible UI.
        </p>
        <div className="flex justify-center flex-col m-4">
         <div className="flex justify-center gap-4">
           <Link
            to="/"
            className="px-6 py-3 bg-white rounded-lg shadow hover:bg-gray-100 transition"
          >
            Back to Home
          </Link>
          <a
            href="https://github.com/hamzakhan-std25/chat-interface-react-tailwind"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            View on GitHub
          </a>
         </div>
          <div className="mt-8">
            <img
              src={about}
              alt="About preview"
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Experience Gemini-Powered AI in Real Time
        </h2>
        <div className="max-w-3xl mx-auto mb-8">
          <img
            src={chat_interface}
            alt="Chat preview"
            className="rounded-xl shadow-lg "
          />
        </div>
        <Link
          to="/chat"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
        >
          Start Chat Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-white text-center">
        <p>© {new Date().getFullYear()} Hamza Khan. Built with Gemini + WebSocket.</p>
      </footer>
    </div>
  );
}


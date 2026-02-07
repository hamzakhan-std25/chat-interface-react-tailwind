import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/authContext";
import { logout } from "../Services/authServices";
import { formatDate } from "../utils/formateTime";
import { Link } from "react-router-dom";


export default function Sidebar({
  selectedSessionId,
  setSelectedSessionId,
  sideIn,
  setSideIn
}) {

  const [sessions, setSessions] = useState([]);
  const { user } = useAuth();
  const SidebarRef = useRef();
  const userId = user?.uid;
  const [isNewChat, setIsNewChat] = useState(true);

  // Ensure sidebar is visible on large screens and behaves as drawer on small screens
  useEffect(() => {
    const applyBreakpoint = () => {
      const isLarge = window.innerWidth >= 1024; // tailwind 'lg' breakpoint
      setSideIn(isLarge);
    };

    applyBreakpoint();
    window.addEventListener('resize', applyBreakpoint);
    return () => window.removeEventListener('resize', applyBreakpoint);
  }, []);

  async function fetchSessions() {
    try {
      const res = await fetch(`https://hamzakhan25-chat-bot-hm.hf.space/chats/sessions/${userId}`);
      // const res = await fetch(`http://localhost:8080/chats/sessions/${userId}`);
      const data = await res.json();
      console.log('fetchSessions data:', data.response);
      setSessions(data.response || []);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }

  useEffect(() => {
    if (userId) fetchSessions();
  }, [userId, selectedSessionId]);

  // Close sidebar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      // only auto-close on outside click for small screens (drawer behavior)
      const isSmall = window.innerWidth < 1024;
      if (isSmall && SidebarRef.current && !SidebarRef.current.contains(event.target)) {
        setSideIn(false);
      }
    }
    function handleKeydown(event) {
      const isSmall = window.innerWidth < 1024;
      if (isSmall && sideIn && event.key === 'Escape') {
        setSideIn(false);
      }
    }
    function lockBodyScroll(lock) {
      if (window.innerWidth < 1024) {
        document.body.classList.toggle('overflow-hidden', !!lock);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    lockBodyScroll(sideIn);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
      lockBodyScroll(false);
    };
  }, [sideIn, setSideIn]);

  return (
    <>
      {/* Sidebar Toggle Button
      <button
        aria-label="Open Sidebar"
        onClick={() => setSideIn(true)}
        className="fixed top-1/2 -left-2 z-40 h-12 w-6 flex items-center justify-center rounded-r-2xl bg-indigo-00 text-white shadow-md hover:translate-x-1 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-600 md:hidden"
      >
        &gt;
      </button> */}

      {/* Overlay for small screens */}
      <div
        aria-hidden={!sideIn}
        onClick={() => setSideIn(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 md:hidden ${sideIn ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Sidebar */}
      <div
        ref={SidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Chat Sessions Sidebar"
        className={`max-w-[280px] w-full bg-gradient-to-b from-indigo-50 to-blue-100 shadow-xl flex flex-col justify-between h-screen fixed top-0 z-50 transform transition-transform duration-300 ease-in-out font-sans md:relative ${sideIn ? 'translate-x-0 left-0' : '-translate-x-full'
          } md:translate-x-0 md:left-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white/70 backdrop-blur">
          <div>
            <h1 className="text-indigo-600 font-extrabold text-xl tracking-wide">
              Chat-Bot
            </h1>
          </div>

          <button
            aria-label="Close Sidebar"
            onClick={() => setSideIn(false)}
            className="text-indigo-500 p-2 rounded-2xl hover:text-indigo-700 bg-indigo-300 transition-all focus:outline-none md:hidden hover:-translate-y-1 "
          >
            <CrossIconSVG />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-indigo-50 to-blue-100 pt-2">
          <button
            onClick={() => {
              setIsNewChat(true);
              selectedSessionId && setSelectedSessionId(false);
              setSideIn(false);
            }}
            className={` cursor-pointer m-3 py-2 rounded-xl font-semibold text-center transition-all w-[-webkit-fill-available]
 ${
              isNewChat
              ? "bg-green-500 text-white shadow-lg"
              : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
          >
            + New Chat
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-1">
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li
                key={session.session_id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!session.session_id || session.session_id === selectedSessionId) return;
                    setSelectedSessionId(session.session_id);
                    setIsNewChat(false);
                    setSideIn(false);
                  }
                }}
                onClick={() => {
                  if (!session.session_id || session.session_id === selectedSessionId) return;
                  setSelectedSessionId(session.session_id);
                  setIsNewChat(false);
                  setSideIn(false);
                }}
                className={`p-3 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all border ${selectedSessionId === session.session_id
                  ? "bg-blue-200 border-blue-400 shadow-sm"
                  : "bg-white/80 hover:bg-blue-100 border-transparent"
                  }`}
              >
                <h3 className="truncate font-medium text-gray-800">
                  {session.last_message?.slice(0, 40) || "Untitled Chat"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(session.last_timestamp)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-2 text-center font-bold rounded-xl  mx-2 bg-blue-500 m-1  hover:bg-blue-400">
          <Link className=" text-white text-md mt-1" to="/about">About Chatbot</Link>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 bg-white/70 backdrop-blur p-4 text-center">
          {user ? (
            <>
              <p className="text-indigo-600 font-medium">
                {user.displayName || user.email}
              </p>
              <button
                onClick={logout}
                className="mt-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="text-gray-700 font-medium">
              Please <span className="text-indigo-500">Log In</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}


const CrossIconSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};
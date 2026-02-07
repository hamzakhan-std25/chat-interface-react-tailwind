import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LogIn/LogIn";
import Signup from "./pages/SignUp/SignUp";
import Chat from "./pages/Chat/Chat";
import About from "./pages/About/About"
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";
import NotificationSystem from "./components/NotificationSystem";
import NotificationBar from "./components/NotificationBar";

import { Toaster } from 'react-hot-toast';


function App() {
  const [notifications, setNotifications] = useState([]);

  function addNotification(msg) {
    // console.log("Adding notification:", msg);
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message: msg }]);
    console.log(notifications)
  }




  return (


      <Router>
        <Toaster position="top-center" />  {/* This displays the notes */}
        <NotificationBar />
        <NotificationSystem notifications={notifications} setNotifications={setNotifications} />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat addNotification={addNotification} />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<About />} />

          {/* The 404 Catch-All Route
        <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>

  );
}

export default App;

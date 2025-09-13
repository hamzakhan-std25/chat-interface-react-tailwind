import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/LogIn/LogIn";
import Signup from "./pages/SignUp/SignUp";
import Chat from "./pages/Chat/Chat";
import About from "./pages/About/About"
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";
import NotificationSystem from "./components/NotificationSystem";



function App() {
  const [notifications, setNotifications] = useState([]);

  function addNotification(msg) {
    // console.log("Adding notification:", msg);
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message: msg }]);
    console.log(notifications)
  }




  return (

    // <About />

    <Router>
        <NotificationSystem notifications={notifications} setNotifications={setNotifications} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat  addNotification={addNotification} />
            </PrivateRoute>
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>


  );
}

export default App;

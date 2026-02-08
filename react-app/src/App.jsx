import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LogIn/LogIn";
import Signup from "./pages/SignUp/SignUp";
import Chat from "./pages/Chat/Chat";
import About from "./pages/About/About"
import PrivateRoute from "./components/PrivateRoute";
import NotificationBar from "./components/NotificationBar";

import { Toaster } from 'react-hot-toast';


function App() {


  return (


      <Router>
        <Toaster position="top-center" />  {/* This displays the notes */}
        <NotificationBar />
       <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
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

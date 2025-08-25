import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/LogIn";
import Signup from "./pages/Signup/SignUp";
import Chat from "./pages/Chat/Chat";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes>
    </Router>
  );
}

export default App;

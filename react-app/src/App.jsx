import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/LogIn/LogIn";
import Signup from "./pages/SignUp/SignUp";
import Chat from "./pages/Chat/Chat";
import About from "./pages/About/About"
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (

    <About />

    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<Signup />} />
    //     <Route 
    //       path="/chat" 
    //       element={
    //         <PrivateRoute>
    //           <Chat />
    //         </PrivateRoute>
    //       } 
    //     />
    //     <Route path="/about" element={<About /> } />
    //   </Routes>
    // </Router>


  );
}

export default App;

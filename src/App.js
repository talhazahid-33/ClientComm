import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Chat from "./Pages/Chat";
import Signup from "./Pages/SignUp";
import "bootstrap/dist/css/bootstrap.min.css";
import ImageChat from "./Pages/ImageChat";
import CustomizedTimeline from "./Pages/FileChat";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/image" element={<ImageChat />} />
          <Route path="/file" element={<CustomizedTimeline />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Assignment1Page } from "./pages/Assignment1Page";
import { Assignment2Page } from "./pages/Assignment2Page";
import { ChatRoomPage } from "./pages/ChatRoomPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assignment/1" element={<Assignment1Page />} />
        <Route path="/assignment/2" element={<Assignment2Page />} />
        <Route path="/chat" element={<ChatRoomPage />} />
      </Routes>
    </Router>
);
};

export default App;
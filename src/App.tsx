import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Assignment1Page } from "./pages/Assignment1Page";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assignment/1" element={<Assignment1Page />} />
      </Routes>
    </Router>
  );
};

export default App;
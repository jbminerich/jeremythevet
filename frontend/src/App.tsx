// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Projects from "./Projects";
import About from "./About";

const App = () => (
  <Router>
    <Navbar /> {/* Navbar added here */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/about" element={<About />} />
      {/* Add more routes as needed */}
    </Routes>
  </Router>
);

export default App;

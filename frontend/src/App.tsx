import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Projects from "./Projects";
import About from "./About";
import Login from "./Login";
import AuthProvider from "./AuthContext";
import CreateUser from "./CreateUser";


const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route
            path="/protected"
            element={
              auth ? <div>Protected Content</div> : <Navigate to="/login" />
            }
          />
                <Route path="/create-user" element={<CreateUser />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

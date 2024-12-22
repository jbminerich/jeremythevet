import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("token"); // Check if the user is authenticated
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/"); // Redirect to the home page
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#007BFF",
        color: "white",
      }}
    >
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none", marginRight: "1rem" }}>
          Home
        </Link>
        <Link to="/projects" style={{ color: "white", textDecoration: "none", marginRight: "1rem" }}>
          Projects
        </Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          About
        </Link>
      </div>
      <div>
        {!token ? (
          <Link to="/login" style={{ color: "white", textDecoration: "none", marginRight: "1rem" }}>
            Login
          </Link>
        ) : (
          <>
            <a
              href="https://home.jeremythevet.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "green",
                borderRadius: "4px",
                display: "inline-block",
              }}
            >
              Dashboard
            </a>
            <button
              onClick={handleLogout}
              style={{
                color: "white",
                textDecoration: "none",
                marginRight: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "green",
                borderRadius: "4px",
                display: "inline-block",
              }}
              
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

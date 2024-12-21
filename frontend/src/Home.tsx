import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to JeremyTheVet.org</h1>
        <p>Sharing stories, ideas, and experiences that inspire.</p>
        <Link to="/projects">
          <button>Explore My Projects</button>
        </Link>
      </div>
    </section>
  );
};

export default Home;

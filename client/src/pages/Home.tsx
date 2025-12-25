/**
 * Home Page
 * Landing page with links to Login and Register
 */
import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="page-container">
      <div className="card card-medium">
        <h1 className="page-title">Welcome to Auth App</h1>
        <p className="page-description">
          A modern authentication system built with React, TypeScript, and
          Django REST Framework.
        </p>
        <div className="button-group">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

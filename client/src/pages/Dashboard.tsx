/**
 * Dashboard (Protected)
 */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  // Redirect to login rout main pageif not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="card card-wide">
        <h1 className="page-title">Dashboard</h1>
        <div className="success-message">🎉 logged in successfully!</div>
        <p className="page-description">
          Welcome to protected dashboard. only accessible for authenticated
          users.
        </p>
        <div className="dashboard-info">
          <p>
            <strong>Token:</strong>{" "}
            {localStorage.getItem("access_token")?.substring(0, 30)}...
          </p>
        </div>
        <Button onClick={logout} variant="secondary">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;

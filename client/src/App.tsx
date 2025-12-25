/**
 * Main App Component
 * Entry point that renders the router
 */
import React from "react";
import AppRouter from "./router/AppRouter";
import "./App.css";

const App: React.FC = () => {
  return <AppRouter />;
};

export default App;

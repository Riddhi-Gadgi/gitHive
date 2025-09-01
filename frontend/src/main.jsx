import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./authContext.jsx";
import Routes from "./Routes.jsx";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

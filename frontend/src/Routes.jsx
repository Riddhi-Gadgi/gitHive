import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

// Pages
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
import RepoList from "./components/repo/RepoList";
import RepoEdit from "./components/repo/RepoEdit";

// Auth Context
import { useAuth } from "./authContext";

//css
import "./index.css";
import RepoView from "./components/repo/RepoView";

const Routes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    // User logged in
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    // Not logged in, redirect to login
    if (
      !userIdFromStorage &&
      !["/auth", "/signup"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }

    // Already logged in, redirect from /auth to dashboard
    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  // useRoutes returns JSX for matched route
  const routesElement = useRoutes([
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/profile", element: <Profile /> },
    { path: "/", element: <Dashboard /> },
    // Repo routes
    { path: "/repo/create", element: <CreateRepo /> },
    { path: "/repo", element: <RepoList /> },
    { path: "/repo/:id", element: <RepoView /> },
    { path: "/repo/edit/:id", element: <RepoEdit /> },
  ]);

  return routesElement;
};

export default Routes;

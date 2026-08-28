import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Wrap any page that requires login: <ProtectedRoute><Dashboard /></ProtectedRoute>
// If there's no logged-in user, it bounces to /login and remembers where the
// user was headed so we can send them back after they sign in.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // avoid a flash-redirect while we check localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LiquidFilters from "./components/LiquidFilters.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VerificationResult from "./pages/VerificationResult.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const [booting, setBooting] = useState(true);

  if (booting) {
    return <LoadingScreen onDone={() => setBooting(false)} />;
  }

  return (
    <>
      {/* Global SVG Liquid Shaders & Displacement Maps */}
      <LiquidFilters />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verify/:companyId"
          element={
            <ProtectedRoute>
              <VerificationResult />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

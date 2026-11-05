import React, { useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LiquidFilters from "./components/LiquidFilters.jsx";

// Route code-splitting with React.lazy for instant mobile page loading
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const HowItWorks = lazy(() => import("./pages/HowItWorks.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const VerificationResult = lazy(() => import("./pages/VerificationResult.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

// Lightweight non-blocking spinner while lazy route chunks load
function RouteLoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg, #030712)",
        gap: 12,
      }}
      aria-live="polite"
    >
      <div
        style={{
          width: 38,
          height: 38,
          border: "3px solid rgba(56, 189, 248, 0.2)",
          borderTopColor: "#38bdf8",
          borderRadius: "50%",
          animation: "route-spin 0.75s linear infinite",
        }}
      />
      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Loading secure view...</span>
      <style>{`
        @keyframes route-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);

  if (booting) {
    return <LoadingScreen onDone={() => setBooting(false)} />;
  }

  return (
    <>
      {/* Global SVG Liquid Shaders */}
      <LiquidFilters />

      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
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
      </Suspense>
    </>
  );
}


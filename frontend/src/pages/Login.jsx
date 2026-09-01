import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import LiquidAuthCard from "../components/LiquidAuthCard.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Auth.css";

export default function Login() {
  const location = useLocation();

  return (
    <div className="page auth-page-wrapper">
      <AnimatedBackground />
      <Navbar />

      <div className="auth-layout container">
        {/* Left: Dynamic Cybersecurity Branding & Trust Radar */}
        <motion.div
          className="auth-brand"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="auth-brand__badge-row">
            <span className="hero__eyebrow glass-pill">
              <ShieldCheck size={14} color="var(--color-accent)" />
              <span>Student Safety Network</span>
            </span>
            <span className="auth-live-pill glass-pill">
              <span className="auth-live-dot" />
              <span>Engine v2.6 Active</span>
            </span>
          </div>

          <h1>
            Protect your career with <span className="text-gradient">AI verification.</span>
          </h1>

          <p>
            Sign in to scan offer letters, verify hiring companies against 2,400+ known threat heuristics, and keep your personal data secure.
          </p>


        </motion.div>

        {/* Right: Unified Morphing Liquid Auth Card */}
        <div className="auth-card-container">
          <LiquidAuthCard
            defaultTab="signin"
            onSuccess={() => {
              const redirectTo = location.state?.from || "/dashboard";
              window.location.href = redirectTo;
            }}
          />
        </div>
      </div>
    </div>
  );
}

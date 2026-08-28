import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
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

          {/* Live Student Threat & Protection Matrix */}
          <div className="auth-live-feed glass-card">
            <div className="auth-feed-header">
              <span className="auth-feed-title">
                <Sparkles size={14} color="#38bdf8" />
                <span>Live Student Security Matrix</span>
              </span>
              <span className="auth-feed-counter">34,000+ Protected</span>
            </div>

            <div className="auth-feed-items">
              <div className="auth-feed-item auth-feed-item--safe">
                <CheckCircle2 size={15} color="#22c55e" className="feed-icon" />
                <div>
                  <strong>Google Summer Analyst '26</strong>
                  <span>Cryptographic signature passed • 0 risk</span>
                </div>
              </div>

              <div className="auth-feed-item auth-feed-item--threat">
                <AlertTriangle size={15} color="#f43f5e" className="feed-icon" />
                <div>
                  <strong>Advance ₹15k Training Fee Scam</strong>
                  <span>Flagged clause: upfront payment requested (Blocked)</span>
                </div>
              </div>

              <div className="auth-feed-item auth-feed-item--safe">
                <Zap size={15} color="#38bdf8" className="feed-icon" />
                <div>
                  <strong>TCS Digital Offer Validation</strong>
                  <span>Matched registered domain MX & MCA records</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="auth-stats glass-pill">
            <div className="auth-stat">
              <strong>98/100</strong>
              <span>Trust engine</span>
            </div>
            <div className="auth-stats__divider" />
            <div className="auth-stat">
              <strong>&lt;10 sec</strong>
              <span>Scan Target</span>
            </div>
            <div className="auth-stats__divider" />
            <div className="auth-stat">
              <strong>Privacy-first</strong>
              <span>Student control</span>
            </div>
          </div>
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

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import LiquidAuthCard from "../components/LiquidAuthCard.jsx";
import Navbar from "../components/Navbar.jsx";
import "./Auth.css";

export default function Register() {
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
              <span>100% Free For Students</span>
            </span>
          </div>

          <h1>
            Join the global safety network protecting <span className="text-gradient">students everywhere.</span>
          </h1>

          <p>
            Create your free account to instantly analyze offer letters, check suspicious recruiter email domains, and contribute to community threat intelligence.
          </p>

          {/* Student Protection Matrix */}
          <div className="auth-live-feed glass-card">
            <div className="auth-feed-header">
              <span className="auth-feed-title">
                <Users size={14} color="#38bdf8" />
                <span>Verified Campus Network</span>
              </span>
              <span className="auth-feed-counter">500+ Universities</span>
            </div>

            <div className="auth-feed-items">
              <div className="auth-feed-item auth-feed-item--safe">
                <Award size={15} color="#22c55e" className="feed-icon" />
                <div>
                  <strong>"Saved me ₹20,000 laptop deposit fee!"</strong>
                  <span>Stanford CS '26 • Flagged fake recruitment bot</span>
                </div>
              </div>

              <div className="auth-feed-item auth-feed-item--safe">
                <Lock size={15} color="#38bdf8" className="feed-icon" />
                <div>
                  <strong>Zero Personal Data Retention</strong>
                  <span>Your resume & offer details are never stored or sold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="auth-stats glass-pill">
            <div className="auth-stat">
              <strong>10k+</strong>
              <span>Active Students</span>
            </div>
            <div className="auth-stats__divider" />
            <div className="auth-stat">
              <strong>2,400+</strong>
              <span>Scams Blocked</span>
            </div>
            <div className="auth-stats__divider" />
            <div className="auth-stat">
              <strong>$0 Loss</strong>
              <span>Protected Students</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Unified Morphing Liquid Auth Card */}
        <div className="auth-card-container">
          <LiquidAuthCard
            defaultTab="signup"
            onSuccess={() => {
              window.location.href = "/dashboard";
            }}
          />
        </div>
      </div>
    </div>
  );
}

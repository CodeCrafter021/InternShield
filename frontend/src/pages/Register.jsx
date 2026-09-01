import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
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

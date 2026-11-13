import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import LiquidAuthCard from "../components/LiquidAuthCard.jsx";
import "./Auth.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="page auth-page-wrapper">
      <AnimatedBackground />

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
              <span>Student-focused internship checks</span>
            </span>
          </div>

          <h1>
            Review internship offers with <span className="text-gradient">more confidence.</span>
          </h1>

          <p>
            Sign in to review company information and potential warning signs in internship offers.
          </p>


        </motion.div>

        {/* Right: Unified Morphing Liquid Auth Card */}
        <div className="auth-card-container">
          <LiquidAuthCard
            defaultTab="signin"
            onSuccess={() => {
              const redirectTo = location.state?.from || "/dashboard";
              navigate(redirectTo, { replace: true });
            }}
          />
        </div>
      </div>
    </div>
  );
}

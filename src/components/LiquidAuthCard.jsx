import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LiquidButton from "./LiquidButton.jsx";
import "./LiquidAuthCard.css";

/**
 * LiquidAuthCard — Ultra-Modern Apple VisionOS / iOS 26 Dynamic Auth Card
 * Features:
 * - Fluid morphing tab indicator with gelatinous spring physics
 * - One-click fast student OAuth buttons (Google & GitHub)
 * - 1-Click Demo Account Quick-Fill Capsule
 * - Real-time password strength analyzer with visual progress bar
 * - 100% full-transparent liquid glass inputs with floating labels & specular bloom
 */
export default function LiquidAuthCard({ defaultTab = "signin", onSuccess }) {
  const [activeTab, setActiveTab] = useState(defaultTab); // "signin" | "signup"
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  function getPasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: "None", color: "transparent", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Weak", color: "#f43f5e", width: "25%" };
      case 2:
        return { score: 2, label: "Fair", color: "#f59e0b", width: "50%" };
      case 3:
        return { score: 3, label: "Strong", color: "#38bdf8", width: "75%" };
      case 4:
        return { score: 4, label: "Military Grade", color: "#22c55e", width: "100%" };
      default:
        return { score: 1, label: "Weak", color: "#f43f5e", width: "25%" };
    }
  }

  const pwdStrength = getPasswordStrength(password);

  function handleFillDemo() {
    setEmail("atharvawallapkar261@gmail.com");
    setPassword("password123");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (activeTab === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (activeTab === "signin") {
        await login({ email: email.trim(), password });
      } else {
        await register({ name: name.trim(), email: email.trim(), password });
      }
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSocialLogin(provider) {
    setIsLoading(true);
    setError("");
    try {
      // Simulate fast OAuth resolution for student demo
      await login({ email: `student.${provider.toLowerCase()}@internshield.ai`, password: "password123" });
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        else navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError(`Failed to authenticate with ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setError("");
  }

  return (
    <motion.div
      className="liquid-auth-card glass-card"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Specular Liquid Top Glaze */}
      <div className="liquid-auth-card__sheen" aria-hidden="true" />

      {/* Header */}
      <div className="liquid-auth-card__header">
        <motion.div
          className="liquid-auth-card__brand-icon"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
        >
          <ShieldCheck size={28} strokeWidth={2.2} />
        </motion.div>
        <h2>{activeTab === "signin" ? "Welcome back" : "Create an account"}</h2>
        <p>
          {activeTab === "signin"
            ? "Sign in to access real-time offer verification & threat radar."
            : "Join thousands of students verifying offers safely with AI."}
        </p>
      </div>

      {/* Morphing Fluid Tabs */}
      <div className="liquid-auth-tabs">
        <button
          type="button"
          className={`liquid-auth-tab ${activeTab === "signin" ? "liquid-auth-tab--active" : ""}`}
          onClick={() => handleTabChange("signin")}
        >
          {activeTab === "signin" && (
            <motion.div
              layoutId="activeAuthTab"
              className="liquid-auth-tab__indicator"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}
          <span>Sign In</span>
        </button>

        <button
          type="button"
          className={`liquid-auth-tab ${activeTab === "signup" ? "liquid-auth-tab--active" : ""}`}
          onClick={() => handleTabChange("signup")}
        >
          {activeTab === "signup" && (
            <motion.div
              layoutId="activeAuthTab"
              className="liquid-auth-tab__indicator"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}
          <span>Sign Up</span>
        </button>
      </div>

      {/* Quick Fill Demo Credentials Chip (Sign In Only) */}
      {activeTab === "signin" && (
        <motion.div
          className="demo-credentials-bar"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            type="button"
            className="demo-credentials-btn glass-pill"
            onClick={handleFillDemo}
          >
            <Zap size={13} color="#38bdf8" />
            <span>⚡ 1-Click Demo Account Autofill</span>
          </button>
        </motion.div>
      )}

      {/* Fast SSO / Social Buttons */}
      <div className="liquid-auth-socials">
        <motion.button
          type="button"
          className="social-auth-btn glass"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSocialLogin("Google")}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" className="social-icon">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </motion.button>

        <motion.button
          type="button"
          className="social-auth-btn glass"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSocialLogin("GitHub")}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="social-icon">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </motion.button>
      </div>

      <div className="auth-divider">
        <span className="auth-divider__line" />
        <span className="auth-divider__text">or with university email</span>
        <span className="auth-divider__line" />
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="liquid-auth-error"
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={15} className="error-icon" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="liquid-auth-form">
        {/* Name Field (Sign Up Only) */}
        <AnimatePresence>
          {activeTab === "signup" && (
            <motion.div
              className="liquid-input-group"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="liquid-input-wrap">
                <User size={18} className="liquid-input-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="liquid-input"
                  required={activeTab === "signup"}
                />
                <label htmlFor="auth-name" className="liquid-input-label">
                  Full Name
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <div className="liquid-input-group">
          <div className="liquid-input-wrap">
            <Mail size={18} className="liquid-input-icon" />
            <input
              id="auth-email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="liquid-input"
              required
            />
            <label htmlFor="auth-email" className="liquid-input-label">
              University / Personal Email
            </label>
          </div>
        </div>

        {/* Password Field */}
        <div className="liquid-input-group">
          <div className="liquid-input-wrap">
            <Lock size={18} className="liquid-input-icon" />
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="liquid-input"
              required
            />
            <label htmlFor="auth-password" className="liquid-input-label">
              Password
            </label>
            <button
              type="button"
              className="liquid-input-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Real-time Password Strength Meter (Sign Up Only) */}
          {activeTab === "signup" && password.length > 0 && (
            <motion.div
              className="pwd-strength-wrap"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <div className="pwd-strength-bar">
                <div
                  className="pwd-strength-fill"
                  style={{ width: pwdStrength.width, backgroundColor: pwdStrength.color }}
                />
              </div>
              <div className="pwd-strength-meta">
                <span className="strength-label" style={{ color: pwdStrength.color }}>
                  Security: {pwdStrength.label}
                </span>
                <span className="strength-hint">Min 8 chars with mixed case & numbers</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password (Sign Up Only) */}
        <AnimatePresence>
          {activeTab === "signup" && (
            <motion.div
              className="liquid-input-group"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="liquid-input-wrap">
                <Lock size={18} className="liquid-input-icon" />
                <input
                  id="auth-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="liquid-input"
                  required={activeTab === "signup"}
                />
                <label htmlFor="auth-confirm-password" className="liquid-input-label">
                  Confirm Password
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <LiquidButton
          type="submit"
          variant="solid"
          size="lg"
          fullWidth
          disabled={isLoading || isSuccess}
          className="liquid-auth-submit"
        >
          {isSuccess ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={18} /> Verified & Access Granted
            </span>
          ) : isLoading ? (
            "Authenticating..."
          ) : activeTab === "signin" ? (
            "Sign In to Dashboard"
          ) : (
            "Create Student Account"
          )}
        </LiquidButton>
      </form>

      {/* Card Footer Switcher */}
      <div className="liquid-auth-card__footer">
        {activeTab === "signin" ? (
          <p>
            New to InternShield?{" "}
            <button
              type="button"
              className="liquid-auth-link"
              onClick={() => handleTabChange("signup")}
            >
              Sign up free →
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="liquid-auth-link"
              onClick={() => handleTabChange("signin")}
            >
              Sign in now →
            </button>
          </p>
        )}
      </div>
    </motion.div>
  );
}

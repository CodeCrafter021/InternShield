import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Lock,
  Smartphone,
  Bell,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Laptop,
  Radio,
  ShieldCheck,
  Zap,
  Download,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserSettings,
  updateUserSettings,
} from "../services/authService.js";
import {
  exportAuditHistory,
  clearAuditData,
} from "../services/verificationService.js";
import LiquidButton from "./LiquidButton.jsx";
import "./DashboardSettings.css";

// ── Avatar Presets (Cyber Student Personas) ──
const AVATAR_PRESETS = [
  { id: "avatar-cyber-1", label: "Cyber Sentinel", icon: "🛡️", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)" },
  { id: "avatar-cyber-2", label: "Quantum Hacker", icon: "⚡", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.15)" },
  { id: "avatar-cyber-3", label: "AI Scout", icon: "🤖", color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)" },
  { id: "avatar-cyber-4", label: "Data Guardian", icon: "🔮", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)" },
  { id: "avatar-cyber-5", label: "Space Cadet", icon: "🚀", color: "#eab308", bg: "rgba(234, 179, 8, 0.15)" },
];

export default function DashboardSettings({ defaultTab = "security", onClose }) {
  const { user, requestOtp, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab === "profile" ? "security" : defaultTab);
  const [settings, setSettings] = useState(getUserSettings());
  const [toastMessage, setToastMessage] = useState(null);

  // Helper toast notification
  function showToast(msg, type = "success") {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleSaveSettings(newVals) {
    const updated = updateUserSettings(newVals);
    setSettings(updated);
    showToast("Settings updated successfully!");
  }

  return (
    <div className="settings-suite">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className={`settings-toast settings-toast--${toastMessage.type}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 size={18} color="#22c55e" />
            ) : (
              <AlertTriangle size={18} color="#f43f5e" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Settings Top Header ── */}
      <div className="settings-suite__header">
        <div>
          <div className="dashboard__status-pill" style={{ marginBottom: 8 }}>
            <span className="dashboard__status-dot" />
            <span>Account Security & Preferences Center</span>
          </div>
          <h2 className="settings-suite__title">System Settings</h2>
          <p className="settings-suite__sub">
            Configure authentication credentials with OTP, 2FA encryption, active device sessions, alert filters, and developer API keys.
          </p>
        </div>
      </div>

      {/* ── Tabbed Content Layout ── */}
      <div className="settings-suite__grid">
        {/* Navigation Sidebar */}
        <div className="settings-nav glass-card">
          <button
            className={`settings-nav__item ${activeTab === "security" ? "settings-nav__item--active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Lock size={18} />
            <span>Password & OTP Reset</span>
          </button>

          <button
            className={`settings-nav__item ${activeTab === "privacy" ? "settings-nav__item--active" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <Shield size={18} />
            <span>Shield Privacy & 2FA</span>
          </button>

          <button
            className={`settings-nav__item ${activeTab === "sessions" ? "settings-nav__item--active" : ""}`}
            onClick={() => setActiveTab("sessions")}
          >
            <Smartphone size={18} />
            <span>Active Sessions</span>
          </button>

          <button
            className={`settings-nav__item ${activeTab === "notifications" ? "settings-nav__item--active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} />
            <span>Alerts & Notifications</span>
          </button>

          <button
            className={`settings-nav__item ${activeTab === "developer" ? "settings-nav__item--active" : ""}`}
            onClick={() => setActiveTab("developer")}
          >
            <Code2 size={18} />
            <span>Developer API & Data</span>
          </button>
        </div>

        {/* Tab Viewport */}
        <div className="settings-content glass-card">
          <AnimatePresence mode="wait">
            {activeTab === "security" && (
              <SecurityTab
                key="security"
                user={user}
                requestOtp={requestOtp}
                resetPassword={resetPassword}
                showToast={showToast}
              />
            )}
            {activeTab === "privacy" && (
              <PrivacyTab
                key="privacy"
                settings={settings}
                onSave={handleSaveSettings}
                showToast={showToast}
              />
            )}
            {activeTab === "sessions" && (
              <SessionsTab
                key="sessions"
                showToast={showToast}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationsTab
                key="notifications"
                settings={settings}
                onSave={handleSaveSettings}
                showToast={showToast}
              />
            )}
            {activeTab === "developer" && (
              <DeveloperTab
                key="developer"
                settings={settings}
                onSave={handleSaveSettings}
                showToast={showToast}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. SECURITY & OTP PASSWORD RESET TAB
// ══════════════════════════════════════════════════════════════════════════════
function SecurityTab({ user, requestOtp, resetPassword, showToast }) {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState(user?.email || "");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === "verify_otp" && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  async function handleSendOtp() {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await requestOtp(email);
      setGeneratedOtp(res.otp);
      setTimerSeconds(60);
      setStep("verify_otp");
      showToast(`Verification code sent to ${email}`);
    } catch (err) {
      setErrorMsg(err.message || "Failed to generate OTP code.");
    } finally {
      setLoading(false);
    }
  }

  function handleDigitChange(idx, val) {
    if (val.length > 1) {
      const clean = val.replace(/\D/g, "").slice(0, 6);
      const newDigits = [...otpDigits];
      clean.split("").forEach((ch, i) => {
        if (i < 6) newDigits[i] = ch;
      });
      setOtpDigits(newDigits);
      if (clean.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const cleanChar = val.replace(/\D/g, "");
    const updated = [...otpDigits];
    updated[idx] = cleanChar;
    setOtpDigits(updated);

    if (cleanChar && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handleConfirmOtp() {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (fullOtp !== generatedOtp) {
      setErrorMsg("Invalid OTP code. Please check the code and try again.");
      return;
    }

    setErrorMsg("");
    setStep("new_password");
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otpDigits.join(""), newPassword);
      setStep("success");
      showToast("Your password has been successfully reset!");
    } catch (err) {
      setErrorMsg(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  function calculateStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    switch (score) {
      case 1:
        return { label: "Weak", color: "#f43f5e", pct: 25 };
      case 2:
        return { label: "Fair", color: "#f59e0b", pct: 50 };
      case 3:
        return { label: "Strong", color: "#38bdf8", pct: 75 };
      case 4:
        return { label: "Military Grade", color: "#22c55e", pct: 100 };
      default:
        return { label: "Too Short", color: "#64748b", pct: 10 };
    }
  }

  const strength = calculateStrength(newPassword);

  return (
    <motion.div
      className="tab-panel"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="tab-panel__header">
        <div>
          <h3>Password & Security Credentials</h3>
          <p>Reset your account master password securely via One-Time Passcode (OTP) verification.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="settings-error-banner">
          <AlertTriangle size={18} color="#f43f5e" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: REQUEST OTP */}
      {step === "request" && (
        <div className="security-step-card">
          <div className="security-step-card__icon-wrap">
            <KeyRound size={28} color="#38bdf8" />
          </div>
          <h4>Request Security Reset Code</h4>
          <p>
            We will generate a secure cryptographic 6-digit OTP and transmit it to your verified email address:{" "}
            <strong>{email}</strong>.
          </p>

          <div className="security-step-card__action">
            <LiquidButton
              variant="cyan"
              size="md"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Generating OTP..." : "Send Verification OTP"}
            </LiquidButton>
          </div>
        </div>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === "verify_otp" && (
        <div className="security-step-card">
          <div className="security-step-card__icon-wrap">
            <Smartphone size={28} color="#8b5cf6" />
          </div>
          <h4>Enter 6-Digit OTP</h4>
          <p>
            Check your inbox for the code sent to <strong>{email}</strong>.
          </p>

          {/* Interactive Demo Assist Bubble */}
          <div className="otp-demo-helper glass-pill">
            <Sparkles size={14} color="#38bdf8" />
            <span>Demo Helper: Your simulated OTP is <strong>{generatedOtp}</strong></span>
            <button
              type="button"
              className="otp-autofill-link"
              onClick={() => {
                const arr = generatedOtp.split("");
                setOtpDigits(arr);
              }}
            >
              (1-Click Autofill)
            </button>
          </div>

          {/* Split 6-Box OTP Inputs */}
          <div className="otp-boxes-wrap">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`otp-digit-box ${digit ? "otp-digit-box--filled" : ""}`}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          <div className="otp-timer-meta">
            {timerSeconds > 0 ? (
              <span>Code expires in <strong>{timerSeconds}s</strong></span>
            ) : (
              <button
                type="button"
                className="otp-resend-btn"
                onClick={handleSendOtp}
              >
                Resend Code
              </button>
            )}
          </div>

          <div className="security-step-card__action">
            <LiquidButton
              variant="cyan"
              size="md"
              onClick={handleConfirmOtp}
            >
              Verify & Set New Password
            </LiquidButton>
          </div>
        </div>
      )}

      {/* STEP 3: SET NEW PASSWORD */}
      {step === "new_password" && (
        <form onSubmit={handleUpdatePassword} className="settings-form">
          <div className="form-group">
            <label>New Master Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="strength-meter-wrap">
                <div className="strength-meter-bar">
                  <div
                    className="strength-meter-fill"
                    style={{ width: `${strength.pct}%`, backgroundColor: strength.color }}
                  />
                </div>
                <div className="strength-meter-text">
                  <span>Strength: <strong style={{ color: strength.color }}>{strength.label}</strong></span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat new master password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div className="password-checklist glass-card">
            <div className={`checklist-item ${newPassword.length >= 8 ? "checklist-item--pass" : ""}`}>
              <Check size={14} /> At least 8 characters
            </div>
            <div className={`checklist-item ${/[A-Z]/.test(newPassword) ? "checklist-item--pass" : ""}`}>
              <Check size={14} /> One uppercase letter
            </div>
            <div className={`checklist-item ${/[0-9]/.test(newPassword) ? "checklist-item--pass" : ""}`}>
              <Check size={14} /> One number digit
            </div>
            <div className={`checklist-item ${/[^A-Za-z0-9]/.test(newPassword) ? "checklist-item--pass" : ""}`}>
              <Check size={14} /> One special character (#, $, %, etc.)
            </div>
          </div>

          <div className="form-actions">
            <LiquidButton
              type="submit"
              variant="cyan"
              size="md"
              disabled={loading}
            >
              {loading ? "Updating..." : "Confirm & Save Password"}
            </LiquidButton>
          </div>
        </form>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === "success" && (
        <div className="security-step-card security-step-card--success">
          <div className="security-step-card__icon-wrap" style={{ background: "rgba(34, 197, 94, 0.15)", borderColor: "rgba(34, 197, 94, 0.4)" }}>
            <CheckCircle2 size={32} color="#22c55e" />
          </div>
          <h4>Password Successfully Updated!</h4>
          <p>
            Your account security credentials have been updated in your local vault. You can now use your new password on all future logins.
          </p>

          <div className="security-step-card__action">
            <LiquidButton
              variant="ghost"
              size="md"
              showArrow={false}
              onClick={() => {
                setStep("request");
                setOtpDigits(["", "", "", "", "", ""]);
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Done
            </LiquidButton>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. PRIVACY & 2FA TAB
// ══════════════════════════════════════════════════════════════════════════════
function PrivacyTab({ settings, onSave, showToast }) {
  const [twoFactor, setTwoFactor] = useState(settings.twoFactorEnabled);
  const [incognito, setIncognito] = useState(settings.incognitoVerification);
  const [telemetry, setTelemetry] = useState(settings.telemetrySharing);
  const [showQrModal, setShowQrModal] = useState(false);

  function handleToggle2Fa() {
    if (!twoFactor) {
      setShowQrModal(true);
    } else {
      setTwoFactor(false);
      onSave({ twoFactorEnabled: false });
      showToast("Two-Factor Authentication disabled.");
    }
  }

  function handleConfirm2Fa() {
    setTwoFactor(true);
    setShowQrModal(false);
    onSave({ twoFactorEnabled: true });
    showToast("Two-Factor Authentication is now active! 🛡️");
  }

  return (
    <motion.div
      className="tab-panel"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="tab-panel__header">
        <div>
          <h3>Shield Privacy & 2-Factor Authentication</h3>
          <p>Configure hardware security keys, stealth mode verifications, and cryptographic isolation.</p>
        </div>
      </div>

      <div className="toggle-cards-list">
        {/* 2FA Card */}
        <div className="toggle-card glass-card">
          <div className="toggle-card__info">
            <div className="toggle-card__icon-wrap">
              <ShieldCheck size={22} color="#38bdf8" />
            </div>
            <div>
              <h4>Two-Factor Authentication (2FA)</h4>
              <p>Require an authenticator code (Google Authenticator / Authy) on new device sign-ins.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={handleToggle2Fa}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>

        {/* Incognito Verification */}
        <div className="toggle-card glass-card">
          <div className="toggle-card__info">
            <div className="toggle-card__icon-wrap">
              <Radio size={22} color="#8b5cf6" />
            </div>
            <div>
              <h4>Incognito Company Verification Mode</h4>
              <p>Mask your student identity and IP address when running background checks on suspected employers.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={incognito}
                onChange={(e) => {
                  setIncognito(e.target.checked);
                  onSave({ incognitoVerification: e.target.checked });
                }}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>

        {/* Telemetry */}
        <div className="toggle-card glass-card">
          <div className="toggle-card__info">
            <div className="toggle-card__icon-wrap">
              <Zap size={22} color="#22c55e" />
            </div>
            <div>
              <h4>Anonymous Threat Telemetry Sharing</h4>
              <p>Contribute anonymized fraud patterns and fake recruiter signatures to help protect fellow students.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={telemetry}
                onChange={(e) => {
                  setTelemetry(e.target.checked);
                  onSave({ telemetrySharing: e.target.checked });
                }}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal Simulator */}
      <AnimatePresence>
        {showQrModal && (
          <div className="settings-modal-overlay">
            <motion.div
              className="settings-modal glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Set Up Authenticator App</h3>
                <p>Scan this QR code with Google Authenticator or 1Password to activate 2FA.</p>
              </div>

              {/* Mock QR Canvas Visual */}
              <div className="mock-qr-wrap">
                <div className="mock-qr-code">
                  <div className="qr-corner qr-top-left" />
                  <div className="qr-corner qr-top-right" />
                  <div className="qr-corner qr-bottom-left" />
                  <div className="qr-center-shield">
                    <Shield size={28} color="#38bdf8" />
                  </div>
                </div>
                <span className="secret-key-text">Secret: <strong>ISHIELD-9842-K10X-Z980</strong></span>
              </div>

              <div className="modal-actions">
                <LiquidButton
                  variant="ghost"
                  size="md"
                  showArrow={false}
                  onClick={() => setShowQrModal(false)}
                >
                  Cancel
                </LiquidButton>
                <LiquidButton
                  variant="cyan"
                  size="md"
                  onClick={handleConfirm2Fa}
                >
                  Confirm 2FA Activation
                </LiquidButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. ACTIVE SESSIONS TAB
// ══════════════════════════════════════════════════════════════════════════════
function SessionsTab({ showToast }) {
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      device: "Windows PC (Google Chrome 128)",
      location: "Mumbai, Maharashtra, India",
      ip: "103.21.144.92",
      current: true,
      icon: Laptop,
      lastActive: "Active Now",
    },
    {
      id: "sess-2",
      device: "Apple iPhone 15 Pro (Safari Mobile)",
      location: "Bangalore, Karnataka, India",
      ip: "49.207.210.14",
      current: false,
      icon: Smartphone,
      lastActive: "2 hours ago",
    },
    {
      id: "sess-3",
      device: "MacBook Pro M3 (Firefox Nightly)",
      location: "New Delhi, India",
      ip: "115.110.245.18",
      current: false,
      icon: Laptop,
      lastActive: "3 days ago",
    },
  ]);

  function handleRevoke(id) {
    setSessions(sessions.filter((s) => s.id !== id));
    showToast("Session successfully revoked and terminated.");
  }

  function handleRevokeAllOther() {
    setSessions(sessions.filter((s) => s.current));
    showToast("Logged out of all other remote device sessions.");
  }

  return (
    <motion.div
      className="tab-panel"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="tab-panel__header">
        <div>
          <h3>Active Device Sessions</h3>
          <p>These devices are currently logged into your InternShield student security account.</p>
        </div>
        {sessions.length > 1 && (
          <LiquidButton
            variant="ghost"
            size="sm"
            showArrow={false}
            onClick={handleRevokeAllOther}
          >
            Log Out Other Devices
          </LiquidButton>
        )}
      </div>

      <div className="sessions-list">
        <AnimatePresence>
          {sessions.map((sess) => (
            <motion.div
              key={sess.id}
              className={`session-card glass-card ${sess.current ? "session-card--current" : ""}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="session-card__left">
                <div className="session-card__icon-wrap">
                  <sess.icon size={22} color={sess.current ? "#38bdf8" : "var(--text-secondary)"} />
                </div>
                <div>
                  <div className="session-card__title-row">
                    <strong>{sess.device}</strong>
                    {sess.current && <span className="session-badge-current">This Device</span>}
                  </div>
                  <div className="session-card__meta">
                    <span>📍 {sess.location}</span>
                    <span>•</span>
                    <span>IP: {sess.ip}</span>
                    <span>•</span>
                    <span>{sess.lastActive}</span>
                  </div>
                </div>
              </div>

              <div className="session-card__right">
                {!sess.current && (
                  <button
                    type="button"
                    className="session-revoke-btn"
                    onClick={() => handleRevoke(sess.id)}
                  >
                    Revoke Access
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. NOTIFICATIONS & ALERTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function NotificationsTab({ settings, onSave, showToast }) {
  const [scamAlerts, setScamAlerts] = useState(settings.scamAlertsEmail);
  const [weeklyDigest, setWeeklyDigest] = useState(settings.weeklyThreatDigest);
  const [community, setCommunity] = useState(settings.communityAlerts);
  const [webhook, setWebhook] = useState(settings.discordWebhook || "");

  function handleSaveWebhook(e) {
    e.preventDefault();
    onSave({ discordWebhook: webhook.trim() });
    showToast("Campus Webhook endpoint updated!");
  }

  return (
    <motion.div
      className="tab-panel"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="tab-panel__header">
        <div>
          <h3>Threat Notifications & Campus Alerts</h3>
          <p>Stay informed whenever new fraudulent schemes target your college campus or target roles.</p>
        </div>
      </div>

      <div className="toggle-cards-list">
        <div className="toggle-card glass-card">
          <div className="toggle-card__info">
            <div className="toggle-card__icon-wrap">
              <AlertTriangle size={22} color="#f43f5e" />
            </div>
            <div>
              <h4>Critical Scam Email Alerts</h4>
              <p>Receive instant notifications if a company you previously searched gets confirmed as fraudulent.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={scamAlerts}
                onChange={(e) => {
                  setScamAlerts(e.target.checked);
                  onSave({ scamAlertsEmail: e.target.checked });
                }}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>

        <div className="toggle-card glass-card">
          <div className="toggle-card__info">
            <div className="toggle-card__icon-wrap">
              <Bell size={22} color="#38bdf8" />
            </div>
            <div>
              <h4>Weekly Internship Threat Digest</h4>
              <p>A concise summary of top intercepted phishing vectors and blacklisted recruitment firms.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => {
                  setWeeklyDigest(e.target.checked);
                  onSave({ weeklyThreatDigest: e.target.checked });
                }}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>

        <div className="toggle-card glass-card">
          <div className="toggle-card__info">
            <div className="toggle-card__icon-wrap">
              <Sparkles size={22} color="#8b5cf6" />
            </div>
            <div>
              <h4>Community Red-Flag Reports</h4>
              <p>Get notified when students at your university flag suspicious offer letters.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={community}
                onChange={(e) => {
                  setCommunity(e.target.checked);
                  onSave({ communityAlerts: e.target.checked });
                }}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>
      </div>

      {/* Campus Placement Webhook */}
      <form onSubmit={handleSaveWebhook} className="settings-form" style={{ marginTop: 28 }}>
        <h4>Campus Discord / Slack Webhook</h4>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 12 }}>
          Broadcast real-time scam alerts directly to your university's placement WhatsApp/Discord channel.
        </p>
        <div className="form-group">
          <div className="input-wrap">
            <Code2 size={16} className="input-icon" />
            <input
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <LiquidButton variant="cyan" size="sm" type="submit">
            Save Webhook URL
          </LiquidButton>
        </div>
      </form>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. DEVELOPER API & DATA TAB
// ══════════════════════════════════════════════════════════════════════════════
function DeveloperTab({ settings, onSave, showToast }) {
  const [apiKey, setApiKey] = useState(settings.apiKey || "ishield_live_9f8c2b71a0e4d6");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    showToast("API Key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRegenerate() {
    const newKey = `ishield_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;
    setApiKey(newKey);
    onSave({ apiKey: newKey });
    showToast("New API key generated!");
  }

  function handleExportData() {
    exportAuditHistory();
    showToast("Cryptographic audit logs downloaded as JSON!");
  }

  function handleClearData() {
    clearAuditData();
    showToast("Local scan logs and audit history successfully wiped.");
  }

  return (
    <motion.div
      className="tab-panel"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="tab-panel__header">
        <div>
          <h3>Student Developer API & Data Management</h3>
          <p>Access our programmatic verification endpoints or export your audit logs.</p>
        </div>
      </div>

      {/* API Key Box */}
      <div className="developer-api-box glass-card">
        <div className="api-box__header">
          <div>
            <strong>Personal Verification API Key</strong>
            <p>1,000 free API verification calls / day for student open-source projects.</p>
          </div>
          <span className="api-status-badge">🟢 Rate Limit: Normal</span>
        </div>

        <div className="api-key-field">
          <code>{showKey ? apiKey : "••••••••••••••••••••••••••••••••••••"}</code>
          <div className="api-key-actions">
            <button
              type="button"
              className="api-action-btn"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? "Hide Key" : "Show Key"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              type="button"
              className="api-action-btn"
              onClick={handleCopy}
              title="Copy to Clipboard"
            >
              {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
            </button>
            <button
              type="button"
              className="api-action-btn"
              onClick={handleRegenerate}
              title="Regenerate API Key"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Export & Data Management */}
      <div className="data-management-grid">
        <div className="data-action-card glass-card">
          <div className="data-card-icon">
            <Download size={22} color="#38bdf8" />
          </div>
          <div>
            <h4>Export Scan History (JSON)</h4>
            <p>Download a cryptographic record of all company verifications and flagged offers.</p>
          </div>
          <LiquidButton
            variant="cyan"
            size="sm"
            showArrow={false}
            onClick={handleExportData}
          >
            Download Records
          </LiquidButton>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="danger-zone glass-card">
        <h4>⚠️ Danger Zone</h4>
        <p>Permanently remove your scan history and delete your cached student verification records.</p>
        <div className="danger-zone__actions">
          <button
            type="button"
            className="danger-btn"
            onClick={handleClearData}
          >
            Clear Local Scan History
          </button>
        </div>
      </div>
    </motion.div>
  );
}

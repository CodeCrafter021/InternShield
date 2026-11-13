import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Smartphone,
  Bell,
  Code2,
  CheckCircle2,
  Check,
  AlertTriangle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Laptop,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getUserSettings,
  updateUserSettings,
  DEFAULT_USER_SETTINGS,
  verifyPasswordResetOtp,
  getActiveSessions,
  revokeSession,
  revokeOtherSessions,
  setupTwoFactor,
  enableTwoFactor,
  disableTwoFactor,
} from "../services/authService.js";
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
  const toastTimeoutRef = useRef(null);
  const [activeTab, setActiveTab] = useState(
    defaultTab === "profile" || defaultTab === "developer" ? "security" : defaultTab
  );
  const [settings, setSettings] = useState(DEFAULT_USER_SETTINGS);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => () => clearTimeout(toastTimeoutRef.current), []);

  useEffect(() => {
    let active = true;
    getUserSettings()
      .then((saved) => {
        if (active) setSettings(saved);
      })
      .catch((err) => {
        if (active) showToast(err.message, "error");
      });
    return () => {
      active = false;
    };
  }, [user?.email]);

  // Helper toast notification
  function showToast(msg, type = "success") {
    clearTimeout(toastTimeoutRef.current);
    setToastMessage({ text: msg, type });
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 3500);
  }

  async function handleSaveSettings(newVals) {
    try {
      const updated = await updateUserSettings(newVals);
      setSettings(updated);
      showToast("Settings updated successfully!");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  }

  return (
    <div className="settings-suite">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className={`settings-toast settings-toast--${toastMessage.type}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
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
            Manage emailed password recovery, authenticator-based sign-in, active sessions, and saved alert preferences.
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
            <span>Password & Security</span>
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
                onTwoFactorChange={(enabled) => setSettings((current) => ({ ...current, twoFactorEnabled: enabled }))}
                showToast={showToast}
              />
            )}
            {activeTab === "sessions" && (
              <SessionsTab
                key="sessions"
                user={user}
                showToast={showToast}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationsTab
                key="notifications"
                settings={settings}
                onSave={handleSaveSettings}
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
      await requestOtp(email);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimerSeconds(60);
      setStep("verify_otp");
      showToast(`If an account exists for ${email}, a reset code has been emailed.`);
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

  async function handleConfirmOtp() {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) {
      setErrorMsg("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetOtp(email, fullOtp);
      setErrorMsg("");
      setStep("new_password");
    } catch (err) {
      setErrorMsg(err.message || "Invalid or expired email code.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
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
          <p>Reset your password with a one-time code sent to your account email.</p>
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
            If this account supports password sign-in, a secure 6-digit code will be sent to its email address:{" "}
            <strong>{email}</strong>.
          </p>

          <div className="security-step-card__action">
            <LiquidButton
              variant="cyan"
              size="md"
              onClick={handleSendOtp}
              disabled={loading || (user?.provider && user.provider !== "password")}
            >
              {loading ? "Sending email..." : "Send Verification OTP"}
            </LiquidButton>
          </div>
          {user?.provider && user.provider !== "password" && (
            <p>This account uses {user.provider} sign-in. Manage its password with that provider.</p>
          )}
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

          {/* One-time code is delivered only to the account email. */}
          <div className="otp-delivery-info glass-pill">
            <Sparkles size={14} color="#38bdf8" />
            <span>Check your inbox and enter the code sent to your email.</span>
          </div>

          {/* Split 6-Box OTP Inputs */}
          <div className="otp-boxes-wrap">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                maxLength={1}
                aria-label={`Verification code digit ${i + 1}`}
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
              <span>Request a new code in <strong>{timerSeconds}s</strong></span>
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
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Set New Password"}
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
            Your password has been updated and all active sessions were signed out. Use your new password the next time you sign in.
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
function PrivacyTab({ settings, onSave, onTwoFactorChange, showToast }) {
  const [twoFactor, setTwoFactor] = useState(settings.twoFactorEnabled);
  const [incognito, setIncognito] = useState(settings.incognitoVerification);
  const [telemetry, setTelemetry] = useState(settings.telemetrySharing);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [setupInfo, setSetupInfo] = useState(null);
  const [authCode, setAuthCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTwoFactor(settings.twoFactorEnabled);
    setIncognito(settings.incognitoVerification);
    setTelemetry(settings.telemetrySharing);
  }, [settings]);

  async function handleToggle2Fa() {
    if (!twoFactor) {
      setSaving(true);
      try {
        const info = await setupTwoFactor();
        setSetupInfo(info);
        setAuthCode("");
        setShowQrModal(true);
      } catch (err) {
        showToast(err.message, "error");
      } finally {
        setSaving(false);
      }
    } else {
      setAuthCode("");
      setShowDisableModal(true);
    }
  }

  async function handleConfirm2Fa() {
    setSaving(true);
    try {
      await enableTwoFactor(authCode);
      setTwoFactor(true);
      setShowQrModal(false);
      onTwoFactorChange(true);
      showToast("Two-factor authentication is enabled.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisable2Fa() {
    setSaving(true);
    try {
      await disableTwoFactor(authCode);
      setTwoFactor(false);
      setShowDisableModal(false);
      onTwoFactorChange(false);
      showToast("Two-factor authentication is disabled.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function savePreference(key, value, setter) {
    try {
      await onSave({ [key]: value });
      setter(value);
    } catch {
      // The parent displays the save error and the prior value remains selected.
    }
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
          <p>Set up an authenticator app and manage how verification activity and threat data are handled.</p>
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
              <p>Use a time-based code from Google Authenticator, Microsoft Authenticator, Authy, or another TOTP app when signing in.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={handleToggle2Fa}
                disabled={saving}
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
              <p>Keep company searches and checks out of your local history and omit your account token from those requests. Your network provider may still see your IP address.</p>
            </div>
          </div>
          <div className="toggle-card__switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={incognito}
                onChange={(e) => {
                  savePreference("incognitoVerification", e.target.checked, setIncognito);
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
                  savePreference("telemetrySharing", e.target.checked, setTelemetry);
                }}
              />
              <span className="slider round" />
            </label>
          </div>
        </div>
      </div>

      {/* Authenticator enrollment and disable confirmation */}
      <AnimatePresence>
        {(showQrModal || showDisableModal) && (
          <div className="settings-modal-overlay">
            <motion.div
              className="settings-modal glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {showQrModal ? (
                <>
                  <div className="modal-header">
                    <h3>Set Up Authenticator App</h3>
                    <p>Scan this QR code with Google Authenticator, Microsoft Authenticator, Authy, or any TOTP app.</p>
                  </div>
                  {setupInfo && (
                    <div className="authenticator-setup">
                      <img className="authenticator-qr" src={setupInfo.qrCodeDataUrl} alt="Authenticator setup QR code" />
                      <span className="secret-key-text">
                        Manual setup key: <strong>{setupInfo.secret}</strong>
                      </span>
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="authenticator-enrollment-code">6-digit authenticator code</label>
                    <div className="input-wrap">
                      <input
                        id="authenticator-enrollment-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-header">
                    <h3>Disable two-factor authentication?</h3>
                    <p>Confirm with the current authenticator code to turn off this account protection.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="authenticator-disable-code">6-digit authenticator code</label>
                    <div className="input-wrap">
                      <input
                        id="authenticator-disable-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <LiquidButton
                  variant="ghost"
                  size="md"
                  showArrow={false}
                  onClick={() => {
                    setShowQrModal(false);
                    setShowDisableModal(false);
                    setAuthCode("");
                  }}
                >
                  Cancel
                </LiquidButton>
                <LiquidButton
                  variant="cyan"
                  size="md"
                  onClick={showQrModal ? handleConfirm2Fa : handleDisable2Fa}
                  disabled={saving || authCode.length !== 6}
                >
                  {saving ? "Verifying..." : showQrModal ? "Verify & Enable 2FA" : "Verify & Disable 2FA"}
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
function SessionsTab({ user, showToast }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let active = true;
    getActiveSessions()
      .then((items) => {
        if (active) setSessions(items);
      })
      .catch((err) => {
        if (active) showToast(err.message, "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.email]);

  async function handleRevoke(id) {
    setWorking(true);
    try {
      await revokeSession(id);
      setSessions((current) => current.filter((session) => session.id !== id));
      showToast("Session access revoked.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setWorking(false);
    }
  }

  async function handleRevokeAllOther() {
    setWorking(true);
    try {
      const count = await revokeOtherSessions();
      setSessions((current) => current.filter((session) => session.current));
      showToast(`Signed out of ${count} other session${count === 1 ? "" : "s"}.`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setWorking(false);
    }
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
          <p>Devices that have an active sign-in to your account, based on their last authenticated activity.</p>
        </div>
        {sessions.length > 1 && (
          <LiquidButton
            variant="ghost"
            size="sm"
            showArrow={false}
            onClick={handleRevokeAllOther}
            disabled={working}
          >
            Log Out Other Devices
          </LiquidButton>
        )}
      </div>

      {loading ? (
        <p className="sessions-empty">Loading active sessions…</p>
      ) : sessions.length === 0 ? (
        <p className="sessions-empty">No active sessions found.</p>
      ) : <div className="sessions-list">
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
                  {/mobile|android|iphone|ipad/i.test(sess.device)
                    ? <Smartphone size={22} color={sess.current ? "#38bdf8" : "var(--text-secondary)"} />
                    : <Laptop size={22} color={sess.current ? "#38bdf8" : "var(--text-secondary)"} />}
                </div>
                <div>
                  <div className="session-card__title-row">
                    <strong>{describeDevice(sess.device)}</strong>
                    {sess.current && <span className="session-badge-current">This Device</span>}
                  </div>
                  <div className="session-card__meta">
                    <span>Last active {formatSessionTime(sess.lastActiveAt)}</span>
                    <span>•</span>
                    <span>Signed in {formatSessionTime(sess.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="session-card__right">
                {!sess.current && (
                  <button
                    type="button"
                    className="session-revoke-btn"
                    onClick={() => handleRevoke(sess.id)}
                    disabled={working}
                  >
                    Revoke Access
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>}
    </motion.div>
  );
}

function describeDevice(userAgent = "") {
  const browser = userAgent.match(/(Edg|Chrome|Firefox|Safari)\/[\d.]+/i)?.[0] || "Browser";
  const platform = userAgent.match(/(Windows NT|Mac OS X|Android|iPhone|iPad|Linux)[^;) ]*/i)?.[0] || "Unknown device";
  return `${platform} · ${browser}`;
}

function formatSessionTime(value) {
  if (!value) return "unknown";
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "unknown";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp.getTime()) / 60_000));
  if (elapsedMinutes < 1) return "just now";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;
  if (elapsedMinutes < 1440) return `${Math.floor(elapsedMinutes / 60)}h ago`;
  return `${Math.floor(elapsedMinutes / 1440)}d ago`;
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. NOTIFICATIONS & ALERTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function NotificationsTab({ settings, onSave }) {
  const [scamAlerts, setScamAlerts] = useState(settings.scamAlertsEmail);
  const [weeklyDigest, setWeeklyDigest] = useState(settings.weeklyThreatDigest);
  const [community, setCommunity] = useState(settings.communityAlerts);
  const [webhook, setWebhook] = useState(settings.discordWebhook || "");

  useEffect(() => {
    setScamAlerts(settings.scamAlertsEmail);
    setWeeklyDigest(settings.weeklyThreatDigest);
    setCommunity(settings.communityAlerts);
    setWebhook(settings.discordWebhook || "");
  }, [settings]);

  async function savePreference(key, value, setter) {
    try {
      await onSave({ [key]: value });
      setter(value);
    } catch {
      // The parent displays the save error and keeps the previous value.
    }
  }

  async function handleSaveWebhook(e) {
    e.preventDefault();
    try {
      await onSave({ discordWebhook: webhook.trim() });
    } catch {
      // The parent displays the save error.
    }
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
          <h3>Notifications & Campus Alerts</h3>
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
                  savePreference("scamAlertsEmail", e.target.checked, setScamAlerts);
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
                  savePreference("weeklyThreatDigest", e.target.checked, setWeeklyDigest);
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
                  savePreference("communityAlerts", e.target.checked, setCommunity);
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
          Save an HTTPS Discord or Slack webhook endpoint to your account's alert preferences.
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

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  CheckCircle2,
  GraduationCap,
  Building2,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Github,
  Linkedin,
  Copy,
  Check,
  Award,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LiquidButton from "./LiquidButton.jsx";
import "./DashboardProfile.css";

// ── Avatar Presets (Cyber Student Personas) ──
const AVATAR_PRESETS = [
  { id: "avatar-cyber-1", label: "Cyber Sentinel", icon: "🛡️", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)" },
  { id: "avatar-cyber-2", label: "Quantum Hacker", icon: "⚡", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.12)" },
  { id: "avatar-cyber-3", label: "AI Scout", icon: "🤖", color: "#22c55e", bg: "rgba(34, 197, 94, 0.12)" },
  { id: "avatar-cyber-4", label: "Data Guardian", icon: "🔮", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.12)" },
  { id: "avatar-cyber-5", label: "Space Cadet", icon: "🚀", color: "#eab308", bg: "rgba(234, 179, 8, 0.12)" },
];

export default function DashboardProfile({ onSaveProfile }) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "Atharva Wallapkar");
  const [email, setEmail] = useState(user?.email || "atharvawallapkar261@gmail.com");
  const [university, setUniversity] = useState(user?.university || "Indian Institute of Technology, Bombay");
  const [major, setMajor] = useState(user?.major || "Computer Science & Engineering");
  const [gradYear, setGradYear] = useState(user?.gradYear || "2027");
  const [targetRole, setTargetRole] = useState(user?.targetRole || "Full Stack & Cloud Security Intern");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [github, setGithub] = useState(user?.github || "https://github.com/atharva-w");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "https://linkedin.com/in/atharva-wallapkar");
  const [bio, setBio] = useState(
    user?.bio ||
      "Passionate undergraduate researcher interested in distributed systems, application security, and verified internships."
  );
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarId || "avatar-cyber-1");
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const studentId = user?.studentId || "IS-STU-884920";

  function showToast(msg, type = "success") {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  }

  function handleCopyStudentId() {
    navigator.clipboard.writeText(studentId);
    setCopiedId(true);
    showToast("Student ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Please enter your name.", "error");
      return;
    }
    setSaving(true);
    try {
      const updatedData = {
        name: name.trim(),
        email: email.trim(),
        university: university.trim(),
        major: major.trim(),
        gradYear,
        targetRole: targetRole.trim(),
        phone: phone.trim(),
        github: github.trim(),
        linkedin: linkedin.trim(),
        bio: bio.trim(),
        avatarId: selectedAvatar,
      };

      if (updateProfile) {
        await updateProfile(updatedData);
      }
      if (onSaveProfile) {
        onSaveProfile(updatedData);
      }
      showToast("Profile updated successfully!");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  const activePersona = AVATAR_PRESETS.find((a) => a.id === selectedAvatar) || AVATAR_PRESETS[0];

  return (
    <div className="profile-suite">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className={`profile-toast profile-toast--${toastMessage.type}`}
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

      {/* ── Profile Suite Header ── */}
      <div className="profile-suite__header">
        <div>
          <div className="dashboard__status-pill" style={{ marginBottom: 8 }}>
            <span className="dashboard__status-dot" />
            <span>Verified Student Dossier • Active Protection</span>
          </div>
          <h1 className="profile-suite__title">Student Profile</h1>
          <p className="profile-suite__sub">
            Manage your academic credentials, verified student badges, career goals, and security persona.
          </p>
        </div>
      </div>

      {/* ── Main Profile Grid ── */}
      <div className="profile-grid">
        {/* ── Left Column: Identity Overview & Badges ── */}
        <div className="profile-identity-col">
          {/* Identity Card */}
          <div className="glass-card profile-card">
            <div className="profile-card__avatar-section">
              <div className="profile-avatar-wrapper">
                <div
                  className="profile-avatar-circle"
                  style={{ background: activePersona.bg, borderColor: activePersona.color }}
                >
                  <span className="profile-avatar-emoji">{activePersona.icon}</span>
                </div>
                <span className="profile-avatar-badge">5v</span>
              </div>

              <div className="profile-info-wrap">
                <div className="profile-name-row">
                  <h2>{name || "Student Researcher"}</h2>
                  <span className="verified-pill" title="Verified College Student">
                    <CheckCircle2 size={13} color="#22c55e" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="profile-sub-email">{email}</p>
                <div className="profile-tag-bubble">
                  <GraduationCap size={14} color="#38bdf8" />
                  <span>{university}</span>
                </div>
                <div className="profile-tag-bubble" style={{ marginTop: 6 }}>
                  <Building2 size={14} color="#a855f7" />
                  <span>{major} • Class of {gradYear}</span>
                </div>
              </div>
            </div>

            {/* Student ID Capsule */}
            <div className="student-id-capsule">
              <div>
                <span className="student-id-label">InternShield Student ID</span>
                <strong className="student-id-val">{studentId}</strong>
              </div>
              <button
                type="button"
                className="copy-id-btn"
                onClick={handleCopyStudentId}
                title="Copy Student ID"
              >
                {copiedId ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Trust Meter */}
            <div className="profile-trust-meter">
              <div className="trust-meter-header">
                <span>Account Trust Score</span>
                <strong>98 / 100 • Tier 1</strong>
              </div>
              <div className="trust-meter-track">
                <div className="trust-meter-fill" style={{ width: "98%" }} />
              </div>
              <p className="trust-meter-note">
                ✓ Full MCA cross-check and authenticated college email verified.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <strong>27</strong>
                <span>Scans Run</span>
              </div>
              <div className="profile-stat-box">
                <strong style={{ color: "#22c55e" }}>19</strong>
                <span>Verified Safe</span>
              </div>
              <div className="profile-stat-box">
                <strong style={{ color: "#f43f5e" }}>6</strong>
                <span>Threats Caught</span>
              </div>
            </div>
          </div>

          {/* Verification Accreditations & Badges */}
          <div className="glass-card badges-card">
            <h3 className="badges-card__title">
              <Award size={18} color="#38bdf8" />
              <span>Accreditations & Badges</span>
            </h3>

            <div className="badges-list">
              <div className="badge-item">
                <div className="badge-icon-wrap" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
                  <ShieldCheck size={20} />
                </div>
                <div className="badge-details">
                  <strong>MCA Registered Student</strong>
                  <span>Cross-verified against official academic directory</span>
                </div>
                <span className="badge-active-dot" />
              </div>

              <div className="badge-item">
                <div className="badge-icon-wrap" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>
                  <GraduationCap size={20} />
                </div>
                <div className="badge-details">
                  <strong>Campus Cyber Sentinel</strong>
                  <span>Active threat analyst & early warning reporter</span>
                </div>
                <span className="badge-active-dot" />
              </div>

              <div className="badge-item">
                <div className="badge-icon-wrap" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>
                  <Zap size={20} />
                </div>
                <div className="badge-details">
                  <strong>Top 1% Reviewer</strong>
                  <span>Helped 400+ peers identify fraudulent job offers</span>
                </div>
                <span className="badge-active-dot" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Edit Profile Details & Persona ── */}
        <div className="profile-edit-col">
          <div className="glass-card profile-form-card">
            <div className="form-card-header">
              <h3>Edit Academic Profile</h3>
              <p>Update your public credentials, academic institution, and cybersecurity persona.</p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              {/* Persona Picker */}
              <div className="form-group">
                <label className="form-label">
                  <Sparkles size={16} color="#38bdf8" />
                  <span>Cyber Security Persona</span>
                </label>
                <div className="persona-grid">
                  {AVATAR_PRESETS.map((av) => {
                    const isSelected = selectedAvatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        className={`persona-btn ${isSelected ? "persona-btn--active" : ""}`}
                        style={{ "--persona-color": av.color, "--persona-bg": av.bg }}
                        onClick={() => setSelectedAvatar(av.id)}
                      >
                        <span className="persona-emoji">{av.icon}</span>
                        <span className="persona-name">{av.label}</span>
                        {isSelected && <CheckCircle2 size={15} className="persona-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legal Name & Email */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label>Full Legal Name</label>
                  <div className="field-input-wrap">
                    <User size={16} className="field-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Atharva Wallapkar"
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Registered Student Email</label>
                  <div className="field-input-wrap field-input-wrap--disabled">
                    <Mail size={16} className="field-icon" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      title="Email is locked to your authenticated student record"
                    />
                    <span className="verified-badge-tag">Locked</span>
                  </div>
                </div>
              </div>

              {/* University & Degree */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label>University / College</label>
                  <div className="field-input-wrap">
                    <Building2 size={16} className="field-icon" />
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Indian Institute of Technology, Bombay"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Major / Degree Specialization</label>
                  <div className="field-input-wrap">
                    <GraduationCap size={16} className="field-icon" />
                    <input
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                    />
                  </div>
                </div>
              </div>

              {/* Graduation Year & Target Role */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label>Expected Graduation Year</label>
                  <div className="field-input-wrap">
                    <Calendar size={16} className="field-icon" />
                    <select
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="field-select"
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Target Internship Role</label>
                  <div className="field-input-wrap">
                    <Briefcase size={16} className="field-icon" />
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Full Stack & Cloud Security Intern"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Social Links */}
              <div className="form-row-2col">
                <div className="form-field">
                  <label>Contact Phone (Optional)</label>
                  <div className="field-input-wrap">
                    <Phone size={16} className="field-icon" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>GitHub Profile</label>
                  <div className="field-input-wrap">
                    <Github size={16} className="field-icon" />
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="form-field">
                <label>LinkedIn Profile</label>
                <div className="field-input-wrap">
                  <Linkedin size={16} className="field-icon" />
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Student Bio */}
              <div className="form-field">
                <label>Student Researcher Bio</label>
                <textarea
                  className="field-textarea"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief description about your career focus, technical research, and internship goals..."
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions-bar">
                <LiquidButton
                  type="submit"
                  variant="cyan"
                  size="md"
                  disabled={saving}
                >
                  {saving ? "Saving Changes..." : "Save Profile Changes"}
                </LiquidButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

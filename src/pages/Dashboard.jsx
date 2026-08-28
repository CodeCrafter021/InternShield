import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  FileText,
  AlertTriangle,
  TrendingUp,
  UploadCloud,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Zap,
  Activity,
  ArrowUpRight,
  Filter,
  Menu,
  Download,
  KeyRound,
  Copy,
  Check,
  ShieldAlert,
  Building2,
  Clock,
  HelpCircle,
  Send,
  Lock,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import { ActivityChart, ThreatDonutChart, TrustScoreGauge } from "../components/DashboardCharts.jsx";
import DashboardProfile from "../components/DashboardProfile.jsx";
import DashboardSettings from "../components/DashboardSettings.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  searchCompanies,
  getDashboardData,
  submitThreatReport,
  analyzeOfferDocument,
} from "../services/verificationService.js";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active View State matching the sidebar item IDs
  const [activeView, setActiveView] = useState(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get("view") || params.get("tab");
    if (viewParam) return viewParam;
    return "dashboard";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search & Scanner state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [scannerSimulating, setScannerSimulating] = useState(false);
  const [scannerResult, setScannerResult] = useState(null);

  // Live Dynamic Real Data State
  const [metrics, setMetrics] = useState([]);
  const [velocityData, setVelocityData] = useState([]);
  const [threatCategories, setThreatCategories] = useState([]);
  const [recentChecks, setRecentChecks] = useState([]);
  const [communityAlerts, setCommunityAlerts] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Community report modal state
  const [reportCompany, setReportCompany] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  async function loadDashboardData() {
    try {
      const data = await getDashboardData();
      setMetrics(data.metrics || []);
      setVelocityData(data.velocityData || []);
      setThreatCategories(data.threatCategories || []);
      setRecentChecks(data.recentChecks || []);
      setCommunityAlerts(data.communityAlerts || []);
    } catch (err) {
      console.error("Failed to load real dashboard data:", err);
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  function handleSaveProfile(updated) {
    if (updateProfile) {
      updateProfile(updated);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewParam = params.get("view") || params.get("tab");
    if (viewParam) {
      setActiveView(viewParam);
    }
  }, [location.search]);

  async function runSearch(term) {
    if (!term.trim()) return;
    setSearching(true);
    setSearchError("");
    try {
      const found = await searchCompanies(term);
      setResults(found);
    } catch (err) {
      setSearchError(err.message || "Search failed. Please try again.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    runSearch(query);
  }

  function handleSuggestedClick(name) {
    setQuery(name);
    runSearch(name);
  }

  async function handleSimulateScan(file) {
    setScannerSimulating(true);
    setScannerResult(null);
    try {
      const res = await analyzeOfferDocument(file || "Placement_Offer_Letter.pdf");
      setScannerResult(res);
      await loadDashboardData();
    } catch (err) {
      console.error("Scan analysis failed:", err);
    } finally {
      setScannerSimulating(false);
    }
  }

  async function handleReportSubmit(e) {
    e.preventDefault();
    if (!reportCompany.trim() || !reportReason.trim()) return;
    setReportSubmitted(true);
    try {
      await submitThreatReport({
        companyName: reportCompany.trim(),
        reason: reportReason.trim(),
        reporterName: `Verified Student (${user?.university ? user.university.split(",")[0] : "IIT Bombay"})`,
      });
      await loadDashboardData();
      setTimeout(() => {
        setReportCompany("");
        setReportReason("");
        setReportSubmitted(false);
      }, 2500);
    } catch (err) {
      console.error("Report submit failed:", err);
      setReportSubmitted(false);
    }
  }

  const filteredRecent = recentChecks.filter((item) => {
    if (activeTab === "safe") return item.risk === "LOW" || item.score >= 70;
    if (activeTab === "threats") return item.risk === "HIGH" || item.risk === "MEDIUM" || item.score < 70;
    return true;
  });

  return (
    <div className="dashboard-portal-wrapper">
      <AnimatedBackground />

      {/* ── Left Sidebar (Matching Reference Screenshot) ── */}
      <DashboardSidebar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.history.replaceState(null, "", `/dashboard?view=${v}`);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main Portal Workspace ── */}
      <div className="dashboard-portal-main">
        {/* Mobile Portal Topbar */}
        <div className="dashboard-mobile-topbar">
          <button
            type="button"
            className="mobile-burger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>
          <div className="mobile-topbar-brand">
            <ShieldCheck size={18} color="#38bdf8" />
            <span>InternShield</span>
          </div>
        </div>

        <main className="dashboard-portal-content">
          <AnimatePresence mode="wait">
            {/* ═════════════════════════════════════════════════════════
                1. OVERVIEW DASHBOARD VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "dashboard" && (
              <motion.div
                key="view-dashboard"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="portal-view"
              >
                {/* Header Welcome */}
                <div className="dashboard__header">
                  <div>
                    <div className="dashboard__status-pill glass-pill">
                      <span className="dashboard__status-dot" />
                      <span>InternShield AI Engine v2.6 • Active Protection</span>
                    </div>
                    <h1 className="dashboard__welcome">
                      Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
                    </h1>
                    <p className="dashboard__sub">
                      Your real-time student security center. Verify companies, scan offers, and track threat intelligence.
                    </p>
                  </div>

                  <div className="dashboard__quick-actions">
                    <LiquidButton
                      variant="cyan"
                      size="md"
                      icon={UploadCloud}
                      onClick={() => setActiveView("scanner")}
                    >
                      Scan Offer Letter
                    </LiquidButton>
                  </div>
                </div>

                {/* ── Apple iOS 27 Liquid Quick Search Capsule ── */}
                <div className="dashboard__search-wrap">
                  <motion.form
                    onSubmit={handleSearch}
                    className="dashboard__search"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  >
                    <Search size={20} color="var(--color-accent)" className="dashboard__search-icon" />
                    <input
                      placeholder="Search any company name or paste domain (e.g. Nimbus Cloud, Google, TCS)..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <LiquidButton
                      type="submit"
                      variant="solid"
                      size="sm"
                      showArrow={false}
                      disabled={searching}
                    >
                      {searching ? "Verifying..." : "Verify Company"}
                    </LiquidButton>
                  </motion.form>

                  {/* Quick Suggestions Pills */}
                  <div className="dashboard__quick-tags">
                    <span className="quick-tags-label">Quick Checks:</span>
                    {[
                      { name: "Nimbus Cloud", risk: "safe" },
                      { name: "QuickHire Global", risk: "threat" },
                      { name: "Solstice Analytics", risk: "safe" },
                      { name: "Apex Cyber", risk: "medium" },
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        className="quick-tag-btn"
                        onClick={() => handleSuggestedClick(item.name)}
                      >
                        {item.risk === "safe" ? "✨" : item.risk === "threat" ? "⚠️" : "🛡️"} {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {searchError && (
                  <div className="form-error" style={{ marginBottom: 16 }}>{searchError}</div>
                )}

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      className="dashboard__results"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                    >
                      <div className="dashboard__results-header">
                        <span>Matching Verified Records ({results.length})</span>
                      </div>
                      {results.map((c) => {
                        const riskLevel = c.risk || (c.reports > 3 ? "HIGH" : c.reports > 1 ? "MEDIUM" : "LOW");
                        return (
                          <button
                            key={c.id}
                            className="dashboard__result-row"
                            onClick={() => navigate(`/verify/${c.id}`)}
                          >
                            <div className="result-row__info">
                              <span className="result-row__name">{c.name}</span>
                              <span className="result-row__domain">{c.domain}</span>
                            </div>
                            <div className="result-row__action">
                              <span className={`risk-badge risk-badge--${riskLevel.toLowerCase()}`}>
                                {riskLevel} RISK
                              </span>
                              <ArrowUpRight size={16} />
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Metrics Grid */}
                <div className="dashboard__metrics">
                  {metrics.map((m) => {
                    const IconComponent =
                      m.label.includes("Total")
                        ? ShieldCheck
                        : m.label.includes("Safe")
                        ? TrendingUp
                        : m.label.includes("Reviews")
                        ? FileText
                        : AlertTriangle;
                    return (
                      <div
                        key={m.label}
                        className="metric-card"
                        style={{ "--metric-glow": m.bgGlow }}
                      >
                        <div className="metric-card__icon" style={{ color: m.color }}>
                          <IconComponent size={22} color={m.color} />
                        </div>
                        <div className="metric-card__body">
                          <div className="metric-card__value">
                            <AnimatedCounter target={m.value} />
                          </div>
                          <span className="metric-card__label">{m.label}</span>
                          <span className="metric-card__change">{m.change}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Velocity Chart + Threat Breakdown Grid */}
                <div className="dashboard__charts-grid">
                  <div className="chart-card">
                    <ActivityChart data={velocityData} />
                  </div>
                  <div className="chart-card">
                    <ThreatDonutChart categories={threatCategories} />
                  </div>
                </div>

                {/* Secondary Grid (Scanner + Community Alerts) */}
                <div className="dashboard__secondary-grid">
                  {/* Left: Instant AI Offer Scanner Widget */}
                  <div className="scanner-widget">
                    <div className="scanner-widget__header">
                      <div className="scanner-widget__title-wrap">
                        <div className="scanner-widget__title-icon">
                          <UploadCloud size={22} color="#38bdf8" />
                        </div>
                        <div>
                          <h3>AI Offer Letter Scanner</h3>
                          <p>Upload PDF/DOCX offer letter to scan for upfront fee & lookalike phishing indicators.</p>
                        </div>
                      </div>
                      <LiquidButton
                        variant="cyan"
                        size="sm"
                        showArrow={false}
                        disabled={scannerSimulating}
                        onClick={() => handleSimulateScan()}
                      >
                        {scannerSimulating ? "Analyzing Heuristics..." : "Run Test Scan"}
                      </LiquidButton>
                    </div>

                    <div className="scanner-widget__dropzone" onClick={() => handleSimulateScan()}>
                      <div className="scanner-widget__drop-icon">
                        <UploadCloud size={26} color="#38bdf8" />
                      </div>
                      <div className="scanner-widget__drop-text">
                        <strong>Drag and drop offer letter here</strong>
                        <span>Supports PDF, DOCX, PNG (Max 15MB) • Instant Neural MCA Cross-Check</span>
                      </div>
                    </div>

                    {scannerResult && (
                      <motion.div
                        className="scanner-widget__results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="scanner-result-header">
                          <CheckCircle2 size={20} color={scannerResult.score >= 70 ? "#22c55e" : "#f43f5e"} />
                          <span>Offer Authenticity Score: {scannerResult.score}/100</span>
                          <span
                            className={`risk-badge risk-badge--${scannerResult.score >= 70 ? "low" : "high"}`}
                            style={{ marginLeft: "auto" }}
                          >
                            {scannerResult.score >= 70 ? "Verified Safe" : "High Threat Flagged"}
                          </span>
                        </div>
                        <div className="scanner-signals-list">
                          {scannerResult.signals.map((sig, idx) => (
                            <div key={idx} className="scanner-signal-row">
                              {sig.pass ? (
                                <CheckCircle2 size={14} color="#22c55e" />
                              ) : (
                                <AlertTriangle size={14} color="#f43f5e" />
                              )}
                              <span>{sig.name}</span>
                              <span className="signal-desc">{sig.desc}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right: Community Alerts */}
                  <div className="glass-card alerts-widget">
                    <div className="alerts-widget__header">
                      <div className="alerts-widget__title-wrap">
                        <AlertTriangle size={22} color="#f43f5e" />
                        <div>
                          <h3>Live Threat Radar</h3>
                          <p>Community reported fraudulent schemes</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="view-all-link"
                        onClick={() => setActiveView("threats")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="alerts-widget__list">
                      {communityAlerts.map((alt) => (
                        <div key={alt.id} className="alert-item">
                          <div className="alert-item__header">
                            <span className="alert-severity alert-severity--high">
                              {alt.severity}
                            </span>
                            <span className="alert-time">{alt.time}</span>
                          </div>
                          <strong className="alert-title">{alt.title}</strong>
                          <p className="alert-detail">{alt.detail}</p>
                          <span className="alert-reporter">Reported by: {alt.reporter}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Checks Table */}
                <motion.div
                  className="glass-card recent-checks"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <div className="recent-checks__header">
                    <div>
                      <h2>Recent Verified Companies</h2>
                      <p>Full cryptographic evidence audit records</p>
                    </div>
                    <div className="recent-checks__filters">
                      {["all", "safe", "threats"].map((t) => (
                        <button
                          key={t}
                          className={`filter-tab ${activeTab === t ? "filter-tab--active" : ""}`}
                          onClick={() => setActiveTab(t)}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="recent-checks__table-wrap">
                    <table className="recent-checks__table">
                      <thead>
                        <tr>
                          <th>Company / Org</th>
                          <th>Domain Check</th>
                          <th>Trust Score</th>
                          <th>Security Result</th>
                          <th>Audited On</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecent.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "32px" }}>
                              <p style={{ color: "var(--text-secondary)" }}>No verification checks match the selected filter.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredRecent.map((c) => (
                            <tr key={c.id}>
                              <td>
                                <div className="table-org">
                                  <strong>{c.name}</strong>
                                  <span>{c.category}</span>
                                </div>
                              </td>
                              <td>
                                <code className="table-domain">{c.domain}</code>
                              </td>
                              <td>
                                <div className="table-score">
                                  <div
                                    className="table-score-bar"
                                    style={{
                                      width: `${c.score}%`,
                                      backgroundColor:
                                        c.score > 80 ? "#22c55e" : c.score > 50 ? "#eab308" : "#f43f5e",
                                    }}
                                  />
                                  <span>{c.score}/100</span>
                                </div>
                              </td>
                              <td>
                                <span className={`risk-badge risk-badge--${(c.risk || "low").toLowerCase()}`}>
                                  {c.risk === "LOW" ? "Verified Safe" : c.risk === "MEDIUM" ? "Moderate Risk" : "High Threat"}
                                </span>
                              </td>
                              <td>
                                <span className="table-date">{c.date}</span>
                              </td>
                              <td>
                                <LiquidButton
                                  variant="ghost"
                                  size="sm"
                                  showArrow={false}
                                  onClick={() => navigate(`/verify/${c.id}`)}
                                >
                                  View Dossier
                                </LiquidButton>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                2. CAMPAIGNS & COMPANY CHECKS VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "companies" && (
              <motion.div
                key="view-companies"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <Building2 size={14} color="#38bdf8" />
                    <span>Company Verification Registry</span>
                  </div>
                  <h2>Search & Verify Employers</h2>
                  <p>Check corporate domain registration, authorized hiring signatories, and MCA record checks.</p>
                </div>

                <div className="dashboard__suggested-grid" style={{ marginTop: 24 }}>
                  {recentChecks.map((c) => (
                    <button
                      key={c.id}
                      className="glass-card dashboard__suggested-item"
                      onClick={() => navigate(`/verify/${c.id}`)}
                    >
                      <div className="suggested-item__icon">
                        <ShieldCheck size={18} color="var(--color-accent)" />
                      </div>
                      <div>
                        <strong>{c.name}</strong>
                        <span>{c.domain}</span>
                      </div>
                      <ArrowUpRight size={16} className="suggested-item__arrow" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                3. BRAND INTERACTION & THREAT RADAR VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "threats" && (
              <motion.div
                key="view-threats"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <ShieldAlert size={14} color="#f43f5e" />
                    <span>Student Threat Intelligence Radar</span>
                  </div>
                  <h2>Community Scam Reports & Fake HR Schemes</h2>
                  <p>Real-time warning feed submitted and verified by students across top engineering campuses.</p>
                </div>

                {/* Report Submission Box */}
                <div className="glass-card" style={{ padding: 24, margin: "24px 0" }}>
                  <h3 style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertTriangle size={18} color="#f43f5e" />
                    <span>Report a Suspicious Company or Recruiter</span>
                  </h3>
                  <form onSubmit={handleReportSubmit} className="settings-form">
                    <div className="form-grid form-grid--2col">
                      <div className="form-group">
                        <label>Company / Recruiter Name</label>
                        <div className="input-wrap">
                          <input
                            type="text"
                            placeholder="e.g. QuickHire HR / Telegram Contact"
                            value={reportCompany}
                            onChange={(e) => setReportCompany(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Suspicious Activity Details</label>
                        <div className="input-wrap">
                          <input
                            type="text"
                            placeholder="e.g. Demanded ₹3,000 for training materials via UPI"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <LiquidButton variant="cyan" size="sm" type="submit">
                        {reportSubmitted ? "Report Submitted to Review Queue!" : "Submit Community Report"}
                      </LiquidButton>
                    </div>
                  </form>
                </div>

                <div className="threats-list-grid">
                  {communityAlerts.map((alt) => (
                    <div key={alt.id} className="glass-card alert-item" style={{ padding: 20 }}>
                      <div className="alert-item__header">
                        <span className="alert-severity alert-severity--high">{alt.severity}</span>
                        <span className="alert-time">{alt.time}</span>
                      </div>
                      <strong className="alert-title" style={{ fontSize: "1.05rem" }}>{alt.title}</strong>
                      <p className="alert-detail" style={{ margin: "10px 0" }}>{alt.detail}</p>
                      <span className="alert-reporter">Verified Reporter: {alt.reporter}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                2. TRANSACTIONS & AUDIT RECORDS VIEW
               ═════════════════════════════════════════════════════════ */}
            {(activeView === "transactions" || activeView === "history") && (
              <motion.div
                key="view-transactions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <Clock size={14} color="#38bdf8" />
                    <span>Audit Trail & Activity Log</span>
                  </div>
                  <h2>Transactions & Verification History</h2>
                  <p>Cryptographic audit records of all company verifications and offer scans completed by your account.</p>
                </div>

                <div className="glass-card recent-checks" style={{ marginTop: 24 }}>
                  <div className="recent-checks__table-wrap">
                    <table className="recent-checks__table">
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Domain</th>
                          <th>Safety Score</th>
                          <th>Status</th>
                          <th>Timestamp</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecent.map((c) => (
                          <tr key={c.id}>
                            <td><strong>{c.name}</strong></td>
                            <td><code className="table-domain">{c.domain}</code></td>
                            <td><strong>{c.score}/100</strong></td>
                            <td>
                              <span className={`risk-badge risk-badge--${(c.risk || "low").toLowerCase()}`}>
                                {c.risk}
                              </span>
                            </td>
                            <td>{c.date}</td>
                            <td>
                              <LiquidButton
                                variant="ghost"
                                size="sm"
                                showArrow={false}
                                onClick={() => navigate(`/verify/${c.id}`)}
                              >
                                View Dossier
                              </LiquidButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                5. GROWTH TOOLS & AI OFFER SCANNER VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "scanner" && (
              <motion.div
                key="view-scanner"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <Zap size={14} color="#8b5cf6" />
                    <span>Heuristic AI Analyzer</span>
                  </div>
                  <h2>Offer Letter Red-Flag Scanner</h2>
                  <p>Deep neural analysis for advance fee demands, lookalike email domains, and spoofed signatures.</p>
                </div>

                <div className="glass-card scanner-widget" style={{ marginTop: 24, padding: 32 }}>
                  <div className="scanner-widget__dropzone" onClick={() => handleSimulateScan()} style={{ padding: 48 }}>
                    <UploadCloud size={52} color="#38bdf8" />
                    <div className="scanner-widget__drop-text">
                      <strong style={{ fontSize: "1.1rem" }}>Upload Internship Offer Letter (PDF / DOCX)</strong>
                      <span>We extract signatory metadata and cross-check corporate registries</span>
                    </div>
                    <LiquidButton
                      variant="cyan"
                      size="md"
                      showArrow={false}
                      disabled={scannerSimulating}
                      onClick={() => handleSimulateScan()}
                    >
                      {scannerSimulating ? "Running AI Heuristics..." : "Select Document"}
                    </LiquidButton>
                  </div>

                  {scannerResult && (
                    <motion.div
                      className="scanner-widget__results glass-card"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ marginTop: 24 }}
                    >
                      <div className="scanner-result-header">
                        <CheckCircle2 size={20} color={scannerResult.score >= 70 ? "#22c55e" : "#f43f5e"} />
                        <strong>Authenticity Index: {scannerResult.score}/100 — {scannerResult.score >= 70 ? "Verified Genuine" : "Flagged Suspicious"}</strong>
                      </div>
                      <div className="scanner-signals-list" style={{ marginTop: 12 }}>
                        {scannerResult.signals.map((sig, idx) => (
                          <div key={idx} className="scanner-signal-row">
                            {sig.pass ? (
                              <CheckCircle2 size={16} color="#22c55e" />
                            ) : (
                              <AlertTriangle size={16} color="#f43f5e" />
                            )}
                            <strong>{sig.name}:</strong>
                            <span className="signal-desc">{sig.desc}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                6. CONTRACTS & SAVED DOSSIERS VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "dossiers" && (
              <motion.div
                key="view-dossiers"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <FileText size={14} color="#38bdf8" />
                    <span>Saved Contracts Vault</span>
                  </div>
                  <h2>Saved Verification Dossiers</h2>
                  <p>Access your bookmarked safety certificates and verified company documents.</p>
                </div>

                <div className="dashboard__suggested-grid" style={{ marginTop: 24 }}>
                  {recentChecks.slice(0, 3).map((c) => (
                    <div key={c.id} className="glass-card dashboard__suggested-item" style={{ cursor: "default" }}>
                      <div className="suggested-item__icon">
                        <ShieldCheck size={20} color="#22c55e" />
                      </div>
                      <div>
                        <strong>{c.name}</strong>
                        <span>Safety Certificate #IS-{c.id.toUpperCase()}-2026</span>
                      </div>
                      <LiquidButton
                        variant="ghost"
                        size="sm"
                        showArrow={false}
                        onClick={() => navigate(`/verify/${c.id}`)}
                      >
                        Open Dossier
                      </LiquidButton>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                7. PLANS & STUDENT PASS VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "plans" && (
              <motion.div
                key="view-plans"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <Sparkles size={14} color="#38bdf8" />
                    <span>Student Protection Tier</span>
                  </div>
                  <h2>Student Pass & Developer Quota</h2>
                  <p>100% Free for verified college students, supported by campus placement safety grants.</p>
                </div>

                <div className="glass-card" style={{ padding: 28, marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                      <span className="badge-tag" style={{ marginLeft: 0, marginBottom: 8, display: "inline-block" }}>Active Student Pass</span>
                      <h3 style={{ fontSize: "1.4rem", color: "#ffffff" }}>InternShield Pro Student Edition</h3>
                      <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Unlimited company verification checks & AI offer scans</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "2rem", fontWeight: 800, color: "#38bdf8" }}>₹0</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}> / Lifetime</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                8. HELP / SUPPORT VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "help" && (
              <motion.div
                key="view-help"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <HelpCircle size={14} color="#38bdf8" />
                    <span>Student Safety Handbook</span>
                  </div>
                  <h2>Help, Support & Fraud Guidelines</h2>
                  <p>Best practices to avoid fraudulent internship schemes before you sign or pay.</p>
                </div>

                <div className="toggle-cards-list" style={{ marginTop: 24 }}>
                  <div className="toggle-card glass-card">
                    <div className="toggle-card__info">
                      <div className="toggle-card__icon-wrap">
                        <AlertTriangle size={22} color="#f43f5e" />
                      </div>
                      <div>
                        <h4>Rule #1: Legitimate Companies Never Ask For Money</h4>
                        <p>No verified tech employer will ever demand laptop courier fees, training deposits, or document processing charges.</p>
                      </div>
                    </div>
                  </div>

                  <div className="toggle-card glass-card">
                    <div className="toggle-card__info">
                      <div className="toggle-card__icon-wrap">
                        <CheckCircle2 size={22} color="#22c55e" />
                      </div>
                      <div>
                        <h4>Rule #2: Verify Official Corporate Domains</h4>
                        <p>Official communication must come from corporate domains (e.g. `@google.com`, `@tcs.com`), never generic Gmail or Telegram IDs.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                9. PROFILE VIEW (Dedicated Student Identity & Badges)
               ═════════════════════════════════════════════════════════ */}
            {activeView === "profile" && (
              <motion.div
                key="view-profile"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <DashboardProfile
                  onSaveProfile={handleSaveProfile}
                />
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                10. SETTINGS VIEW (Dedicated Security & Credentials)
               ═════════════════════════════════════════════════════════ */}
            {activeView === "settings" && (
              <motion.div
                key="view-settings"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <DashboardSettings
                  defaultTab="security"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

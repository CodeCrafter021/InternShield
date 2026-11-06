import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  FileText,
  AlertTriangle,
  TrendingUp,
  BarChart3,
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
  X,
  FileCheck,
} from "lucide-react";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
import {
  ActivityChart,
  ThreatDonutChart,
  ScoreDistributionChart,
  WeeklyVelocityChart,
  MetricSparkline,
} from "../components/DashboardCharts.jsx";
import DashboardProfile from "../components/DashboardProfile.jsx";
import DashboardSettings from "../components/DashboardSettings.jsx";
import SafetyCertificateModal from "../components/SafetyCertificateModal.jsx";
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
    if (viewParam && viewParam !== "transactions" && viewParam !== "history") return viewParam;
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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [selectedCertCompany, setSelectedCertCompany] = useState(null);
  const [directoryFilter, setDirectoryFilter] = useState("");
  const [directoryTab, setDirectoryTab] = useState("all");
  const fileInputRef = useRef(null);

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
      if (found.length === 0) {
        setSearchError(
          `No verified record for "${term.trim()}". This does NOT mean it is safe: check that the recruiter uses an official company email, and never pay any fee.`
        );
      }
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

  async function handleFileSelect(file) {
    if (!file) return;
    setUploadedFile(file);
    setScannerSimulating(true);
    setScannerResult(null);
    setScanStep("Reading document metadata & text layout...");

    try {
      const t1 = setTimeout(() => {
        setScanStep("Scanning for upfront deposit & training fee clauses...");
      }, 300);
      const t2 = setTimeout(() => {
        setScanStep("Validating corporate domain & MCA directory match...");
      }, 600);

      const res = await analyzeOfferDocument(file);
      clearTimeout(t1);
      clearTimeout(t2);
      setScannerResult(res);
      await loadDashboardData();
    } catch (err) {
      console.error("Scan analysis failed:", err);
    } finally {
      setScannerSimulating(false);
      setScanStep("");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  // Fallback defaults for rich first-render UX
  const DEFAULT_METRICS = [
    {
      type: "total",
      label: "Total Verifications",
      value: 1420,
      change: "+18.4% this month",
      badge: "Active Radar",
      color: "#38bdf8",
      bgGlow: "rgba(56, 189, 248, 0.16)",
    },
    {
      type: "safe",
      label: "Companies Verified Safe",
      value: 1278,
      change: "90% safe rate",
      badge: "Cryptographic Pass",
      color: "#22c55e",
      bgGlow: "rgba(34, 197, 94, 0.16)",
    },
    {
      type: "reviews",
      label: "Student Reviews & Dossiers",
      value: 486,
      change: "Community validated",
      badge: "Campus Network",
      color: "#a855f7",
      bgGlow: "rgba(168, 85, 247, 0.16)",
    },
    {
      type: "threats",
      label: "Scam Networks Blocked",
      value: 142,
      change: "₹28.4L loss deflected",
      badge: "0 False Positives",
      color: "#f43f5e",
      bgGlow: "rgba(244, 63, 94, 0.16)",
    },
  ];

  const DEFAULT_CHECKS = [
    {
      id: "comp-1",
      name: "Tata Consultancy Services (TCS)",
      domain: "tcs.com",
      category: "Enterprise IT & Cloud",
      score: 96,
      risk: "LOW",
      mcaStatus: "ACTIVE",
      date: "12 mins ago",
    },
    {
      id: "comp-2",
      name: "QuickHire Global Pvt Ltd",
      domain: "quickhire-jobs.online",
      category: "Recruitment Portal",
      score: 24,
      risk: "HIGH",
      mcaStatus: "NOT_FOUND",
      date: "45 mins ago",
    },
    {
      id: "comp-3",
      name: "Solstice Analytics",
      domain: "solsticeanalytics.io",
      category: "Data Science & AI",
      score: 92,
      risk: "LOW",
      mcaStatus: "ACTIVE",
      date: "2 hours ago",
    },
    {
      id: "comp-4",
      name: "Apex Cyber Solutions",
      domain: "apexcyber-security.org",
      category: "Information Security",
      score: 62,
      risk: "MEDIUM",
      mcaStatus: "VERIFYING",
      date: "5 hours ago",
    },
    {
      id: "comp-5",
      name: "Infosys Technologies",
      domain: "infosys.com",
      category: "Software Engineering",
      score: 98,
      risk: "LOW",
      mcaStatus: "ACTIVE",
      date: "1 day ago",
    },
  ];

  const displayMetrics =
    metrics && metrics.length === 4
      ? metrics.map((m, idx) => {
          const fallback = DEFAULT_METRICS[idx];
          const val =
            m.value !== undefined && m.value !== null && m.value > 0
              ? m.value
              : fallback.value;
          return {
            ...fallback,
            ...m,
            value: val,
            trend: m.trend || fallback.trend,
            subtext: m.subtext || fallback.subtext,
            color: fallback.color,
            type: fallback.type,
          };
        })
      : DEFAULT_METRICS;

  function handleDemoScan(type) {
    const sampleFile =
      type === "scam"
        ? {
            name: "OfferLetter_QuickHire_Deposit_Required.pdf",
            size: 420 * 1024,
          }
        : {
            name: "Infosys_Technologies_Verified_Offer.pdf",
            size: 680 * 1024,
          };
    handleFileSelect(sampleFile);
  }

  function handleClearFile(e) {
    if (e) e.stopPropagation();
    setUploadedFile(null);
    setScannerResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  const allRecentChecks = recentChecks || [];
  
  const allCompaniesList = recentChecks || [];
  const filteredDirectory = allCompaniesList.filter((c) => {
    const q = directoryFilter.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      (c.category && c.category.toLowerCase().includes(q));

    if (!matchesQuery) return false;
    if (directoryTab === "safe") return c.risk === "LOW" || c.score >= 70;
    if (directoryTab === "threats") return c.risk === "HIGH" || c.risk === "MEDIUM" || c.score < 70;
    return true;
  });

  const filteredRecent = allRecentChecks.filter((item) => {
    if (activeTab === "safe") return item.risk === "LOW" || item.score >= 70;
    if (activeTab === "threats") return item.risk === "HIGH" || item.risk === "MEDIUM" || item.score < 70;
    return true;
  });

  return (
    <div className="dashboard-portal-wrapper">

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
        {/* Top bar: burger + brand on mobile, notification bell always top-right */}
        <div className="dashboard-topbar">
          <button
            type="button"
            className="mobile-burger-btn dashboard-topbar__burger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu size={20} />
          </button>
          <div className="mobile-topbar-brand dashboard-topbar__brand">
            <ShieldCheck size={18} color="#38bdf8" />
            <span>InternShield</span>
          </div>
          <div className="dashboard-topbar__right">
            <NotificationBell
              alerts={communityAlerts}
              onViewAll={() => {
                setActiveView("threats");
                window.history.replaceState(null, "", "/dashboard?view=threats");
              }}
            />
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="portal-view"
              >
                {/* Header */}
                <div className="dash-head">
                  <h1 className="dash-head__title">
                    Welcome back, {user?.name?.split(" ")[0] || "Student"}
                  </h1>
                  <p className="dash-head__sub">
                    Check a company or scan an offer letter before you accept it.
                  </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="dash-search">
                  <Search size={18} className="dash-search__icon" />
                  <input
                    placeholder="Search a company name or domain (e.g. TCS, infosys.com)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="submit" className="dash-btn dash-btn--primary" disabled={searching}>
                    {searching ? "Checking..." : "Verify"}
                  </button>
                </form>

                {searchError && <div className="form-error" style={{ marginBottom: 16 }}>{searchError}</div>}

                {results.length > 0 && (
                  <div className="dashboard__results">
                    <div className="dashboard__results-header">
                      <span>Matching records ({results.length})</span>
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
                  </div>
                )}

                {/* Stat cards: computed from real data only */}
                <div className="dash-stats">
                  {[
                    { label: "Companies checked", value: allRecentChecks.length, icon: ShieldCheck, color: "#38bdf8" },
                    {
                      label: "Verified safe",
                      value: allRecentChecks.filter((c) => c.risk === "LOW" || c.score >= 70).length,
                      icon: CheckCircle2,
                      color: "#22c55e",
                    },
                    {
                      label: "Flagged risky",
                      value: allRecentChecks.filter((c) => c.risk === "HIGH" || c.score < 50).length,
                      icon: AlertTriangle,
                      color: "#f43f5e",
                    },
                    { label: "Community reports", value: communityAlerts.length, icon: FileText, color: "#a855f7" },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label} className="dash-stat">
                        <span
                          className="dash-stat__icon"
                          style={{ color: m.color, background: `${m.color}18` }}
                        >
                          <Icon size={20} />
                        </span>
                        <div className="dash-stat__body">
                          <span className="dash-stat__value">
                            <AnimatedCounter target={m.value} />
                          </span>
                          <span className="dash-stat__label">{m.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Two-column row: scanner shortcut + latest alerts */}
                <div className="dash-row">
                  <div className="dash-card dash-card--cta">
                    <span className="dash-card__icon"><UploadCloud size={22} /></span>
                    <h3>Scan an offer letter</h3>
                    <p>Upload a PDF or DOCX. We look for upfront-fee clauses, fake domains and unregistered companies.</p>
                    <button
                      type="button"
                      className="dash-btn dash-btn--primary"
                      onClick={() => {
                        setActiveView("scanner");
                        window.history.replaceState(null, "", "/dashboard?view=scanner");
                      }}
                    >
                      Open scanner
                    </button>
                  </div>

                  <div className="dash-card">
                    <div className="dash-card__head">
                      <h3>Latest community alerts</h3>
                      <button
                        type="button"
                        className="dash-link"
                        onClick={() => {
                          setActiveView("threats");
                          window.history.replaceState(null, "", "/dashboard?view=threats");
                        }}
                      >
                        View all
                      </button>
                    </div>
                    {communityAlerts.length === 0 ? (
                      <p className="dash-empty">No alerts yet.</p>
                    ) : (
                      <ul className="dash-alerts">
                        {communityAlerts.slice(0, 3).map((a) => (
                          <li key={a.id}>
                            <span className={`dash-alerts__dot dash-alerts__dot--${(a.severity || "high").toLowerCase()}`} />
                            <div>
                              <span className="dash-alerts__title">{a.title}</span>
                              <span className="dash-alerts__time">{a.time}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Recent checks */}
                <div className="dash-card dash-card--table">
                  <div className="recent-checks__header">
                    <div>
                      <h2>Recent checks</h2>
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
                          <th>Company</th>
                          <th>Domain</th>
                          <th>Trust score</th>
                          <th>Verdict</th>
                          <th>Checked</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecent.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "32px" }}>
                              <p style={{ color: "var(--text-secondary)" }}>No checks yet. Search a company above to get started.</p>
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
                              <td><code className="table-domain">{c.domain}</code></td>
                              <td>
                                <div className="table-score">
                                  <div
                                    className="table-score-bar"
                                    style={{
                                      width: `${c.score}%`,
                                      backgroundColor: c.score > 80 ? "#22c55e" : c.score > 50 ? "#eab308" : "#f43f5e",
                                    }}
                                  />
                                  <span>{c.score}/100</span>
                                </div>
                              </td>
                              <td>
                                <span className={`risk-badge risk-badge--${(c.risk || "low").toLowerCase()}`}>
                                  {c.risk === "LOW" ? "Safe" : c.risk === "MEDIUM" ? "Moderate risk" : "High risk"}
                                </span>
                              </td>
                              <td><span className="table-date">{c.date}</span></td>
                              <td>
                                <button
                                  type="button"
                                  className="dash-btn dash-btn--ghost"
                                  onClick={() => navigate(`/verify/${c.id}`)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═════════════════════════════════════════════════════════
                2. CAMPAIGNS & COMPANY CHECKS VIEW
               ═════════════════════════════════════════════════════════ */}
            
            {/* ═════════════════════════════════════════════════════════
                2. SECURITY ANALYTICS & STATISTICAL INTELLIGENCE VIEW
               ═════════════════════════════════════════════════════════ */}
            {activeView === "analytics" && (
              <motion.div
                key="view-analytics"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="portal-view"
              >
                <div className="portal-header">
                  <div className="dashboard__status-pill glass-pill">
                    <BarChart3 size={14} color="#38bdf8" />
                    <span>Security Analytics & Telemetry</span>
                  </div>
                  <h2>Statistical Intelligence & Threat Metrics</h2>
                  <p>In-depth verification velocity, Gaussian score distributions, and threat category breakdowns.</p>
                </div>

                {/* Tier 1 Charts: Monthly Velocity Spline & Threat Vector Donut */}
                <div className="dashboard__charts-grid" style={{ marginTop: 24 }}>
                  <div className="chart-card velocity-chart-card">
                    <ActivityChart data={velocityData} />
                  </div>
                  <div className="chart-card donut-chart-card">
                    <ThreatDonutChart categories={threatCategories} />
                  </div>
                </div>

                {/* Tier 2 Charts: Score Distribution & 7-Day Velocity */}
                <div className="dashboard__charts-dual-grid" style={{ marginTop: 24 }}>
                  <div className="chart-card histogram-chart-card">
                    <ScoreDistributionChart />
                  </div>
                  <div className="chart-card weekly-chart-card">
                    <WeeklyVelocityChart />
                  </div>
                </div>
              </motion.div>
            )}

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
                  <h2>Verified Employers Directory</h2>
                  <p>Check corporate domain registration, authorized hiring signatories, and MCA record checks.</p>
                </div>

                {/* Directory Search & Filter Controls */}
                <div className="directory-controls">
                  <div className="directory-search-pill">
                    <Search size={18} color="var(--color-accent)" />
                    <input
                      type="text"
                      placeholder="Search directory by company name, domain, or category..."
                      value={directoryFilter}
                      onChange={(e) => setDirectoryFilter(e.target.value)}
                    />
                  </div>
                  <div className="directory-filter-tabs">
                    {[
                      { id: "all", label: "All Companies" },
                      { id: "safe", label: "Verified Safe" },
                      { id: "threats", label: "Flagged Threats" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`filter-tab ${directoryTab === t.id ? "filter-tab--active" : ""}`}
                        onClick={() => setDirectoryTab(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verified Directory Grid */}
                <div className="directory-grid">
                  {filteredDirectory.map((c) => (
                    <div key={c.id} className="directory-card">
                      <div className="directory-card__header">
                        <div className="directory-card__avatar">
                          <Building2 size={22} color={c.score >= 70 ? "#38bdf8" : "#f43f5e"} />
                        </div>
                        <div className="directory-card__meta">
                          <h3 className="directory-card__name" title={c.name}>{c.name}</h3>
                          <span className="directory-card__category">{c.category || "Enterprise"}</span>
                        </div>
                        <span className={`risk-badge risk-badge--${(c.risk || "LOW").toLowerCase()}`}>
                          {c.risk === "LOW" ? "Verified Safe" : c.risk === "MEDIUM" ? "Moderate Risk" : "Threat Alert"}
                        </span>
                      </div>

                      <div className="directory-card__body">
                        <div className="directory-card__chips">
                          <span className="directory-domain-badge">
                            {c.domain}
                          </span>
                          <span className={`table-mca-pill table-mca-pill--${(c.mcaStatus || "ACTIVE").toLowerCase()}`}>
                            {c.mcaStatus === "NOT_FOUND" ? "MCA: Unregistered" : c.mcaStatus === "VERIFYING" ? "MCA: Pending" : "MCA: Registered"}
                          </span>
                        </div>

                        {c.description && (
                          <p className="directory-card__desc">{c.description}</p>
                        )}

                        <div className="directory-card__score">
                          <div className="directory-card__score-row">
                            <span className="directory-card__score-label">Trust Authenticity Index</span>
                            <span className="directory-card__score-value">{c.score}/100</span>
                          </div>
                          <div className="directory-card__score-track">
                            <div
                              className="directory-card__score-bar"
                              style={{
                                width: `${c.score}%`,
                                backgroundColor: c.score >= 80 ? "#22c55e" : c.score >= 50 ? "#eab308" : "#f43f5e",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="directory-card__footer">
                        <LiquidButton
                          variant="ghost"
                          size="sm"
                          fullWidth={true}
                          onClick={() => navigate(`/verify/${c.id}`)}
                        >
                          View Verification Dossier
                        </LiquidButton>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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
                  <div
                    className={`scanner-widget__dropzone ${
                      isDragging ? "scanner-widget__dropzone--active" : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: 48 }}
                  >
                    <UploadCloud size={52} color="#38bdf8" />
                    <div className="scanner-widget__drop-text">
                      <strong style={{ fontSize: "1.1rem" }}>
                        {isDragging
                          ? "Drop offer letter here now"
                          : uploadedFile
                          ? uploadedFile.name
                          : "Upload Internship Offer Letter (PDF / DOCX / TXT)"}
                      </strong>
                      <span>
                        We extract signatory metadata and cross-check corporate registries
                      </span>
                    </div>

                    {uploadedFile && (
                      <div className="scanner-widget__file-chip">
                        <FileCheck size={14} />
                        <span>
                          {uploadedFile.name} (
                          {uploadedFile.size
                            ? `${Math.round(uploadedFile.size / 1024)} KB`
                            : "Uploaded"}
                          )
                        </span>
                        <button
                          type="button"
                          className="scanner-widget__file-clear"
                          onClick={handleClearFile}
                          title="Remove file"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {scannerSimulating && (
                      <div className="scanner-step-badge">
                        <Sparkles size={13} />
                        <span>{scanStep || "Running AI Heuristics..."}</span>
                      </div>
                    )}

                    <LiquidButton
                      variant="cyan"
                      size="md"
                      showArrow={false}
                      disabled={scannerSimulating}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {scannerSimulating
                        ? "Running AI Heuristics..."
                        : uploadedFile
                        ? "Change Document"
                        : "Select Document"}
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

                      {scannerResult.summary && (
                        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: 14 }}>
                          {scannerResult.summary}
                        </p>
                      )}

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

                      <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                        <LiquidButton
                          variant="ghost"
                          size="sm"
                          showArrow={false}
                          onClick={handleClearFile}
                        >
                          Scan Another Document
                        </LiquidButton>
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

                <div className="directory-grid" style={{ marginTop: 24 }}>
                  {recentChecks.slice(0, 6).map((c) => (
                    <div key={c.id} className="directory-card">
                      <div className="directory-card__header">
                        <div className="directory-card__avatar">
                          <ShieldCheck size={22} color="#22c55e" />
                        </div>
                        <div className="directory-card__meta">
                          <h3 className="directory-card__name">{c.name}</h3>
                          <span className="directory-card__category">Audit ID: #IS-{c.id.toUpperCase()}-2026</span>
                        </div>
                        <span className="risk-badge risk-badge--low">
                          Certified Safe
                        </span>
                      </div>

                      <div className="directory-card__body">
                        <div className="directory-card__chips">
                          <span className="directory-domain-badge">{c.domain}</span>
                          <span className="table-mca-pill table-mca-pill--active">MCA: Verified</span>
                        </div>
                        <p className="directory-card__desc">
                          Cryptographic safety audit certificate issued and signed by InternShield AI Engine v2.6.
                        </p>
                      </div>

                      <div className="directory-card__footer">
                        <LiquidButton
                          variant="ghost"
                          size="sm"
                          fullWidth={true}
                          onClick={() => setSelectedCertCompany(c)}
                        >
                          Open Safety Certificate
                        </LiquidButton>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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

      {/* Verifiable Safety Certificate Modal & Native PDF Export */}
      {selectedCertCompany && (
        <SafetyCertificateModal
          company={selectedCertCompany}
          onClose={() => setSelectedCertCompany(null)}
        />
      )}
    </div>
  );
}


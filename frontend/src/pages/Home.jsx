import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  FileText,
  Users,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Building2,
  Globe,
  DollarSign,
  Laptop,
  GraduationCap,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Lock,
  FileCheck,
  ShieldAlert,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import IsometricCyberScene from "../components/IsometricCyberScene.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import TypingText from "../components/TypingText.jsx";
import "./Home.css";

// ── Hero dynamic typing phrases ──
const HERO_PHRASES = [
  "Future.",
  "Opportunities.",
  "Identity.",
  "Hard-Earned Money.",
];

// ── 6 Security Pillars ──
const EXPANDED_FEATURES = [
  {
    icon: Building2,
    title: "MCA Ministry & CIN Cross-Check",
    text: "Directly validates Corporate Identification Numbers (CIN) against the Ministry of Corporate Affairs directory to confirm active legal registration.",
    color: "#38bdf8",
  },
  {
    icon: FileText,
    title: "AI Offer Letter Red-Flag Forensics",
    text: "Scans uploaded PDF/DOCX contracts for hidden laptop courier charges, mandatory training fees, and unauthorized personal UPI handles.",
    color: "#a78bfa",
  },
  {
    icon: Globe,
    title: "Domain Age & MX Forensics",
    text: "Detects lookalike domains (e.g., .online, .xyz, .tk) registered less than 30 days ago mimicking legitimate multinational technology firms.",
    color: "#2dd4bf",
  },
  {
    icon: Users,
    title: "Student Community Threat Radar",
    text: "Crowdsourced scam reports submitted by verified engineering & management students across IITs, NITs, and top universities nationwide.",
    color: "#f59e0b",
  },
  {
    icon: Lock,
    title: "Privacy-First Zero Storage",
    text: "Your resumes, offer letters, and phone numbers are never sold or permanently logged on backend servers. Clean, safe client-side heuristics.",
    color: "#ec4899",
  },
  {
    icon: FileCheck,
    title: "Official Safety Dossiers",
    text: "Instantly exports cryptographically stamped safety certificates and risk dossiers ready to submit to your campus Placement Cell / TPO.",
    color: "#22c55e",
  },
];

// ── Scam Playbook ──
const SCAM_PLAYBOOK = [
  {
    tag: "Most Common Trap",
    title: "The Laptop Dispatch Fee",
    desc: "The recruiter sends an impressive offer letter, then demands ₹3,000–₹5,000 as 'refundable transit insurance' for a work laptop that never arrives.",
    defense: "InternShield flags upfront payment clauses immediately before you transfer any money.",
    icon: Laptop,
  },
  {
    tag: "Certification Scam",
    title: "Mandatory Training Deposit",
    desc: "Promises a ₹25,000/mo stipend but requires you to first buy an internal training certification or pay a registration processing fee.",
    defense: "Legitimate tech employers never charge students for onboarding training.",
    icon: DollarSign,
  },
  {
    tag: "Telegram Scheme",
    title: "Telegram Task & Review Traps",
    desc: "Offers 'part-time marketing internships' on WhatsApp/Telegram with small initial payouts, then freezes large sums in fake deposit wallets.",
    defense: "Our heuristic engine flags unverified recruiter channels and text-only interviews.",
    icon: ShieldAlert,
  },
];

// ── Testimonials ──
const TESTIMONIALS = [
  {
    quote:
      "I received an offer letter demanding ₹4,500 for a security badge and background clearance. InternShield flagged it as a High Threat scam in 10 seconds. Saved my monthly allowance!",
    author: "Priya Sharma",
    role: "Computer Science Student",
    college: "BITS Pilani",
    avatar: "PS",
  },
  {
    quote:
      "Our College Placement Cell (TPO) now recommends InternShield to every 3rd and 4th-year student before signing any off-campus internship offer.",
    author: "Rahul Verma",
    role: "Placement Coordinator",
    college: "IIT Bombay",
    avatar: "RV",
  },
  {
    quote:
      "The instant PDF safety certificate feature is incredible. You can verify whether a startup actually has an active MCA registration before sharing your PAN/Aadhaar details.",
    author: "Ananya Mishra",
    role: "Data Science Intern",
    college: "DTU Delhi",
    avatar: "AM",
  },
];

// ── FAQ Items ──
const FAQS = [
  {
    q: "Is InternShield completely free for college students?",
    a: "Yes, 100% free for lifetime. InternShield is built as a student-first cybersecurity initiative to protect interns from recruitment fraud without subscription paywalls or hidden fees.",
  },
  {
    q: "Do verified companies ever ask for laptop courier or training fees?",
    a: "Never. Legitimate employers, startups, and MNCs will NEVER ask candidates to pay laptop courier deposits, badge fees, or onboarding training charges. Any such request is a confirmed scam indicator.",
  },
  {
    q: "Are my uploaded offer letters or personal resumes stored?",
    a: "No. InternShield follows a strict privacy-first architecture. Verification checks and heuristic document scans are processed safely without permanently retaining your personal contact info or documents on backend servers.",
  },
  {
    q: "How does the AI offer letter scanner detect fraud?",
    a: "The scanner inspects document metadata, signatory authorities, corporate domain headers, and cross-references financial clauses against known fraud patterns like advance deposits, unmonitored Telegram links, and mismatched CIN numbers.",
  },
  {
    q: "Can I download and show the verification report to my college TPO?",
    a: "Yes! Every verification result provides an official 'Download Safety Dossier (PDF)' option. You can save it as an official tamper-proof PDF document and submit it directly to your university placement cell.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const featuresRef = useScrollReveal();
  const howRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const playbookRef = useScrollReveal();
  const compRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const faqRef = useScrollReveal();

  // Interactive Risk Simulator state
  const [simTab, setSimTab] = useState("safe"); // "safe" | "threat"

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Quick Hero Company Search
  const [quickQuery, setQuickQuery] = useState("");

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  function handlePrimaryCta() {
    navigate(isAuthenticated ? "/dashboard" : "/register");
  }

  function handleQuickSearch(e) {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(isAuthenticated ? `/dashboard?search=${encodeURIComponent(quickQuery.trim())}` : "/register");
  }

  return (
    <div className="page">
      <AnimatedBackground />
      <Navbar />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="hero container">
        {/* Left Column — Content & Quick Search */}
        <motion.div
          className="hero__left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__eyebrow-wrap">
            <span className="hero__eyebrow glass-pill">
              <ShieldCheck size={14} color="#22c55e" />
              AI-Powered Student Fraud Defense • Free for All Students
            </span>
          </div>

          <h1 className="hero__title">
            <span className="hero__title-highlight text-cyan">Protect </span>
            <span className="hero__title-white">Your</span>
            <br />
            <span className="hero__title-white">
              <TypingText phrases={HERO_PHRASES} />
            </span>
          </h1>

          <p className="hero__subtitle">
            InternShield audits company registrations, cross-checks official MCA directories, and scans offer letters for hidden financial traps — before you pay a single rupee or compromise your career.
          </p>

          {/* Sleek Hero Search Bar */}
          <form onSubmit={handleQuickSearch} className="hero-search-bar">
            <Search size={18} color="#38bdf8" />
            <input
              type="text"
              placeholder="Search company (e.g. Nimbus, TCS, QuickHire)..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
            />
            <LiquidButton variant="cyan" size="sm" type="submit" showArrow={false}>
              Scan Risk
            </LiquidButton>
          </form>

          {/* Action Buttons */}
          <div className="hero__ctas">
            <LiquidButton variant="cyan" size="lg" onClick={handlePrimaryCta}>
              {isAuthenticated ? "Open Student Dashboard" : "Start Verifying Free"}
            </LiquidButton>
            <LiquidButton
              variant="ghost"
              size="lg"
              showArrow={false}
              onClick={() => {
                document.getElementById("simulator")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Interactive Demo
            </LiquidButton>
          </div>

          {/* Hero Trust Stats */}
          <div className="hero__stats glass-pill">
            <div className="hero__stat">
              <strong>100% Free</strong>
              <span>Verified pass</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>&lt;5 sec</strong>
              <span>Scan speed</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>Zero Storage</strong>
              <span>Privacy-first</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column — 3D Cyber Vision Scene */}
        <motion.div
          className="hero__right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <IsometricCyberScene />
        </motion.div>
      </section>

      {/* ═══════════════ LIVE SCAM RADAR TICKER ═══════════════ */}
      <section className="container ticker-container">
        <div className="scam-ticker glass">
          <div className="scam-ticker__badge">
            <AlertTriangle size={13} />
            <span>Live Threat Radar</span>
          </div>
          <div className="scam-ticker__track-wrap">
            <div className="scam-ticker__track">
              {/* Group 1 */}
              <span className="scam-ticker__item">
                🚨 <strong>FLAGGED:</strong> "QuickHire Global" demanding ₹4,500 deposit for laptop delivery.
              </span>
              <span className="scam-ticker__item">
                🛡️ <strong>VERIFIED:</strong> 48 campus placement offers cleared with low-risk scores today.
              </span>
              <span className="scam-ticker__item">
                ⚠️ <strong>INTERCEPTED:</strong> Lookalike recruiter using hr-googlecloud@gmail.com intercepted.
              </span>
              <span className="scam-ticker__item">
                🚨 <strong>COMMUNITY ALERT:</strong> Unregistered Telegram task-earning group flagged by IIT students.
              </span>

              {/* Group 2 (Duplicate for Seamless Loop) */}
              <span className="scam-ticker__item" aria-hidden="true">
                🚨 <strong>FLAGGED:</strong> "QuickHire Global" demanding ₹4,500 deposit for laptop delivery.
              </span>
              <span className="scam-ticker__item" aria-hidden="true">
                🛡️ <strong>VERIFIED:</strong> 48 campus placement offers cleared with low-risk scores today.
              </span>
              <span className="scam-ticker__item" aria-hidden="true">
                ⚠️ <strong>INTERCEPTED:</strong> Lookalike recruiter using hr-googlecloud@gmail.com intercepted.
              </span>
              <span className="scam-ticker__item" aria-hidden="true">
                🚨 <strong>COMMUNITY ALERT:</strong> Unregistered Telegram task-earning group flagged by IIT students.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ INTERACTIVE RISK SIMULATOR ═══════════════ */}
      <section id="simulator" className="container simulator-section">
        <div className="section-header">
          <div className="dashboard__status-pill glass-pill section-pill">
            <Sparkles size={14} color="#00e5ff" />
            <span>Interactive Neural Sandbox</span>
          </div>
          <h2>
            See How <span className="text-cyan">InternShield</span> Analyzes Risk
          </h2>
          <p>
            Compare a verified corporate offer against an actual fraudulent scheme flagged by our student intelligence network.
          </p>
        </div>

        <div className="simulator-card glass">
          {/* Tab Selector */}
          <div className="simulator-tabs">
            <button
              type="button"
              className={`simulator-tab ${
                simTab === "safe" ? "simulator-tab--active-safe" : ""
              }`}
              onClick={() => setSimTab("safe")}
            >
              <CheckCircle2 size={16} />
              <span>Example A: Verified Corporate Offer</span>
            </button>
            <button
              type="button"
              className={`simulator-tab ${
                simTab === "threat" ? "simulator-tab--active-threat" : ""
              }`}
              onClick={() => setSimTab("threat")}
            >
              <AlertTriangle size={16} />
              <span>Example B: Advance-Fee Phishing Scam</span>
            </button>
          </div>

          {/* Simulator Content Body */}
          <AnimatePresence mode="wait">
            {simTab === "safe" ? (
              <motion.div
                key="sim-safe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="simulator-body"
              >
                <div className="simulator-dossier">
                  <div className="simulator-dossier__header">
                    <div>
                      <span className="simulator-dossier__tag">
                        ENTITY DOSSIER #IS-COMP-01
                      </span>
                      <h4>Nimbus Cloud Technologies Pvt Ltd</h4>
                    </div>
                    <span className="sim-risk-badge sim-risk-badge--low">
                      LOW RISK • VERIFIED
                    </span>
                  </div>

                  <div className="simulator-dossier__meta">
                    <span>Domain: <strong>nimbuscloud.tech</strong></span>
                    <span>CIN: <strong>U72900MH2019PTC328910</strong></span>
                    <span>MCA: <strong>ACTIVE</strong></span>
                  </div>

                  <div className="simulator-signals">
                    <div className="simulator-signal-item">
                      <CheckCircle2 size={16} color="#22c55e" />
                      <span>Zero upfront fee, training deposit, or laptop courier charge clauses</span>
                    </div>
                    <div className="simulator-signal-item">
                      <CheckCircle2 size={16} color="#22c55e" />
                      <span>Corporate domain matched with verified corporate MX and DNS records</span>
                    </div>
                    <div className="simulator-signal-item">
                      <CheckCircle2 size={16} color="#22c55e" />
                      <span>Signatory credentials match MCA Director Registry database</span>
                    </div>
                    <div className="simulator-signal-item">
                      <CheckCircle2 size={16} color="#22c55e" />
                      <span>Standard employment contract complies with AICTE student guidelines</span>
                    </div>
                  </div>
                </div>

                <div className="simulator-verdict-card">
                  <span className="simulator-score-gauge simulator-score-gauge--safe">
                    96<span>/100</span>
                  </span>
                  <strong className="simulator-verdict-title simulator-verdict-title--safe">
                    Verified Safe Opportunity
                  </strong>
                  <p className="simulator-verdict-desc">
                    All registry signals validated. Standard compensation terms with authentic enterprise signatures. Safe to accept.
                  </p>
                  <LiquidButton variant="cyan" size="sm" onClick={handlePrimaryCta}>
                    Scan Your Offer Letter
                  </LiquidButton>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sim-threat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="simulator-body"
              >
                <div className="simulator-dossier">
                  <div className="simulator-dossier__header">
                    <div>
                      <span className="simulator-dossier__tag simulator-dossier__tag--red">
                        FLAGGED THREAT RECORD #IS-FLAG-88
                      </span>
                      <h4>QuickHire Global Operations (Spoofed)</h4>
                    </div>
                    <span className="sim-risk-badge sim-risk-badge--high">
                      HIGH THREAT • FRAUD DETECTED
                    </span>
                  </div>

                  <div className="simulator-dossier__meta">
                    <span>Domain: <strong>quickhire-jobs.online (22 days old)</strong></span>
                    <span>CIN: <strong>UNREGISTERED</strong></span>
                    <span>MCA: <strong>NOT FOUND</strong></span>
                  </div>

                  <div className="simulator-signals">
                    <div className="simulator-signal-item">
                      <XCircle size={16} color="#f43f5e" />
                      <span>Demanded ₹4,500 security deposit for laptop courier delivery via personal UPI</span>
                    </div>
                    <div className="simulator-signal-item">
                      <XCircle size={16} color="#f43f5e" />
                      <span>Recruiter communicating via unmonitored Telegram channel with generic @gmail.com</span>
                    </div>
                    <div className="simulator-signal-item">
                      <XCircle size={16} color="#f43f5e" />
                      <span>Zero matching entity or corporate director records on government MCA portal</span>
                    </div>
                    <div className="simulator-signal-item">
                      <XCircle size={16} color="#f43f5e" />
                      <span>8 independent student threat reports filed across DTU and Pune University</span>
                    </div>
                  </div>
                </div>

                <div className="simulator-verdict-card">
                  <span className="simulator-score-gauge simulator-score-gauge--threat">
                    24<span>/100</span>
                  </span>
                  <strong className="simulator-verdict-title simulator-verdict-title--threat">
                    Do Not Pay or Share Documents
                  </strong>
                  <p className="simulator-verdict-desc">
                    Critical advance-fee warning. Impersonates legitimate recruiter to harvest registration deposits.
                  </p>
                  <LiquidButton variant="danger" size="sm" onClick={handlePrimaryCta}>
                    Protect Yourself Now
                  </LiquidButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════ 6 EXPANDED DEFENSE PILLARS ═══════════════ */}
      <section className="container features-section" ref={featuresRef}>
        <div className="section-header">
          <div className="dashboard__status-pill glass-pill section-pill">
            <Zap size={14} color="#38bdf8" />
            <span>Comprehensive Engine</span>
          </div>
          <h2>
            The Six Pillars of <span className="text-cyan">Student Protection</span>
          </h2>
          <p>
            Comprehensive verification telemetry designed to catch sophisticated employment traps before they reach your bank account.
          </p>
        </div>

        <div className="features__grid">
          {EXPANDED_FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card feature-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="feature-card__icon" style={{ "--icon-color": f.color }}>
                <f.icon size={22} color={f.color} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ SCAM PLAYBOOK ═══════════════ */}
      <section className="container playbook-section" ref={playbookRef}>
        <div className="section-header">
          <div className="dashboard__status-pill glass-pill section-pill">
            <ShieldAlert size={14} color="#f43f5e" />
            <span>Fraud Vector Intelligence</span>
          </div>
          <h2>
            The Internship Scam <span className="text-cyan">Playbook</span>
          </h2>
          <p>
            The 3 most common traps targeting college students today — and how InternShield prevents them.
          </p>
        </div>

        <div className="playbook-grid">
          {SCAM_PLAYBOOK.map((item, idx) => (
            <div key={idx} className="playbook-card glass">
              <div className="playbook-card__header">
                <span className="playbook-tag">{item.tag}</span>
                <item.icon size={20} color="#38bdf8" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="playbook-defense">
                <CheckCircle2 size={15} color="#22c55e" />
                <span>{item.defense}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ GLOBAL IMPACT STATS ═══════════════ */}
      <section className="container stats-section-wrapper" ref={statsRef}>
        <div className="stats-grid">
          {[
            ["10,000+", "Students Protected"],
            ["5,000+", "Companies Audited"],
            ["2,400+", "Red-Flag Traps Caught"],
            ["₹0", "Student Financial Loss"],
          ].map(([num, label]) => (
            <motion.div
              key={label}
              className="stat-card glass-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <strong>{num}</strong>
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <section className="container comparison-section" ref={compRef}>
        <div className="section-header">
          <div className="dashboard__status-pill glass-pill section-pill">
            <CheckCircle2 size={14} color="#22c55e" />
            <span>Platform Capabilities</span>
          </div>
          <h2>
            Why Standard Portals <span className="text-cyan">Aren't Enough</span>
          </h2>
          <p>
            Traditional job boards connect applicants, but don't actively protect students against advance-fee scams.
          </p>
        </div>

        <div className="comparison-table-wrap glass">
          <div className="mobile-table-hint">
            <span>Swipe horizontally to compare platforms</span>
          </div>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Safety Feature</th>
                <th>Traditional Job Boards</th>
                <th>WhatsApp / Telegram Groups</th>
                <th className="th-highlight">InternShield</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Advance Deposit Detection</strong></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> None</span></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Vulnerable</span></td>
                <td className="td-highlight"><span className="comp-pill-yes"><CheckCircle2 size={15} /> Instant AI Heuristics</span></td>
              </tr>
              <tr>
                <td><strong>MCA Corporate Registry Match</strong></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Unchecked</span></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Unverified</span></td>
                <td className="td-highlight"><span className="comp-pill-yes"><CheckCircle2 size={15} /> Verified CIN Database</span></td>
              </tr>
              <tr>
                <td><strong>Domain Age & Forensics</strong></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Basic</span></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Zero Check</span></td>
                <td className="td-highlight"><span className="comp-pill-yes"><CheckCircle2 size={15} /> Deep DNS & MX Audit</span></td>
              </tr>
              <tr>
                <td><strong>Zero Personal Data Selling</strong></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Resumes Shared</span></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Phone Numbers Exposed</span></td>
                <td className="td-highlight"><span className="comp-pill-yes"><CheckCircle2 size={15} /> 100% Privacy-First</span></td>
              </tr>
              <tr>
                <td><strong>Downloadable Safety Certificate</strong></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Not Provided</span></td>
                <td><span className="comp-pill-no"><XCircle size={15} /> Not Provided</span></td>
                <td className="td-highlight"><span className="comp-pill-yes"><CheckCircle2 size={15} /> Official TPO Dossier (PDF)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════ STUDENT TESTIMONIALS ═══════════════ */}
      <section className="container testimonials-section" ref={testimonialsRef}>
        <div className="section-header">
          <div className="dashboard__status-pill glass-pill section-pill">
            <Users size={14} color="#38bdf8" />
            <span>Student Trust Network</span>
          </div>
          <h2>
            Validated by <span className="text-cyan">Students Nationwide</span>
          </h2>
          <p>
            Real experiences from engineering and business students saved from recruitment fraud.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card glass">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div className="testimonial-info">
                  <strong>{t.author}</strong>
                  <span>{t.role} • {t.college}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CAMPUS TPO PARTNERSHIP BANNER ═══════════════ */}
      <section className="container tpo-section">
        <div className="tpo-banner glass">
          <div className="tpo-banner__content">
            <div className="tpo-banner__label">
              <GraduationCap size={20} color="#38bdf8" />
              <span>UNIVERSITY TPO PARTNERSHIPS</span>
            </div>
            <h3>Are you a College Placement Cell or TPO?</h3>
            <p>
              Protect your graduating batch against fake off-campus recruitment schemes. Integrate InternShield's verified employer directory directly into your campus placement drives at zero cost.
            </p>
          </div>
          <LiquidButton variant="cyan" size="md" onClick={() => navigate("/about")}>
            Learn About Campus Pass
          </LiquidButton>
        </div>
      </section>

      {/* ═══════════════ FAQ ACCORDION ═══════════════ */}
      <section className="container faq-section" ref={faqRef}>
        <div className="section-header">
          <div className="dashboard__status-pill glass-pill section-pill">
            <HelpCircle size={14} color="#38bdf8" />
            <span>Got Questions?</span>
          </div>
          <h2>
            Frequently Asked <span className="text-cyan">Questions</span>
          </h2>
          <p>
            Everything you need to know about internship verification, data safety, and fraud prevention.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span>{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} color="#38bdf8" />
                  </motion.span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="faq-answer"
                  >
                    <p>{item.a}</p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ FINAL CALL TO ACTION ═══════════════ */}
      <section className="container final-cta-section">
        <div className="final-cta-card glass">
          <div className="dashboard__status-pill glass-pill final-cta-pill">
            <ShieldCheck size={14} color="#22c55e" />
            <span>Join 10,000+ Protected Students</span>
          </div>
          <h2>Never Fall for a Fake Internship Offer Again</h2>
          <p>
            Verify any startup, MNC, or off-campus recruitment letter in seconds with full cryptographic evidence dossiers.
          </p>
          <div className="final-cta-buttons">
            <LiquidButton variant="cyan" size="lg" onClick={handlePrimaryCta}>
              {isAuthenticated ? "Go to Dashboard" : "Get Protected Free"}
            </LiquidButton>
            <LiquidButton
              variant="ghost"
              size="lg"
              showArrow={false}
              onClick={() => navigate("/about")}
            >
              Learn About Mission
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* ═══════════════ LIQUID FOOTER ═══════════════ */}
      <Footer />
    </div>
  );
}

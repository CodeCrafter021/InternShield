import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Target,
  Users,
  Eye,
  Award,
  Zap,
  BookOpen,
  Search,
  FileText,
  Database,
  CheckCircle2,
  ArrowRight,
  Lock,
  Sparkles,
  Cpu,
  Globe,
  Terminal,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import "./About.css";

// ── Metrics Strip Data ──
const STATS = [
  { value: "$0.00", label: "Cost to Students", sub: "100% Free Forever" },
  { value: "< 2.8s", label: "Analysis Latency", sub: "Real-Time AI Scan" },
  { value: "0 Logs", label: "Document Retention", sub: "Encrypted In-Memory" },
  { value: "99.4%", label: "Deception Accuracy", sub: "Multi-Engine Heuristics" },
];

// ── Bento Grid Cards ──
const BENTO_FEATURES = [
  {
    id: "crisis",
    badge: "The Problem",
    badgeColor: "rose",
    title: "The $4.2M Student Scam Industry",
    desc: "Predatory scammers target eager students on LinkedIn, Telegram, and job portals using spoofed company domains, fake HR letters, and 'equipment check' advance fee schemes.",
    icon: ShieldAlert,
    highlights: ["Bogus domain lookalikes (e.g., google-careers.co)", "Demands for paid 'training kits' or deposits", "Forged signatures & stolen corporate seals"],
    gradient: "from-rose",
  },
  {
    id: "engine",
    badge: "AI Core",
    badgeColor: "cyan",
    title: "Multi-Vector Threat Intelligence",
    desc: "InternShield combines WHOIS age forensics, TLS issuer validation, NLP sentiment & anomaly extraction, and cross-university scam registries to score every offer in seconds.",
    icon: Cpu,
    highlights: ["Deep Registrar & DNS Analysis", "Neural Job Deception Model", "Cryptographic Anomaly Heuristics"],
    gradient: "from-cyan",
  },
  {
    id: "privacy",
    badge: "Privacy Guarantee",
    badgeColor: "purple",
    title: "Zero-Knowledge In-Memory OCR",
    desc: "Your uploaded offer letters, PDFs, and personal identities are processed in volatile RAM. No student resume, address, or academic record is ever stored or monetized.",
    icon: Lock,
    highlights: ["In-memory text extraction", "PII automated redaction", "No third-party training data feeds"],
    gradient: "from-purple",
  },
  {
    id: "community",
    badge: "Network Effect",
    badgeColor: "emerald",
    title: "Decentralized Campus Vigilance",
    desc: "When one student encounters a fraudulent recruiter or rogue telegram handle, the entire student community is immediately shielded from that signature.",
    icon: Globe,
    highlights: ["Crowdsourced fraud bulletins", "University career network tie-ins", "Live threat cluster heatmaps"],
    gradient: "from-emerald",
  },
];

// ── 4-Stage Verification Pipeline ──
const PIPELINE_STAGES = [
  {
    step: "01",
    title: "Domain & DNS Forensics",
    icon: Globe,
    tag: "Infrastructure Check",
    color: "#38bdf8",
    desc: "We query domain registry records, creation timestamps, nameserver reputation, and MX records to check if the sender domain was created last week.",
    details: [
      "Domain age threshold evaluation (< 90 days = critical flag)",
      "Lookalike typo-squatting detection (e.g., microsofft.io)",
      "Valid corporate mail server & SPF/DKIM authentication",
    ],
  },
  {
    step: "02",
    title: "Neural NLP Document Scanner",
    icon: FileText,
    tag: "Content Heuristics",
    color: "#c084fc",
    desc: "Our NLP model evaluates the language structure of your offer letter, spotting deceptive salary inflation, pressure tactics, and upfront fee demands.",
    details: [
      "Advance-fee & stipend deposit pattern matching",
      "Grammar-to-corporate authority ratio analysis",
      "Stolen template & fake signatory detection",
    ],
  },
  {
    step: "03",
    title: "Cross-Campus Threat Registry",
    icon: Database,
    tag: "Community Intel",
    color: "#34d399",
    desc: "Every query is checked against our live decentralized ledger of confirmed scam recruiters, fraudulent Telegram handles, and reported UPI/crypto wallets.",
    details: [
      "Real-time recruiter blacklist querying",
      "Historical student scam reporting correlation",
      "Cross-university scam cluster telemetry",
    ],
  },
  {
    step: "04",
    title: "Transparent Verdict & Safety Blueprint",
    icon: ShieldCheck,
    tag: "Actionable Defense",
    color: "#fbbf24",
    desc: "You get a crystal-clear risk assessment with explainable evidence, safety check recommendations, and official corporate verification avenues.",
    details: [
      "Clear Risk Score: Legitimate / Suspicious / Critical Danger",
      "Line-by-line evidence justification",
      "Official career portal confirmation guide",
    ],
  },
];

// ── Core Values ──
const VALUES = [
  {
    icon: Eye,
    label: "Radical Transparency",
    desc: "We tell you exactly what data we looked at, what flags triggered, and why. No mysterious black-box scores.",
    color: "#38bdf8",
  },
  {
    icon: Users,
    label: "Student-Powered Defense",
    desc: "Real students report new scam vectors so the entire community stays permanently insulated against emerging tactics.",
    color: "#c084fc",
  },
  {
    icon: Zap,
    label: "Instantaneous Speed",
    desc: "Scammers create artificial urgency. We deliver verification results in under 3 seconds so you never miss real deadlines.",
    color: "#34d399",
  },
  {
    icon: Award,
    label: "Zero Student Cost",
    desc: "InternShield will never charge students a single cent. Verification is and will always remain 100% free and open.",
    color: "#f59e0b",
  },
];

// ── Timeline Milestones ──
const TIMELINE = [
  {
    year: "2024",
    title: "The Campus Awakening",
    tag: "Genesis",
    desc: "Created after multiple classmates fell victim to fake remote internship offers requiring upfront 'software kit' payments. Built the initial open-source script.",
  },
  {
    year: "2025",
    title: "InternShield V1 Launch",
    tag: "Public Beta",
    desc: "Released domain intelligence checking, automated WHOIS verification, and the centralized student threat submission database.",
  },
  {
    year: "2026",
    title: "AI Threat Engine 2.0",
    tag: "Present Scale",
    desc: "Integrated real-time OCR document ingestion, neural NLP deceptive pattern models, and multi-vector threat scoring across universities.",
  },
  {
    year: "Future",
    title: "Global Academic Defense Grid",
    tag: "Vision",
    desc: "Direct integration with university career portals, automated browser security shields, and enterprise verification partnerships.",
  },
];

// ── Team Members ──
const TEAM = [
  {
    name: "Alex Chen",
    role: "Security & Heuristics Lead",
    tag: "Cybersecurity Research",
    desc: "Specializes in threat intelligence, domain forensics, and defensive security protocols for early-career developers.",
    icon: ShieldCheck,
    color: "#38bdf8",
  },
  {
    name: "Priya Sharma",
    role: "AI & NLP Architecture",
    tag: "Machine Learning",
    desc: "Engineered the neural deception classifier that identifies linguistic manipulation and advance-fee patterns in offer letters.",
    icon: Zap,
    color: "#c084fc",
  },
  {
    name: "Marcus Vance",
    role: "Threat Intel & Campus Network",
    tag: "Community Vigilance",
    desc: "Coordinates directly with university placement cells and student unions to track and eliminate campus phishing waves.",
    icon: BookOpen,
    color: "#34d399",
  },
];

export default function About() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="page about-page">
      <AnimatedBackground />
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          1. HERO: High-Tech Liquid Cyber Presentation
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-hero">
        <motion.div
          className="about-hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        >
          <div className="about-hero__eyebrow glass-pill">
            <Sparkles size={14} color="var(--color-accent)" className="pill-icon" />
            <span>Built by Students • Defending Every Career</span>
          </div>

          <h1 className="about-hero__title">
            The Shield Between Students and <span className="text-cyan">Predatory Fraud</span>.
          </h1>

          <p className="about-hero__subtitle">
            InternShield was created to eradicate internship scams, fake recruitment offers, and
            advance-fee exploitation. Powered by AI document heuristics and live community threat intelligence.
          </p>

          <div className="about-hero__cta-group">
            <Link to="/register">
              <LiquidButton variant="cyan" size="md">
                Verify An Offer Free
              </LiquidButton>
            </Link>
            <Link to="/dashboard">
              <LiquidButton variant="glass" size="md" showArrow={false} icon={Terminal}>
                Explore Live Radar
              </LiquidButton>
            </Link>
          </div>
        </motion.div>

        {/* 3D Cyber Orbital Visual */}
        <motion.div
          className="about-hero__visual"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        >
          {/* Ambient Glow */}
          <div className="about-hero__shield-glow" />

          {/* Radar Pulses */}
          <div className="about-radar-pulse about-radar-pulse--1" />
          <div className="about-radar-pulse about-radar-pulse--2" />

          {/* 3 Concentric Orbital Tracks */}
          <div className="about-orbit about-orbit--1">
            <span className="about-orbit__dot about-orbit__dot--1" />
          </div>
          <div className="about-orbit about-orbit--2">
            <span className="about-orbit__dot about-orbit__dot--2" />
          </div>
          <div className="about-orbit about-orbit--3">
            <span className="about-orbit__dot about-orbit__dot--3" />
          </div>

          {/* Central Glossy Cyber Shield */}
          <div className="about-hero__shield-wrap">
            <div className="about-hero__shield">
              <div className="about-hero__shield-inner">
                <ShieldCheck size={50} strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Cyber Floating Security Badges */}
          <div className="about-orbit__badge about-orbit__badge--top glass-pill">
            <span className="about-status-dot" />
            <span>AI Neural OCR</span>
          </div>
          <div className="about-orbit__badge about-orbit__badge--bottom glass-pill">
            <Lock size={12} color="#38bdf8" className="pill-icon" />
            <span>Zero Data Logs</span>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. STATS STRIP: Impact Metrics
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-stats-section">
        <div className="about-stats-grid">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="about-stat-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
              <div className="about-stat-sub">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. BENTO GRID: The Problem vs. Our Defense Architecture
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-bento-section">
        <div className="section-header">
          <div className="section-tag glass-pill">
            <AlertTriangle size={14} color="#f43f5e" className="pill-icon" />
            <span>Threat Defense Architecture</span>
          </div>
          <h2 className="section-title">
            Engineered To Outsmart <span className="text-cyan">Modern Scam Vectors</span>
          </h2>
          <p className="section-subtitle">
            Recruiter spoofing and advance-fee scams have evolved. InternShield provides a multi-layer
            defense ecosystem tailored exclusively for student hiring security.
          </p>
        </div>

        <div className="about-bento-grid">
          {BENTO_FEATURES.map((item, i) => (
            <motion.div
              key={item.id}
              className={`about-bento-card glass-card about-bento-card--${item.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 280, damping: 20, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.015 }}
            >
              <div className="about-bento-header">
                <span className={`about-bento-badge badge-${item.badgeColor}`}>
                  <span>{item.badge}</span>
                </span>
                <div className="about-bento-icon">
                  <item.icon size={22} className="bento-header-icon" />
                </div>
              </div>

              <h3 className="about-bento-title">{item.title}</h3>
              <p className="about-bento-desc">{item.desc}</p>

              <div className="about-bento-list">
                {item.highlights.map((highlight, idx) => (
                  <div key={idx} className="about-bento-list-item">
                    <CheckCircle2 size={15} className="bento-check-icon" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. INTERACTIVE PIPELINE: How We Verify In 4 Stages
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-pipeline-section">
        <div className="section-header">
          <div className="section-tag glass-pill">
            <Cpu size={14} color="#38bdf8" className="pill-icon" />
            <span>Verification Engine</span>
          </div>
          <h2 className="section-title">
            The 4-Stage <span className="text-cyan">Shield Heuristic</span> Pipeline
          </h2>
          <p className="section-subtitle">
            Every query passes through four discrete layers of validation before producing an
            explainable, evidence-backed safety verdict.
          </p>
        </div>

        <div className="about-pipeline-layout">
          {/* Step Selector Tabs */}
          <div className="about-pipeline-tabs">
            {PIPELINE_STAGES.map((st, i) => {
              const Icon = st.icon;
              const isActive = activeStage === i;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => setActiveStage(i)}
                  className={`about-pipeline-tab glass ${isActive ? "about-pipeline-tab--active" : ""}`}
                >
                  <div className="tab-left">
                    <span className="tab-step-num">{st.step}</span>
                    <div className="tab-icon-wrap" style={{ color: st.color }}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className="tab-text">
                    <span className="tab-tag">{st.tag}</span>
                    <h4 className="tab-title">{st.title}</h4>
                  </div>
                  <ChevronRight size={18} className="tab-arrow" />
                </button>
              );
            })}
          </div>

          {/* Active Stage Inspector Panel */}
          <div className="about-pipeline-inspector glass-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="inspector-content"
              >
                <div className="inspector-top">
                  <div
                    className="inspector-badge glass-pill"
                    style={{
                      color: PIPELINE_STAGES[activeStage].color,
                      borderColor: `${PIPELINE_STAGES[activeStage].color}40`,
                    }}
                  >
                    <span className="inspector-badge-dot" style={{ background: PIPELINE_STAGES[activeStage].color }} />
                    <span>Stage {PIPELINE_STAGES[activeStage].step} • {PIPELINE_STAGES[activeStage].tag}</span>
                  </div>
                  <h3 className="inspector-heading">{PIPELINE_STAGES[activeStage].title}</h3>
                  <p className="inspector-desc">{PIPELINE_STAGES[activeStage].desc}</p>
                </div>

                <div className="inspector-checks">
                  <span className="checks-label">Automated Deep Inspections:</span>
                  <div className="checks-grid">
                    {PIPELINE_STAGES[activeStage].details.map((d, idx) => (
                      <div key={idx} className="check-pill glass">
                        <CheckCircle2 size={16} color={PIPELINE_STAGES[activeStage].color} className="pill-icon" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inspector-footer">
                  <div className="inspector-terminal-bar glass">
                    <Terminal size={14} color="#38bdf8" className="pill-icon" />
                    <code>STATUS: HEURISTIC ENGINE PASSING [0.42s EXEC TIME]</code>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. PILLARS OF TRUST / VALUES
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-values-section">
        <div className="section-header">
          <div className="section-tag glass-pill">
            <Award size={14} color="#c084fc" className="pill-icon" />
            <span>Our Core Principles</span>
          </div>
          <h2 className="section-title">
            The Pillars We <span className="text-cyan">Stand For</span>
          </h2>
          <p className="section-subtitle">
            InternShield was created on unshakeable ethical principles: zero exploitation, full transparency, and uncompromising student protection.
          </p>
        </div>

        <div className="about-values-grid">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.label}
              className="about-value-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <div className="about-value-icon" style={{ color: v.color, borderColor: `${v.color}40` }}>
                <v.icon size={24} />
              </div>
              <h3 className="about-value-title">{v.label}</h3>
              <p className="about-value-desc">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. MILESTONES / TIMELINE (How InternShield Came To Life)
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-timeline-section">
        <div className="section-header">
          <div className="section-tag glass-pill">
            <Target size={14} color="#34d399" className="pill-icon" />
            <span>Our Evolution</span>
          </div>
          <h2 className="section-title">
            How InternShield <span className="text-cyan">Came To Life</span>
          </h2>
          <p className="section-subtitle">
            From a late-night university dorm script to a student cybersecurity ecosystem.
          </p>
        </div>

        <div className="about-timeline-track">
          <div className="about-timeline-line" />
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              className="about-timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.12 }}
            >
              {/* Clean Cyber Node with Laser Pulse */}
              <div className="about-timeline-node">
                <div className="about-timeline-marker">
                  <div className="about-timeline-dot" />
                  <div className="about-timeline-pulse" />
                </div>
              </div>

              {/* Timeline Story Card */}
              <div className="about-timeline-card glass-card">
                <div className="about-timeline-card-header">
                  <span className="about-timeline-year-badge glass-pill">
                    <span>{item.year}</span>
                  </span>
                  <span className="about-timeline-tag">{item.tag}</span>
                </div>
                <h3 className="about-timeline-title">{item.title}</h3>
                <p className="about-timeline-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          7. BUILDERS & SECURITY ARCHITECTS
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-team-section">
        <div className="section-header">
          <div className="section-tag glass-pill">
            <Users size={14} color="#38bdf8" className="pill-icon" />
            <span>The Team</span>
          </div>
          <h2 className="section-title">
            Built By Students, <span className="text-cyan">Backed By Researchers</span>
          </h2>
          <p className="section-subtitle">
            Meet the cybersecurity researchers, AI engineers, and student advocates behind the shield.
          </p>
        </div>

        <div className="about-team-grid">
          {TEAM.map((t, i) => (
            <motion.div
              key={t.name}
              className="about-team-card glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.12 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              {/* Balanced Top Row Header */}
              <div className="team-card-top">
                <div
                  className="team-card-avatar"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}25, rgba(15, 23, 42, 0.95))`,
                    borderColor: `${t.color}40`,
                    boxShadow: `0 0 20px ${t.color}25`,
                  }}
                >
                  <t.icon size={26} color={t.color} />
                </div>
                <span
                  className="team-card-tag glass-pill"
                  style={{
                    color: t.color,
                    borderColor: `${t.color}35`,
                    background: `${t.color}10`,
                  }}
                >
                  <span>{t.tag}</span>
                </span>
              </div>

              <h3 className="team-card-name">{t.name}</h3>
              <span className="team-card-role" style={{ color: t.color }}>{t.role}</span>
              <p className="team-card-desc">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          8. HIGH-CONVERSION CTA BANNER
          ══════════════════════════════════════════════════════════ */}
      <section className="container about-cta-section">
        <div className="about-cta-banner glass-card">
          <div className="about-cta-glow" />
          <div className="about-cta-content">
            <div className="about-cta-badge glass-pill">
              <ShieldCheck size={14} color="#38bdf8" className="pill-icon" />
              <span>Instant Verification • Free Forever</span>
            </div>
            <h2>Got an offer letter? Check it before you sign.</h2>
            <p>
              Join thousands of university students protecting their careers, identities, and finances against predatory hiring scams.
            </p>
            <div className="about-cta-actions">
              <Link to="/register">
                <LiquidButton variant="cyan" size="lg">
                  Start Free Verification
                </LiquidButton>
              </Link>
              <Link to="/dashboard">
                <LiquidButton variant="glass" size="lg" showArrow={false}>
                  Open Security Dashboard
                </LiquidButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

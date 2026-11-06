import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  FileText,
  Lock,
  Cpu,
  Globe,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Terminal,
  FileCheck,
  Zap,
  Mail,
  Fingerprint,
  FileSpreadsheet,
  HelpCircle,
  Clock,
  Layers,
  Database,
  QrCode,
  Download,
  Share2,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import "./HowItWorks.css";

// ── 4 Deep Verification Stages ──
const FORENSIC_STAGES = [
  {
    id: "ingestion",
    step: "01",
    tag: "Stage 1 • Zero-Knowledge Input",
    title: "Document & Entity Ingestion",
    shortDesc: "Drop your PDF/DOCX offer letter or type any employer name.",
    icon: FileText,
    accent: "#38bdf8",
    detailTitle: "Zero-Knowledge In-Memory Parsing",
    detailDesc:
      "When you upload an offer document, our client-side OCR engine parses the raw text in volatile memory without ever saving your resume, contact info, or personal identifiers to persistent disks.",
    checks: [
      "In-memory optical character recognition (OCR) for scanned PDFs and seals",
      "Automatic redaction of applicant PII (Aadhaar, phone, home address)",
      "Extraction of compensation clauses, stipends, and mandatory fee mentions",
      "Parsing of HR email headers, corporate phone numbers, and recruiter handles",
    ],
    terminalPreview: [
      "[INFO] Parsing offer_letter_2026.pdf (1.4 MB)...",
      "[INFO] Volatile buffer initialized. Zero permanent disk writes enabled.",
      "[EXTRACT] Extracted entity: 'Apex Global Technologies Pvt Ltd'",
      "[EXTRACT] Recruiter email found: 'recruitment@apex-tech-careers.online'",
      "[ALERT] Detected potential advance fee clause: 'Mandatory laptop deposit ₹4,500'",
      "[OK] Ingestion complete in 142ms. Passing to MCA & WHOIS engines.",
    ],
  },
  {
    id: "mca",
    step: "02",
    tag: "Stage 2 • Legal Registry Check",
    title: "MCA Ministry & CIN Verification",
    shortDesc: "Validates corporate legal status against government registers.",
    icon: Building2,
    accent: "#a78bfa",
    detailTitle: "Real-Time Corporate Affairs Cross-Referencing",
    detailDesc:
      "We query official Ministry of Corporate Affairs (MCA) directories to confirm if the organization possesses a legally valid Corporate Identification Number (CIN) and active ROC filing status.",
    checks: [
      "21-digit CIN alphanumeric format & registrar checksum validation",
      "ROC status audit (Active vs Strike-Off vs Defunct vs Never Registered)",
      "Director identification number (DIN) & registered office address check",
      "Cross-referencing reported company vintage against incorporation date",
    ],
    terminalPreview: [
      "[QUERY] MCA National Registry API :: Querying 'Apex Global Technologies'...",
      "[WARN] No official 21-digit CIN matched for trading name.",
      "[FAIL] Status: UNREGISTERED ENTITY / NO ACTIVE ROC RECORD.",
      "[CROSSCHECK] Checking secondary trade registries (MSME / GSTN)...",
      "[ALERT] Found recent GST registration 12 days ago under unregistered individual.",
      "[SCORE] Corporate legitimacy penalty: -45 points applied.",
    ],
  },
  {
    id: "infrastructure",
    step: "03",
    tag: "Stage 3 • Cyber Infrastructure",
    title: "Domain Age & Mail Forensics",
    shortDesc: "Audits WHOIS tenure, typo-squatting, and email servers.",
    icon: Globe,
    accent: "#2dd4bf",
    detailTitle: "Deep Registrar & Anti-Spoofing Forensics",
    detailDesc:
      "Scammers frequently purchase disposable lookalike domains (e.g. 'infosys-campus.xyz') registered mere days before launching mass phishing campaigns against university students.",
    checks: [
      "Domain age threshold evaluation (< 90 days triggers high-risk flag)",
      "Levenshtein distance calculation to catch brand typo-squatting",
      "Authoritative MX records & corporate mail server verification",
      "Detection of public free email domains (@gmail, @outlook) in official offers",
    ],
    terminalPreview: [
      "[DNS] Querying WHOIS for domain 'apex-tech-careers.online'...",
      "[WHOIS] Creation Date: 2026-10-14 (Registered only 9 days ago!)",
      "[REGISTRAR] Privacy-masked offshore registrar detected.",
      "[MX] Mail exchanger: Free tier SMTP relay with missing SPF/DKIM flags.",
      "[DMARC] Policy: p=none (Vulnerable to spoofed executive email addresses).",
      "[SCORE] Domain infrastructure risk: CRITICAL RED FLAG (+50 Threat Index).",
    ],
  },
  {
    id: "verdict",
    step: "04",
    tag: "Stage 4 • Cryptographic Verdict",
    title: "Safety Dossier & TPO Export",
    shortDesc: "Generates an explainable score and tamper-proof PDF dossier.",
    icon: FileCheck,
    accent: "#22c55e",
    detailTitle: "Definitive Risk Scoring & Verifiable Certificates",
    detailDesc:
      "Every forensic signal is synthesized into a standardized 0–100 Threat Index. Students receive an itemized evidence dossier and a tamper-proof PDF to share directly with their Placement Cell / TPO.",
    checks: [
      "Standardized triage rating: SAFE (Green), CAUTION (Yellow), SCAM (Red)",
      "Explainable bullet points showing exact reasons for every point deduction",
      "Tamper-proof SHA-256 digital signature embedded in exportable reports",
      "Direct one-click export for college Placement Officers (TPO) & cyber portals",
    ],
    terminalPreview: [
      "[SYNTHESIS] Aggregating Stage 1 to 3 heuristic weights...",
      "[VERDICT] Calculated Scam Probability: 94.8% :: STATUS: CRITICAL RISK (RED)",
      "[EVIDENCE] 1. Unregistered entity | 2. 9-day-old domain | 3. Advance fee requested",
      "[CRYPTO] Stamped Report Hash: sha256:7f4a...9b12e",
      "[STATUS] Official Student Advisory Dossier generated successfully.",
      "[ACTION] Alert dispatched to campus threat network.",
    ],
  },
];

// ── Interactive Scam vs Legit Offer Comparison Data ──
const OFFER_SAMPLES = {
  scam: {
    badge: "🚨 High-Risk Trap Sample",
    badgeType: "scam",
    sender: "Apex Talent Group <recruitment@apex-tech-careers.online>",
    date: "Received 2 days ago via Telegram / Cold Email",
    role: "Associate Cloud Engineer (Remote)",
    stipend: "₹45,000 / month (Immediate Joining)",
    items: [
      {
        type: "danger",
        title: "Disposable Sub-domain & Free Webmail",
        desc: "Domain 'apex-tech-careers.online' registered just 9 days ago. Genuine enterprises use primary corporate domains.",
      },
      {
        type: "danger",
        title: "Mandatory Laptop Courier Fee Trap",
        desc: "Demands ₹4,500 via personal UPI handle as a 'refundable transit insurance' for work equipment before day 1.",
      },
      {
        type: "danger",
        title: "No Legal CIN or MCA Directory Match",
        desc: "Company registration number provided does not exist on the Ministry of Corporate Affairs (MCA) portal.",
      },
      {
        type: "warning",
        title: "Informal Communication Channels",
        desc: "Interview conducted entirely via Telegram text chat without any formal video panel or authenticated portal.",
      },
    ],
    verdict: "RED FLAG • 95% Scam Confidence",
    recommendation: "DO NOT pay any money. Report this recruiter immediately.",
  },
  legit: {
    badge: "✅ Verified Enterprise Sample",
    badgeType: "legit",
    sender: "Campus Hiring Team <earlycareers@tcs.com>",
    date: "Received via University Placement Portal",
    role: "System Engineer Trainee",
    stipend: "₹30,000 / month + Standard Benefits",
    items: [
      {
        type: "success",
        title: "Official Corporate Domain & SPF Validated",
        desc: "Originates from 'tcs.com' with strict DMARC, DKIM, and enterprise mail exchanger authentication.",
      },
      {
        type: "success",
        title: "Zero Upfront Fees Guarantee",
        desc: "Explicitly states no monetary security deposit, laptop charges, or document verification fees are required.",
      },
      {
        type: "success",
        title: "Active 21-Digit Corporate CIN on MCA",
        desc: "CIN verified with Ministry of Corporate Affairs, matching official registered headquarters and ROC status.",
      },
      {
        type: "success",
        title: "Authorized Campus Placement Channel",
        desc: "Offer corresponds with official college TPO drive schedules and authenticated on-campus selection list.",
      },
    ],
    verdict: "SAFE • 100% Legitimacy Verified",
    recommendation: "Safe to sign and accept through your college TPO.",
  },
};

// ── Common Trap Grid ──
const FRAUD_VECTORS = [
  {
    icon: AlertTriangle,
    tag: "Most Prevalent",
    tagColor: "rose",
    title: "The Laptop Courier & Transit Fee",
    desc: "Scammers issue a glowing offer letter and demand ₹3,000 to ₹6,000 as 'refundable transit insurance' for a work MacBook that never arrives.",
    tip: "Legitimate employers NEVER ask candidates to pay for their own work equipment or shipping.",
  },
  {
    icon: Globe,
    tag: "High Stealth",
    tagColor: "cyan",
    title: "Typo-Squatting & Lookalike Domains",
    desc: "Criminals register spoofed URLs like 'infosyss-careers.co' or 'google-intern-portal.tech' with spoofed HR signatures and stolen company logos.",
    tip: "InternShield audits WHOIS creation dates and registrar records to unmask recent domain registrations.",
  },
  {
    icon: Mail,
    tag: "Phishing Attack",
    tagColor: "purple",
    title: "The Personal Webmail Recruiter",
    desc: "Recruiters claiming to represent Fortune 500 multinationals but writing from 'company.hr.recruiting@gmail.com' or using unmonitored WhatsApp numbers.",
    tip: "Enterprise talent acquisition teams always write from authentic authenticated corporate domains.",
  },
  {
    icon: Building2,
    tag: "Ghost Entity",
    tagColor: "amber",
    title: "Unregistered Shell 'LLCs'",
    desc: "Fictitious companies claiming corporate status with forged signatures and fake GST numbers that fail national Ministry of Corporate Affairs checks.",
    tip: "Our platform checks CIN numbers directly against the government registrar in sub-second queries.",
  },
  {
    icon: Fingerprint,
    tag: "Financial Extortion",
    tagColor: "emerald",
    title: "Paid Training & LMS Portal Traps",
    desc: "Offer letters conditioned upon the student purchasing an expensive mandatory 'training certification' or LMS seat license prior to onboarding.",
    tip: "Legitimate internships invest in training you; they never require you to buy internal certificates.",
  },
  {
    icon: Zap,
    tag: "Micro-Task Bait",
    tagColor: "cyan",
    title: "Telegram / WhatsApp Task Rings",
    desc: "Promises of ₹2,000/day for liking videos or rating apps, starting with small payouts to build trust before trapping you in prepaid task schemes.",
    tip: "Never engage with unverified telegram recruiting handles or payment tasks.",
  },
];

// ── FAQ Items ──
const FAQS = [
  {
    q: "Do you store or sell my uploaded offer letter or personal resume?",
    a: "Absolutely not. InternShield operates on a strict zero-knowledge architecture. Uploaded PDFs and text inputs are parsed in volatile RAM only to extract forensic indicators (domain, CIN, fee clauses) and are immediately scrubbed. We never retain student resumes, addresses, or identity documents.",
  },
  {
    q: "How does InternShield verify Ministry of Corporate Affairs (MCA) records?",
    a: "We cross-reference company names and Corporate Identification Numbers (CIN) against the official national corporate registry. This confirms active legal incorporation status, registered office jurisdiction, director credentials, and filing recency.",
  },
  {
    q: "Can I submit the InternShield Safety Dossier to my college TPO?",
    a: "Yes! Every verification report includes an exportable, tamper-proof PDF with an SHA-256 cryptographic stamp and itemized evidence points specifically formatted for university Placement Cells and Training & Placement Officers (TPOs).",
  },
  {
    q: "What if the company is an early-stage startup or international remote company?",
    a: "Our multi-vector intelligence balances MCA registration with international domain tenure, founder presence, corporate DNS infrastructure, and community reports so that genuine early-stage startups are not penalized unfairly while disposable scam domains are instantly caught.",
  },
  {
    q: "Is InternShield completely free for college students?",
    a: "Yes. Basic verification, domain intelligence lookups, and offer letter scans are 100% free for all students and university placement cells.",
  },
];

/**
 * HowItWorks — Comprehensive Dedicated Page for InternShield Verification Protocol
 */
export default function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0);
  const [sampleTab, setSampleTab] = useState("scam");
  const [openFaq, setOpenFaq] = useState(0);

  const currentStage = FORENSIC_STAGES[activeStage];
  const sample = OFFER_SAMPLES[sampleTab];

  return (
    <div className="how-page">
      <AnimatedBackground />
      <Navbar />

      <main className="how-main">
        {/* ═══════════════════════════════════════
            1. HERO SECTION
            ═══════════════════════════════════════ */}
        <section className="how-hero container">
          <div className="how-hero__content">
            <motion.div
              className="glass-pill how-hero__badge"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Sparkles size={14} color="#38bdf8" />
              <span>InternShield Threat Forensics Engine v2.6</span>
            </motion.div>

            <motion.h1
              className="how-hero__title"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              How InternShield <span className="text-cyan">Works</span>
            </motion.h1>

            <motion.p
              className="how-hero__subtitle"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A transparent look into our 4-stage forensics architecture. We cross-examine government corporate registers, domain tenures, and AI red-flag indicators to safeguard students from fraudulent recruitment schemes.
            </motion.p>

            <motion.div
              className="how-hero__actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/dashboard">
                <LiquidButton variant="solid" size="lg">
                  Verify an Offer Now
                </LiquidButton>
              </Link>
              <Link to="/register">
                <LiquidButton variant="secondary" size="lg">
                  Create Student Account
                </LiquidButton>
              </Link>
            </motion.div>

            {/* Quick Stat Chips */}
            <motion.div
              className="how-hero__chips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="how-chip glass-pill">
                <Clock size={13} color="#38bdf8" />
                <span>&lt; 2.8s Deep Scan</span>
              </div>
              <div className="how-chip glass-pill">
                <Lock size={13} color="#a78bfa" />
                <span>Zero-Knowledge In-Memory</span>
              </div>
              <div className="how-chip glass-pill">
                <Building2 size={13} color="#2dd4bf" />
                <span>Direct MCA Registry Link</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            2. INTERACTIVE 4-STAGE PIPELINE
            ═══════════════════════════════════════ */}
        <section className="how-pipeline container">
          <div className="section-header">
            <span className="section-tag">Step-by-Step Architecture</span>
            <h2 className="section-title">The Four-Stage Forensic Pipeline</h2>
            <p className="section-subtitle">
              Click through the stages below to see how our engine transforms an unverified offer document into an authenticated risk verdict.
            </p>
          </div>

          {/* Stage Selector Tabs */}
          <div className="how-stage-tabs">
            {FORENSIC_STAGES.map((stg, idx) => {
              const Icon = stg.icon;
              const isActive = activeStage === idx;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`how-stage-tab glass-card ${isActive ? "how-stage-tab--active" : ""}`}
                >
                  <div className="how-stage-tab__header">
                    <span className="how-stage-tab__num" style={{ color: stg.accent }}>
                      {stg.step}
                    </span>
                    <div
                      className="how-stage-tab__icon"
                      style={{
                        background: isActive ? `${stg.accent}25` : "rgba(255,255,255,0.04)",
                        color: stg.accent,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                  <h4 className="how-stage-tab__title">{stg.title}</h4>
                  <p className="how-stage-tab__desc">{stg.shortDesc}</p>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep-Dive Console */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              className="how-stage-console glass-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left Column: Explanations & Checklist */}
              <div className="how-console__info">
                <div className="how-console__badge glass-pill" style={{ borderColor: `${currentStage.accent}40` }}>
                  <span style={{ color: currentStage.accent }}>{currentStage.tag}</span>
                </div>
                <h3 className="how-console__title">{currentStage.detailTitle}</h3>
                <p className="how-console__text">{currentStage.detailDesc}</p>

                <div className="how-console__checklist">
                  <h5 className="how-checklist__header">Forensic Verification Checks:</h5>
                  <ul>
                    {currentStage.checks.map((chk, i) => (
                      <li key={i}>
                        <CheckCircle2 size={16} color={currentStage.accent} className="chk-icon" />
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Simulated Forensic Terminal Stream */}
              <div className="how-console__terminal">
                <div className="terminal-topbar">
                  <div className="terminal-dots">
                    <span className="dot dot--red" />
                    <span className="dot dot--yellow" />
                    <span className="dot dot--green" />
                  </div>
                  <span className="terminal-title">internshield-forensics-core // {currentStage.id}</span>
                </div>

                <div className="terminal-body font-mono">
                  {currentStage.terminalPreview.map((line, i) => (
                    <div key={i} className="terminal-line">
                      <span className="line-num">{i + 1}</span>
                      <span className="line-content">{line}</span>
                    </div>
                  ))}
                  <div className="terminal-cursor-line">
                    <span className="line-num">{currentStage.terminalPreview.length + 1}</span>
                    <span className="terminal-cursor">_</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ═══════════════════════════════════════
            3. INTERACTIVE ANATOMY: SCAM VS LEGIT
            ═══════════════════════════════════════ */}
        <section className="how-anatomy container">
          <div className="section-header">
            <span className="section-tag">Interactive Anatomy</span>
            <h2 className="section-title">Scam Offer vs. Verified Enterprise</h2>
            <p className="section-subtitle">
              Inspect how the InternShield engine flags telltale deception signals in a fraudulent job offer compared to an authentic placement letter.
            </p>
          </div>

          {/* Toggle Pills */}
          <div className="how-anatomy__toggle">
            <button
              type="button"
              className={`toggle-btn ${sampleTab === "scam" ? "toggle-btn--active toggle-btn--scam" : ""}`}
              onClick={() => setSampleTab("scam")}
            >
              <ShieldAlert size={16} />
              <span>Flagged Scam Offer (Red Flags)</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${sampleTab === "legit" ? "toggle-btn--active toggle-btn--legit" : ""}`}
              onClick={() => setSampleTab("legit")}
            >
              <ShieldCheck size={16} />
              <span>Verified Enterprise Offer (Clean)</span>
            </button>
          </div>

          {/* Sample Offer Forensic Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={sampleTab}
              className={`how-offer-card glass-card ${sampleTab === "scam" ? "border-danger" : "border-success"}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="offer-header">
                <div>
                  <div
                    className={`offer-badge glass-pill ${
                      sampleTab === "scam" ? "badge--danger" : "badge--success"
                    }`}
                  >
                    {sample.badge}
                  </div>
                  <h3 className="offer-role">{sample.role}</h3>
                  <div className="offer-meta">
                    <span>{sample.sender}</span>
                    <span className="meta-sep">•</span>
                    <span>{sample.date}</span>
                  </div>
                </div>

                <div className="offer-compensation">
                  <span className="comp-label">Offered Compensation</span>
                  <span className="comp-value">{sample.stipend}</span>
                </div>
              </div>

              {/* Forensic Callout Grid */}
              <div className="offer-forensics-grid">
                {sample.items.map((item, idx) => (
                  <div key={idx} className={`forensic-point forensic-point--${item.type}`}>
                    <div className="point-header">
                      {item.type === "danger" && <XCircle size={18} color="#f43f5e" />}
                      {item.type === "warning" && <AlertTriangle size={18} color="#f59e0b" />}
                      {item.type === "success" && <CheckCircle2 size={18} color="#22c55e" />}
                      <h4>{item.title}</h4>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bottom Verdict Strip */}
              <div className="offer-verdict-strip">
                <div className="verdict-info">
                  <span className="verdict-label">InternShield Risk Engine Score:</span>
                  <span className={`verdict-score ${sampleTab === "scam" ? "text-danger" : "text-success"}`}>
                    {sample.verdict}
                  </span>
                </div>
                <div className="verdict-action">
                  <span>{sample.recommendation}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ═══════════════════════════════════════
            4. COMMON SCAM TRAP MATRIX
            ═══════════════════════════════════════ */}
        <section className="how-vectors container">
          <div className="section-header">
            <span className="section-tag">Threat Knowledgebase</span>
            <h2 className="section-title">Scam Vectors We Actively Intercept</h2>
            <p className="section-subtitle">
              Over 2,400+ recruitment fraud templates circulate through WhatsApp, LinkedIn, and Telegram. Here are the most prevalent entrapment models caught daily.
            </p>
          </div>

          <div className="vectors-grid">
            {FRAUD_VECTORS.map((vec, i) => {
              const Icon = vec.icon;
              return (
                <motion.div
                  key={vec.title}
                  className="vector-card glass-card"
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="vector-card__top">
                    <div className="vector-card__icon">
                      <Icon size={20} />
                    </div>
                    <span className={`vector-tag vector-tag--${vec.tagColor}`}>
                      {vec.tag}
                    </span>
                  </div>

                  <h3 className="vector-card__title">{vec.title}</h3>
                  <p className="vector-card__desc">{vec.desc}</p>

                  <div className="vector-card__tip">
                    <span className="tip-badge">Security Guardrail:</span>
                    <p>{vec.tip}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            5. TPO & UNIVERSITY CERTIFICATE STRIP
            ═══════════════════════════════════════ */}
        <section className="how-tpo container">
          <div className="tpo-card glass-card">
            <div className="tpo-content">
              <div className="glass-pill tpo-pill">
                <FileCheck size={14} color="#22c55e" />
                <span>University Placement Cell Compliant</span>
              </div>
              <h2 className="tpo-title">
                Export Tamper-Proof Dossiers for Your College TPO
              </h2>
              <p className="tpo-text">
                Need to prove to your campus Placement Officer that a company is fraudulent? InternShield produces a digitally signed PDF with full forensic traces, timestamped WHOIS dumps, and MCA registration status that Placement Cells accept without question.
              </p>
              <div className="tpo-features">
                <div className="tpo-feat">
                  <QrCode size={16} color="#38bdf8" />
                  <span>Verifiable Verification Hash</span>
                </div>
                <div className="tpo-feat">
                  <Download size={16} color="#a78bfa" />
                  <span>Instant 1-Click PDF Export</span>
                </div>
                <div className="tpo-feat">
                  <ShieldCheck size={16} color="#2dd4bf" />
                  <span>Legally Formatted Evidence</span>
                </div>
              </div>
            </div>

            <div className="tpo-mock">
              <div className="mock-dossier glass-card">
                <div className="mock-dossier__badge">OFFICIAL VERDICT</div>
                <div className="mock-dossier__title">InternShield Verification Dossier</div>
                <div className="mock-dossier__meta">Audit ID: #IS-2026-9048-VERIFIED</div>
                <div className="mock-dossier__bar">
                  <span className="bar-fill" />
                </div>
                <div className="mock-dossier__status">
                  <span className="status-dot-green" />
                  <span>Cryptographically Validated</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            6. FREQUENTLY ASKED QUESTIONS (FAQ)
            ═══════════════════════════════════════ */}
        <section className="how-faq container">
          <div className="section-header">
            <span className="section-tag">Student FAQ</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Common questions about security, data privacy, and verification accuracy.
            </p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`faq-item glass-card ${isOpen ? "faq-item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`faq-arrow ${isOpen ? "faq-arrow--rotated" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="faq-answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            7. CALL TO ACTION BANNER
            ═══════════════════════════════════════ */}
        <section className="how-cta container">
          <div className="how-cta__card glass-card">
            <div className="how-cta__glow" aria-hidden="true" />
            <h2 className="how-cta__title">
              Ready to Verify Your Internship Offer?
            </h2>
            <p className="how-cta__desc">
              Join thousands of college students ensuring their career begins safely. Zero fees, zero logs, instant peace of mind.
            </p>
            <div className="how-cta__buttons">
              <Link to="/dashboard">
                <LiquidButton variant="solid" size="lg">
                  Launch Live Verification Scanner
                </LiquidButton>
              </Link>
              <Link to="/about">
                <LiquidButton variant="secondary" size="lg">
                  Learn About Our Mission
                </LiquidButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

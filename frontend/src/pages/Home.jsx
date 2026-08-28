import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  FileText,
  Users,
  ChevronRight,
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
  "Identity.",
  "Opportunities.",
  "Trust.",
];

// ── Features list ──
const FEATURES = [
  {
    icon: Search,
    title: "Company Verification",
    text: "Search any company and instantly see the evidence InternShield has collected — website, domain, and record checks.",
    color: "#38bdf8",
  },
  {
    icon: FileText,
    title: "Offer Red-Flag Detection",
    text: "Upload an offer letter and we scan it for suspicious payment requests, mismatched details, and unusual contact methods.",
    color: "#a78bfa",
  },
  {
    icon: Users,
    title: "Student Reviews & Reports",
    text: "Read verified student feedback and report suspicious offers so the next student is warned in time.",
    color: "#2dd4bf",
  },
];

// ── 3D Lock Illustration Component ──
function Lock3D() {
  return (
    <div className="lock3d-wrap">
      {/* Background glow layers */}
      <div className="lock3d-glow lock3d-glow--1" />
      <div className="lock3d-glow lock3d-glow--2" />

      {/* Main Lock Card with Liquid Glass */}
      <motion.div
        className="lock3d-card glass"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="lock3d-shackle" />
        <div className="lock3d-body">
          <div className="lock3d-keyhole">
            <div className="lock3d-keyhole-circle" />
            <div className="lock3d-keyhole-stem" />
          </div>
          <div className="lock3d-pulse" />
        </div>
      </motion.div>
    </div>
  );
}

// ── Isometric Geometric Accent Blocks ──
function IsoBlocks() {
  return (
    <div className="iso-blocks" aria-hidden="true">
      <div className="iso-block iso-block--1" />
      <div className="iso-block iso-block--2" />
      <div className="iso-block iso-block--3" />
      <svg className="iso-wires" viewBox="0 0 200 200" fill="none">
        <line x1="30" y1="30" x2="160" y2="30" stroke="rgba(124,58,237,0.3)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1="30" y1="90" x2="90" y2="55" stroke="rgba(0,229,255,0.3)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line x1="30" y1="90" x2="155" y2="90" stroke="rgba(124,58,237,0.25)" strokeWidth="1" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="2s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const featuresRef = useScrollReveal();
  const howRef = useScrollReveal();
  const statsRef = useScrollReveal();

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

  return (
    <div className="page">
      <AnimatedBackground />
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero container">
        {/* Left — Copy */}
        <motion.div
          className="hero__left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="hero__eyebrow glass-pill">
            <ShieldCheck size={14} color="var(--color-success)" />
            Student Safety Network
          </span>

          <h1 className="hero__title">
            <span className="hero__title-highlight text-cyan">Protect </span>
            <span className="hero__title-white">Your</span>
            <br />
            <span className="hero__title-white">
              <TypingText phrases={HERO_PHRASES} />
            </span>
          </h1>

          <p className="hero__subtitle">
            InternShield collects company and offer evidence, checks it against known warning
            signs, and gives you a clear risk result — before you share your details or pay a rupee.
          </p>

          <div className="hero__ctas">
            <LiquidButton
              variant="cyan"
              size="lg"
              onClick={handlePrimaryCta}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
            </LiquidButton>
            <LiquidButton
              variant="ghost"
              size="lg"
              showArrow={false}
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn more
            </LiquidButton>
          </div>

          <div className="hero__stats glass-pill">
            <div className="hero__stat">
              <strong>98/100</strong>
              <span>Trust engine</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>&lt;10 sec</strong>
              <span>Verification target</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <strong>Privacy-first</strong>
              <span>Student control</span>
            </div>
          </div>
        </motion.div>

        {/* Right — 3D Isometric Cyber Scene (4 Nodes & Standing Lock) */}
        <motion.div
          className="hero__right"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        >
          <IsometricCyberScene />
        </motion.div>
      </section>

      {/* ═══════════════ BOTTOM BANNER ═══════════════ */}
      <section className="hero-banner container">
        <div className="hero-banner__inner glass-card">
          <div className="hero-banner__icon-wrap">
            <div className="hero-banner__shield-bg" />
            <ShieldCheck size={52} color="white" strokeWidth={1.5} className="hero-banner__shield" />
          </div>
          <div className="hero-banner__text">
            <p>
              Our service aims to reduce the risk of fraudulent internship offers and protect against
              the unauthorised exploitation of students, networks and opportunities.
            </p>
            <button className="hero-banner__link" onClick={handlePrimaryCta}>
              Learn more <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="container features" ref={featuresRef}>
        <h2 className="section-title reveal">
          What <span className="text-cyan">InternShield</span> checks for you
        </h2>
        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card feature-card reveal"
              style={{ transitionDelay: `${i * 0.12}s` }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
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

      {/* ═══════════════ HOW IT WORKS + STATS ═══════════════ */}
      <section id="how-it-works" className="container combined-section" ref={howRef}>
        <div className="how-it-works">
          <h2 className="section-title reveal">How it <span className="text-cyan">works</span></h2>
          <div className="how-it-works__steps">
            {[
              ["01", "Enter a company", "Search by name or paste the website URL you were given."],
              ["02", "We gather evidence", "Domain checks, records, reviews and reports are pulled together instantly."],
              ["03", "See your risk result", "A clear GREEN / YELLOW / RED result — with the reasons behind it."],
            ].map(([num, title, text]) => (
              <motion.div
                key={num}
                className="how-it-works__step glass-card reveal"
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="how-it-works__num">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="stats-section" ref={statsRef}>
          <div className="stats-grid">
            {[
              ["10,000+", "Students Protected"],
              ["5,000+", "Companies Verified"],
              ["2,400+", "Red Flags Caught"],
              ["98%", "Accuracy Rate"],
            ].map(([num, label]) => (
              <motion.div
                key={label}
                className="stat-card glass-card reveal"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <strong>{num}</strong>
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ LIQUID FOOTER ═══════════════ */}
      <Footer />
    </div>
  );
}

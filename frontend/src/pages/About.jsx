import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Target,
  Users,
  Eye,
  Award,
  Zap,
  BookOpen,
} from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import "./About.css";

const VALUES = [
  {
    icon: Eye,
    label: "Transparency First",
    desc: "We tell you exactly what data we looked at, what passed, and what failed. No black-box scores.",
  },
  {
    icon: Users,
    label: "Student-Powered",
    desc: "Real students report scam patterns so the entire community stays protected in real time.",
  },
  {
    icon: Zap,
    label: "Speed Matters",
    desc: "Scammers create urgency. We return verification results within seconds so you never miss a real opportunity.",
  },
  {
    icon: Award,
    label: "Zero Exploitation",
    desc: "InternShield will never charge students to verify an offer. This tool is, and will always be, free.",
  },
];

const TIMELINE = [
  {
    year: "2024",
    title: "The Idea",
    desc: "Built after multiple students at our university fell for fraudulent internship offers asking for advance fees.",
  },
  {
    year: "2025",
    title: "V1 Launch",
    desc: "Released domain verification, red-flag heuristics, and the student review database.",
  },
  {
    year: "2026",
    title: "AI Threat Engine",
    desc: "Integrated real-time document OCR, NLP offer-letter scanning, and automated registrar checks.",
  },
];

const TEAM = [
  {
    name: "Alex Chen",
    role: "Co-founder & Security Lead",
    desc: "Former cybersecurity researcher passionate about defending early-career developers.",
    icon: ShieldCheck,
    color: "#38bdf8",
  },
  {
    name: "Priya Sharma",
    role: "Co-founder & ML Engineer",
    desc: "Specialises in NLP models that detect deceptive patterns in job descriptions and offers.",
    icon: Zap,
    color: "#a78bfa",
  },
  {
    name: "Marcus Vance",
    role: "Community & Policy Lead",
    desc: "Works directly with university career centres and student advocates to surface new threat signals.",
    icon: BookOpen,
    color: "#2dd4bf",
  },
];

export default function About() {
  const missionRef = useScrollReveal();
  const valuesRef = useScrollReveal();
  const storyRef = useScrollReveal();
  const teamRef = useScrollReveal();

  return (
    <div className="page about-page">
      <AnimatedBackground />
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="container about-hero">
        <motion.div
          className="about-hero__content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="hero__eyebrow glass-pill">
            <Award size={14} color="var(--color-accent)" />
            Our Story
          </span>
          <h1>
            Securing <span className="text-cyan">Internship</span> Futures.
          </h1>
          <p>
            InternShield was built by students, for students. We understand how terrifying it is to
            receive an offer you can't fully trust — so we built the tool we wish we'd had.
          </p>
        </motion.div>

        <motion.div
          className="about-hero__visual"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        >
          <div className="about-hero__shield-wrap">
            <div className="about-hero__shield-glow" />
            <div className="about-hero__shield glass">
              <ShieldCheck size={56} color="#ffffff" strokeWidth={1.4} />
            </div>
          </div>
          <div className="about-orbit about-orbit--1">
            <span className="about-orbit__dot about-orbit__dot--1" />
          </div>
          <div className="about-orbit about-orbit--2">
            <span className="about-orbit__dot about-orbit__dot--2" />
          </div>
        </motion.div>
      </section>

      {/* ═══════ MISSION ═══════ */}
      <section className="container about-mission" ref={missionRef}>
        <div className="about-mission__card glass-card reveal">
          <Target size={28} color="var(--color-accent)" />
          <div>
            <h2>Our Mission</h2>
            <p>
              To ensure that no student loses money, time, or opportunity to a fraudulent internship.
              We do this by making verification instant, free, and privacy-respecting — powered by
              community intelligence and AI-driven analysis.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ VALUES ═══════ */}
      <section className="container about-values" ref={valuesRef}>
        <h2 className="section-title reveal">What we <span className="text-cyan">stand for</span></h2>
        <div className="about-values__grid">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.label}
              className="about-value-card glass-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="about-value-card__icon">
                <v.icon size={20} color="var(--color-accent)" />
              </div>
              <h3>{v.label}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ TIMELINE / STORY ═══════ */}
      <section className="container about-story" ref={storyRef}>
        <h2 className="section-title reveal">How we <span className="text-cyan">got here</span></h2>
        <div className="about-timeline">
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              className="about-timeline__item reveal"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="about-timeline__year-pill glass-pill">{item.year}</div>
              <div className="about-timeline__body glass-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ TEAM ═══════ */}
      <section className="container about-team" ref={teamRef}>
        <h2 className="section-title reveal">Who <span className="text-cyan">we are</span></h2>
        <div className="about-team__grid">
          {TEAM.map((t, i) => (
            <motion.div
              key={t.name}
              className="team-card glass-card reveal"
              style={{ transitionDelay: `${i * 0.12}s`, "--team-color": t.color }}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="team-card__icon">
                <t.icon size={22} color={t.color} />
              </div>
              <h3>{t.name}</h3>
              <span className="team-card__role">{t.role}</span>
              <p>{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="container about-cta">
        <div className="about-cta__card glass-card">
          <h2>Ready to protect yourself?</h2>
          <p>Join 10,000+ students who verify before they trust.</p>
          <div style={{ marginTop: 24 }}>
            <Link to="/register">
              <LiquidButton variant="cyan" size="lg">
                Get Started — It's Free
              </LiquidButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ VISCOUS FOOTER ═══════ */}
      <Footer />
    </div>
  );
}

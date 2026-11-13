import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import "./About.css";

const PRINCIPLES = [
  {
    title: "Student safety",
    text: "Help students pause and check an opportunity before sharing personal information or paying fees.",
  },
  {
    title: "Clear signals",
    text: "Present useful risk indicators in a way that is easier to understand and follow up on.",
  },
  {
    title: "Your judgment matters",
    text: "Use a check as guidance—not as a guarantee. Confirm important details with the company through its official channels.",
  },
];

export default function About() {
  return (
    <div className="page about-page">
      <AnimatedBackground />
      <Navbar />
      <main>
        <section className="container about-hero about-hero--simple">
          <div className="about-hero__content">
            <div className="about-hero__eyebrow glass-pill">
              <ShieldCheck size={14} aria-hidden="true" />
              About InternShield
            </div>
            <h1 className="about-hero__title">
              Helping students make <span className="text-cyan">safer choices</span>.
            </h1>
            <p className="about-hero__subtitle">
              InternShield is a student-focused platform for reviewing internship companies and
              offers for potential warning signs.
            </p>
            <div className="about-hero__cta-group">
              <Link to="/how-it-works">
                <LiquidButton variant="cyan" size="md">How it works</LiquidButton>
              </Link>
              <Link to="/dashboard">
                <LiquidButton variant="glass" size="md" showArrow={false}>Open dashboard</LiquidButton>
              </Link>
            </div>
          </div>
        </section>

        <section className="container concise-info-section" aria-labelledby="principles-title">
          <div className="section-header">
            <h2 id="principles-title">What we stand for</h2>
          </div>
          <div className="concise-info-grid">
            {PRINCIPLES.map((item) => (
              <article className="glass-card concise-info-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

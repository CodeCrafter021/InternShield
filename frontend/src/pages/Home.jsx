import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, FileText, Lock, Search, ShieldCheck } from "lucide-react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Navbar from "../components/Navbar.jsx";
import LiquidButton from "../components/LiquidButton.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "./Home.css";

const FEATURES = [
  {
    icon: Building2,
    title: "Check a company",
    text: "Review available company and website details before trusting an opportunity.",
  },
  {
    icon: FileText,
    title: "Review an offer",
    text: "Look for warning signs such as upfront fees or unusual requests in an internship offer.",
  },
  {
    icon: Lock,
    title: "Make an informed choice",
    text: "See the available risk information and decide what to verify next.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [company, setCompany] = useState("");

  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (!scrollTo) return;

    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState({}, document.title);
  }, [location.state]);

  function openDashboard(search = "") {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    const query = search.trim();
    navigate(query ? `/dashboard?search=${encodeURIComponent(query)}` : "/dashboard");
  }

  function handleSearch(event) {
    event.preventDefault();
    if (company.trim()) openDashboard(company);
  }

  return (
    <div className="page">
      <AnimatedBackground />
      <Navbar />

      <main>
        <section className="hero hero--static container">
          <motion.div
            className="hero__left"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="hero__eyebrow-wrap">
              <span className="hero__eyebrow glass-pill">
                <ShieldCheck size={14} color="#22c55e" />
                Internship checks, made clearer
              </span>
            </div>

            <h1 className="hero__title">
              <span className="hero__title-highlight text-cyan">Check </span>
              <span className="hero__title-white">before you</span>
              <br />
              <span className="hero__title-white">trust an offer.</span>
            </h1>

            <p className="hero__subtitle">
              InternShield helps students review internship companies and offers for possible
              warning signs—so they can make a more informed decision.
            </p>

            <form onSubmit={handleSearch} className="hero-search-bar">
              <Search size={18} color="#38bdf8" aria-hidden="true" />
              <input
                type="text"
                aria-label="Company name"
                placeholder="Enter a company name"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
              <LiquidButton variant="cyan" size="sm" type="submit" showArrow={false}>
                Check
              </LiquidButton>
            </form>

            <div className="hero__ctas">
              <LiquidButton variant="ghost" size="md" onClick={() => navigate("/how-it-works")}>
                How it works
              </LiquidButton>
            </div>
          </motion.div>
        </section>

        <section className="container home-summary-section" aria-labelledby="features-title">
          <div className="section-header">
            <h2 id="features-title">
              A clearer way to review <span className="text-cyan">internship offers</span>
            </h2>
            <p>Focus on the details that matter before you share information or pay a fee.</p>
          </div>
          <div className="features__grid">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <article className="glass-card feature-card" key={title}>
                <div className="feature-card__icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container home-summary-section" aria-labelledby="steps-title">
          <div className="section-header">
            <h2 id="steps-title">Three simple steps</h2>
          </div>
          <ol className="home-steps glass">
            <li><span>1</span> Enter a company name or review an offer in your dashboard.</li>
            <li><span>2</span> Check the available information and any warning signs.</li>
            <li><span>3</span> Verify important details directly before taking action.</li>
          </ol>
        </section>

        <section className="container final-cta-section">
          <div className="final-cta-card glass">
            <h2>Have an internship offer?</h2>
            <p>Review it before you commit, share personal details, or send money.</p>
            <div className="final-cta-buttons">
              <LiquidButton variant="cyan" size="lg" onClick={() => openDashboard()}>
                {isAuthenticated ? "Open dashboard" : "Get started"}
              </LiquidButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

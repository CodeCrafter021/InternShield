import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Heart,
  Lock,
} from "lucide-react";
import "./Footer.css";

/**
 * Footer — Ultra-Attractive Apple iOS 26 Liquid Glass Footer
 * Features:
 * - Full-width wide container with multi-layer SVG viscous liquid waves
 * - Trust feature badges (256-bit encrypted, zero logs, open intelligence)
 * - 4 organized navigation columns
 * - Perfectly centered, glossy social liquid pills
 * - Refined legal and status bar
 */
export default function Footer() {
  return (
    <footer className="liquid-footer">
      {/* ── Multi-Layer SVG Liquid Wave Transition ── */}
      <div className="liquid-footer__waves" aria-hidden="true">
        <svg
          className="liquid-footer__wave-svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="footerWaveGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
              <stop offset="50%" stopColor="rgba(56, 189, 248, 0.18)" />
              <stop offset="100%" stopColor="rgba(45, 212, 191, 0.15)" />
            </linearGradient>
            <linearGradient id="footerWaveGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.12)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.12)" />
              <stop offset="100%" stopColor="rgba(10, 16, 32, 0.9)" />
            </linearGradient>
          </defs>

          {/* Deep Viscous Wave Layer */}
          <path
            className="liquid-footer__wave-path liquid-footer__wave-path--1"
            fill="url(#footerWaveGrad1)"
            d="M0,32 C360,95 540,-15 900,45 C1260,105 1380,20 1440,32 L1440,120 L0,120 Z"
          />

          {/* Middle Fluid Wave Layer */}
          <path
            className="liquid-footer__wave-path liquid-footer__wave-path--2"
            fill="url(#footerWaveGrad2)"
            d="M0,64 C420,10 600,110 1020,50 C1320,10 1380,80 1440,64 L1440,120 L0,120 Z"
          />

          {/* Foreground Dark Glass Wave */}
          <path
            className="liquid-footer__wave-path liquid-footer__wave-path--3"
            fill="rgba(6, 10, 20, 0.96)"
            d="M0,75 C320,40 680,105 1060,60 C1280,30 1380,85 1440,75 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className="liquid-footer__inner">
        {/* ── Main 4-Column Grid ── */}
        <div className="liquid-footer__grid">
          {/* Brand Column */}
          <div className="liquid-footer__brand-col">
            <Link to="/" className="liquid-footer__brand">
              <motion.div
                className="liquid-footer__brand-icon"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <ShieldCheck size={24} strokeWidth={2.2} />
              </motion.div>
              <div className="liquid-footer__brand-text">
                <span className="liquid-footer__brand-title">InternShield</span>
                <div className="liquid-footer__brand-sub">
                  <Lock size={12} color="#38bdf8" />
                  <span>Zero Private Data Retention</span>
                </div>
              </div>
            </Link>

            <p className="liquid-footer__tagline">
              The AI-powered student cybersecurity network detecting fraudulent offers, lookalike domains, and unauthorized recruiters.
            </p>

            <div className="liquid-footer__status-badge glass-pill">
              <span className="liquid-footer__status-dot" />
              <span>AI Threat Engine v2.6 • Active Protection</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div className="liquid-footer__col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/about">About Mission</Link></li>
              <li><Link to="/dashboard">Security Dashboard</Link></li>
              <li><Link to="/login">Sign In / Register</Link></li>
              <li><Link to="/register">Create Student Account</Link></li>
            </ul>
          </div>

          {/* Column 2: Security Engine */}
          <div className="liquid-footer__col">
            <h4>Security Tools</h4>
            <ul>
              <li><Link to="/dashboard">Domain Intelligence Check</Link></li>
              <li><Link to="/dashboard">AI Offer Letter Scanner</Link></li>
              <li><Link to="/dashboard">Live Student Threat Radar</Link></li>
              <li><Link to="/about">Cryptographic Heuristics</Link></li>
              <li><Link to="/about">Campus Threat Prevention</Link></li>
            </ul>
          </div>

          {/* Column 3: Community & Social Connect */}
          <div className="liquid-footer__col">
            <h4>Connect & Community</h4>
            <p className="liquid-footer__col-desc">
              Join thousands of developers and university students keeping hiring transparent.
            </p>

            {/* Social Pills */}
            <div className="liquid-footer__socials">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="GitHub"
              >
                <div className="social-pill__icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </div>
                <span>GitHub</span>
              </motion.a>

              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Twitter / X"
              >
                <div className="social-pill__icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                </div>
                <span>Twitter</span>
              </motion.a>

              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="LinkedIn"
              >
                <div className="social-pill__icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </div>
                <span>LinkedIn</span>
              </motion.a>

              <motion.a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Discord Community"
              >
                <div className="social-pill__icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                  </svg>
                </div>
                <span>Discord</span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* ── Bottom Legal & Copyright Strip ── */}
        <div className="liquid-footer__bottom">
          <div className="liquid-footer__copyright">
            <span className="copyright-text">© {new Date().getFullYear()} InternShield. All rights reserved.</span>
            <div className="liquid-footer__legal-links">
              <Link to="/about">Privacy Policy</Link>
              <span className="footer-dot">•</span>
              <Link to="/about">Terms of Service</Link>
              <span className="footer-dot">•</span>
              <Link to="/about">Security Disclosure</Link>
              <span className="footer-dot">•</span>
              <Link to="/dashboard">System Status</Link>
            </div>
          </div>

          <div className="liquid-footer__made-with">
            <span>Crafted with</span>
            <Heart size={14} className="liquid-footer__heart" fill="#f43f5e" />
            <span>for students worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

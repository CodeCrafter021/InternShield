import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="liquid-footer liquid-footer--simple">
      <div className="liquid-footer__inner">
        <Link to="/" className="liquid-footer__brand">
          <span className="liquid-footer__brand-icon">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <span className="liquid-footer__brand-title">InternShield</span>
        </Link>
        <nav className="liquid-footer__simple-links" aria-label="Footer navigation">
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <p className="liquid-footer__simple-copy">
          Review internship opportunities with care. Always verify important details independently.
        </p>
        <div className="liquid-footer__bottom">
          <span className="copyright-text">© {new Date().getFullYear()} InternShield</span>
        </div>
      </div>
    </footer>
  );
}

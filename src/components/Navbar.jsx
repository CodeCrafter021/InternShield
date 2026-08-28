import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ShieldCheck, Menu, X, Sparkles, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LiquidButton from "./LiquidButton.jsx";
import "./Navbar.css";

/**
 * Navbar — Apple iOS 26 Floating Dynamic Island Header
 * Expands, contracts, and morphs with organic fluid springs on scroll and state changes.
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ── High-performance scroll tracking using requestAnimationFrame ──
  const [scrollDir, setScrollDir] = useState("up");
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled(y > 50);

          if (y > lastY + 8) {
            setScrollDir("down");
          } else if (y < lastY - 8) {
            setScrollDir("up");
          }
          setLastY(y);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  const shouldHide = scrollDir === "down" && lastY > 320 && !open;

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleHowItWorks() {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    } else {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <div className="dynamic-island-veil" aria-hidden="true" />
      <motion.header
        className={`dynamic-island ${isScrolled ? "dynamic-island--scrolled" : ""}`}
        initial={{ y: -70, opacity: 0 }}
        animate={{
          y: shouldHide ? -90 : 0,
          opacity: shouldHide ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
      {/* Specular Liquid Light Sheen */}
      <div className="dynamic-island__sheen" aria-hidden="true" />

      {/* Brand Emblem */}
      <Link to="/" className="dynamic-island__brand" onClick={() => setOpen(false)}>
        <motion.div
          className="dynamic-island__brand-icon"
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <ShieldCheck size={20} strokeWidth={2.2} />
        </motion.div>
        <span className="dynamic-island__brand-name">InternShield</span>

        {/* Live Status Pill when scrolled (Dynamic Island Feature) */}
        <AnimatePresence>
          {isScrolled && (
            <motion.span
              className="dynamic-island__status-pill"
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="dynamic-island__status-dot" />
              <span>Shield Active</span>
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Nav Links with Fluid Active Pill Indicator */}
      <nav className={`dynamic-island__nav ${open ? "dynamic-island__nav--open" : ""}`}>
        <NavLink
          to="/"
          end
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive ? "dynamic-island__link dynamic-island__link--active" : "dynamic-island__link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive ? "dynamic-island__link dynamic-island__link--active" : "dynamic-island__link"
          }
        >
          About
        </NavLink>
        {isAuthenticated && (
          <>
            <NavLink
              to="/dashboard"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive && location.search !== "?view=settings"
                  ? "dynamic-island__link dynamic-island__link--active"
                  : "dynamic-island__link"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard?view=settings"
              onClick={() => setOpen(false)}
              className={() =>
                location.search === "?view=settings" || location.search === "?tab=settings"
                  ? "dynamic-island__link dynamic-island__link--active"
                  : "dynamic-island__link"
              }
            >
              Settings
            </NavLink>
          </>
        )}
        <button
          type="button"
          className="dynamic-island__link"
          onClick={handleHowItWorks}
        >
          How it works
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="dynamic-island__actions">
        {isAuthenticated ? (
          <>
            <span className="dynamic-island__user">
              Hi, {user?.name?.split(" ")[0]}
            </span>
            <LiquidButton
              variant="ghost"
              size="sm"
              showArrow={false}
              onClick={handleLogout}
            >
              Log out
            </LiquidButton>
          </>
        ) : (
          <>
            <Link to="/login" className="dynamic-island__signin">
              Sign in
            </Link>
            <LiquidButton
              variant="solid"
              size="sm"
              showArrow={false}
              onClick={() => navigate("/register")}
            >
              Get Started
            </LiquidButton>
          </>
        )}
      </div>

      {/* Mobile Burger Toggle */}
      <button
        className="dynamic-island__burger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </motion.header>
    </>
  );
}

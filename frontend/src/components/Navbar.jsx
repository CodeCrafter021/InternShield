import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LiquidButton from "./LiquidButton.jsx";
import "./Navbar.css";

/**
 * Navbar — Floating Modern Glass Header
 * Ultra-smooth 120 FPS scroll tracking with zero listener thrashing
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled(y > 40);

          const lastY = lastYRef.current;
          // Smooth threshold: only hide when scrolled deep and moving down significantly
          if (y > 350 && y > lastY + 15) {
            setShouldHide(true);
          } else if (y < lastY - 10 || y <= 350) {
            setShouldHide(false);
          }
          lastYRef.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      <div className="dynamic-island-veil" aria-hidden="true" />
      <motion.header
        className={`dynamic-island ${isScrolled ? "dynamic-island--scrolled" : ""}`}
        initial={{ y: -70, opacity: 0 }}
        animate={{
          y: shouldHide && !open ? -90 : 0,
          opacity: shouldHide && !open ? 0 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
      {/* Specular Liquid Light Sheen */}
      <div className="dynamic-island__sheen" aria-hidden="true" />

      {/* Brand Emblem */}
      <Link to="/" className="dynamic-island__brand" onClick={() => setOpen(false)}>
        <div className="dynamic-island__brand-icon">
          <ShieldCheck size={20} strokeWidth={2.2} />
        </div>
        <span className="dynamic-island__brand-name">InternShield</span>
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
        <NavLink
          to="/how-it-works"
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            isActive ? "dynamic-island__link dynamic-island__link--active" : "dynamic-island__link"
          }
        >
          How It Works
        </NavLink>

        {isAuthenticated ? (
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive ? "dynamic-island__link dynamic-island__link--active" : "dynamic-island__link"
            }
          >
            Dashboard
          </NavLink>
        ) : null}
      </nav>

      {/* Right Controls */}
      <div className="dynamic-island__actions">
        {isAuthenticated ? (
          <>
            <span className="dynamic-island__user">
              {user?.name ? user.name.split(" ")[0] : "Student"}
            </span>
            <LiquidButton
              variant="cyan"
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
            >
              Portal
            </LiquidButton>
            <LiquidButton
              variant="ghost"
              size="sm"
              showArrow={false}
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
            >
              Sign Out
            </LiquidButton>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="dynamic-island__signin"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <LiquidButton
              variant="cyan"
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate("/register");
              }}
            >
              Get Started
            </LiquidButton>
          </>
        )}
      </div>

      {/* Mobile Burger Toggle Button */}
      <button
        type="button"
        className="dynamic-island__burger"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </motion.header>
    </>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./GlassButton.css";

// Matches "6. Glassmorphism Buttons" from the design reference:
// - Glow expands on hover
// - Arrow slides right on hover
// - Button lifts slightly on hover
// - Gradient: Purple -> Indigo -> Cyan
//
// variant="solid"  -> filled gradient pill (primary CTA, e.g. "Get Started")
// variant="ghost"   -> outlined glass pill (secondary CTA, e.g. "Learn more")
export default function GlassButton({
  children,
  onClick,
  type = "button",
  variant = "solid",
  showArrow = true,
  disabled = false,
  fullWidth = false,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`glass-btn glass-btn--${variant} ${fullWidth ? "glass-btn--full" : ""}`}
      whileHover={disabled ? {} : { y: -3 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <span className="glass-btn__glow" />
      <span className="glass-btn__label">
        {children}
        {showArrow && <ArrowRight size={16} className="glass-btn__arrow" />}
      </span>
    </motion.button>
  );
}

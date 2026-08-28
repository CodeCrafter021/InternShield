import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./LiquidButton.css";

/**
 * LiquidButton — Apple iOS 26 Gelatinous Glass Pill Button
 * Features:
 * - Real-time cursor-following internal caustic light refraction
 * - Viscous elastic squash & stretch spring physics (stiffness: 300, damping: 20)
 * - Multi-layer specular highlight bevels & ambient neon glow halos
 */
export default function LiquidButton({
  children,
  onClick,
  variant = "solid", // "solid" | "ghost" | "cyan" | "danger"
  size = "md", // "sm" | "md" | "lg"
  fullWidth = false,
  showArrow = true,
  disabled = false,
  type = "button",
  className = "",
  icon: Icon = null,
  ...props
}) {
  const btnRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e) {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    btnRef.current.style.setProperty("--mouse-x", `${x}%`);
    btnRef.current.style.setProperty("--mouse-y", `${y}%`);
  }

  function handleMouseEnter(e) {
    if (!disabled) {
      setIsHovered(true);
      handleMouseMove(e);
    }
  }

  function handleMouseLeave() {
    setIsHovered(false);
    if (btnRef.current) {
      btnRef.current.style.setProperty("--mouse-x", "50%");
      btnRef.current.style.setProperty("--mouse-y", "50%");
    }
  }

  return (
    <motion.button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`liquid-btn liquid-btn--${variant} liquid-btn--${size} ${
        fullWidth ? "liquid-btn--full" : ""
      } ${className}`}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.03,
              scaleY: 0.99,
              transition: { type: "spring", stiffness: 280, damping: 22 },
            }
      }
      whileTap={
        disabled
          ? {}
          : {
              scale: 0.95,
              scaleX: 1.03,
              transition: { type: "spring", stiffness: 350, damping: 18 },
            }
      }
      {...props}
    >
      {/* Dynamic Cursor-Tracking Internal Caustic Refraction Light */}
      <div
        className={`liquid-btn__caustic ${isHovered ? "liquid-btn__caustic--active" : ""}`}
        aria-hidden="true"
      />

      {/* Surface Specular Glaze Layer */}
      <div className="liquid-btn__specular-glaze" aria-hidden="true" />

      {/* Ambient Liquid Glow Halo */}
      <div className="liquid-btn__glow" aria-hidden="true" />

      {/* Content Label */}
      <span className="liquid-btn__content">
        {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} className="liquid-btn__icon" />}
        <span>{children}</span>
        {showArrow && (
          <motion.span
            className="liquid-btn__arrow"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowRight size={size === "sm" ? 13 : size === "lg" ? 18 : 15} />
          </motion.span>
        )}
      </span>
    </motion.button>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import GlassButton from "../components/GlassButton.jsx";

export default function NotFound() {
  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
      <AnimatedBackground />
      <h1 className="text-gradient" style={{ fontSize: "3rem" }}>404</h1>
      <p style={{ color: "var(--text-secondary)" }}>This page doesn't exist.</p>
      <Link to="/"><GlassButton variant="solid" showArrow={false}>Back home</GlassButton></Link>
    </div>
  );
}

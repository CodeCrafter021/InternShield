import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileCheck,
  Zap,
  Sparkles,
  Shield,
  Activity,
  Cpu,
} from "lucide-react";
import "./IsometricCyberScene.css";

/**
 * IsometricCyberScene — Ultra-Premium Apple VisionOS 3D Cyber Network
 * Features:
 * - 4 Rich Multi-Layer 3D Isometric Floating Glass Pedestals
 * - Hyper-realistic 3D VisionOS Glass & Chromium Security Lock sitting on the left vault
 * - Volumetric light beacon with particle laser scan rings
 * - Holographic aperture portal, glowing crystal core, and sonar radar hub
 * - Pulsing photon data packets flowing along glowing circuit bus paths
 * - Interactive 3D tilt and hover glow physics
 */
export default function IsometricCyberScene() {
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="iso-scene-wrap">
      {/* ── Ambient Radial Volumetric Caustic Halos ── */}
      <div className="iso-ambient-glow iso-ambient-glow--1" />
      <div className="iso-ambient-glow iso-ambient-glow--2" />

      {/* ── SVG Foundation: Grid Floor, Radar Ripples & Animated Photon Bus ── */}
      <svg className="iso-circuit-svg" viewBox="0 0 600 500" fill="none">
        <defs>
          {/* Gradients */}
          <linearGradient id="neonCyanPurple" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <linearGradient id="neonEmeraldCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>

          <linearGradient id="laserBeamGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(0, 229, 255, 0.65)" />
            <stop offset="30%" stopColor="rgba(56, 189, 248, 0.35)" />
            <stop offset="70%" stopColor="rgba(139, 92, 246, 0.12)" />
            <stop offset="100%" stopColor="rgba(0, 229, 255, 0)" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="laserBeamFilter" x="-30%" y="-20%" width="160%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Isometric Grid Matrix Lines */}
        <g opacity="0.18">
          <line x1="60" y1="210" x2="300" y2="90" stroke="#38bdf8" strokeWidth="1" />
          <line x1="160" y1="260" x2="400" y2="140" stroke="#38bdf8" strokeWidth="1" />
          <line x1="260" y1="310" x2="500" y2="190" stroke="#38bdf8" strokeWidth="1" />
          <line x1="160" y1="160" x2="400" y2="280" stroke="#8b5cf6" strokeWidth="1" />
          <line x1="260" y1="110" x2="500" y2="230" stroke="#8b5cf6" strokeWidth="1" />
        </g>

        {/* Concentric Radar Sonar Ripples Under Bottom Node */}
        <ellipse cx="300" cy="350" rx="95" ry="48" stroke="rgba(0, 229, 255, 0.35)" strokeWidth="1.8" className="iso-sonar-ring iso-sonar-ring--1" />
        <ellipse cx="300" cy="350" rx="150" ry="75" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.4" className="iso-sonar-ring iso-sonar-ring--2" />
        <ellipse cx="300" cy="350" rx="210" ry="105" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1" className="iso-sonar-ring iso-sonar-ring--3" />

        {/* Glowing Bus Pipelines Between Platforms */}
        {/* Left -> Top */}
        <path id="pathLeftTop" d="M 160 215 L 300 145" stroke="url(#neonCyanPurple)" strokeWidth="2.5" strokeDasharray="6 6" filter="url(#neonGlowCyan)" />
        {/* Top -> Right */}
        <path id="pathTopRight" d="M 300 145 L 440 215" stroke="url(#neonCyanPurple)" strokeWidth="2.5" strokeDasharray="6 6" filter="url(#neonGlowCyan)" />
        {/* Right -> Bottom */}
        <path id="pathRightBottom" d="M 440 215 L 300 285" stroke="url(#neonCyanPurple)" strokeWidth="2.5" strokeDasharray="6 6" filter="url(#neonGlowCyan)" />
        {/* Bottom -> Left */}
        <path id="pathBottomLeft" d="M 300 285 L 160 215" stroke="url(#neonCyanPurple)" strokeWidth="2.5" strokeDasharray="6 6" filter="url(#neonGlowCyan)" />

        {/* Cross Diagonal Sync Traces */}
        <path d="M 160 215 L 300 285" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 300 145 L 300 285" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 440 215 L 160 215" stroke="rgba(139, 92, 246, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Animated Photons (Light Pulses Traveling Along Paths) */}
        <circle r="4" fill="#ffffff" filter="url(#neonGlowCyan)">
          <animateMotion path="M 160 215 L 300 145 L 440 215 L 300 285 Z" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#00e5ff" filter="url(#neonGlowCyan)">
          <animateMotion path="M 440 215 L 300 285 L 160 215 L 300 145 Z" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="#8b5cf6" filter="url(#neonGlowCyan)">
          <animateMotion path="M 300 145 L 300 285 L 160 215 Z" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Perimeter Circuit Breakouts */}
        <path d="M 160 215 L 50 270 L 20 310" stroke="rgba(0, 229, 255, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 440 215 L 550 270 L 580 310" stroke="rgba(139, 92, 246, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 300 350 L 300 440 L 230 475" stroke="rgba(45, 212, 191, 0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>

      {/* ── 3D ISOMETRIC PLATFORM NODES ── */}
      <div className="iso-stage">

        {/* ═════════════════════════════════════════════════════════════════
            NODE 1 (LEFT): THE SECURITY MASTER VAULT WITH STANDING 3D LOCK
            ═════════════════════════════════════════════════════════════════ */}
        <motion.div
          className={`iso-node-group iso-node-group--left ${hoveredNode === "vault" ? "is-hovered" : ""}`}
          onMouseEnter={() => setHoveredNode("vault")}
          onMouseLeave={() => setHoveredNode(null)}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Volumetric Laser Cylinder Shooting to Sky */}
          <div className="iso-laser-column" />
          <div className="iso-laser-ring iso-laser-ring--1" />
          <div className="iso-laser-ring iso-laser-ring--2" />

          {/* 3D Master Lock Resting Solidly On Top */}
          <div className="vision-lock-3d">
            {/* Chromium Shackle with Specular Sheen */}
            <div className="vision-lock-shackle">
              <div className="shackle-sheen" />
            </div>

            {/* Liquid Glass Lock Chassis */}
            <div className="vision-lock-chassis">
              <div className="chassis-specular-rim" />
              {/* Glowing Core Keyhole */}
              <div className="vision-lock-keyhole">
                <div className="keyhole-bulb" />
                <div className="keyhole-slit" />
              </div>
              <Sparkles size={11} className="lock-sparkle" />
            </div>

            {/* Realistic Contact Shadow on Platform */}
            <div className="lock-contact-shadow" />
          </div>

          {/* 3D Multi-Layer Pedestal Platform */}
          <div className="iso-slab iso-slab--vault">
            {/* Top Gloss Cap */}
            <div className="iso-slab__top">
              <div className="iso-slab__inset-grid" />
            </div>
            {/* Left 3D Wall */}
            <div className="iso-slab__wall-left" />
            {/* Right 3D Wall */}
            <div className="iso-slab__wall-right" />
            {/* Neon Under-Glow Halo */}
            <div className="iso-slab__glow" />
          </div>

          {/* Floating High-Contrast Pill Badge */}
          <motion.div
            className="iso-tag glass-pill"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheck size={13} color="#00e5ff" />
            <span>AI Shield Active</span>
          </motion.div>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════════════
            NODE 2 (TOP): HOLOGRAPHIC AI VERIFICATION PORTAL
            ═════════════════════════════════════════════════════════════════ */}
        <motion.div
          className={`iso-node-group iso-node-group--top ${hoveredNode === "domain" ? "is-hovered" : ""}`}
          onMouseEnter={() => setHoveredNode("domain")}
          onMouseLeave={() => setHoveredNode(null)}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          {/* Top Aperture Light Cone */}
          <div className="iso-aperture-beam" />

          {/* Floating Holographic Ring */}
          <div className="iso-holo-ring">
            <Zap size={18} color="#00e5ff" className="holo-icon-pulse" />
          </div>

          {/* 3D Hollow Glass Frame Pedestal */}
          <div className="iso-slab iso-slab--portal">
            <div className="iso-slab__top iso-slab__top--frame">
              <div className="iso-portal-liquid-well" />
            </div>
            <div className="iso-slab__wall-left" />
            <div className="iso-slab__wall-right" />
            <div className="iso-slab__glow iso-slab__glow--cyan" />
          </div>

          {/* Floating High-Contrast Pill Badge */}
          <motion.div
            className="iso-tag glass-pill"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <Zap size={13} color="#2dd4bf" />
            <span>MX Domain Verified</span>
          </motion.div>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════════════
            NODE 3 (RIGHT): CRYPTOGRAPHIC ANALYSIS SLAB
            ═════════════════════════════════════════════════════════════════ */}
        <motion.div
          className={`iso-node-group iso-node-group--right ${hoveredNode === "heuristics" ? "is-hovered" : ""}`}
          onMouseEnter={() => setHoveredNode("heuristics")}
          onMouseLeave={() => setHoveredNode(null)}
          animate={{ y: [0, -11, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          {/* Floating Shield Hologram */}
          <div className="iso-floating-crystal">
            <FileCheck size={18} color="#a78bfa" className="holo-icon-pulse" />
          </div>

          {/* 3D Lavender Glass Slab */}
          <div className="iso-slab iso-slab--crypto">
            <div className="iso-slab__top iso-slab__top--lavender">
              <div className="iso-crypto-mesh" />
            </div>
            <div className="iso-slab__wall-left iso-slab__wall-left--purple" />
            <div className="iso-slab__wall-right iso-slab__wall-right--purple" />
            <div className="iso-slab__glow iso-slab__glow--purple" />
          </div>

          {/* Floating High-Contrast Pill Badge */}
          <motion.div
            className="iso-tag glass-pill"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <FileCheck size={13} color="#c084fc" />
            <span>0-Risk Heuristics</span>
          </motion.div>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════════════
            NODE 4 (BOTTOM): CENTRAL SONAR TRUST HUB
            ═════════════════════════════════════════════════════════════════ */}
        <motion.div
          className={`iso-node-group iso-node-group--bottom ${hoveredNode === "core" ? "is-hovered" : ""}`}
          onMouseEnter={() => setHoveredNode("core")}
          onMouseLeave={() => setHoveredNode(null)}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          {/* Floating Central Energy Orb */}
          <div className="iso-core-orb">
            <div className="orb-inner-pulse" />
          </div>

          {/* 3D Multi-Tier Glass Hub Platform */}
          <div className="iso-slab iso-slab--core">
            <div className="iso-slab__top iso-slab__top--white">
              <div className="iso-core-target-ring" />
            </div>
            <div className="iso-slab__wall-left" />
            <div className="iso-slab__wall-right" />
            <div className="iso-slab__glow iso-slab__glow--emerald" />
          </div>

          {/* Floating High-Contrast Pill Badge */}
          <motion.div
            className="iso-tag glass-pill"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
          >
            <CheckCircle2 size={13} color="#4ade80" />
            <span>Zero-Fee Protocol</span>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}

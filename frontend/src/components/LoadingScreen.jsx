import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import "./LoadingScreen.css";

const STATUS = [
  "Preparing secure environment",
  "Initializing threat engine",
  "Verifying safety certificates",
  "Almost ready",
];

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 12 + 2);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 500);
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.floor(progress);
  const statusIdx = Math.min(Math.floor(pct / 26), STATUS.length - 1);

  return (
    <AnimatePresence>
      <motion.div
        className="ls"
        exit={{ opacity: 0, scale: 1.02, y: -8 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Soft Ambient Luminous Liquid Blobs */}
        <div className="ls__glow ls__glow--1" />
        <div className="ls__glow ls__glow--2" />

        {/* Center Liquid Glass Orb */}
        <div className="ls__center">
          {/* Ambient Breathing Halo */}
          <motion.div
            className="ls__orb-halo"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.85, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Liquid Crystal Glass Bubble */}
          <motion.div
            className="ls__orb"
            animate={{
              scale: [1, 1.05, 0.98, 1],
              borderRadius: ["34%", "44%", "38%", "34%"],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Top Specular Liquid Light Sheen */}
            <div className="ls__orb-sheen" />

            {/* Glowing Shield Emblem */}
            <motion.div
              className="ls__orb-icon"
              animate={{
                scale: [1, 0.94, 1.04, 1],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ShieldCheck size={44} strokeWidth={1.8} />
            </motion.div>
          </motion.div>
        </div>

        {/* Liquid Glass Progress Capsule */}
        <div className="ls__progress-card">
          <div className="ls__progress-track">
            <motion.div
              className="ls__progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ ease: "easeOut", duration: 0.15 }}
            >
              <div className="ls__progress-glow" />
            </motion.div>
          </div>

          <div className="ls__progress-info">
            <AnimatePresence mode="wait">
              <motion.span
                key={statusIdx}
                className="ls__status-text"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {STATUS[statusIdx]}
              </motion.span>
            </AnimatePresence>
            <span className="ls__percentage">{pct}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import "./AiScannerCard.css";

// Reproduces "3. Typing AI Scanner Animation": a small glass panel that
// looks like it's live-checking an internship offer — lines type in one at
// a time, a checkmark fades in, then the confidence bar fills. Loops forever
// on the homepage hero to keep the page feeling alive.
const STEPS = [
  { line: "> Checking company domain...", result: "LinkedIn verified" },
  { line: "> Detecting salary anomalies...", result: "No suspicious patterns" },
  { line: "> Cross-checking student reports...", result: "0 unresolved reports" },
];

export default function AiScannerCard() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [isConfidenceReady, setIsConfidenceReady] = useState(false);
  const [displayConfidence, setDisplayConfidence] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setVisibleSteps(0);
    setIsConfidenceReady(false);
    setDisplayConfidence(0);

    const timers = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleSteps(i + 1), 600 * (i + 1)));
    });

    // Trigger confidence bar animation after steps appear
    const barDelay = 600 * (STEPS.length + 1);
    timers.push(
      setTimeout(() => {
        setIsConfidenceReady(true);
        // Smooth requestAnimationFrame for counter
        let start = null;
        let frameId;
        const target = 98;
        const duration = 1000;

        function animateNumber(timestamp) {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          // Ease-out quad
          const easeProgress = 1 - (1 - progress) * (1 - progress);
          setDisplayConfidence(Math.round(easeProgress * target));
          if (progress < 1) {
            frameId = requestAnimationFrame(animateNumber);
          }
        }
        frameId = requestAnimationFrame(animateNumber);
      }, barDelay)
    );

    // Restart the whole loop after a pause
    timers.push(setTimeout(() => setCycle((c) => c + 1), barDelay + 3400));

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  return (
    <div className="scanner-card glass">
      <div className="scanner-card__header">
        <motion.span
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bot size={16} color="var(--color-primary)" />
        </motion.span>
        <span className="scanner-card__tag">LIVE AI ANALYSIS</span>
      </div>
      <h4 className="scanner-card__title">Scanning internship offer...</h4>

      <div className="scanner-card__body">
        {STEPS.map((step, i) => (
          <div key={step.line} className="scanner-card__step" style={{ opacity: i < visibleSteps ? 1 : 0.25 }}>
            <p className="scanner-card__line">{step.line}</p>
            {i < visibleSteps && (
              <motion.p
                className="scanner-card__result"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                ✓ {step.result}
              </motion.p>
            )}
          </div>
        ))}

        <div className="scanner-card__confidence">
          <span>&gt; AI Confidence Score...</span>
          <div className="scanner-card__bar-track">
            <motion.div
              className="scanner-card__bar-fill"
              animate={{ width: isConfidenceReady ? "98%" : "0%" }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="scanner-card__bar-value">{displayConfidence}%</span>
        </div>
      </div>
    </div>
  );
}

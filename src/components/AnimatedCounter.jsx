import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Animates a number counting up from 0 to `value` (or `target`) once the element scrolls into view
export default function AnimatedCounter({ value, target, duration = 1.1, suffix = "" }) {
  const targetVal = Number(value ?? target ?? 0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let frame;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setDisplay(Math.floor(progress * targetVal));
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, targetVal, duration]);

  return (
    <motion.span ref={ref}>
      {display}
      {suffix}
    </motion.span>
  );
}


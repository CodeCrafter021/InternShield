import React from "react";
import { motion } from "framer-motion";
import "./AnimatedBarChart.css";

// A lightweight bar chart where every bar grows in from height 0 on mount,
// staggered so they don't all snap in at once ("add animations on each bar").
// data: [{ label: "Jan", value: 40 }, ...]
export default function AnimatedBarChart({ data, unit = "" }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={d.label} className="bar-chart__col">
          <div className="bar-chart__track">
            <motion.div
              className="bar-chart__bar"
              initial={{ height: 0 }}
              whileInView={{ height: `${(d.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
            >
              <span className="bar-chart__value">{d.value}{unit}</span>
            </motion.div>
          </div>
          <span className="bar-chart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

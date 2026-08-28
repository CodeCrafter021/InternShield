import React from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, X } from "lucide-react";

const STATUS_CONFIG = {
  PASS: { color: "var(--color-success)", Icon: Check },
  REVIEW: { color: "var(--color-warning)", Icon: AlertTriangle },
  FAIL: { color: "var(--color-danger)", Icon: X },
};

// One row of the verification result's evidence list, e.g. "Website domain
// resolves — PASS". `index` is used to stagger the entrance animation so
// checks appear one after another instead of popping in all at once.
export default function EvidenceCard({ name, status, index = 0 }) {
  const { color, Icon } = STATUS_CONFIG[status] || STATUS_CONFIG.REVIEW;

  return (
    <motion.div
      className="evidence-row glass"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.4, ease: "easeOut" }}
    >
      <span className="evidence-row__icon" style={{ color, borderColor: color }}>
        <Icon size={14} />
      </span>
      <span className="evidence-row__name">{name}</span>
      <span className="evidence-row__status" style={{ color }}>{status}</span>
    </motion.div>
  );
}

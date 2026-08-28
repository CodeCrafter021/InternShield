import React from "react";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

// Renders the GREEN / YELLOW / RED risk pill described in the plan.
// Deliberately uses "risk" language, never a legal "safe" / "scam" claim.
const CONFIG = {
  GREEN: { label: "Low risk", color: "var(--color-success)", Icon: ShieldCheck },
  YELLOW: { label: "Needs review", color: "var(--color-warning)", Icon: ShieldAlert },
  RED: { label: "High risk", color: "var(--color-danger)", Icon: ShieldX },
};

export default function RiskBadge({ level = "GREEN", size = "md" }) {
  const { label, color, Icon } = CONFIG[level] || CONFIG.GREEN;

  return (
    <span
      className={`risk-badge risk-badge--${size}`}
      style={{ color, borderColor: color, background: `${color}1a` }}
    >
      <Icon size={size === "lg" ? 20 : 15} />
      {label}
    </span>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Zap,
  Sparkles,
  Layers,
  Filter,
} from "lucide-react";

/**
 * Monthly Verification Velocity Bar & Area Spline Chart (Apple iOS 27 Liquid Style)
 */
export function ActivityChart({ data }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // "all" | "safe" | "threats"

  const chartData =
    data && data.length > 0
      ? data
      : [
          { month: "Mar", total: 14, threats: 2 },
          { month: "Apr", total: 22, threats: 3 },
          { month: "May", total: 18, threats: 1 },
          { month: "Jun", total: 35, threats: 6 },
          { month: "Jul", total: 29, threats: 4 },
          { month: "Aug", total: 42, threats: 7 },
        ];

  const maxTotal = Math.max(...chartData.map((d) => d.total), 1);
  const maxSafe = Math.max(...chartData.map((d) => d.total - d.threats), 1);
  const maxThreats = Math.max(...chartData.map((d) => d.threats), 1);

  function getBarValue(d) {
    if (filterMode === "safe") return d.total - d.threats;
    if (filterMode === "threats") return d.threats;
    return d.total;
  }

  const currentMax =
    filterMode === "safe" ? maxSafe : filterMode === "threats" ? maxThreats : maxTotal;

  // Normalized coordinates for spline path (width: 500, height: 180, bottom padding: 30)
  const splinePoints = chartData.map((d, i) => {
    const x = 40 + i * ((500 - 80) / Math.max(chartData.length - 1, 1));
    const val = getBarValue(d);
    const y = 150 - (val / currentMax) * 110;
    return { x, y, ...d };
  });

  // Construct smooth SVG path through spline points
  const areaPath = splinePoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, "");

  const lastPt = splinePoints[splinePoints.length - 1] || { x: 500, y: 150 };
  const firstPt = splinePoints[0] || { x: 0, y: 150 };
  const fullAreaPath = `${areaPath} L ${lastPt.x} 170 L ${firstPt.x} 170 Z`;

  return (
    <div className="activity-chart">
      {/* ── Header with Controls & Filter Tabs ── */}
      <div className="activity-chart__header">
        <div className="activity-chart__title-wrap">
          <div className="activity-chart__title-icon">
            <Activity size={18} color="#38bdf8" />
          </div>
          <div>
            <h4>Verification Velocity</h4>
            <p>Monthly distribution of security scans & intercepted threats</p>
          </div>
        </div>

        {/* Liquid Segmented Control Filter Tabs */}
        <div className="activity-chart__filter-tabs">
          {[
            { id: "all", label: "All Velocity", color: "#38bdf8" },
            { id: "safe", label: "Safe Only", color: "#22c55e" },
            { id: "threats", label: "Threats", color: "#f43f5e" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`filter-btn ${filterMode === tab.id ? "filter-btn--active" : ""}`}
              onClick={() => setFilterMode(tab.id)}
            >
              <span className="filter-btn__dot" style={{ background: tab.color }} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Chart Visual Wrap (SVG Area Wave + Liquid Interactive Bars) ── */}
      <div className="activity-chart__svg-wrap">
        <svg viewBox="0 0 500 180" className="activity-chart__svg" preserveAspectRatio="none">
          <defs>
            {/* Liquid Area Gradient */}
            <linearGradient id="liquidAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={
                  filterMode === "safe"
                    ? "rgba(34, 197, 94, 0.45)"
                    : filterMode === "threats"
                    ? "rgba(244, 63, 94, 0.45)"
                    : "rgba(56, 189, 248, 0.45)"
                }
              />
              <stop
                offset="100%"
                stopColor={
                  filterMode === "safe"
                    ? "rgba(34, 197, 94, 0.0)"
                    : filterMode === "threats"
                    ? "rgba(244, 63, 94, 0.0)"
                    : "rgba(139, 92, 246, 0.0)"
                }
              />
            </linearGradient>

            {/* Liquid Spline Line Gradient */}
            <linearGradient id="liquidLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Background Grid Horizontal Lines */}
          {[35, 75, 115, 155].map((y) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="480"
              y2={y}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill Under Spline */}
          <path d={fullAreaPath} fill="url(#liquidAreaGrad)" />

          {/* Spline Curve Line */}
          <path
            d={areaPath}
            fill="none"
            stroke="url(#liquidLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive Glowing Pulse Dot on Active Column */}
          {activeIdx !== null && splinePoints[activeIdx] && (
            <g>
              <circle
                cx={splinePoints[activeIdx].x}
                cy={splinePoints[activeIdx].y}
                r="12"
                fill="rgba(56, 189, 248, 0.25)"
                className="activity-chart__dot-halo"
              />
              <circle
                cx={splinePoints[activeIdx].x}
                cy={splinePoints[activeIdx].y}
                r="6"
                fill="#ffffff"
                stroke="#38bdf8"
                strokeWidth="2.5"
                filter="drop-shadow(0 0 6px #38bdf8)"
              />
            </g>
          )}
        </svg>

        {/* ── Interactive Liquid Cylinder Bar Columns ── */}
        <div className="activity-chart__bars">
          {chartData.map((d, i) => {
            const barVal = getBarValue(d);
            const heightPct = Math.max(16, (barVal / currentMax) * 100);
            const safeCount = d.total - d.threats;
            const safePct = ((safeCount / d.total) * 100).toFixed(0);
            const isHovered = activeIdx === i;

            // Compute threat slice height for combined mode
            const threatSlicePct =
              filterMode === "all" ? (d.threats / d.total) * 100 : 0;

            // Liquid dynamic tooltip class position (left/right aware)
            const tooltipClass = `activity-tooltip ${
              i < 2 ? "activity-tooltip--left" : i > chartData.length - 3 ? "activity-tooltip--right" : ""
            }`;

            return (
              <div
                key={d.month}
                className="activity-bar-col"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {/* ── Dynamic Floating Liquid Glass Tooltip ── */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={tooltipClass}
                      initial={{ opacity: 0, y: 10, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.92 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="tooltip-header">
                        <span className="tooltip-month">{d.month} 2026 Telemetry</span>
                        <span className="tooltip-badge">{safePct}% Safe</span>
                      </div>

                      <div className="tooltip-divider" />

                      <div className="tooltip-row">
                        <span className="tooltip-label text-cyan">⚡ Total Audits</span>
                        <span className="tooltip-val">{d.total}</span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label text-emerald">🛡️ Verified Clean</span>
                        <span className="tooltip-val">{safeCount}</span>
                      </div>
                      <div className="tooltip-row">
                        <span className="tooltip-label text-rose">⚠️ Threat Flags</span>
                        <span className="tooltip-val">{d.threats}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Liquid Cylinder Glass Bar Track ── */}
                <div className="activity-bar-track">
                  <motion.div
                    className="activity-bar-fill"
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                      delay: i * 0.05,
                    }}
                    style={{
                      background:
                        filterMode === "safe"
                          ? "linear-gradient(180deg, #22c55e 0%, #15803d 100%)"
                          : filterMode === "threats"
                          ? "linear-gradient(180deg, #f43f5e 0%, #be123c 100%)"
                          : "linear-gradient(180deg, #38bdf8 0%, #7c3aed 100%)",
                    }}
                  >
                    {/* Liquid Specular Sheen Overlay */}
                    <div className="activity-bar-shimmer" />

                    {/* Threat Top Segment in All mode */}
                    {filterMode === "all" && threatSlicePct > 0 && (
                      <div
                        className="activity-bar-threat-slice"
                        style={{ height: `${Math.min(threatSlicePct, 80)}%` }}
                        title={`${d.threats} threats detected`}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Month Label */}
                <span
                  className={`activity-bar-label ${
                    isHovered ? "activity-bar-label--active" : ""
                  }`}
                >
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  {
    name: "Unregistered Domain",
    percentage: 42,
    color: "#38bdf8",
    description: "Lookalike domains mimicking legitimate tech firms created <30 days ago.",
  },
  {
    name: "Advance Training Fee",
    percentage: 28,
    color: "#8b5cf6",
    description: "Demanding ₹5,000–₹25,000 for training, laptop kits, or security clearance.",
  },
  {
    name: "Telegram / Shadow Interview",
    percentage: 18,
    color: "#f43f5e",
    description: "Interviews strictly conducted via text chat without verified corporate emails.",
  },
  {
    name: "Identity Harvesting",
    percentage: 12,
    color: "#eab308",
    description: "Collecting government ID & bank details before offer letter issuance.",
  },
];

/**
 * Threat Vector Radar / Concentric Liquid Donut Breakdown
 */
export function ThreatDonutChart({ categories }) {
  const safeCategories =
    categories && categories.length >= 4 ? categories : DEFAULT_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState(safeCategories[0]);

  return (
    <div className="threat-donut">
      <div className="threat-donut__header">
        <div className="threat-donut__title-icon">
          <AlertTriangle size={18} color="#f43f5e" />
        </div>
        <div>
          <h4>Threat Vector Heuristics</h4>
          <p>Distribution of detected scam patterns</p>
        </div>
      </div>

      <div className="threat-donut__body">
        {/* SVG Donut Ring with Liquid Segments */}
        <div className="threat-donut__visual">
          <svg viewBox="0 0 160 160" className="threat-donut__svg">
            {/* Background Base Glass Ring */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="16"
            />
            {/* Category Segment 1 (Fake Domain - 42%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#38bdf8"
              strokeWidth={activeCategory.name === safeCategories[0].name ? "19" : "15"}
              strokeDasharray="163.6 389.5"
              strokeDashoffset="0"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[0])}
            />
            {/* Category Segment 2 (Advance Fee - 28%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={activeCategory.name === safeCategories[1].name ? "19" : "15"}
              strokeDasharray="109 389.5"
              strokeDashoffset="-170"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[1])}
            />
            {/* Category Segment 3 (Shadow Chat - 18%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#f43f5e"
              strokeWidth={activeCategory.name === safeCategories[2].name ? "19" : "15"}
              strokeDasharray="70 389.5"
              strokeDashoffset="-285"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[2])}
            />
            {/* Category Segment 4 (Identity Theft - 12%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#eab308"
              strokeWidth={activeCategory.name === safeCategories[3].name ? "19" : "15"}
              strokeDasharray="46.7 389.5"
              strokeDashoffset="-360"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[3])}
            />
          </svg>

          {/* Center Trust / Threat Dynamic Metric */}
          <div className="threat-donut__center">
            <span className="threat-donut__center-score">{activeCategory.percentage}%</span>
            <span className="threat-donut__center-label">Vector Ratio</span>
          </div>
        </div>

        {/* Category Interactive List */}
        <div className="threat-donut__list">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`threat-donut__item ${
                activeCategory.name === cat.name ? "threat-donut__item--active" : ""
              }`}
              onMouseEnter={() => setActiveCategory(cat)}
              onClick={() => setActiveCategory(cat)}
            >
              <div className="threat-donut__item-header">
                <span
                  className="threat-donut__item-dot"
                  style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                />
                <span className="threat-donut__item-name">{cat.name}</span>
                <span className="threat-donut__item-pct">{cat.percentage}%</span>
              </div>
              <p className="threat-donut__item-desc">{cat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Trust Gauge Widget (Apple VisionOS Liquid Optical Ring)
 */
export function TrustScoreGauge({ score = 96 }) {
  const strokeDashoffset = 314 - (314 * score) / 100;

  return (
    <div className="trust-gauge glass-card">
      <div className="trust-gauge__top">
        <ShieldCheck size={20} color="var(--color-accent)" />
        <span>Student Protection Engine</span>
      </div>

      <div className="trust-gauge__dial">
        <svg viewBox="0 0 120 120" className="trust-gauge__svg">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeDasharray="314"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className="trust-gauge__circle-fill"
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#00e5ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="trust-gauge__text">
          <strong>{score}</strong>
          <span>/ 100</span>
        </div>
      </div>

      <div className="trust-gauge__badge glass-pill">
        <CheckCircle2 size={13} color="#22c55e" />
        <span>AI Risk Level: Minimal</span>
      </div>
    </div>
  );
}


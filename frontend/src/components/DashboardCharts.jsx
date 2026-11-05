import React, { useState, memo } from "react";
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
  BarChart3,
  PieChart,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Info,
} from "lucide-react";
import "./DashboardCharts.css";

/**
 * 1. Verification Velocity & Security Spline Area Chart (Apple iOS 27 Liquid Style)
 */
export const ActivityChart = memo(function ActivityChart({ data }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // "all" | "safe" | "threats"

  const chartData =
    data && data.length > 0
      ? data
      : [
          { month: "Mar", total: 24, safe: 21, threats: 3 },
          { month: "Apr", total: 38, safe: 32, threats: 6 },
          { month: "May", total: 31, safe: 28, threats: 3 },
          { month: "Jun", total: 54, safe: 46, threats: 8 },
          { month: "Jul", total: 47, safe: 42, threats: 5 },
          { month: "Aug", total: 68, safe: 59, threats: 9 },
        ];

  function getBarValue(d) {
    if (filterMode === "safe") return d.safe || d.total - d.threats;
    if (filterMode === "threats") return d.threats;
    return d.total || d.safe + d.threats;
  }

  const currentMax = Math.max(...chartData.map((d) => getBarValue(d)), 1);

  // Normalized coordinates for spline path (width: 500, height: 160)
  const splinePoints = chartData.map((d, i) => {
    const x = 30 + i * ((500 - 60) / Math.max(chartData.length - 1, 1));
    const val = getBarValue(d);
    const y = 140 - (val / currentMax) * 105;
    return { x, y, val, ...d };
  });

  const areaPath = splinePoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, "");

  const lastPt = splinePoints[splinePoints.length - 1] || { x: 500, y: 140 };
  const firstPt = splinePoints[0] || { x: 30, y: 140 };
  const fullAreaPath = `${areaPath} L ${lastPt.x} 155 L ${firstPt.x} 155 Z`;

  return (
    <div className="activity-chart">
      {/* ── Header with Controls & Filter Tabs ── */}
      <div className="activity-chart__header">
        <div className="activity-chart__title-wrap">
          <div className="activity-chart__title-icon">
            <Activity size={18} color="#38bdf8" />
          </div>
          <div>
            <h4>Verification Velocity & Attack Curve</h4>
            <p>Monthly distribution of validated offers & intercepted scam networks</p>
          </div>
        </div>

        <div className="activity-chart__controls">
          <div className="activity-chart__filter-tabs">
            {[
              { id: "all", label: "All Scans" },
              { id: "safe", label: "Verified Safe" },
              { id: "threats", label: "Traps Deflected" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`chart-filter-btn ${filterMode === tab.id ? "active" : ""}`}
                onClick={() => setFilterMode(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Spline Area SVG Visualization ── */}
      <div className="activity-chart__svg-wrap">
        <svg viewBox="0 0 500 160" className="activity-chart__svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={
                  filterMode === "threats"
                    ? "#f43f5e"
                    : filterMode === "safe"
                    ? "#22c55e"
                    : "#a855f7"
                }
                stopOpacity="0.32"
              />
              <stop
                offset="100%"
                stopColor={
                  filterMode === "threats"
                    ? "#f43f5e"
                    : filterMode === "safe"
                    ? "#22c55e"
                    : "#a855f7"
                }
                stopOpacity="0.0"
              />
            </linearGradient>

            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop
                offset="100%"
                stopColor={filterMode === "threats" ? "#f43f5e" : "#00f0ff"}
              />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1="30" y1="35" x2="470" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="30" y1="85" x2="470" y2="85" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1="30" y1="135" x2="470" y2="135" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

          {/* Area Fill */}
          <path d={fullAreaPath} fill="url(#areaGradient)" />

          {/* Main Spline Line */}
          <path
            d={areaPath}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Glowing Points */}
          {splinePoints.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={activeIdx === i ? "6.5" : "4.5"}
                fill="#ffffff"
                stroke={filterMode === "threats" ? "#f43f5e" : "#a855f7"}
                strokeWidth="2.5"
                style={{ cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              />
            </g>
          ))}
        </svg>

        {/* Column Hover Interactive Bars */}
        <div className="activity-chart__bars">
          {chartData.map((d, i) => {
            const isHovered = activeIdx === i;
            const safeCount = d.safe || d.total - d.threats;
            const threatCount = d.threats;
            const totalCount = d.total || safeCount + threatCount;

            return (
              <div
                key={d.month}
                className={`activity-bar-col ${isHovered ? "active" : ""}`}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="activity-bar-tooltip glass-card">
                    <strong className="tooltip-month">{d.month} Analytics</strong>
                    <div className="tooltip-row">
                      <span className="tooltip-dot safe" />
                      <span>Verified Safe:</span>
                      <strong>{safeCount}</strong>
                    </div>
                    <div className="tooltip-row">
                      <span className="tooltip-dot threat" />
                      <span>Intercepted Threats:</span>
                      <strong>{threatCount}</strong>
                    </div>
                    <div className="tooltip-divider" />
                    <div className="tooltip-row total">
                      <span>Total Scans:</span>
                      <strong>{totalCount}</strong>
                    </div>
                  </div>
                )}

                <div className="activity-bar-track">
                  <div
                    className="activity-bar-fill"
                    style={{
                      height: `${(getBarValue(d) / currentMax) * 100}%`,
                      background:
                        filterMode === "threats"
                          ? "linear-gradient(180deg, #f43f5e 0%, #be123c 100%)"
                          : filterMode === "safe"
                          ? "linear-gradient(180deg, #22c55e 0%, #15803d 100%)"
                          : "linear-gradient(180deg, #a855f7 0%, #38bdf8 100%)",
                    }}
                  />
                </div>
                <span className={`activity-bar-label ${isHovered ? "active" : ""}`}>
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

/**
 * 2. Attack Vector Heuristics & Threat Donut Distribution
 */
const DEFAULT_CATEGORIES = [
  {
    name: "Lookalike / Phishing Domains",
    percentage: 42,
    color: "#38bdf8",
    description: "Fake domains created <30 days ago mimicking TCS, Google, Infosys.",
  },
  {
    name: "Upfront Security / Training Fee",
    percentage: 28,
    color: "#a855f7",
    description: "Demanding ₹4,000–₹25,000 for training, laptop kits, or courier fee.",
  },
  {
    name: "Telegram / Unverified HR Chat",
    percentage: 18,
    color: "#f43f5e",
    description: "Recruitment conducted via WhatsApp/Telegram with generic gmail.com address.",
  },
  {
    name: "Identity & Bank Harvesting",
    percentage: 12,
    color: "#eab308",
    description: "Collecting Aadhaar, PAN & bank checks before issuance of valid contracts.",
  },
];

export const ThreatDonutChart = memo(function ThreatDonutChart({ categories }) {
  const safeCategories =
    categories && categories.length >= 4 ? categories : DEFAULT_CATEGORIES;
  const [activeCategory, setActiveCategory] = useState(safeCategories[0]);
  const currentCategory = activeCategory || safeCategories[0] || { name: "", percentage: 0 };

  return (
    <div className="threat-donut">
      <div className="threat-donut__header">
        <div className="threat-donut__title-icon">
          <AlertTriangle size={18} color="#f43f5e" />
        </div>
        <div>
          <h4>Threat Vector Heuristics</h4>
          <p>Distribution of detected student scam vectors</p>
        </div>
      </div>

      <div className="threat-donut__body">
        {/* SVG Donut Ring with Liquid Segments */}
        <div className="threat-donut__visual">
          <svg viewBox="0 0 160 160" className="threat-donut__svg">
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="15"
            />
            {/* Segment 1 (Fake Domain - 42%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#38bdf8"
              strokeWidth={currentCategory?.name === safeCategories[0].name ? "19" : "14"}
              strokeDasharray="163.6 389.5"
              strokeDashoffset="0"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[0])}
            />
            {/* Segment 2 (Advance Fee - 28%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#a855f7"
              strokeWidth={currentCategory?.name === safeCategories[1].name ? "19" : "14"}
              strokeDasharray="109 389.5"
              strokeDashoffset="-170"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[1])}
            />
            {/* Segment 3 (Telegram Chat - 18%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#f43f5e"
              strokeWidth={currentCategory?.name === safeCategories[2].name ? "19" : "14"}
              strokeDasharray="70 389.5"
              strokeDashoffset="-285"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[2])}
            />
            {/* Segment 4 (Identity Theft - 12%) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              fill="none"
              stroke="#eab308"
              strokeWidth={currentCategory?.name === safeCategories[3].name ? "19" : "14"}
              strokeDasharray="46.7 389.5"
              strokeDashoffset="-360"
              strokeLinecap="round"
              className="donut-segment"
              onMouseEnter={() => setActiveCategory(safeCategories[3])}
            />
          </svg>

          {/* Center Metric Display */}
          <div className="threat-donut__center">
            <span className="threat-donut__center-score">{currentCategory?.percentage}%</span>
            <span className="threat-donut__center-label">Vector Ratio</span>
          </div>
        </div>

        {/* Category Interactive List */}
        <div className="threat-donut__list">
          {safeCategories.map((cat) => (
            <div
              key={cat.name}
              className={`threat-donut__item ${
                currentCategory?.name === cat.name ? "threat-donut__item--active" : ""
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
});

/**
 * 3. Statistical Trust Score Distribution Histogram
 */
export const ScoreDistributionChart = memo(function ScoreDistributionChart() {
  const [selectedBin, setSelectedBin] = useState(null);

  const BINS = [
    { range: "0–20", label: "Critical Threat", count: 18, color: "#f43f5e", pct: "7%" },
    { range: "21–40", label: "High Risk", count: 32, color: "#fb7185", pct: "13%" },
    { range: "41–60", label: "Suspicious", count: 48, color: "#eab308", pct: "19%" },
    { range: "61–80", label: "Credible Org", count: 86, color: "#38bdf8", pct: "34%" },
    { range: "81–100", label: "Verified Safe", count: 68, color: "#22c55e", pct: "27%" },
  ];

  const maxCount = Math.max(...BINS.map((b) => b.count));

  return (
    <div className="score-distribution-chart">
      <div className="chart-header-row">
        <div className="chart-title-wrap">
          <div className="chart-title-icon" style={{ background: "rgba(56, 189, 248, 0.1)" }}>
            <BarChart3 size={18} color="#38bdf8" />
          </div>
          <div>
            <h4>Trust Score Gaussian Distribution</h4>
            <p>Statistical distribution of 1,420+ verified employer scores</p>
          </div>
        </div>

        <div className="stat-pill">
          <span>Median Score:</span>
          <strong>74.2 / 100</strong>
        </div>
      </div>

      {/* Histogram Bars */}
      <div className="histogram-grid">
        {BINS.map((bin, idx) => {
          const isSelected = selectedBin === idx;
          const heightPct = (bin.count / maxCount) * 100;

          return (
            <div
              key={bin.range}
              className={`histogram-col ${isSelected ? "active" : ""}`}
              onMouseEnter={() => setSelectedBin(idx)}
              onMouseLeave={() => setSelectedBin(null)}
            >
              <span className="histogram-count">{bin.count}</span>
              <div className="histogram-track">
                <div
                  className="histogram-fill"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: bin.color,
                    boxShadow: `0 0 12px ${bin.color}40`,
                  }}
                />
              </div>
              <span className="histogram-range">{bin.range}</span>
              <span className="histogram-tag" style={{ color: bin.color }}>
                {bin.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="distribution-footer">
        <div className="footer-metric">
          <span className="dot safe" />
          <span>Passing Ratio: <strong>81.4%</strong> (Score ≥ 60)</span>
        </div>
        <div className="footer-metric">
          <span className="dot threat" />
          <span>Severe Risk Ratio: <strong>18.6%</strong> (Score &lt; 60)</span>
        </div>
      </div>
    </div>
  );
});

/**
 * 4. Weekly Threat Interception & Daily Velocity Bar Chart
 */
export const WeeklyVelocityChart = memo(function WeeklyVelocityChart() {
  const [activeDay, setActiveDay] = useState(null);

  const DAYS = [
    { day: "Mon", scans: 48, threats: 4 },
    { day: "Tue", scans: 62, threats: 7 },
    { day: "Wed", scans: 55, threats: 3 },
    { day: "Thu", scans: 84, threats: 11 },
    { day: "Fri", scans: 76, threats: 8 },
    { day: "Sat", scans: 34, threats: 2 },
    { day: "Sun", scans: 29, threats: 1 },
  ];

  const maxVal = Math.max(...DAYS.map((d) => d.scans));

  return (
    <div className="weekly-velocity-chart">
      <div className="chart-header-row">
        <div className="chart-title-wrap">
          <div className="chart-title-icon" style={{ background: "rgba(168, 85, 247, 0.1)" }}>
            <Zap size={18} color="#a855f7" />
          </div>
          <div>
            <h4>7-Day Interception Velocity</h4>
            <p>Daily breakdown of student verification traffic & blocked traps</p>
          </div>
        </div>

        <div className="stat-pill success">
          <ShieldCheck size={14} color="#22c55e" />
          <span>36 Traps Deflected This Week</span>
        </div>
      </div>

      <div className="weekly-bars-container">
        {DAYS.map((d, i) => {
          const isHovered = activeDay === i;
          const scanHeight = (d.scans / maxVal) * 100;
          const threatHeight = (d.threats / maxVal) * 100;

          return (
            <div
              key={d.day}
              className={`weekly-col ${isHovered ? "active" : ""}`}
              onMouseEnter={() => setActiveDay(i)}
              onMouseLeave={() => setActiveDay(null)}
            >
              <div className="weekly-bars-pair">
                {/* Total Scans Bar */}
                <div
                  className="weekly-bar scan-bar"
                  style={{ height: `${scanHeight}%` }}
                  title={`${d.scans} Scans`}
                />
                {/* Intercepted Threats Bar */}
                <div
                  className="weekly-bar threat-bar"
                  style={{ height: `${threatHeight}%` }}
                  title={`${d.threats} Threats Flagged`}
                />
              </div>
              <span className="weekly-day-label">{d.day}</span>
              <span className="weekly-scans-count">{d.scans}</span>
            </div>
          );
        })}
      </div>

      <div className="weekly-legend">
        <div className="legend-item">
          <span className="legend-box scan" />
          <span>Total Student Inquiries</span>
        </div>
        <div className="legend-item">
          <span className="legend-box threat" />
          <span>Scams Blocked Before Payment</span>
        </div>
      </div>
    </div>
  );
});

/**
 * 5. Security Sentinel Matrix & Engine Health
 */
export const SecurityHealthMatrix = memo(function SecurityHealthMatrix() {
  const METRICS = [
    { label: "AI Document Heuristics", val: "99.4%", color: "#06b6d4", desc: "Offer letter NLP & forgery detection" },
    { label: "Domain DNS Quarantine", val: "98.8%", color: "#38bdf8", desc: "Typosquat & shadow host intercept" },
    { label: "Student Community Sentinels", val: "95.2%", color: "#a855f7", desc: "Crowdsourced complaint consensus" },
    { label: "Cryptographic Evidence Ledger", val: "100%", color: "#22c55e", desc: "Tamper-proof verifiable hashes" },
  ];

  return (
    <div className="security-health-matrix">
      <div className="chart-header-row">
        <div className="chart-title-wrap">
          <div className="chart-title-icon" style={{ background: "rgba(34, 197, 94, 0.1)" }}>
            <ShieldCheck size={18} color="#22c55e" />
          </div>
          <div>
            <h4>Sentinel Defense Health</h4>
            <p>Cryptographic engine integrity & real-time telemetry</p>
          </div>
        </div>

        <div className="stat-pill success">
          <span className="live-radar-dot" />
          <span>All 4 Defense Nodes Operational</span>
        </div>
      </div>

      <div className="matrix-grid">
        {METRICS.map((m) => (
          <div key={m.label} className="matrix-card">
            <div className="matrix-card__top">
              <span className="matrix-label">{m.label}</span>
              <span className="matrix-val" style={{ color: m.color }}>
                {m.val}
              </span>
            </div>
            <div className="matrix-track">
              <div
                className="matrix-fill"
                style={{
                  width: m.val,
                  backgroundColor: m.color,
                  boxShadow: `0 0 10px ${m.color}60`,
                }}
              />
            </div>
            <p className="matrix-desc">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * 6. Trust Gauge Widget (Apple VisionOS Liquid Optical Ring)
 */
export const TrustScoreGauge = memo(function TrustScoreGauge({ score = 96 }) {
  const strokeDashoffset = 314 - (314 * score) / 100;

  return (
    <div className="trust-gauge glass-card">
      <div className="trust-gauge__top">
        <ShieldCheck size={20} color="#38bdf8" />
        <span>Student Protection Index</span>
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
});

/**
 * 7. Micro SVG Sparkline for KPI Metric Cards (Apple VisionOS / Linear style)
 */
export const MetricSparkline = memo(function MetricSparkline({ type = "total", color = "#38bdf8" }) {
  const paths = {
    total: {
      d: "M 0 22 C 20 25, 35 12, 55 16 C 75 20, 85 8, 100 4",
      area: "M 0 22 C 20 25, 35 12, 55 16 C 75 20, 85 8, 100 4 L 100 32 L 0 32 Z",
    },
    safe: {
      d: "M 0 24 C 25 18, 45 22, 65 10 C 80 8, 90 6, 100 4",
      area: "M 0 24 C 25 18, 45 22, 65 10 C 80 8, 90 6, 100 4 L 100 32 L 0 32 Z",
    },
    reviews: {
      d: "M 0 20 C 20 28, 40 12, 60 18 C 75 22, 85 10, 100 6",
      area: "M 0 20 C 20 28, 40 12, 60 18 C 75 22, 85 10, 100 6 L 100 32 L 0 32 Z",
    },
    threats: {
      d: "M 0 26 C 25 24, 45 28, 65 12 C 80 6, 92 4, 100 2",
      area: "M 0 26 C 25 24, 45 28, 65 12 C 80 6, 92 4, 100 2 L 100 32 L 0 32 Z",
    },
  };

  const selected = paths[type] || paths.total;
  const safeId = `spark-grad-${type}-${String(color).replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="metric-sparkline-wrap">
      <svg viewBox="0 0 100 32" className="metric-sparkline-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id={safeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={selected.area} fill={`url(#${safeId})`} />
        <path d={selected.d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
});

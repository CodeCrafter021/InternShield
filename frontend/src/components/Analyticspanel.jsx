import React, { useMemo } from "react";
import { Search, ShieldCheck, ShieldAlert, Gauge, SearchX, ScanSearch } from "lucide-react";
import "./AnalyticsPanel.css";

const DAY = 24 * 60 * 60 * 1000;
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function timeAgo(iso) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

/**
 * Analytics built ONLY from this user's own activity:
 *  - searches:  [{ term, results, timestamp }]        (a company name typed in the search box)
 *  - checks:    [{ id, name, risk, score, timestamp }] (a full verification of one company)
 */
export default function AnalyticsPanel({ checks = [], searches = [], onStart }) {
  const d = useMemo(() => {
    const safe = checks.filter((c) => c.risk === "LOW").length;
    const medium = checks.filter((c) => c.risk === "MEDIUM").length;
    const high = checks.filter((c) => c.risk === "HIGH").length;
    const avg = checks.length
      ? Math.round(checks.reduce((s, c) => s + (Number(c.score) || 0), 0) / checks.length)
      : null;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfToday.getTime() - (6 - i) * DAY);
      return { label: DAY_NAMES[date.getDay()], date, searches: 0, checks: 0 };
    });
    const put = (iso, key) => {
      const t = new Date(iso).getTime();
      if (Number.isNaN(t)) return;
      const idx = Math.floor((t - days[0].date.getTime()) / DAY);
      if (idx >= 0 && idx < 7) days[idx][key] += 1;
    };
    searches.forEach((s) => put(s.timestamp, "searches"));
    checks.forEach((c) => put(c.timestamp, "checks"));

    const buckets = [
      { label: "0–20", min: 0, max: 20, color: "#f43f5e", count: 0 },
      { label: "21–40", min: 21, max: 40, color: "#fb7185", count: 0 },
      { label: "41–60", min: 41, max: 60, color: "#eab308", count: 0 },
      { label: "61–80", min: 61, max: 80, color: "#38bdf8", count: 0 },
      { label: "81–100", min: 81, max: 100, color: "#22c55e", count: 0 },
    ];
    checks.forEach((c) => {
      const sc = Number(c.score);
      const b = buckets.find((x) => sc >= x.min && sc <= x.max);
      if (b) b.count += 1;
    });

    const activity = [
      ...searches.map((s) => ({ type: "search", title: s.term, ts: s.timestamp, results: s.results })),
      ...checks.map((c) => ({ type: "check", title: c.name, ts: c.timestamp, risk: c.risk, score: c.score })),
    ]
      .filter((a) => !Number.isNaN(new Date(a.ts).getTime()))
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, 8);

    return { safe, medium, high, avg, days, buckets, activity };
  }, [checks, searches]);

  if (checks.length === 0 && searches.length === 0) {
    return (
      <div className="an-empty">
        <span className="an-empty__icon"><SearchX size={26} /></span>
        <h3>No activity yet</h3>
        <p>
          Search for a company or run a verification. Your analytics are built only from what you do,
          so they will appear here after your first search.
        </p>
        {onStart && (
          <button type="button" className="an-btn" onClick={onStart}>Search a company</button>
        )}
      </div>
    );
  }

  const maxDay = Math.max(...d.days.flatMap((x) => [x.searches, x.checks]), 1);
  const maxBucket = Math.max(...d.buckets.map((b) => b.count), 1);
  const pct = (n) => (checks.length ? Math.round((n / checks.length) * 100) : 0);
  const bar = (n) => (n ? `${Math.max((n / maxDay) * 100, 8)}%` : "0%");

  return (
    <div className="an">
      {/* what the numbers mean */}
      <div className="an-defs">
        <div><i style={{ background: "#38bdf8" }} /><b>Search</b> you typed a company name in the search box</div>
        <div><i style={{ background: "#a855f7" }} /><b>Verification</b> you ran a full check on one company</div>
      </div>

      <div className="an-summary">
        <div className="an-sum">
          <span className="an-sum__icon" style={{ color: "#38bdf8", background: "#38bdf818" }}><Search size={18} /></span>
          <div><strong>{searches.length}</strong><span>Searches</span></div>
        </div>
        <div className="an-sum">
          <span className="an-sum__icon" style={{ color: "#a855f7", background: "#a855f718" }}><ScanSearch size={18} /></span>
          <div><strong>{checks.length}</strong><span>Verifications</span></div>
        </div>
        <div className="an-sum">
          <span className="an-sum__icon" style={{ color: "#22c55e", background: "#22c55e18" }}><Gauge size={18} /></span>
          <div>
            <strong>{d.avg === null ? "–" : d.avg}{d.avg !== null && <small>/100</small>}</strong>
            <span>Avg trust score</span>
          </div>
        </div>
        <div className="an-sum">
          <span className="an-sum__icon" style={{ color: "#f43f5e", background: "#f43f5e18" }}><ShieldAlert size={18} /></span>
          <div><strong>{d.high}</strong><span>High-risk found</span></div>
        </div>
      </div>

      <div className="an-grid">
        {/* last 7 days */}
        <section className="an-card an-card--wide">
          <header className="an-card__head">
            <div>
              <h3>Your activity, last 7 days</h3>
              <p>Searches and verifications you did each day</p>
            </div>
            <div className="an-keys">
              <span><i style={{ background: "#38bdf8" }} />Searches</span>
              <span><i style={{ background: "#a855f7" }} />Verifications</span>
            </div>
          </header>
          <div className="an-bars an-bars--days">
            {d.days.map((x, i) => (
              <div className="an-bar" key={i} title={`${x.label}: ${x.searches} searches, ${x.checks} verifications`}>
                <div className="an-bar__pair">
                  <div className="an-bar__col">
                    <span className="an-bar__val">{x.searches || ""}</span>
                    <div className="an-bar__fill" style={{ height: bar(x.searches), background: "#38bdf8" }} />
                  </div>
                  <div className="an-bar__col">
                    <span className="an-bar__val">{x.checks || ""}</span>
                    <div className="an-bar__fill" style={{ height: bar(x.checks), background: "#a855f7" }} />
                  </div>
                </div>
                <span className="an-bar__label">{x.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* verification results */}
        <section className="an-card">
          <header className="an-card__head">
            <div>
              <h3>Verification results</h3>
              <p>Verdicts of the companies you verified</p>
            </div>
          </header>
          {checks.length === 0 ? (
            <p className="an-note">Run a verification on a company to see its verdict here.</p>
          ) : (
            <>
              <div className="an-stack" role="img" aria-label="Verification results">
                {d.safe > 0 && <span style={{ width: `${pct(d.safe)}%`, background: "#22c55e" }} />}
                {d.medium > 0 && <span style={{ width: `${pct(d.medium)}%`, background: "#eab308" }} />}
                {d.high > 0 && <span style={{ width: `${pct(d.high)}%`, background: "#f43f5e" }} />}
              </div>
              <ul className="an-legend">
                {[
                  { label: "Safe", n: d.safe, color: "#22c55e" },
                  { label: "Moderate risk", n: d.medium, color: "#eab308" },
                  { label: "High risk", n: d.high, color: "#f43f5e" },
                ].map((r) => (
                  <li key={r.label}>
                    <i style={{ background: r.color }} />
                    <span>{r.label}</span>
                    <b>{r.n}</b>
                    <em>{pct(r.n)}%</em>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* score distribution */}
        <section className="an-card">
          <header className="an-card__head">
            <div>
              <h3>Trust scores</h3>
              <p>Score range of the companies you verified</p>
            </div>
          </header>
          {checks.length === 0 ? (
            <p className="an-note">Scores appear after your first verification.</p>
          ) : (
            <div className="an-bars an-bars--scores">
              {d.buckets.map((b) => (
                <div className="an-bar" key={b.label} title={`${b.label}: ${b.count}`}>
                  <span className="an-bar__val">{b.count || ""}</span>
                  <div className="an-bar__track">
                    <div className="an-bar__fill" style={{ height: b.count ? `${Math.max((b.count / maxBucket) * 100, 8)}%` : "0%", background: b.color }} />
                  </div>
                  <span className="an-bar__label">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* recent activity */}
        <section className="an-card an-card--wide">
          <header className="an-card__head">
            <div>
              <h3>Recent activity</h3>
              <p>The latest searches and verifications behind these charts</p>
            </div>
          </header>
          <ul className="an-feed">
            {d.activity.map((a, i) => (
              <li key={i}>
                <span className={`an-feed__tag an-feed__tag--${a.type}`}>
                  {a.type === "search" ? "Search" : "Verified"}
                </span>
                <span className="an-feed__title">{a.title}</span>
                <span className="an-feed__meta">
                  {a.type === "search"
                    ? a.results > 0
                      ? `${a.results} match${a.results > 1 ? "es" : ""}`
                      : "No record found"
                    : `${a.score}/100 · ${a.risk === "LOW" ? "Safe" : a.risk === "MEDIUM" ? "Moderate" : "High risk"}`}
                </span>
                <span className="an-feed__time">{timeAgo(a.ts)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
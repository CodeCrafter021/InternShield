import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bell, ShieldAlert, CheckCheck } from "lucide-react";
import "./NotificationBell.css";

const READ_KEY = "internshield_notif_read";

function loadRead() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

/**
 * Bell icon for the dashboard top-right corner.
 * `alerts` = community alerts from the data layer.
 * `onViewAll` = open the Threat Radar view.
 */
export default function NotificationBell({ alerts = [], onViewAll }) {
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(loadRead);
  const wrapRef = useRef(null);

  const items = useMemo(() => alerts.slice(0, 8), [alerts]);
  const unread = items.filter((a) => !readIds.has(String(a.id))).length;

  // close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function markAllRead() {
    const next = new Set(readIds);
    items.forEach((a) => next.add(String(a.id)));
    setReadIds(next);
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...next]));
    } catch {}
  }

  return (
    <div className="notif" ref={wrapRef}>
      <button
        type="button"
        className="notif__btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell size={19} />
        {unread > 0 && <span className="notif__badge">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="notif__panel" role="dialog" aria-label="Notifications">
          <div className="notif__head">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button type="button" className="notif__link" onClick={markAllRead}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="notif__list">
            {items.length === 0 ? (
              <p className="notif__empty">You're all caught up.</p>
            ) : (
              items.map((a) => {
                const isUnread = !readIds.has(String(a.id));
                return (
                  <div key={a.id} className={`notif__item ${isUnread ? "notif__item--unread" : ""}`}>
                    <span className={`notif__icon notif__icon--${(a.severity || "high").toLowerCase()}`}>
                      <ShieldAlert size={15} />
                    </span>
                    <div className="notif__text">
                      <span className="notif__title">{a.title}</span>
                      <span className="notif__time">{a.time || "Recently"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            className="notif__footer"
            onClick={() => {
              setOpen(false);
              onViewAll && onViewAll();
            }}
          >
            View all in Threat Radar
          </button>
        </div>
      )}
    </div>
  );
}

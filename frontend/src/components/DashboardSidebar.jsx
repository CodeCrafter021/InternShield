import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Building2,
  FileText,
  User,
  Settings,
  HelpCircle,
  Search,
  ChevronLeft,
  LogOut,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./DashboardSidebar.css";

export default function DashboardSidebar({
  activeView = "dashboard",
  onSelectView,
  isOpen = false,
  onClose,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Desktop collapse state (persisted in localStorage)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("internshield_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("internshield_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Meaningful navigation items arranged specifically for InternShield
  const NAV_ITEMS = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "scanner",
      label: "Offer Scanner",
      icon: ShieldCheck,
      badge: "AI",
      badgeType: "ai",
    },
    {
      id: "analytics",
      label: "Security Analytics",
      icon: BarChart3,
      badge: "Stats",
      badgeType: "ai",
    },
    {
      id: "threats",
      label: "Threat Radar",
      icon: TrendingUp,
    },
    {
      id: "companies",
      label: "Verified Directory",
      icon: Building2,
    },
    {
      id: "dossiers",
      label: "Saved Dossiers",
      icon: FileText,
    },
    {
      id: "profile",
      label: "Student Profile",
      icon: User,
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
    },
  ];

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="dashboard-sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── InternShield Sleek Navigation Sidebar ── */}
      <aside
        className={`dashboard-sidebar-v2 ${
          isCollapsed ? "sidebar--collapsed" : "sidebar--expanded"
        } ${isOpen ? "sidebar--mobile-open" : ""}`}
      >
        {/* ── Circular Edge Toggle Button ── */}
        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft
            size={14}
            className={`toggle-chevron ${
              isCollapsed ? "toggle-chevron--collapsed" : ""
            }`}
          />
        </button>

        {/* ── Brand Header ── */}
        <div
          className="sidebar-brand-row"
          onClick={() => {
            onSelectView("dashboard");
            if (isOpen && onClose) onClose();
          }}
          title="InternShield Dashboard"
        >
          <div className="sidebar-brand-emblem-wrap">
            <div className="sidebar-brand-emblem">
              <Shield size={19} className="brand-emblem-icon" />
            </div>
          </div>
          <div className="sidebar-label-col brand-label-col">
            <span className="sidebar-brand-title">InternShield</span>
            <span className="sidebar-brand-tag">Security Portal</span>
          </div>
        </div>

        {/* ── Search Bar Pill ── */}
        <div
          className="sidebar-search-wrap"
          onClick={() => isCollapsed && setIsCollapsed(false)}
        >
          <div className="sidebar-search-pill">
            <div className="search-icon-box">
              <Search size={16} className="search-pill-icon" />
            </div>
            <div className="sidebar-label-col search-input-col">
              <input
                type="text"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-pill-input"
                tabIndex={isCollapsed ? -1 : 0}
              />
            </div>
          </div>
        </div>

        {/* ── Section Title "Menu" ── */}
        <div className="sidebar-section-title">
          <div className="section-title-wrap">
            <span className="section-title-text">
              {isCollapsed ? "•••" : "Menu"}
            </span>
          </div>
        </div>

        {/* ── Navigation Menu List ── */}
        <nav className="sidebar-nav-list">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-btn ${
                  isActive ? "sidebar-nav-btn--active" : ""
                }`}
                onClick={() => {
                  onSelectView(item.id);
                  if (isOpen && onClose) onClose();
                }}
              >
                {/* Active Indicator Bar */}
                {isActive && <span className="active-indicator-bar" />}

                {/* Left Fixed Icon Slot */}
                <div className="nav-btn-icon-box">
                  <Icon size={18} strokeWidth={1.9} />
                  {isCollapsed && item.badge && (
                    <span className="collapsed-badge-dot" />
                  )}
                </div>

                {/* Right Flexible Label Slot */}
                <div className="sidebar-label-col nav-label-col">
                  <span className="nav-btn-label">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`nav-btn-badge ${
                        item.badgeType === "ai"
                          ? "nav-btn-badge--ai"
                          : "nav-btn-badge--alert"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Tooltip on Collapsed Mode */}
                {isCollapsed && (
                  <span className="sidebar-collapsed-tooltip">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Bottom Section (Tailored to InternShield) ── */}
        <div className="sidebar-bottom-block">
          <div className="sidebar-bottom-divider" />

          {/* Settings (fixed at bottom) */}
          <button
            type="button"
            className={`sidebar-action-row settings-action-row ${
              activeView === "settings" ? "sidebar-action-row--active" : ""
            }`}
            onClick={() => {
              onSelectView("settings");
              if (isOpen && onClose) onClose();
            }}
            title="Settings"
          >
            <div className="action-icon-box">
              <Settings size={18} strokeWidth={1.9} />
            </div>
            <div className="sidebar-label-col settings-label-col">
              <span className="settings-action-label">Settings</span>
            </div>
            {isCollapsed && (
              <span className="sidebar-collapsed-tooltip">Settings</span>
            )}
          </button>

          {/* Clean Logout Option */}
          <button
            type="button"
            className="sidebar-action-row logout-action-row"
            onClick={handleLogout}
            title="Logout"
          >
            <div className="action-icon-box">
              <LogOut size={16} />
            </div>
            <div className="sidebar-label-col logout-label-col">
              <span className="logout-action-label">Logout</span>
            </div>
            {isCollapsed && (
              <span className="sidebar-collapsed-tooltip">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

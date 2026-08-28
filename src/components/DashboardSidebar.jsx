import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutGrid,
  Banknote,
  HelpCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./DashboardSidebar.css";

// Avatar presets mapping for avatar icons
const AVATAR_EMOJIS = {
  "avatar-cyber-1": "🛡️",
  "avatar-cyber-2": "⚡",
  "avatar-cyber-3": "🤖",
  "avatar-cyber-4": "🔮",
  "avatar-cyber-5": "🚀",
};

export default function DashboardSidebar({
  activeView = "dashboard",
  onSelectView,
  isOpen = false,
  onClose,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleBackToHome() {
    navigate("/");
  }

  const avatarEmoji = (user?.avatarId && AVATAR_EMOJIS[user.avatarId]) || "🛡️";

  // Streamlined Navigation Menu according to reference screenshot:
  // Excluded: Campaigns, Brand Interaction, Growth Tools, Plans, Contracts
  // Included: Dashboard, Transactions, Help/Support, Profile, Settings
  const MENU_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "transactions", label: "Transactions", icon: Banknote },
    { id: "help", label: "Help/Support", icon: HelpCircle },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  function isItemActive(itemId) {
    if (activeView === itemId) return true;
    if (itemId === "transactions" && activeView === "history") return true;
    return false;
  }

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

      <aside
        className={`dashboard-sidebar ${isOpen ? "dashboard-sidebar--open" : ""}`}
      >
        {/* ── Top Header with Back Arrow Button ── */}
        <div className="sidebar-top-bar">
          <button
            type="button"
            className="sidebar-back-btn"
            onClick={handleBackToHome}
            title="Back to Home"
            aria-label="Back to Home"
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* ── User Profile Header Capsule (Exact Reference Screenshot Layout) ── */}
        <div
          className="sidebar-profile-card"
          onClick={() => {
            onSelectView("profile");
            if (onClose) onClose();
          }}
          title="View Student Profile"
          style={{ cursor: "pointer" }}
        >
          <div className="sidebar-avatar-wrap">
            <div className="sidebar-avatar-circle">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "Avatar"}
                  className="sidebar-avatar-img"
                />
              ) : (
                <span className="sidebar-avatar-emoji">{avatarEmoji}</span>
              )}
            </div>
            {/* Status badge pill overlay matching screenshot */}
            <span className="sidebar-avatar-badge">5v</span>
          </div>

          <div className="sidebar-user-details">
            <strong className="sidebar-user-name">
              {user?.name || "Atharva Wallapkar"}
            </strong>
            <span className="sidebar-user-email" title={user?.email || "atharvawallapkar261@gmail.com"}>
              {user?.email || "atharvawallapkar261@gmail.com"}
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="sidebar-divider" />

        {/* ── Menu Items Navigation List ── */}
        <nav className="sidebar-nav-menu">
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const active = isItemActive(item.id);

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${
                  active ? "sidebar-nav-item--active" : ""
                }`}
                onClick={() => {
                  onSelectView(item.id);
                  if (onClose) onClose();
                }}
              >
                <span className="sidebar-nav-item__icon">
                  <IconComponent size={20} strokeWidth={1.8} />
                </span>
                <span className="sidebar-nav-item__label">{item.label}</span>
              </button>
            );
          })}

          {/* ── Logout Button at Bottom of Menu List ── */}
          <button
            type="button"
            className="sidebar-nav-item sidebar-nav-item--logout"
            onClick={handleLogout}
          >
            <span className="sidebar-nav-item__icon">
              <LogOut size={20} strokeWidth={1.8} />
            </span>
            <span className="sidebar-nav-item__label">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}


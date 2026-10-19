import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  ClipboardList,
  ListChecks,
  Sparkles,
  HeartHandshake,
  History,
  MessageSquare,
  Settings,
  LogOut,
  Home
} from "lucide-react";

export const SUPPORTER_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "discover", label: "Discover Campaigns", icon: Compass },
  { id: "workshops", label: "Workshops", icon: GraduationCap },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "commitments", label: "Commitments", icon: ListChecks },
  { id: "donations", label: "Donations", icon: HeartHandshake },
  { id: "impact", label: "My Impact", icon: Sparkles },
  { id: "history", label: "Activity History", icon: History },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function SupporterSidebar({ activeTab, onSelectTab, isOpen, onClose, supporterName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        id="sidebar-scrim"
        style={{ display: isOpen ? "block" : "none" }}
        onClick={onClose}
      />

      <aside id="sidebar" className={isOpen ? "open" : ""}>
        {/* Brand Header */}
        <div className="brand">
          <Link to="/" className="brand-mark" style={{ textDecoration: 'none' }}>
            <div className="brand-logo">A</div>
            <div>
              <div className="brand-name">AidLink</div>
              <div className="brand-org">{supporterName || "Supporter Portal"}</div>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="mainnav">
          <div className="nav-section-label">Navigation</div>
          {SUPPORTER_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  onSelectTab(id);
                  if (onClose) onClose();
                }}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={17} style={{ opacity: isActive ? 1 : 0.85 }} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="sidebar-foot" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{ color: '#D7E4DF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
          >
            <Home size={15} />
            <span>Public Home</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: '#FA8072', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0, fontSize: '12px' }}
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import Icon from './Icons';

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "campaigns", label: "Campaigns", icon: "campaigns" },
  { id: "workshops", label: "Workshops", icon: "activities" },
  { id: "activities", label: "Activities", icon: "activities" },
  { id: "volunteers", label: "Volunteers", icon: "volunteers" },
  { id: "resources", label: "Resources", icon: "resources" },
  { id: "donations", label: "Donations", icon: "donations" },
  { id: "expenses", label: "Expenses", icon: "expenses" },
  { id: "evidence", label: "Evidence", icon: "evidence" },
  { id: "reports", label: "Reports", icon: "reports" },
  { id: "feedback", label: "Feedback", icon: "feedback" },
  { id: "transparency", label: "Transparency", icon: "transparency" },
  { id: "org-profile", label: "Organisation Profile", icon: "org" },
];

export default function Sidebar({ currentView, onNav, pendingVolCount, missingEvidenceCount, orgName, isSidebarOpen, onCloseSidebar }) {
  const navigate = useNavigate();
  const activeItem = currentView === "campaign-detail" ? "campaigns" : currentView;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <div
        id="sidebar-scrim"
        style={{ display: isSidebarOpen ? "block" : "none" }}
        onClick={onCloseSidebar}
      />
      <aside id="sidebar" className={isSidebarOpen ? "open" : ""}>
        <div className="brand">
          <div className="brand-mark">
            <div className="brand-logo">A</div>
            <div className="brand-name">AidLink</div>
          </div>
          <div className="brand-org">{orgName}</div>
        </div>
        <nav className="mainnav">
          {NAV_ITEMS.map((item) => {
            let badge = null;
            if (item.id === "volunteers" && pendingVolCount > 0) {
              badge = <span className="nav-badge">{pendingVolCount}</span>;
            }
            if (item.id === "expenses" && missingEvidenceCount > 0) {
              badge = <span className="nav-badge">{missingEvidenceCount}</span>;
            }
            return (
              <button
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {badge}
              </button>
            );
          })}
        </nav>
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

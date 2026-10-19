import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icons';
import { initials } from '../../data/mockData';

export default function Topbar({ 
  org, 
  notifications = [], 
  onDismissNotification,
  onMarkAllNotificationsRead,
  onToggleSidebar, 
  onOpenNewCampaignModal, 
  onOpenNewWorkshopModal, 
  onNav, 
  onNavCampaign,
  onSearch 
}) {
  const [searchInput, setSearchInput] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = Array.isArray(notifications) ? notifications.length : 0;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isNotifOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchInput);
    }
  };

  const handleNotificationClick = (notif) => {
    setIsNotifOpen(false);
    if (onDismissNotification) {
      onDismissNotification(notif.id);
    }
    if (notif.campaignId && onNavCampaign) {
      const tab = notif.type === 'volunteer' ? 'volunteers' :
                  notif.type === 'evidence' ? 'evidence' :
                  notif.type === 'resource' ? 'resources' :
                  notif.type === 'update' ? 'updates' : 'chain';
      onNavCampaign(notif.campaignId, tab);
    } else if (notif.type === 'volunteer') {
      onNav('volunteers');
    } else if (notif.type === 'evidence') {
      onNav('evidence');
    } else if (notif.type === 'verification') {
      onNav('profile');
    } else {
      onNav('overview');
    }
  };

  return (
    <header id="topbar">
      <button 
        id="menu-btn" 
        className="icon-btn" 
        onClick={onToggleSidebar} 
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>

      <div className="search-box">
        <Icon name="search" />
        <input 
          type="text" 
          placeholder="Search campaigns, volunteers, evidence…" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="topbar-right">
        <button className="btn btn-secondary btn-sm" onClick={onOpenNewWorkshopModal}>
          <Icon name="activities" /> Organize workshop
        </button>
        <button className="btn btn-primary btn-sm" onClick={onOpenNewCampaignModal}>
          <Icon name="plus" /> New campaign
        </button>

        {/* Functioning Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            className="icon-btn" 
            aria-label="Notifications" 
            title="Notifications"
            onClick={() => setIsNotifOpen(prev => !prev)}
            style={{ color: isNotifOpen ? 'var(--accent)' : undefined }}
          >
            <Icon name="bell" />
            {unreadCount > 0 && <span className="dot-badge"></span>}
          </button>

          {isNotifOpen && (
            <div className="notif-dropdown">
              <div className="notif-head">
                <div className="notif-head-title">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge badge-info">{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      if (onMarkAllNotificationsRead) onMarkAllNotificationsRead();
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', fontSize: '11.5px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--ink-soft)' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>No unread notifications</div>
                    <div style={{ fontSize: '11.8px', color: 'var(--ink-faint)', marginTop: '4px' }}>You're all caught up on all campaign activities.</div>
                  </div>
                ) : (
                  notifications.map(n => {
                    const dotColor = n.severity === 'warn' ? 'var(--warn)' : n.severity === 'action' ? 'var(--danger)' : 'var(--info)';
                    return (
                      <div 
                        key={n.id} 
                        className="notif-item"
                        onClick={() => handleNotificationClick(n)}
                      >
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: dotColor, marginTop: '5px', flexShrink: 0 }}></span>
                        <div className="notif-item-body">
                          <div className="notif-item-title">{n.text}</div>
                          <div className="notif-item-sub">
                            {n.campaignId && <span style={{ fontWeight: 600 }}>{n.campaignId}</span>}
                            {n.campaignId && <span>·</span>}
                            <span>{n.ts}</span>
                          </div>
                        </div>
                        <button 
                          className="notif-item-dismiss" 
                          title="Dismiss"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDismissNotification) onDismissNotification(n.id);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="notif-foot">
                  <button 
                    onClick={() => {
                      setIsNotifOpen(false);
                      onNav('overview');
                    }}
                  >
                    View operational overview →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="topbar-org">
          <div className="org-avatar">{initials(org.shortName)}</div>
          <div className="org-meta">
            <div className="n">{org.name}</div>
            <div className="v">
              <Icon name="check" /> Platform-verified
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

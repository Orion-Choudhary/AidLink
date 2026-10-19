import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';

export default function CampaignsList({ campaigns, initialFilter, onNavCampaign, onOpenNewCampaignModal }) {
  const [statusFilter, setStatusFilter] = useState(initialFilter.status || 'all');
  const [query, setQuery] = useState(initialFilter.q || '');

  const filteredList = campaigns.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (query && !(c.name.toLowerCase().includes(query.toLowerCase()) || c.region.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const counts = {
    all: campaigns.length,
    active: campaigns.filter(c => c.status === "active").length,
    draft: campaigns.filter(c => c.status === "draft").length,
    closed: campaigns.filter(c => c.status === "closed").length,
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Campaigns</h1>
          <div className="page-sub">Every relief campaign run through AidLink, with its current status, progress and location.</div>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewCampaignModal}>
          <Icon name="plus" /> New campaign
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className="pillrow">
          <button className={`pill-filter ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
            All ({counts.all})
          </button>
          <button className={`pill-filter ${statusFilter === 'active' ? 'active' : ''}`} onClick={() => setStatusFilter('active')}>
            Active ({counts.active})
          </button>
          <button className={`pill-filter ${statusFilter === 'draft' ? 'active' : ''}`} onClick={() => setStatusFilter('draft')}>
            Draft ({counts.draft})
          </button>
          <button className={`pill-filter ${statusFilter === 'closed' ? 'active' : ''}`} onClick={() => setStatusFilter('closed')}>
            Closed ({counts.closed})
          </button>
        </div>
        <div className="search-box" style={{ maxWidth: '260px' }}>
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="Search campaigns…" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No campaigns match your filters</div>
          <div className="empty-sub">Try a different status filter or search term.</div>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredList.map(c => (
            <div key={c.id} className="card card-pad row-clickable" onClick={() => onNavCampaign(c.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '16px' }}>{c.name}</div>
                  <div className="faint" style={{ fontSize: '12px', marginTop: '3px' }}>{c.region}</div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {(c.is_urgent || c.isUrgent) && (
                    <span className="badge badge-danger">
                      URGENT
                    </span>
                  )}
                  <StatusBadge status={c.status} />
                </div>
              </div>
              <div style={{
                fontSize: '12.8px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '12px',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {c.objective}
              </div>
              {c.status !== "draft" ? (
                <div className="progress-row" style={{ marginBottom: '10px' }}>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${c.progress}%`,
                        background: c.health === 'at_risk' ? 'var(--warn)' : c.health === 'delayed' ? 'var(--danger)' : 'var(--accent)'
                      }}
                    ></div>
                  </div>
                  <div className="progress-num">{c.progress}%</div>
                </div>
              ) : (
                <div className="faint" style={{ fontSize: '12px', marginBottom: '10px' }}>Not yet published</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }} className="faint">
                <span>{c.disaster}</span>
                {c.status !== "draft" && <StatusBadge status={c.health} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

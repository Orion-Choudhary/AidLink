import React from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtDate, daysAgo } from '../../../data/mockData';

export default function Overview({ campaigns, volunteers, expenses, notifications, onNav, onNavCampaign, onShowToast }) {
  const activeCampaigns = campaigns.filter(c => c.status === "active");
  const draftCampaigns = campaigns.filter(c => c.status === "draft");
  const totalHouseholds = activeCampaigns.reduce((s, c) => s + c.beneficiaries.householdsReached, 0);
  const pendingVols = volunteers.filter(v => v.status === "pending");
  const missingEv = expenses.filter(e => e.status === "missing_evidence");
  
  const overdueUpdates = activeCampaigns
    .map(c => ({ c, days: daysAgo(c.lastUpdatePublished) }))
    .filter(x => x.days !== null && x.days > 14);

  const upcomingActivities = campaigns
    .flatMap(c => c.activities.map(a => ({ ...a, campaignId: c.id, campaignName: c.name })))
    .filter(a => a.status === "scheduled" || a.status === "in_progress")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const recentActivity = campaigns
    .flatMap(c => c.audit.map(a => ({ ...a, campaignName: c.name, campaignId: c.id })))
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 7);

  // Attention items builder
  const attentionItems = [];
  if (pendingVols.length > 0) {
    attentionItems.push({
      icon: "volunteers",
      tone: "warn",
      title: `${pendingVols.length} volunteer application${pendingVols.length > 1 ? 's' : ''} awaiting review`,
      sub: pendingVols.slice(0, 3).map(v => v.name).join(", ") + (pendingVols.length > 3 ? ` +${pendingVols.length - 3} more` : ""),
      action: <button className="btn btn-secondary btn-sm" onClick={() => onNav('volunteers')}>Review</button>
    });
  }
  missingEv.forEach(e => {
    attentionItems.push({
      icon: "expenses",
      tone: "warn",
      title: `Expense missing evidence — ₹${Number(e.amount).toLocaleString("en-IN")}`,
      sub: `${e.category} · ${e.campaignName}`,
      action: <button className="btn btn-secondary btn-sm" onClick={() => onNavCampaign(e.campaignId, 'expenses')}>Open</button>
    });
  });
  overdueUpdates.forEach(o => {
    attentionItems.push({
      icon: "reports",
      tone: "danger",
      title: `Progress update overdue — ${o.days} days since last update`,
      sub: o.c.name,
      action: <button className="btn btn-secondary btn-sm" onClick={() => onNavCampaign(o.c.id, 'updates')}>Publish update</button>
    });
  });
  activeCampaigns.forEach(c => {
    c.resources.filter(r => (r.allocated - r.deployed) < r.allocated * 0.15 && r.deployed > 0).forEach(r => {
      attentionItems.push({
        icon: "resources",
        tone: "info",
        title: `${r.name} running low — ${(r.allocated - r.deployed).toLocaleString("en-IN")} ${r.unit} remaining`,
        sub: c.name,
        action: <button className="btn btn-secondary btn-sm" onClick={() => onNavCampaign(c.id, 'resources')}>View</button>
      });
    });
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Overview</h1>
          <div className="page-sub">What's happening across relief campaigns right now, what needs your attention, and what to document next.</div>
        </div>
        <button className="btn btn-secondary" onClick={() => onNav('campaigns')}>
          View all campaigns <Icon name="chevronRight" />
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '18px' }}>
        <div className="card card-pad">
          <div className="stat-label">Active campaigns</div>
          <div className="stat-num">{activeCampaigns.length}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>{draftCampaigns.length} in draft</div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Households reached</div>
          <div className="stat-num">{totalHouseholds.toLocaleString("en-IN")}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>across active campaigns</div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Pending volunteer review</div>
          <div className="stat-num" style={{ color: pendingVols.length > 0 ? "var(--warn)" : "var(--success)" }}>
            {pendingVols.length}
          </div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>
            {pendingVols.length > 0 ? "needs a decision" : "all caught up"}
          </div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Expenses missing evidence</div>
          <div className="stat-num" style={{ color: missingEv.length > 0 ? "var(--warn)" : "var(--success)" }}>
            {missingEv.length}
          </div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>
            {missingEv.length > 0 ? "documentation gap" : "all documented"}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-pad">
          <div className="section-title-row">
            <div className="card-title">Needs your attention</div>
          </div>
          {attentionItems.length === 0 ? (
            <div className="empty">
              <div className="empty-title">Nothing needs attention right now</div>
              <div className="empty-sub">New volunteer applications, evidence gaps and overdue updates will show up here.</div>
            </div>
          ) : (
            attentionItems.map((it, idx) => (
              <div key={idx} className="attn-item">
                <div 
                  className="attn-icon" 
                  style={{
                    background: `var(--${it.tone === 'warn' ? 'warn' : it.tone === 'danger' ? 'danger' : 'info'}-tint)`,
                    color: `var(--${it.tone === 'warn' ? 'warn' : it.tone === 'danger' ? 'danger' : 'info'})`
                  }}
                >
                  <Icon name={it.icon} />
                </div>
                <div className="attn-body">
                  <div className="attn-title">{it.title}</div>
                  <div className="attn-sub">{it.sub}</div>
                </div>
                <div className="attn-action">{it.action}</div>
              </div>
            ))
          )}
        </div>

        <div className="card card-pad">
          <div className="section-title-row">
            <div className="card-title">Active campaign health</div>
            <span className="link-all" onClick={() => onNav('campaigns')}>View all</span>
          </div>
          {activeCampaigns.map(c => (
            <div 
              key={c.id}
              className="row-clickable" 
              onClick={() => onNavCampaign(c.id)} 
              style={{ padding: '11px 0', borderBottom: '1px solid var(--border)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px', gap: '10px' }}>
                <div style={{ fontWeight: 600, fontSize: '13.4px' }}>{c.name}</div>
                <StatusBadge status={c.health} />
              </div>
              <div className="progress-row">
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
              <div className="faint" style={{ fontSize: '11.5px', marginTop: '5px' }}>{c.region}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', marginTop: '16px' }}>
        <div className="card card-pad">
          <div className="section-title-row">
            <div className="card-title">Upcoming &amp; in-progress activities</div>
            <span className="link-all" onClick={() => onNav('activities')}>View all</span>
          </div>
          {upcomingActivities.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No upcoming activities</div>
              <div className="empty-sub">Scheduled or in-progress activities across campaigns will appear here.</div>
            </div>
          ) : (
            <table>
              <tbody>
                {upcomingActivities.map(a => (
                  <tr key={a.id} className="row-clickable" onClick={() => onNavCampaign(a.campaignId, 'activities')}>
                    <td>
                      <div className="cell-main">{a.title}</div>
                      <div className="cell-sub">{a.campaignName} · {a.location}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(a.date)}</td>
                    <td><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card card-pad">
          <div className="section-title-row">
            <div className="card-title">Recent system activity</div>
            <span className="link-all" onClick={() => onNav('transparency')}>Full audit trail</span>
          </div>
          <div className="timeline">
            {recentActivity.map((a, idx) => (
              <div key={idx} className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-when">{a.ts}</div>
                <div className="tl-title">{a.action}</div>
                <div className="tl-body">{a.detail} <span className="faint">— {a.campaignName}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

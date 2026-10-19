import React from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtINR, fmtDate } from '../../../data/mockData';

export default function TransparencyPage({ campaigns = [], org, onNav }) {
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  const totalDonations = safeCampaigns.reduce((s, c) => s + (c.donations || []).reduce((sub, d) => sub + (Number(d.amount) || 0), 0), 0);
  const totalExpenses = safeCampaigns.reduce((s, c) => s + (c.expenses || []).reduce((sub, e) => sub + (Number(e.amount) || 0), 0), 0);
  const allReportsCount = safeCampaigns.reduce((s, c) => s + (c.impactReports || []).filter(r => r.status === 'published').length, 0);

  const allAudit = safeCampaigns
    .flatMap(c => (c.audit || []).map(a => ({ ...a, campaignName: c.name })))
    .sort((a, b) => new Date(b.ts) - new Date(a.ts));

  const allExpenses = safeCampaigns.flatMap(c => c.expenses || []);
  const totalExpCount = allExpenses.length;
  const withEvCount = allExpenses.filter(e => e.evidence_linked || e.evidenceLinked).length;
  const expCoveragePct = totalExpCount > 0 ? Math.round((withEvCount / totalExpCount) * 100) : 0;

  const orgName = org?.name || org?.org_name || 'Organisation';
  const verificationDate = org?.verification?.completedOn || org?.created_at || new Date().toISOString();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Transparency</h1>
          <div className="page-sub">The organisation-wide accountability record — financial totals, verification standing, and a full audit trail.</div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '18px' }}>
        <div className="card card-pad">
          <div className="stat-label">Campaigns run</div>
          <div className="stat-num">{safeCampaigns.length}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>
            {safeCampaigns.filter(c => c.status === 'active').length} currently active
          </div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Donations recorded</div>
          <div className="stat-num">{fmtINR(totalDonations)}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>across all campaigns</div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Declared expenses</div>
          <div className="stat-num">{fmtINR(totalExpenses)}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>self-reported</div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Published impact reports</div>
          <div className="stat-num">{allReportsCount}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>campaign-level reports</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', marginBottom: '18px' }}>
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: '10px' }}>Verification standing</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <StatusBadge status={org?.verification_status || "verified"} />
            <span className="faint" style={{ fontSize: '12px' }}>Completed {fmtDate(verificationDate)}</span>
          </div>
          <p style={{ fontSize: '12.8px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            Platform verification confirms {orgName} completed AidLink's registration, Darpan certification, financial disclosure, and leadership checks.
          </p>
          <span className="link-all" onClick={() => onNav && onNav('org-profile')}>View verification detail →</span>
        </div>

        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: '10px' }}>Expense documentation coverage</div>
          <div className="progress-row" style={{ marginBottom: '8px' }}>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${expCoveragePct}%` }}></div></div>
            <div className="progress-num">{expCoveragePct}%</div>
          </div>
          <div className="faint" style={{ fontSize: '12.2px' }}>
            {withEvCount} of {totalExpCount} declared expenses have supporting evidence attached.
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <div className="card-title" style={{ marginBottom: '12px' }}>Full audit trail</div>
        {allAudit.length === 0 ? (
          <div className="faint" style={{ fontSize: '13px', padding: '16px 0' }}>No audit trail actions logged yet.</div>
        ) : (
          <div className="timeline">
            {allAudit.slice(0, 25).map((a, idx) => (
              <div key={idx} className="tl-item">
                <div className="tl-dot"></div>
                <div className="tl-when">{a.ts ? new Date(a.ts).toLocaleString() : 'Recent'} · <span className="faint">{a.actor || 'System'}</span></div>
                <div className="tl-title">{a.action}</div>
                <div className="tl-body">{a.detail} <span className="faint">— {a.campaignName}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


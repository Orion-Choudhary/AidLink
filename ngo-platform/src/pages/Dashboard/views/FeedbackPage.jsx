import React from 'react';
import Icon from '../../../components/Dashboard/Icons';
import { fmtDate } from '../../../data/mockData';

export default function FeedbackPage({ feedbackList, campaigns }) {
  const dimsAgg = {};
  feedbackList.forEach(f => {
    Object.entries(f.dims).forEach(([k, v]) => {
      dimsAgg[k] = dimsAgg[k] || [];
      dimsAgg[k].push(v);
    });
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Feedback</h1>
          <div className="page-sub">Feedback from verified interactions only — volunteers and beneficiary representatives directly involved in a campaign.</div>
        </div>
      </div>

      <div className="notice notice-info" style={{ marginBottom: '18px' }}>
        <Icon name="shield" />
        <div>
          <div className="notice-title">Restricted to verified interactions</div>
          <div className="notice-body">Only people confirmed to have participated in or been reached by a specific campaign activity can leave feedback here. This is shown by theme rather than as a single combined score.</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '20px' }}>
        {Object.entries(dimsAgg).map(([k, vals]) => {
          const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
          return (
            <div key={k} className="card card-pad">
              <div className="stat-label">{k}</div>
              <div className="stat-num" style={{ fontSize: '24px' }}>{avg}<span className="faint" style={{ fontSize: '14px' }}> / 5</span></div>
              <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>from {vals.length} verified response{vals.length > 1 ? 's' : ''}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        {feedbackList.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(f => {
          const c = campaigns.find(x => x.id === f.campaignId) || { name: 'Campaign' };
          return (
            <div key={f.id} style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13.4px' }}>{f.name} <span className="faint" style={{ fontWeight: 400 }}>— {f.source}</span></div>
                  <div className="faint" style={{ fontSize: '11.8px' }}>
                    {c.name} · {fmtDate(f.date)} <span className="badge badge-success" style={{ marginLeft: '6px' }}><span className="badge-dot"></span> Verified interaction</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '6px 0 8px' }}>{f.comment}</p>
              <div className="pillrow">
                {Object.entries(f.dims).map(([k, v]) => (
                  <span key={k} className="badge badge-neutral">{k}: {v}/5</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

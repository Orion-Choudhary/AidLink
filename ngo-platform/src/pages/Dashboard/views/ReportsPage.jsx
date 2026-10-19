import React from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtDate } from '../../../data/mockData';

export default function ReportsPage({ campaigns, onViewImpactReport, onNavCampaign }) {
  const allReports = campaigns.flatMap(c => c.impactReports.map(r => ({ ...r, campaignId: c.id, campaignName: c.name })));
  const eligibleCampaigns = campaigns.filter(c => c.status !== "draft" && c.impactReports.length === 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <div className="page-sub">Structured impact reports generated and published from campaign data.</div>
        </div>
      </div>

      {allReports.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No impact reports published yet</div>
          <div className="empty-sub">Open a campaign and generate its impact report from the Impact Report tab.</div>
        </div>
      ) : (
        <div className="table-wrap" style={{ marginBottom: '22px' }}>
          <table>
            <thead>
              <tr><th>Report</th><th>Campaign</th><th>Period</th><th>Published</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {allReports.map(r => (
                <tr key={r.id}>
                  <td className="cell-main">{r.title}</td>
                  <td className="faint">{r.campaignName}</td>
                  <td className="faint">{r.period}</td>
                  <td className="mono">{fmtDate(r.publishedOn)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => onViewImpactReport(r.campaignId, r.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {eligibleCampaigns.length > 0 && (
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: '10px' }}>Campaigns without a published report</div>
          {eligibleCampaigns.map(c => (
            <div key={c.id} className="attn-item">
              <div className="attn-icon" style={{ background: 'var(--info-tint)', color: 'var(--info)' }}><Icon name="reports" /></div>
              <div className="attn-body">
                <div className="attn-title">{c.name}</div>
                <div className="attn-sub">{c.progress}% progress · {c.region}</div>
              </div>
              <div className="attn-action">
                <button className="btn btn-secondary btn-sm" onClick={() => onNavCampaign(c.id, 'impact')}>
                  Generate report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

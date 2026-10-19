import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtDate, initials } from '../../../data/mockData';

export default function VolunteersPage({ campaigns, onNavCampaign, onDecideVolunteer }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [query, setQuery] = useState('');

  const allVolunteers = campaigns.flatMap(c => 
    (c.volunteers || []).map(v => ({ 
      ...v, 
      campaignId: c.id, 
      campaignName: c.name 
    }))
  );

  const campaignFilteredVolunteers = campaignFilter === 'all'
    ? allVolunteers
    : allVolunteers.filter(v => String(v.campaignId) === String(campaignFilter));

  let list = campaignFilteredVolunteers;
  if (statusFilter !== "all") {
    list = list.filter(v => (v.status || '').toLowerCase() === statusFilter.toLowerCase());
  }
  if (query) {
    list = list.filter(v => (v.name || '').toLowerCase().includes(query.toLowerCase()));
  }

  const counts = { all: campaignFilteredVolunteers.length };
  ["pending", "active", "rejected"].forEach(s => {
    counts[s] = campaignFilteredVolunteers.filter(v => (v.status || '').toLowerCase() === s).length;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Volunteers</h1>
          <div className="page-sub">Applications, supporting documents, and participation across every campaign.</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label htmlFor="volunteer-campaign-filter" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
              Campaign:
            </label>
            <select
              id="volunteer-campaign-filter"
              className="field-input"
              style={{
                width: 'auto',
                minWidth: '220px',
                maxWidth: '320px',
                padding: '5px 10px',
                fontSize: '12.5px',
                height: '32px',
                cursor: 'pointer'
              }}
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
            >
              <option value="all">All campaigns ({allVolunteers.length})</option>
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({(c.volunteers || []).length})
                </option>
              ))}
            </select>
          </div>

          <div className="pillrow">
            <button className={`pill-filter ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
              All ({counts.all})
            </button>
            <button className={`pill-filter ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => setStatusFilter('pending')}>
              Pending review ({counts.pending})
            </button>
            <button className={`pill-filter ${statusFilter === 'active' ? 'active' : ''}`} onClick={() => setStatusFilter('active')}>
              Active ({counts.active})
            </button>
            <button className={`pill-filter ${statusFilter === 'rejected' ? 'active' : ''}`} onClick={() => setStatusFilter('rejected')}>
              Declined ({counts.rejected})
            </button>
          </div>
        </div>

        <div className="search-box" style={{ maxWidth: '220px' }}>
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="Search name…" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No volunteers found</div>
          <div className="empty-sub">
            {campaignFilter !== 'all'
              ? 'No volunteers found for the selected campaign and filter.'
              : 'Try a different filter or search term.'}
          </div>
          {(campaignFilter !== 'all' || statusFilter !== 'all' || query) && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
              onClick={() => {
                setCampaignFilter('all');
                setStatusFilter('all');
                setQuery('');
              }}
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Campaign</th>
                <th>Role &amp; Skills</th>
                <th>Applied</th>
                <th>Hours</th>
                <th>Supporting Document / CV</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(v => {
                const docPath = v.document_path || v.documentPath;
                const isPending = (v.status || '').toLowerCase() === 'pending' || v.status === 'APPLIED';
                return (
                  <tr key={v.id}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div className="avatar-sm">{initials(v.name || 'V')}</div>
                      <div>
                        <div className="cell-main">{v.name}</div>
                      </div>
                    </td>
                    <td className="faint row-clickable" onClick={() => onNavCampaign(v.campaignId, 'volunteers')}>
                      {v.campaignName}
                    </td>
                    <td>
                      <div className="cell-main">{v.role || 'Volunteer'}</div>
                      {v.skills && (
                        <div className="cell-sub faint">
                          {Array.isArray(v.skills) ? v.skills.join(', ') : v.skills}
                        </div>
                      )}
                    </td>
                    <td className="mono">{fmtDate(v.appliedOn || v.applied_on)}</td>
                    <td className="mono">{v.hoursLogged || v.hours_logged || 0}</td>
                    <td>
                      {docPath ? (
                        <a
                          href={`http://localhost:5000/${docPath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                        >
                          <Icon name="reports" /> View CV / Doc
                        </a>
                      ) : (
                        <span className="faint" style={{ fontSize: '11px' }}>—</span>
                      )}
                    </td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>
                      {isPending ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            title="Decline Volunteer"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onDecideVolunteer(v.campaignId, v.id, 'rejected')}
                          >
                            Decline
                          </button>
                          <button
                            title="Approve Volunteer"
                            className="btn btn-primary btn-sm"
                            onClick={() => onDecideVolunteer(v.campaignId, v.id, 'active')}
                          >
                            Approve
                          </button>
                        </div>
                      ) : (v.status || '').toLowerCase() === 'active' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            title="Decline Volunteer"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onDecideVolunteer(v.campaignId, v.id, 'rejected')}
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            title="Approve Volunteer"
                            className="btn btn-primary btn-sm"
                            onClick={() => onDecideVolunteer(v.campaignId, v.id, 'active')}
                          >
                            Approve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

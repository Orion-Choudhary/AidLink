import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtDate } from '../../../data/mockData';

export default function ActivitiesPage({ campaigns, onNavCampaign }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const allActivities = campaigns.flatMap(c => c.activities.map(a => ({ ...a, campaignId: c.id, campaignName: c.name })));

  let list = allActivities;
  if (statusFilter !== "all") {
    list = list.filter(a => a.status === statusFilter);
  }
  list = list.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  const counts = { all: allActivities.length };
  ["scheduled", "in_progress", "completed"].forEach(s => {
    counts[s] = allActivities.filter(a => a.status === s).length;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Activities</h1>
          <div className="page-sub">Relief activities and their schedule across every campaign.</div>
        </div>
      </div>
      <div className="pillrow" style={{ marginBottom: '16px' }}>
        <button className={`pill-filter ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          All ({counts.all})
        </button>
        <button className={`pill-filter ${statusFilter === 'scheduled' ? 'active' : ''}`} onClick={() => setStatusFilter('scheduled')}>
          Scheduled ({counts.scheduled})
        </button>
        <button className={`pill-filter ${statusFilter === 'in_progress' ? 'active' : ''}`} onClick={() => setStatusFilter('in_progress')}>
          In progress ({counts.in_progress})
        </button>
        <button className={`pill-filter ${statusFilter === 'completed' ? 'active' : ''}`} onClick={() => setStatusFilter('completed')}>
          Completed ({counts.completed})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No activities found</div>
          <div className="empty-sub">Try a different filter.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Activity</th><th>Campaign</th><th>Type</th><th>Date</th><th>Location</th><th>Status</th></tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id} className="row-clickable" onClick={() => onNavCampaign(a.campaignId, 'activities')}>
                  <td className="cell-main">{a.title}</td>
                  <td className="faint">{a.campaignName}</td>
                  <td>{a.type}</td>
                  <td className="mono">{fmtDate(a.date)}</td>
                  <td>{a.location}</td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import { fmtDate } from '../../../data/mockData';

export default function EvidencePage({ campaigns, onNavCampaign }) {
  const [query, setQuery] = useState('');

  const allEvidence = campaigns.flatMap(c => c.evidence.map(e => ({ ...e, campaignId: c.id, campaignName: c.name })));

  let list = allEvidence;
  if (query) {
    list = list.filter(e => e.title.toLowerCase().includes(query.toLowerCase()));
  }
  list = list.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Evidence</h1>
          <div className="page-sub">All supporting documentation uploaded across campaigns — organised, not guaranteed proof.</div>
        </div>
      </div>

      <div className="search-box" style={{ maxWidth: '280px', marginBottom: '16px' }}>
        <Icon name="search" />
        <input 
          type="text" 
          placeholder="Search evidence…" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <div className="empty-title">No evidence found</div>
          <div className="empty-sub">Try a different search term.</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Item</th><th>Campaign</th><th>Type</th><th>Linked to</th><th>Uploaded by</th><th>Date</th></tr>
            </thead>
            <tbody>
              {list.map(e => (
                <tr key={e.id} className="row-clickable" onClick={() => onNavCampaign(e.campaignId, 'evidence')}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <span className="faint"><Icon name={e.type === "Photo Set" ? "photo" : "file"} /></span>
                    {e.title}
                  </td>
                  <td className="faint">{e.campaignName}</td>
                  <td>{e.type}</td>
                  <td className="faint">{e.linkedTo}</td>
                  <td>{e.uploadedBy}</td>
                  <td className="mono">{fmtDate(e.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';

export default function WorkshopsPage({ 
  workshops, 
  onOpenNewWorkshopModal,
  onOpenEditWorkshopModal,
  onOpenDiscardWorkshopModal
}) {
  const [query, setQuery] = useState('');

  const list = (workshops || []).filter(w => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (w.title && w.title.toLowerCase().includes(q)) ||
      (w.city && w.city.toLowerCase().includes(q)) ||
      (w.location && w.location.toLowerCase().includes(q)) ||
      (w.form_url && w.form_url.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Community Workshops</h1>
          <div className="page-sub">Skill development, first responder training, and crisis preparedness workshops organized by your NGO.</div>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewWorkshopModal}>
          <Icon name="plus" /> Organize workshop
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div className="pillrow">
          <span className="pill-filter active">All Workshops ({list.length})</span>
        </div>
        <div className="search-box" style={{ maxWidth: '280px' }}>
          <Icon name="search" />
          <input 
            type="text" 
            placeholder="Search workshops or links…" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <div className="empty-title">
            {query ? 'No matching workshops found' : 'No workshops organized yet'}
          </div>
          <div className="empty-sub">
            {query 
              ? `No workshops matched "${query}". Try adjusting your search query.`
              : 'Create community training sessions on first aid, evacuation drills, or sanitation.'}
          </div>
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={onOpenNewWorkshopModal}>
            Organize first workshop
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Workshop Title</th>
                <th>Date &amp; Time</th>
                <th>Venue / Location</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Registration Form Link</th>
                <th style={{ textAlign: 'right', minWidth: '170px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(w => (
                <tr key={w.id}>
                  <td>
                    <div className="cell-main" style={{ fontWeight: 600 }}>{w.title}</div>
                    {w.description && <div className="cell-sub" style={{ maxWidth: '340px' }}>{w.description}</div>}
                  </td>
                  <td>
                    <div className="mono" style={{ fontWeight: 600 }}>{w.date || 'Upcoming'}</div>
                    <div className="faint" style={{ fontSize: '11.5px' }}>{w.time || 'Scheduled'}</div>
                  </td>
                  <td>{w.location || 'On-ground'}</td>
                  <td>
                    <span className="badge badge-neutral">{w.city || 'Patiala'}</span>
                  </td>
                  <td className="mono">{w.target_capacity || 50} seats</td>
                  <td>
                    {w.form_url ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <a 
                            href={w.form_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="badge badge-success" 
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title={w.form_url}
                          >
                            <Icon name="check" /> Form Attached ↗
                          </a>
                        </div>
                        <button
                          className="btn-ghost btn-sm"
                          style={{ fontSize: '11px', padding: '2px 6px', alignSelf: 'flex-start', color: 'var(--ink-soft)' }}
                          onClick={() => onOpenEditWorkshopModal(w)}
                        >
                          <Icon name="edit" /> Edit Link
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="faint" style={{ fontSize: '12px' }}>No form attached</span>
                        <button
                          className="btn-secondary btn-sm"
                          style={{ fontSize: '11px', padding: '2px 8px', alignSelf: 'flex-start' }}
                          onClick={() => onOpenEditWorkshopModal(w)}
                        >
                          <Icon name="plus" /> Attach Link
                        </button>
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenEditWorkshopModal(w)}
                        title="Edit workshop details or registration form link"
                      >
                        <Icon name="edit" /> Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => onOpenDiscardWorkshopModal(w)}
                        title="Discard and delete workshop"
                      >
                        <Icon name="trash" /> Discard
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

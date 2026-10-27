import React from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtDate, initials } from '../../../data/mockData';
import { API_BASE } from '../../../config/api';

export default function OrgProfilePage({ org = {}, onShowToast }) {
  const v = org?.verification || {};
  const steps = Array.isArray(v.steps) ? v.steps : [
    { label: 'Darpan Portal & Registration ID', detail: `Verified registration ID: ${org?.darpan_id || org?.regNumber || 'Valid'}` },
    { label: 'Identity & Legal Certification', detail: 'Registration certificate and supporting documentation verified.' },
    { label: 'Bank & Financial Accountability Check', detail: 'Direct donation routing & 80G tax exemption active.' }
  ];
  const sectors = Array.isArray(org?.sectors) && org.sectors.length > 0 
    ? org.sectors 
    : ['Disaster Relief', 'Emergency Aid', 'Community Rehabilitation'];
  const team = Array.isArray(org?.team) && org.team.length > 0 
    ? org.team 
    : [{ name: org?.contact_name || 'Coordinator', role: 'Operations & Field Lead', since: '2024' }];
  const docs = Array.isArray(org?.docs) && org.docs.length > 0 
    ? org.docs 
    : [
        { name: 'Registration Certificate', type: 'PDF Document', updated: org?.created_at || '2026-01-10', path: org?.registration_cert_path },
        { name: 'Supporting Authority Letter', type: 'PDF Document', updated: org?.created_at || '2026-01-10', path: org?.supporting_doc_path }
      ];

  const orgName = org?.name || org?.org_name || 'Organisation';
  const shortName = org?.shortName || org?.short_name || orgName.substring(0, 3).toUpperCase();
  const completedDate = v.completedOn || org?.created_at || new Date().toISOString();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Organisation Profile</h1>
          <div className="page-sub">Registration, verification status and team details for {orgName}.</div>
        </div>
        <button className="btn btn-secondary" onClick={() => onShowToast && onShowToast('Profile details updated from official registration records.')}>
          Verified Status
        </button>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', marginBottom: '18px' }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
            <div className="org-avatar" style={{ width: '52px', height: '52px', fontSize: '19px' }}>
              {initials(shortName)}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}>{orgName}</div>
              <div className="faint" style={{ fontSize: '12.5px' }}>{org?.hq || 'India'} · Founded {org?.founded || 2024}</div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
            {org?.tagline || 'Emergency Disaster Response & Community Assistance'}
          </p>
          <div className="pillrow" style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {sectors.map(s => <span key={s} className="badge badge-neutral">{s}</span>)}
          </div>
          <div className="divider" style={{ height: '1px', background: 'var(--border)', margin: '14px 0' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.6px' }}>
            <div><div className="faint">Registration type</div><div style={{ fontWeight: 600, marginTop: '2px' }}>{org?.regType || 'Registered Non-Profit'}</div></div>
            <div><div className="faint">Darpan / Reg number</div><div className="mono" style={{ fontWeight: 600, marginTop: '2px' }}>{org?.regNumber || org?.darpan_id || 'DARPAN/REG/2026'}</div></div>
            <div><div className="faint">PAN</div><div className="mono" style={{ fontWeight: 600, marginTop: '2px' }}>{org?.pan || 'AAATN1234F'}</div></div>
            <div><div className="faint">FCRA Status</div><div style={{ fontWeight: 600, marginTop: '2px' }}>{org?.fcra || 'Eligible / Registered'}</div></div>
            <div><div className="faint">Tax status</div><div style={{ fontWeight: 600, marginTop: '2px' }}>{org?.status80g || '80G Certified'}</div></div>
            <div><div className="faint">Contact Email</div><div className="mono" style={{ fontWeight: 600, marginTop: '2px', fontSize: '11.5px' }}>{org?.email || 'contact@ngo.org'}</div></div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: '6px' }}>Platform verification</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 12px' }}>
            <StatusBadge status={org?.verification_status || "verified"} /> 
            <span className="faint" style={{ fontSize: '12px' }}>Completed {fmtDate(completedDate)}</span>
          </div>
          {steps.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--success)', marginTop: '1px' }}><Icon name="check" /></span>
              <div>
                <div style={{ fontSize: '12.8px', fontWeight: 600 }}>{s.label}</div>
                <div className="faint" style={{ fontSize: '11.8px', marginTop: '2px' }}>{s.detail}</div>
              </div>
            </div>
          ))}
          <div className="disclaimer" style={{ fontSize: '11.5px', color: 'var(--ink-faint)', marginTop: '12px', lineHeight: 1.5 }}>
            Platform verification reflects completion of AidLink's documentation and identity-check process.
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: '12px' }}>Leadership &amp; Team</div>
          {team.map((t, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="avatar-sm" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-tint)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '12px' }}>
                {initials(t.name)}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{t.name}</div>
                <div className="faint" style={{ fontSize: '11.8px' }}>{t.role} {t.since ? `· since ${t.since}` : ''}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card card-pad">
          <div className="card-title" style={{ marginBottom: '12px' }}>Registration &amp; Compliance Documents</div>
          {docs.map((d, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span className="faint"><Icon name="file" /></span>
                <div>
                  <div style={{ fontSize: '12.8px', fontWeight: 600 }}>{d.name}</div>
                  <div className="faint" style={{ fontSize: '11.5px' }}>{d.type} {d.updated ? `· updated ${fmtDate(d.updated)}` : ''}</div>
                </div>
              </div>
              {d.path ? (
                <a 
                  href={`${API_BASE}/${d.path}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="icon-btn"
                  title="Download / View document"
                >
                  <Icon name="download" />
                </a>
              ) : (
                <button className="icon-btn" onClick={() => onShowToast && onShowToast('Document on file verified by platform admins.')}>
                  <Icon name="check" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


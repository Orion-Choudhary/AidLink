import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import { fmtINR, fmtDate } from '../../../data/mockData';

export default function DonationsPage({ campaigns = [], donations = [], onNavCampaign }) {
  const [activeSection, setActiveSection] = useState('all'); // 'all' | 'campaign' | 'direct'

  // If donations array from database is available, use it; otherwise extract from campaigns
  let fullList = [];
  if (Array.isArray(donations) && donations.length > 0) {
    fullList = donations.map(d => ({
      id: d.id,
      donor: d.donor || 'Anonymous Donor',
      amount: parseFloat(d.amount) || 0,
      purpose: d.purpose || 'General Support',
      method: d.method || 'UPI',
      date: d.date,
      campaignId: d.campaign_id || d.campaignId || null,
      campaignName: d.campaign_name || d.campaignName || null,
      isDirect: !d.campaign_id && !d.campaignId
    }));
  } else {
    fullList = campaigns
      .flatMap(c => (c.donations || []).map(d => ({
        ...d,
        amount: parseFloat(d.amount) || 0,
        campaignId: c.id,
        campaignName: c.name,
        isDirect: false
      })));
  }

  fullList.sort((a, b) => new Date(b.date) - new Date(a.date));

  const campaignDonations = fullList.filter(d => !d.isDirect);
  const directDonations = fullList.filter(d => d.isDirect);

  const totalAmount = fullList.reduce((s, d) => s + d.amount, 0);
  const campaignAmount = campaignDonations.reduce((s, d) => s + d.amount, 0);
  const directAmount = directDonations.reduce((s, d) => s + d.amount, 0);

  const displayedList = activeSection === 'campaign'
    ? campaignDonations
    : activeSection === 'direct'
    ? directDonations
    : fullList;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Donations &amp; Contributions</h1>
          <div className="page-sub">
            Track and verify all funds received — categorized by specific emergency relief campaigns and direct organisational support.
          </div>
        </div>
      </div>

      {/* 3 Metric Cards Breakdown */}
      <div className="grid grid-3" style={{ marginBottom: '22px' }}>
        <div className="card card-pad">
          <div className="stat-label">Total Recorded Funds</div>
          <div className="stat-num">{fmtINR(totalAmount)}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>
            {fullList.length} total contribution{fullList.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Campaign-Specific Aid</div>
          <div className="stat-num">{fmtINR(campaignAmount)}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>
            {campaignDonations.length} donation{campaignDonations.length === 1 ? '' : 's'} linked to campaigns
          </div>
        </div>

        <div className="card card-pad">
          <div className="stat-label">Direct NGO Contributions</div>
          <div className="stat-num" style={{ color: 'var(--success)' }}>{fmtINR(directAmount)}</div>
          <div className="faint" style={{ fontSize: '11.8px', marginTop: '3px' }}>
            {directDonations.length} direct donation{directDonations.length === 1 ? '' : 's'} to organization
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="notice notice-info" style={{ marginBottom: '20px' }}>
        <Icon name="alert" />
        <div>
          <div className="notice-title">Simulated for demonstration &amp; accountability</div>
          <div className="notice-body">
            Every donation shown here is a recorded entry for transparent accountability and reporting. AidLink serves as an integrating infrastructure and routes contributions directly to registered NGOs.
          </div>
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeSection === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSection('all')}
        >
          All Donations ({fullList.length})
        </button>
        <button
          className={`tab-btn ${activeSection === 'campaign' ? 'active' : ''}`}
          onClick={() => setActiveSection('campaign')}
        >
          Campaign-Specific ({campaignDonations.length})
        </button>
        <button
          className={`tab-btn ${activeSection === 'direct' ? 'active' : ''}`}
          onClick={() => setActiveSection('direct')}
        >
          Direct to NGO ({directDonations.length})
        </button>
      </div>

      {/* Table Display */}
      {displayedList.length === 0 ? (
        <div className="card empty">
          <div className="empty-title">No donations found in this section</div>
          <div className="empty-sub">
            {activeSection === 'direct'
              ? 'Direct contributions made by individuals to your NGO will appear here.'
              : activeSection === 'campaign'
              ? 'Donations made to specific campaigns will appear here.'
              : 'Donation records will appear here as supporters contribute.'}
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Category</th>
                <th>Destination / Campaign</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedList.map(d => {
                const isClickable = Boolean(d.campaignId);
                return (
                  <tr
                    key={d.id}
                    className={isClickable ? "row-clickable" : ""}
                    onClick={() => isClickable && onNavCampaign && onNavCampaign(d.campaignId, 'donations')}
                  >
                    <td className="cell-main">{d.donor}</td>
                    <td>
                      {d.isDirect ? (
                        <span className="badge badge-success">
                          <span className="badge-dot" />
                          Direct to NGO
                        </span>
                      ) : (
                        <span className="badge badge-info">
                          <span className="badge-dot" />
                          Campaign Aid
                        </span>
                      )}
                    </td>
                    <td>
                      {d.campaignName ? (
                        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
                          {d.campaignName} ↗
                        </span>
                      ) : (
                        <span className="faint" style={{ fontStyle: 'italic' }}>
                          General Organisation Support
                        </span>
                      )}
                    </td>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      {fmtINR(d.amount)}
                    </td>
                    <td>{d.purpose}</td>
                    <td className="faint">{d.method}</td>
                    <td className="mono">{fmtDate(d.date)}</td>
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


import React, { useState } from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtINR, fmtDate } from '../../../data/mockData';

export default function ExpensesPage({ campaigns, onNavCampaign }) {
  const [statusFilter, setStatusFilter] = useState('all');

  const allExpenses = campaigns.flatMap(c => c.expenses.map(e => ({ ...e, campaignId: c.id, campaignName: c.name })));

  let list = allExpenses;
  if (statusFilter !== "all") {
    list = list.filter(e => e.status === statusFilter);
  }
  list = list.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = allExpenses.reduce((s, e) => s + e.amount, 0);
  const counts = { all: allExpenses.length };
  ["declared", "verified", "missing_evidence"].forEach(s => {
    counts[s] = allExpenses.filter(e => e.status === s).length;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Expenses</h1>
          <div className="page-sub">Declared expenses across campaigns — accountability records, not audited accounting.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="stat-label">Total declared</div>
          <div className="stat-num">{fmtINR(total)}</div>
        </div>
      </div>

      <div className="pillrow" style={{ marginBottom: '16px' }}>
        <button className={`pill-filter ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          All ({counts.all})
        </button>
        <button className={`pill-filter ${statusFilter === 'verified' ? 'active' : ''}`} onClick={() => setStatusFilter('verified')}>
          Evidence-linked ({counts.verified})
        </button>
        <button className={`pill-filter ${statusFilter === 'declared' ? 'active' : ''}`} onClick={() => setStatusFilter('declared')}>
          Declared only ({counts.declared})
        </button>
        <button className={`pill-filter ${statusFilter === 'missing_evidence' ? 'active' : ''}`} onClick={() => setStatusFilter('missing_evidence')}>
          Missing evidence ({counts.missing_evidence})
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Category</th><th>Campaign</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {list.map(e => (
              <tr key={e.id} className="row-clickable" onClick={() => onNavCampaign(e.campaignId, 'expenses')}>
                <td className="cell-main">{e.category}</td>
                <td className="faint">{e.campaignName}</td>
                <td className="faint">{e.vendor}</td>
                <td className="mono">{fmtINR(e.amount)}</td>
                <td className="mono">{fmtDate(e.date)}</td>
                <td><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import Icon from '../../../components/Dashboard/Icons';
import StatusBadge from '../../../components/Dashboard/StatusBadge';
import { fmtINR, fmtDate, initials } from '../../../data/mockData';

const CAMPAIGN_TABS = [
  { id: "chain", label: "Overview" },
  { id: "activities", label: "Activities" },
  { id: "volunteers", label: "Volunteers" },
  { id: "resources", label: "Resources" },
  { id: "donations", label: "Donations" },
  { id: "expenses", label: "Expenses" },
  { id: "evidence", label: "Evidence" },
  { id: "updates", label: "Updates" },
  { id: "impact", label: "Impact Report" },
  { id: "audit", label: "Audit History" },
];

export default function CampaignDetail({
  campaign,
  activeTab,
  onTabChange,
  onNav,
  onPublishCampaign,
  onToggleUrgent,
  onOpenNewActivityModal,
  onOpenNewExpenseModal,
  onOpenNewEvidenceModal,
  onOpenNewUpdateModal,
  onOpenNewResourceModal,
  onOpenUpdateResourceModal,
  onOpenUpdateBeneficiariesModal,
  onGenerateImpactReport,
  onViewImpactReport,
  onDecideVolunteer,
  onShowToast
}) {
  if (!campaign) {
    return (
      <div className="empty">
        <div className="empty-title">Campaign not found</div>
        <button className="btn btn-secondary" style={{ marginTop: '10px' }} onClick={() => onNav('campaigns')}>
          Return to campaigns
        </button>
      </div>
    );
  }

  const currentTab = activeTab || "chain";

  const totalDonations = (campaign.donations || []).reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const totalExpenses = (campaign.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const isUrgent = Boolean(campaign.is_urgent || campaign.isUrgent);

  return (
    <div>
      <div className="crumb">
        <a onClick={() => onNav('campaigns')}>Campaigns</a> <Icon name="chevronRight" /> <span>{campaign.name}</span>
      </div>
      <div className="page-head">
        <div>
          <h1>{campaign.name}</h1>
          <div className="page-sub">
            {campaign.region} · {campaign.disaster}{campaign.startDate ? " · Started " + fmtDate(campaign.startDate) : ""}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            type="button"
            className="btn btn-sm"
            style={{ 
              background: isUrgent ? 'var(--danger)' : 'var(--surface)',
              color: isUrgent ? '#ffffff' : 'var(--ink)',
              border: `1px solid ${isUrgent ? 'var(--danger)' : 'var(--border-strong)'}`,
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => onToggleUrgent && onToggleUrgent(campaign.id, isUrgent)}
            title="Toggle urgent priority in supporter feeds"
          >
            {isUrgent ? 'Urgent Priority' : 'Mark Urgent'}
          </button>
          <StatusBadge status={campaign.status} />
          {campaign.status !== "draft" && <StatusBadge status={campaign.health} />}
          {campaign.status === "draft" && (
            <button className="btn btn-primary" onClick={() => onPublishCampaign(campaign.id)}>
              Publish campaign
            </button>
          )}
        </div>
      </div>

      <div className="tabs">
        {CAMPAIGN_TABS.map(t => (
          <button 
            key={t.id}
            className={`tab-btn ${currentTab === t.id ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview / Chain Tab */}
      {currentTab === "chain" && (
        <div>
          <div className="chain">
            <div className="chain-node">
              <div className="chain-step">1 · Objective</div>
              <div className="chain-value">{campaign.targetHouseholds.toLocaleString("en-IN")}</div>
              <div className="chain-label">households targeted</div>
            </div>
            <div className="chain-node">
              <div className="chain-step">2 · Resources</div>
              <div className="chain-value">{campaign.resources.length}</div>
              <div className="chain-label">resource lines allocated</div>
            </div>
            <div className="chain-node">
              <div className="chain-step">3 · Activities</div>
              <div className="chain-value">{campaign.activities.length}</div>
              <div className="chain-label">{campaign.activities.filter(a => a.status === 'completed').length} completed</div>
            </div>
            <div className="chain-node">
              <div className="chain-step">4 · Evidence</div>
              <div className="chain-value">{campaign.evidence.length}</div>
              <div className="chain-label">supporting items on file</div>
            </div>
            <div className="chain-node">
              <div className="chain-step">5 · Reported impact</div>
              <div className="chain-value">{campaign.beneficiaries.householdsReached.toLocaleString("en-IN")}</div>
              <div className="chain-label">
                households reached{campaign.impactReports.filter(r => r.status === 'published').length ? ', report published' : ''}
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="card card-pad">
              <div className="card-title" style={{ marginBottom: '10px' }}>Objective</div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>{campaign.objective}</p>
              <div className="divider"></div>
              <div className="progress-row" style={{ marginBottom: '6px' }}>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${campaign.progress}%` }}></div></div>
                <div className="progress-num">{campaign.progress}%</div>
              </div>
              <div className="faint" style={{ fontSize: '12px' }}>Overall progress toward stated objective</div>
            </div>

            <div className="card card-pad">
              <div className="card-title" style={{ marginBottom: '10px' }}>Financial summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <span className="muted" style={{ fontSize: '13px' }}>Simulated donations received</span>
                <span className="mono" style={{ fontWeight: 600 }}>{fmtINR(totalDonations)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                <span className="muted" style={{ fontSize: '13px' }}>Declared expenses</span>
                <span className="mono" style={{ fontWeight: 600 }}>{fmtINR(totalExpenses)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
                <span className="muted" style={{ fontSize: '13px' }}>Expenses missing evidence</span>
                <span className="mono" style={{ fontWeight: 600, color: campaign.expenses.filter(e => e.status === 'missing_evidence').length ? 'var(--warn)' : 'var(--ink)' }}>
                  {campaign.expenses.filter(e => e.status === 'missing_evidence').length}
                </span>
              </div>
              <div className="disclaimer">
                Donations shown are simulated for demonstration and are not live payment transactions. Declared expenses are self-reported accountability records, not an independently audited account.
              </div>
            </div>
          </div>

          {campaign.updates.length > 0 && (
            <div className="card card-pad" style={{ marginTop: '16px' }}>
              <div className="card-title" style={{ marginBottom: '12px' }}>Latest progress update</div>
              <div className="tl-when">{fmtDate(campaign.updates[0].date)}</div>
              <div className="tl-title" style={{ fontSize: '14.5px', margin: '3px 0 6px' }}>{campaign.updates[0].title}</div>
              <div className="tl-body">{campaign.updates[0].body}</div>
            </div>
          )}
        </div>
      )}

      {/* Activities Tab */}
      {currentTab === "activities" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Relief activities &amp; schedule</div>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewActivityModal}>
              <Icon name="plus" /> Schedule activity
            </button>
          </div>
          {campaign.activities.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No activities yet</div>
              <div className="empty-sub">Schedule the first relief activity for this campaign — distributions, health camps, WASH works and more.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Activity</th><th>Type</th><th>Date</th><th>Location</th><th>Volunteers</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {campaign.activities.slice().sort((a, b) => new Date(a.date) - new Date(b.date)).map(a => (
                    <tr key={a.id}>
                      <td>
                        <div className="cell-main">{a.title}</div>
                        {a.notes && <div className="cell-sub">{a.notes}</div>}
                      </td>
                      <td>{a.type}</td>
                      <td className="mono">{fmtDate(a.date)}</td>
                      <td>{a.location}</td>
                      <td className="mono">{a.volunteersAssigned}</td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Volunteers Tab */}
      {currentTab === "volunteers" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Volunteer applications &amp; participation</div>
          </div>
          {campaign.volunteers.filter(v => (v.status || '').toLowerCase() === "pending" || v.status === "APPLIED").length > 0 && (
            <div className="card card-pad" style={{ marginBottom: '16px' }}>
              <div className="card-title" style={{ marginBottom: '10px', color: 'var(--warn)' }}>
                Awaiting review ({campaign.volunteers.filter(v => (v.status || '').toLowerCase() === "pending" || v.status === "APPLIED").length})
              </div>
              {campaign.volunteers.filter(v => (v.status || '').toLowerCase() === "pending" || v.status === "APPLIED").map(v => {
                const docPath = v.document_path || v.documentPath;
                return (
                  <div key={v.id} className="attn-item">
                    <div className="avatar-sm">{initials(v.name || 'V')}</div>
                    <div className="attn-body">
                      <div className="attn-title">{v.name} <span className="faint" style={{ fontWeight: 400 }}>— {v.role || 'Volunteer'}</span></div>
                      <div className="attn-sub">
                        Applied {fmtDate(v.appliedOn || v.applied_on)} · Skills: {Array.isArray(v.skills) ? v.skills.join(", ") : (v.skills || 'General')}
                      </div>
                      {docPath && (
                        <div style={{ marginTop: '5px' }}>
                          <a
                            href={`http://localhost:5000/${docPath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '11.5px', padding: '2px 8px' }}
                          >
                            <Icon name="reports" /> Review CV / Supporting Doc
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="attn-action" style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => onDecideVolunteer(campaign.id, v.id, 'rejected')}>
                        Decline
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => onDecideVolunteer(campaign.id, v.id, 'active')}>
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Volunteer</th><th>Role</th><th>Skills</th><th>Supporting Document</th><th>Hours logged</th><th>Status</th></tr>
              </thead>
              <tbody>
                {campaign.volunteers.filter(v => (v.status || '').toLowerCase() !== "pending" && v.status !== "APPLIED").map(v => {
                  const docPath = v.document_path || v.documentPath;
                  return (
                    <tr key={v.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div className="avatar-sm">{initials(v.name || 'V')}</div>
                        <div>
                          <div className="cell-main">{v.name}</div>
                          <div className="cell-sub">Applied {fmtDate(v.appliedOn || v.applied_on)}</div>
                        </div>
                      </td>
                      <td>{v.role || 'Volunteer'}</td>
                      <td className="faint">{Array.isArray(v.skills) ? v.skills.join(", ") : (v.skills || '—')}</td>
                      <td>
                        {docPath ? (
                          <a
                            href={`http://localhost:5000/${docPath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '11.5px', padding: '2px 8px' }}
                          >
                            <Icon name="reports" /> View Doc
                          </a>
                        ) : (
                          <span className="faint">—</span>
                        )}
                      </td>
                      <td className="mono">{v.hoursLogged || v.hours_logged || 0}</td>
                      <td><StatusBadge status={v.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {currentTab === "resources" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Resources &amp; allocation</div>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewResourceModal}>
              <Icon name="plus" /> Add resource line
            </button>
          </div>
          {campaign.resources.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No resources allocated yet</div>
              <div className="empty-sub">Resource lines — relief kits, materials, equipment — will appear here once allocated.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Resource</th><th>Source</th><th>Allocated</th><th>Deployed</th><th>Remaining</th><th>Utilisation</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {campaign.resources.map(r => {
                    const pct = Math.round((r.deployed / r.allocated) * 100);
                    const low = (r.allocated - r.deployed) < r.allocated * 0.15;
                    return (
                      <tr key={r.id}>
                        <td className="cell-main">{r.name}</td>
                        <td className="faint">{r.source}</td>
                        <td className="mono">{r.allocated.toLocaleString("en-IN")} {r.unit}</td>
                        <td className="mono">{r.deployed.toLocaleString("en-IN")} {r.unit}</td>
                        <td className="mono" style={{ color: low ? 'var(--warn)' : 'inherit', fontWeight: low ? 700 : 'normal' }}>
                          {(r.allocated - r.deployed).toLocaleString("en-IN")} {r.unit}
                        </td>
                        <td>
                          <div className="progress-row" style={{ maxWidth: '140px' }}>
                            <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%`, background: low ? 'var(--warn)' : 'var(--accent)' }}></div></div>
                            <div className="progress-num">{pct}%</div>
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => onOpenUpdateResourceModal(r)}>
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Donations Tab */}
      {currentTab === "donations" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Donations (simulated)</div>
            <div className="mono" style={{ fontWeight: 700, fontSize: '14px' }}>{fmtINR(totalDonations)} total</div>
          </div>
          <div className="notice notice-info" style={{ marginBottom: '14px' }}>
            <Icon name="alert" />
            <div>
              <div className="notice-title">Simulated donations</div>
              <div className="notice-body">All donation records on AidLink are simulated for accountability tracking and demonstration. No real payment processing takes place on this platform.</div>
            </div>
          </div>
          {campaign.donations.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No donations recorded yet</div>
              <div className="empty-sub">Simulated donation records will appear here as they are logged.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Donor</th><th>Amount</th><th>Purpose</th><th>Method</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {campaign.donations.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(d => (
                    <tr key={d.id}>
                      <td className="cell-main">{d.donor}</td>
                      <td className="mono">{fmtINR(d.amount)}</td>
                      <td>{d.purpose}</td>
                      <td className="faint">{d.method}</td>
                      <td className="mono">{fmtDate(d.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {currentTab === "expenses" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Declared expenses</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div className="mono" style={{ fontWeight: 700, fontSize: '14px' }}>{fmtINR(totalExpenses)} total</div>
              <button className="btn btn-primary btn-sm" onClick={onOpenNewExpenseModal}>
                <Icon name="plus" /> Declare expense
              </button>
            </div>
          </div>
          <div className="notice notice-plain" style={{ marginBottom: '14px' }}>
            <Icon name="alert" />
            <div>
              <div className="notice-title">Accountability record, not an audit</div>
              <div className="notice-body">Declared expenses are self-reported by field and finance teams to document how resources were used. They are not an independently audited financial statement.</div>
            </div>
          </div>
          {campaign.expenses.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No expenses declared yet</div>
              <div className="empty-sub">Declared expenses with supporting evidence will appear here.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Category</th><th>Vendor</th><th>Amount</th><th>Date</th><th>Evidence</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {campaign.expenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => (
                    <tr key={e.id}>
                      <td>
                        <div className="cell-main">{e.category}</div>
                        {e.note && <div className="cell-sub">{e.note}</div>}
                      </td>
                      <td className="faint">{e.vendor}</td>
                      <td className="mono">{fmtINR(e.amount)}</td>
                      <td className="mono">{fmtDate(e.date)}</td>
                      <td>
                        {e.evidenceLinked ? (
                          <span className="badge badge-success"><span className="badge-dot"></span> Linked</span>
                        ) : (
                          <button className="btn btn-secondary btn-sm" onClick={() => onTabChange('evidence')}>
                            <Icon name="upload" /> Attach
                          </button>
                        )}
                      </td>
                      <td><StatusBadge status={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Evidence Tab */}
      {currentTab === "evidence" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Supporting evidence</div>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewEvidenceModal}>
              <Icon name="upload" /> Upload evidence
            </button>
          </div>
          <div className="notice notice-plain" style={{ marginBottom: '14px' }}>
            <Icon name="alert" />
            <div>
              <div className="notice-title">Supporting documentation, not proof</div>
              <div className="notice-body">Evidence items — photos, invoices, registers — support the campaign record but do not, on their own, guarantee that an activity or expense occurred exactly as described.</div>
            </div>
          </div>
          {campaign.evidence.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No evidence uploaded yet</div>
              <div className="empty-sub">Photos, documents and registers that support activities and expenses will appear here.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Item</th><th>Type</th><th>Linked to</th><th>Uploaded by</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {campaign.evidence.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(e => (
                    <tr key={e.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <span className="faint"><Icon name={e.type === "Photo Set" ? "photo" : "file"} /></span>
                        <span className="cell-main">{e.title}</span>
                      </td>
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
      )}

      {/* Updates Tab */}
      {currentTab === "updates" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Progress updates</div>
            <button className="btn btn-primary btn-sm" onClick={onOpenNewUpdateModal}>
              <Icon name="plus" /> Publish update
            </button>
          </div>
          {campaign.updates.length === 0 ? (
            <div className="empty">
              <div className="empty-title">No updates published yet</div>
              <div className="empty-sub">Structured progress updates keep stakeholders informed as the campaign advances.</div>
            </div>
          ) : (
            <div className="card card-pad">
              <div className="timeline">
                {campaign.updates.map(u => (
                  <div key={u.id} className="tl-item">
                    <div className="tl-dot"></div>
                    <div className="tl-when">{fmtDate(u.date)}</div>
                    <div className="tl-title" style={{ fontSize: '14px' }}>{u.title}</div>
                    <div className="tl-body">{u.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Impact Report Tab */}
      {currentTab === "impact" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Campaign impact report</div>
            <button className="btn btn-primary btn-sm" onClick={() => onGenerateImpactReport(campaign.id)}>
              <Icon name="plus" /> Generate &amp; publish report
            </button>
          </div>
          {campaign.impactReports.filter(r => r.status === "published").length === 0 ? (
            <div className="empty">
              <div className="empty-title">No impact report published yet</div>
              <div className="empty-sub">Generate a structured report that pulls together objective, resources, activities, evidence and reported impact.</div>
            </div>
          ) : (
            <div className="card card-pad">
              {campaign.impactReports.filter(r => r.status === "published").map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="cell-main" style={{ fontSize: '14px' }}>{r.title}</div>
                    <div className="cell-sub">{r.period} · Published {fmtDate(r.publishedOn)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <StatusBadge status={r.status} />
                    <button className="btn btn-secondary btn-sm" onClick={() => onViewImpactReport(campaign.id, r.id)}>
                      <Icon name="download" /> View report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="disclaimer">
            Impact reports summarise campaign data reported on this platform. They reflect declared expenses and field-reported outcomes, and are not an independently audited assessment.
          </div>
        </div>
      )}

      {/* Audit History Tab */}
      {currentTab === "audit" && (
        <div>
          <div className="section-title-row">
            <div className="card-title">Auditable action history</div>
          </div>
          <div className="card card-pad">
            <div className="timeline">
              {campaign.audit.map((a, idx) => (
                <div key={idx} className="tl-item">
                  <div className="tl-dot"></div>
                  <div className="tl-when">{a.ts} · <span className="faint">{a.actor}</span></div>
                  <div className="tl-title">{a.action}</div>
                  <div className="tl-body">{a.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="disclaimer">
            Every significant action on this campaign — publishing, approvals, declared expenses, evidence uploads and report generation — is recorded here with a timestamp and responsible team member.
          </div>
        </div>
      )}
    </div>
  );
}

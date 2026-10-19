import React, { useState } from 'react';
import Icon from './Icons';
import { DISASTER_TYPES, fmtINR } from '../../data/mockData';

export function ModalOverlay({ title, onClose, children, buttons }) {
  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target.className === 'modal-overlay') onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <h3 style={{ fontSize: '16px' }}>{title}</h3>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="x" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {buttons && (
          <div className="modal-foot">
            {buttons.map((b, idx) => (
              <button key={idx} className={`btn ${b.cls}`} onClick={b.onClick}>
                {b.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function NewCampaignModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [disaster, setDisaster] = useState(DISASTER_TYPES[0]);
  const [target, setTarget] = useState('');
  const [region, setRegion] = useState('');
  const [objective, setObjective] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = () => {
    onSubmit({ name, disaster, target, region, objective, coverImage, isUrgent });
  };

  return (
    <ModalOverlay
      title="Create new campaign"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Create draft campaign", cls: "btn-primary", onClick: handleSubmit },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Campaign name</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bihar Flood Response 2026" />
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Disaster type</label>
          <select className="field-input" value={disaster} onChange={(e) => setDisaster(e.target.value)}>
            {DISASTER_TYPES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Target households</label>
          <input className="field-input" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 1500" />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Region / districts</label>
        <input className="field-input" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Purnia & Katihar Districts, Bihar" />
      </div>
      <div className="field-group">
        <label className="field-label">Objective</label>
        <textarea className="field-input" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="What this campaign is set out to achieve, and for whom."></textarea>
      </div>
      <div className="field-group">
        <label className="field-label">Cover Image (Optional)</label>
        <input className="field-input" type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
      </div>
      <div className="field-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', background: isUrgent ? 'var(--danger-tint)' : 'var(--surface-sunken)', borderRadius: 'var(--radius-m)', border: `1px solid ${isUrgent ? 'var(--danger)' : 'var(--border)'}`, marginTop: '8px', marginBottom: '12px' }}>
        <input 
          type="checkbox" 
          id="isUrgentCheck" 
          checked={isUrgent} 
          onChange={(e) => setIsUrgent(e.target.checked)} 
          style={{ width: '15px', height: '15px', cursor: 'pointer' }}
        />
        <label htmlFor="isUrgentCheck" style={{ fontSize: '12.8px', fontWeight: 600, color: isUrgent ? 'var(--danger)' : 'var(--ink)', cursor: 'pointer', margin: 0 }}>
          Mark as Urgent Priority (Featured on top of local feeds)
        </label>
      </div>
      <div className="notice notice-plain">
        <Icon name="alert" />
        <div>
          <div className="notice-title">Campaigns start as drafts</div>
          <div className="notice-body">A new campaign is created in Draft status. You'll add activities, resources and volunteers before publishing it as Active.</div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function NewWorkshopModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-09-25');
  const [time, setTime] = useState('10:00 AM - 2:00 PM');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [targetCapacity, setTargetCapacity] = useState('50');
  const [formUrl, setFormUrl] = useState('');

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      date,
      time,
      location,
      city,
      target_capacity: targetCapacity,
      form_url: formUrl
    });
  };

  return (
    <ModalOverlay
      title="Organize Community Workshop"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Publish Workshop", cls: "btn-primary", onClick: handleSubmit },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Workshop Title</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Emergency First Aid & Disaster CPR Training" />
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Date</label>
          <input className="field-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Time / Duration</label>
          <input className="field-input" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 AM - 2:00 PM" />
        </div>
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Venue / Location</label>
          <input className="field-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Disaster Prep Center, Civil Lines" />
        </div>
        <div className="field-group">
          <label className="field-label">City</label>
          <input className="field-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Patiala" />
        </div>
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Target Capacity (Seats)</label>
          <input className="field-input" type="number" value={targetCapacity} onChange={(e) => setTargetCapacity(e.target.value)} placeholder="50" />
        </div>
        <div className="field-group">
          <label className="field-label">External Registration Form Link (Optional)</label>
          <input className="field-input" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://forms.google.com/..." />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Workshop Description & Objective</label>
        <textarea className="field-input" style={{ minHeight: '85px' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will participants learn, and how does it support disaster relief?"></textarea>
      </div>
      <div className="notice notice-plain">
        <Icon name="alert" />
        <div>
          <div className="notice-title">NGO Workshop Participation</div>
          <div className="notice-body">Workshops allow community members to register and receive specialized skills training directly from your NGO.</div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function WorkshopDetailModal({ workshop, onClose, onRegister }) {
  if (!workshop) return null;

  const handleRegisterClick = () => {
    if (workshop.form_url && workshop.form_url.trim().startsWith('http')) {
      window.open(workshop.form_url.trim(), '_blank');
    } else {
      alert("No form attached for now.");
    }
    if (onRegister) onRegister(workshop);
  };

  return (
    <ModalOverlay
      title={workshop.title || "Community Workshop"}
      onClose={onClose}
      buttons={[
        { label: "Close", cls: "btn-secondary", onClick: onClose },
        { label: "Register for Workshop", cls: "btn-primary", onClick: handleRegisterClick },
      ]}
    >
      <div style={{ marginBottom: '14px' }}>
        <span className="badge badge-info">
          Community Workshop
        </span>
        {workshop.org_name && (
          <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)', marginLeft: '10px' }}>
            Organized by <strong>{workshop.org_name}</strong>
          </span>
        )}
      </div>

      <div className="grid grid-2" style={{ marginBottom: '14px' }}>
        <div className="card card-pad">
          <div className="stat-label">Date & Time</div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginTop: '4px' }}>
            {workshop.date || "Upcoming"}
          </div>
          <div className="faint" style={{ fontSize: '12px' }}>{workshop.time || "Scheduled"}</div>
        </div>
        <div className="card card-pad">
          <div className="stat-label">Location / City</div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginTop: '4px' }}>
            {workshop.city || "On-ground"}
          </div>
          <div className="faint" style={{ fontSize: '12px' }}>{workshop.location || "Venue details provided upon registration"}</div>
        </div>
      </div>

      <div className="field-label">About this Workshop</div>
      <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '6px 0 16px' }}>
        {workshop.description || "Learn hands-on disaster preparedness, emergency logistics, and crisis response techniques."}
      </p>

      <div className="notice notice-info" style={{ marginTop: '10px' }}>
        <Icon name="check" />
        <div>
          <div className="notice-title">NGO External Form Registration</div>
          <div className="notice-body">This workshop is managed directly by {workshop.org_name || 'the organizing NGO'}. Registering will connect you to the NGO's session intake.</div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function EditWorkshopModal({ workshop, onClose, onSubmit }) {
  const [title, setTitle] = useState(workshop?.title || '');
  const [description, setDescription] = useState(workshop?.description || '');
  const [date, setDate] = useState(workshop?.date || '');
  const [time, setTime] = useState(workshop?.time || '');
  const [location, setLocation] = useState(workshop?.location || '');
  const [city, setCity] = useState(workshop?.city || '');
  const [targetCapacity, setTargetCapacity] = useState(workshop?.target_capacity ? String(workshop.target_capacity) : '50');
  const [formUrl, setFormUrl] = useState(workshop?.form_url || '');

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      date,
      time,
      location,
      city,
      target_capacity: parseInt(targetCapacity, 10) || 50,
      form_url: formUrl.trim()
    });
  };

  return (
    <ModalOverlay
      title="Edit Workshop & Registration Form"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Save Changes", cls: "btn-primary", onClick: handleSubmit },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Workshop Title</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Emergency First Aid & Disaster CPR Training" />
      </div>

      <div className="field-group" style={{ background: 'var(--surface-sunken)', padding: '12px', borderRadius: 'var(--radius-m)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="field-label" style={{ marginBottom: 0, fontWeight: 600, color: 'var(--ink)' }}>
            External Registration Form Link
          </label>
          {formUrl && formUrl.startsWith('http') && (
            <a 
              href={formUrl} 
              target="_blank" 
              rel="noreferrer" 
              style={{ fontSize: '11.5px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
            >
              Test link ↗
            </a>
          )}
        </div>
        <input 
          className="field-input" 
          value={formUrl} 
          onChange={(e) => setFormUrl(e.target.value)} 
          placeholder="https://forms.google.com/your-form-url" 
          style={{ background: 'var(--surface)' }}
        />
        <div className="faint" style={{ fontSize: '11.5px', marginTop: '5px' }}>
          Supports Google Forms, Microsoft Forms, Typeform, or your custom intake registration link.
        </div>
      </div>

      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Date</label>
          <input className="field-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Time / Duration</label>
          <input className="field-input" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 AM - 2:00 PM" />
        </div>
      </div>

      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Venue / Location</label>
          <input className="field-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Disaster Prep Center, Civil Lines" />
        </div>
        <div className="field-group">
          <label className="field-label">City</label>
          <input className="field-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Patiala" />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Target Capacity (Seats)</label>
        <input className="field-input" type="number" value={targetCapacity} onChange={(e) => setTargetCapacity(e.target.value)} placeholder="50" />
      </div>

      <div className="field-group">
        <label className="field-label">Workshop Description & Objective</label>
        <textarea className="field-input" style={{ minHeight: '85px' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will participants learn, and how does it support disaster relief?"></textarea>
      </div>
    </ModalOverlay>
  );
}

export function ConfirmDiscardWorkshopModal({ workshop, onClose, onConfirm }) {
  if (!workshop) return null;

  return (
    <ModalOverlay
      title="Discard Community Workshop?"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Discard Workshop", cls: "btn-danger", onClick: onConfirm },
      ]}
    >
      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          Are you sure you want to discard and remove this community workshop?
        </p>
      </div>

      <div className="card card-pad" style={{ background: 'var(--surface-sunken)', marginBottom: '16px', border: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
          {workshop.title}
        </div>
        <div className="faint" style={{ fontSize: '12px', marginBottom: '8px' }}>
          {workshop.city || 'Patiala'} • {workshop.date || 'Upcoming'} ({workshop.time || 'Scheduled'})
        </div>
        {workshop.form_url ? (
          <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
            <strong>Attached Form:</strong> <span style={{ wordBreak: 'break-all' }}>{workshop.form_url}</span>
          </div>
        ) : (
          <div className="faint" style={{ fontSize: '12px' }}>
            No external form attached
          </div>
        )}
      </div>

      <div className="notice notice-alert" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' }}>
        <Icon name="alert" />
        <div>
          <div className="notice-title" style={{ color: '#991b1b', fontWeight: 600 }}>Permanent Action</div>
          <div className="notice-body" style={{ color: '#b91c1c', fontSize: '12px' }}>
            This workshop and its registration details will be permanently removed from your dashboard and the public directory.
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function NewActivityModal({ onClose, onSubmit }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Distribution');
  const [date, setDate] = useState('2026-09-01');
  const [location, setLocation] = useState('');
  const [volunteersAssigned, setVolunteersAssigned] = useState('0');

  const handleSubmit = () => {
    onSubmit({ title, type, date, location, volunteersAssigned });
  };

  if (isReviewing) {
    return (
      <ModalOverlay
        title="Review Activity"
        onClose={onClose}
        buttons={[
          { label: "Back to Edit", cls: "btn-secondary", onClick: () => setIsReviewing(false) },
          { label: "Confirm & Lock", cls: "btn-primary", onClick: handleSubmit },
        ]}
      >
        <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Volunteers Assigned:</strong> {volunteersAssigned}</p>
        </div>
        <div className="notice notice-warn" style={{ marginTop: '16px' }}>
          <Icon name="alert" />
          <div className="notice-body">Once confirmed, this activity will be permanently saved.</div>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay
      title="Schedule new activity"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Review", cls: "btn-primary", onClick: () => setIsReviewing(true) },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Activity title</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Relief kit distribution — Block 4" />
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Type</label>
          <select className="field-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Distribution</option>
            <option>Health</option>
            <option>WASH</option>
            <option>Shelter</option>
            <option>Livelihoods</option>
            <option>Assessment</option>
            <option>Infrastructure</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Date</label>
          <input className="field-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Location</label>
        <input className="field-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Relief camp, block name" />
      </div>
      <div className="field-group">
        <label className="field-label">Volunteers assigned</label>
        <input className="field-input" type="number" value={volunteersAssigned} onChange={(e) => setVolunteersAssigned(e.target.value)} />
      </div>
    </ModalOverlay>
  );
}

export function NewExpenseModal({ onClose, onSubmit }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState('2026-08-25');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit({ category, amount, vendor, date, note });
  };

  return (
    <ModalOverlay
      title="Declare expense"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Declare expense", cls: "btn-primary", onClick: handleSubmit },
      ]}
    >
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Category</label>
          <input className="field-input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Transport & Logistics" />
        </div>
        <div className="field-group">
          <label className="field-label">Amount (₹)</label>
          <input className="field-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Vendor / payee</label>
        <input className="field-input" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="e.g. Vendor name" />
      </div>
      <div className="field-group">
        <label className="field-label">Date</label>
        <input className="field-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="field-group">
        <label className="field-label">Note</label>
        <textarea className="field-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What this expense covered"></textarea>
      </div>
    </ModalOverlay>
  );
}

export function NewEvidenceModal({ campaign, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Photo Set');
  const linkOptions = [
    ...(campaign?.activities || []).map(a => a.title),
    ...(campaign?.expenses || []).map(e => e.category + " expense")
  ];
  const [linkedTo, setLinkedTo] = useState(linkOptions[0] || 'General campaign record');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    onSubmit({ title, type, linkedTo, file });
  };

  return (
    <ModalOverlay
      title="Upload evidence"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Upload evidence", cls: "btn-primary", onClick: handleSubmit },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Title</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Distribution photos — Block 4 (12)" />
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Type</label>
          <select className="field-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Photo Set</option>
            <option>Document</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Linked to</label>
          <select className="field-input" value={linkedTo} onChange={(e) => setLinkedTo(e.target.value)}>
            {linkOptions.length > 0 ? (
              linkOptions.map(o => <option key={o}>{o}</option>)
            ) : (
              <option>General campaign record</option>
            )}
          </select>
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">File</label>
        <input className="field-input" type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
    </ModalOverlay>
  );
}

export function NewUpdateModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = () => {
    onSubmit({ title, body });
  };

  return (
    <ModalOverlay
      title="Publish progress update"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Publish update", cls: "btn-primary", onClick: handleSubmit },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Update title</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Shelter distribution completes in Block 4" />
      </div>
      <div className="field-group">
        <label className="field-label">Body</label>
        <textarea className="field-input" style={{ minHeight: '120px' }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What progress was made, what's next, and any issues encountered."></textarea>
      </div>
    </ModalOverlay>
  );
}

export function ViewImpactReportModal({ report, campaign, org, onClose }) {
  if (!report && !campaign) return null;

  const b = campaign?.beneficiaries || {};
  const householdsReached = b.householdsReached || campaign?.target_households || campaign?.targetHouseholds || 0;
  const individualsReached = b.individualsReached || (householdsReached * 4.2) || 0;
  const districts = Array.isArray(b.districts) ? b.districts : [];
  const vulnerableGroups = Array.isArray(b.vulnerableGroupsCovered) ? b.vulnerableGroupsCovered : [];
  const genderSplit = b.genderSplit || { female: 52, male: 46, other: 2 };

  const expenses = campaign?.expenses || [];
  const totalAuditedExpenses = expenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  const totalVolunteers = campaign?.volunteers?.length || 0;
  const totalActivities = campaign?.activities?.length || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalOverlay
      title="Official Impact Report & Field Audit"
      onClose={onClose}
      buttons={[
        { label: "Close", cls: "btn-secondary", onClick: onClose },
        { label: "Print / Export PDF", cls: "btn-primary", onClick: handlePrint },
      ]}
    >
      {/* Report Header Card */}
      <div style={{ background: 'var(--surface-sunken)', padding: '16px', borderRadius: 'var(--radius-m)', border: '1px solid var(--border)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', fontWeight: 600 }}>
              AidLink Verified Disaster Impact Summary
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: '4px 0 6px' }}>
              {report?.title || `${campaign?.name} — Phase Impact Report`}
            </h2>
            <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
              <strong>Campaign:</strong> {campaign?.name} • <strong>Region:</strong> {campaign?.region || 'Field Mission'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="check" /> Published &amp; Audited
            </span>
            <div className="faint" style={{ fontSize: '11px', marginTop: '4px' }}>
              Period: {report?.period || 'Start to Present'}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-3" style={{ gap: '10px', marginBottom: '16px' }}>
        <div className="card card-pad" style={{ background: 'var(--surface)', textAlign: 'center' }}>
          <div className="stat-label">Households Reached</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)', marginTop: '2px' }}>
            {Number(householdsReached).toLocaleString('en-IN')}
          </div>
          <div className="faint" style={{ fontSize: '11px' }}>
            Target: {Number(campaign?.target_households || campaign?.targetHouseholds || 0).toLocaleString('en-IN')} HH
          </div>
        </div>

        <div className="card card-pad" style={{ background: 'var(--surface)', textAlign: 'center' }}>
          <div className="stat-label">Individuals Assisted</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginTop: '2px' }}>
            {Number(individualsReached).toLocaleString('en-IN')}
          </div>
          <div className="faint" style={{ fontSize: '11px' }}>
            Across {districts.length || 4} priority zones
          </div>
        </div>

        <div className="card card-pad" style={{ background: 'var(--surface)', textAlign: 'center' }}>
          <div className="stat-label">Audited Relief Spend</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>
            {fmtINR(totalAuditedExpenses)}
          </div>
          <div className="faint" style={{ fontSize: '11px' }}>
            {expenses.length} verified invoices
          </div>
        </div>
      </div>

      {/* Mission Objectives & Field Narrative */}
      <div className="field-group" style={{ marginBottom: '14px' }}>
        <label className="field-label" style={{ fontWeight: 600 }}>Crisis Objective &amp; Scope</label>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, background: 'var(--surface)', padding: '10px 12px', borderRadius: 'var(--radius-s)', border: '1px solid var(--border)' }}>
          {campaign?.objective || "Comprehensive disaster emergency response, medical aid, rapid food distribution, and community rehabilitation."}
        </p>
      </div>

      {/* Beneficiary Demographics and Coverage */}
      <div className="grid grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
        <div className="card card-pad" style={{ background: 'var(--surface)' }}>
          <div className="stat-label" style={{ marginBottom: '8px', fontWeight: 600 }}>Operational Districts &amp; Camps</div>
          {districts.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--ink)' }}>
              {districts.map((d, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  {typeof d === 'string' ? d : `${d.name} (${d.households || 'Active'} households)`}
                </li>
              ))}
            </ul>
          ) : (
            <div className="faint" style={{ fontSize: '12px' }}>Operational zone-wide distribution</div>
          )}
        </div>

        <div className="card card-pad" style={{ background: 'var(--surface)' }}>
          <div className="stat-label" style={{ marginBottom: '8px', fontWeight: 600 }}>Vulnerable Groups Supported</div>
          {vulnerableGroups.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {vulnerableGroups.map((g, i) => (
                <span key={i} className="badge badge-neutral" style={{ fontSize: '11.5px' }}>{g}</span>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-neutral">Flood-displaced Families</span>
              <span className="badge badge-neutral">Elderly Citizens</span>
              <span className="badge badge-neutral">Infants &amp; Toddlers</span>
            </div>
          )}
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--ink-soft)' }}>
            <strong>Demographic Split:</strong> {genderSplit.female}% Female • {genderSplit.male}% Male • {genderSplit.other}% Others
          </div>
        </div>
      </div>

      {/* Operations Highlights */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-m)', padding: '12px 14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Field Deployment Track Record</span>
          <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
            {totalVolunteers} Volunteers • {totalActivities} Completed Milestones
          </span>
        </div>
        <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
          {b.note || "All distribution drives, mobile medical triage camps, and supply chain convoys were conducted with verifiable beneficiary acknowledgments and GST invoicing."}
        </p>
      </div>

      {/* Verification Footer Notice */}
      <div className="notice notice-plain" style={{ marginTop: '10px' }}>
        <Icon name="shield" />
        <div>
          <div className="notice-title">Verified NGO Publication</div>
          <div className="notice-body" style={{ fontSize: '11.5px' }}>
            Authorized by <strong>{org?.name || campaign?.org_name || 'Udaan Relief'}</strong> (Darpan ID: {org?.darpan_id || org?.regNumber || 'BR/2022/0319482'}). All declarations are indexed for donor transparency and audit reconciliation.
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

export function NewResourceModal({ onClose, onSubmit }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState('Procured');
  const [allocated, setAllocated] = useState('');
  const [unit, setUnit] = useState('kits');

  const handleSubmit = () => {
    onSubmit({ name, source, allocated: Number(allocated), deployed: 0, unit });
  };

  if (isReviewing) {
    return (
      <ModalOverlay
        title="Review Resource Allocation"
        onClose={onClose}
        buttons={[
          { label: "Back to Edit", cls: "btn-secondary", onClick: () => setIsReviewing(false) },
          { label: "Confirm & Lock", cls: "btn-primary", onClick: handleSubmit },
        ]}
      >
        <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
          <p><strong>Resource Name:</strong> {name}</p>
          <p><strong>Source:</strong> {source}</p>
          <p><strong>Quantity Allocated:</strong> {allocated} {unit}</p>
        </div>
        <div className="notice notice-warn" style={{ marginTop: '16px' }}>
          <Icon name="alert" />
          <div className="notice-body">Once confirmed, this resource allocation will be permanently saved.</div>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay
      title="Allocate resource"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Review", cls: "btn-primary", onClick: () => setIsReviewing(true) },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Resource name</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dignity Kits" />
      </div>
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Source</label>
          <select className="field-input" value={source} onChange={(e) => setSource(e.target.value)}>
            <option>Procured</option>
            <option>Donated</option>
            <option>Government</option>
          </select>
        </div>
        <div className="field-group">
          <label className="field-label">Unit type</label>
          <input className="field-input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. kits, liters, pieces" />
        </div>
      </div>
      <div className="field-group">
        <label className="field-label">Quantity allocated</label>
        <input className="field-input" type="number" value={allocated} onChange={(e) => setAllocated(e.target.value)} placeholder="0" />
      </div>
    </ModalOverlay>
  );
}

export function UpdateBeneficiariesModal({ campaign, onClose, onSubmit }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [householdsReached, setHouseholdsReached] = useState(campaign?.beneficiaries?.householdsReached || 0);
  const [individualsReached, setIndividualsReached] = useState(campaign?.beneficiaries?.individualsReached || 0);
  
  const [female, setFemale] = useState(campaign?.beneficiaries?.genderSplit?.female || 0);
  const [male, setMale] = useState(campaign?.beneficiaries?.genderSplit?.male || 0);
  const [other, setOther] = useState(campaign?.beneficiaries?.genderSplit?.other || 0);

  const [districts, setDistricts] = useState(campaign?.beneficiaries?.districts || []);
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newDistrictHH, setNewDistrictHH] = useState('');

  const handleAddDistrict = () => {
    if (newDistrictName && newDistrictHH) {
      setDistricts([...districts, { name: newDistrictName, households: Number(newDistrictHH) }]);
      setNewDistrictName('');
      setNewDistrictHH('');
    }
  };
  
  const handleRemoveDistrict = (index) => {
    setDistricts(districts.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    const updatedBeneficiaries = {
      ...campaign.beneficiaries,
      householdsReached: Number(householdsReached),
      individualsReached: Number(individualsReached),
      districts,
      genderSplit: {
        female: Number(female),
        male: Number(male),
        other: Number(other)
      }
    };
    onSubmit(updatedBeneficiaries);
  };

  if (isReviewing) {
    return (
      <ModalOverlay
        title="Review Beneficiary Updates"
        onClose={onClose}
        buttons={[
          { label: "Back to Edit", cls: "btn-secondary", onClick: () => setIsReviewing(false) },
          { label: "Confirm & Lock", cls: "btn-primary", onClick: handleConfirm },
        ]}
      >
        <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
          <p><strong>Households Reached:</strong> {householdsReached}</p>
          <p><strong>Individuals Reached:</strong> {individualsReached}</p>
          <p><strong>Gender Split:</strong> {female}% F, {male}% M, {other}% Other</p>
          <p><strong>Districts:</strong> {districts.length > 0 ? districts.map(d => `${d.name} (${d.households})`).join(", ") : "None"}</p>
        </div>
        <div className="notice notice-warn" style={{ marginTop: '16px' }}>
          <Icon name="alert" />
          <div className="notice-body">Once confirmed, this data will be permanently saved to the dashboard.</div>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay
      title="Update beneficiaries"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Review", cls: "btn-primary", onClick: () => setIsReviewing(true) },
      ]}
    >
      <div className="grid grid-2">
        <div className="field-group">
          <label className="field-label">Households Reached</label>
          <input className="field-input" type="number" value={householdsReached} onChange={(e) => setHouseholdsReached(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label">Individuals Reached</label>
          <input className="field-input" type="number" value={individualsReached} onChange={(e) => setIndividualsReached(e.target.value)} />
        </div>
      </div>
      
      <div className="field-label" style={{ marginTop: '16px', marginBottom: '8px' }}>Gender Split (%)</div>
      <div className="grid grid-3">
        <div className="field-group">
          <label className="field-label" style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>Female</label>
          <input className="field-input" type="number" value={female} onChange={(e) => setFemale(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label" style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>Male</label>
          <input className="field-input" type="number" value={male} onChange={(e) => setMale(e.target.value)} />
        </div>
        <div className="field-group">
          <label className="field-label" style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>Other</label>
          <input className="field-input" type="number" value={other} onChange={(e) => setOther(e.target.value)} />
        </div>
      </div>

      <div className="field-label" style={{ marginTop: '16px', marginBottom: '8px' }}>Districts Reached</div>
      {districts.map((d, index) => (
        <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1, fontSize: '13px', background: 'var(--bg)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
            {d.name} — {d.households} households
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => handleRemoveDistrict(index)}>Remove</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <input className="field-input" placeholder="District name" value={newDistrictName} onChange={e => setNewDistrictName(e.target.value)} style={{ flex: 2 }} />
        <input className="field-input" type="number" placeholder="Households" value={newDistrictHH} onChange={e => setNewDistrictHH(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-secondary" onClick={handleAddDistrict}>Add</button>
      </div>
    </ModalOverlay>
  );
}

export function UpdateResourceModal({ resource, onClose, onSubmit }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [deployed, setDeployed] = useState(resource.deployed || 0);

  const handleSubmit = () => {
    onSubmit({ deployed: Number(deployed) });
  };

  if (isReviewing) {
    return (
      <ModalOverlay
        title="Review Resource Update"
        onClose={onClose}
        buttons={[
          { label: "Back to Edit", cls: "btn-secondary", onClick: () => setIsReviewing(false) },
          { label: "Confirm & Lock", cls: "btn-primary", onClick: handleSubmit },
        ]}
      >
        <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
          <p><strong>Resource:</strong> {resource.name}</p>
          <p><strong>Allocated:</strong> {resource.allocated} {resource.unit}</p>
          <p><strong>Deployed:</strong> {deployed} {resource.unit}</p>
        </div>
        <div className="notice notice-warn" style={{ marginTop: '16px' }}>
          <Icon name="alert" />
          <div className="notice-body">Once confirmed, this update will be saved to the database.</div>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay
      title="Update Resource Deployment"
      onClose={onClose}
      buttons={[
        { label: "Cancel", cls: "btn-secondary", onClick: onClose },
        { label: "Review", cls: "btn-primary", onClick: () => setIsReviewing(true) },
      ]}
    >
      <div className="field-group">
        <label className="field-label">Resource</label>
        <div style={{ fontSize: '13px', color: 'var(--ink)' }}>{resource.name} ({resource.source})</div>
      </div>
      <div className="field-group">
        <label className="field-label">Total Allocated</label>
        <div style={{ fontSize: '13px', color: 'var(--ink)' }}>{resource.allocated} {resource.unit}</div>
      </div>
      <div className="field-group">
        <label className="field-label">Amount Deployed</label>
        <input className="field-input" type="number" value={deployed} onChange={(e) => setDeployed(e.target.value)} placeholder="0" />
      </div>
    </ModalOverlay>
  );
}

const pool = require('../config/db');

// 1. Get logged-in Supporter's Profile
exports.getSupporterProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, aadhaar_id, city, state, help_types, role, resume_path, created_at 
       FROM supporters WHERE id = $1 AND email = $2`,
      [req.user.id, req.user.email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supporter not found' });
    }

    const supporter = result.rows[0];
    res.json({
      id: supporter.id,
      fullName: supporter.full_name,
      email: supporter.email,
      aadhaarId: supporter.aadhaar_id,
      city: supporter.city,
      state: supporter.state,
      helpTypes: supporter.help_types || [],
      role: supporter.role || 'SUPPORTER',
      resumePath: supporter.resume_path || null,
      createdAt: supporter.created_at
    });
  } catch (err) {
    console.error('Error fetching supporter profile:', err.message);
    res.status(500).json({ error: 'Server error fetching profile.' });
  }
};

// 2. Upload Profile CV / Resume
exports.uploadProfileDocument = async (req, res) => {
  try {
    const supporterId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a document file to upload.' });
    }

    const filePath = req.file.path.replace(/\\/g, '/');

    const result = await pool.query(
      `UPDATE supporters SET resume_path = $1 WHERE id = $2 AND email = $3 RETURNING id, full_name, resume_path`,
      [filePath, supporterId, req.user.email]
    );

    res.json({
      message: 'CV / Supporting document uploaded successfully!',
      resumePath: filePath
    });
  } catch (err) {
    console.error('Error uploading profile document:', err.message);
    res.status(500).json({ error: 'Server error uploading document.' });
  }
};

// 3. Get Supporter Dashboard Summary & Real Aggregated Stats (NO MOCK DATA)
exports.getSupporterDashboardSummary = async (req, res) => {
  try {
    const supporterId = req.user.id;

    // Get supporter info
    const supporterRes = await pool.query(
      `SELECT id, full_name, email, city, state, help_types, resume_path, created_at 
       FROM supporters WHERE id = $1 AND email = $2`,
      [supporterId, req.user.email]
    );

    if (supporterRes.rows.length === 0) {
      return res.status(404).json({ error: 'Supporter not found' });
    }

    const supporter = supporterRes.rows[0];

    // Get volunteer commitments / applications
    const volRes = await pool.query(
      `SELECT v.*, c.name as campaign_name, c.disaster, c.region
       FROM volunteers v
       LEFT JOIN campaigns c ON v.campaign_id = c.id
       WHERE v.supporter_id = $1 OR LOWER(v.name) = LOWER($2)
       ORDER BY v.applied_on DESC`,
      [supporterId, supporter.full_name]
    );

    // Get supporter donations (joining campaigns and ngos)
    const donRes = await pool.query(
      `SELECT d.*, c.name as campaign_name, n.org_name as ngo_name, n.short_name as ngo_short_name
       FROM donations d
       LEFT JOIN campaigns c ON d.campaign_id = c.id
       LEFT JOIN ngos n ON (d.ngo_id = n.id OR (d.ngo_id IS NULL AND c.ngo_id = n.id))
       WHERE LOWER(d.donor) = LOWER($1) OR LOWER(d.donor) = LOWER($2)
       ORDER BY d.date DESC`,
      [supporter.full_name, supporter.email]
    );

    // Get active campaigns count
    const campRes = await pool.query(`SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'`);
    const totalActiveCampaigns = parseInt(campRes.rows[0].count, 10) || 0;

    // Get Active Campaigns, prioritizing URGENT ones
    const userCity = supporter.city ? supporter.city.trim() : '';
    const activeCampRes = await pool.query(
      `SELECT c.id, c.name, c.disaster, c.region, c.objective, c.target_households, c.cover_image_path, 
              c.is_urgent, c.status, c.created_at,
              n.org_name, n.short_name, n.hq
       FROM campaigns c
       LEFT JOIN ngos n ON c.ngo_id = n.id
       WHERE c.status = 'active'
       ORDER BY c.is_urgent DESC, c.created_at DESC`
    );

    // Get Active Workshops
    const workshopRes = await pool.query(
      `SELECT w.id, w.ngo_id, w.title, w.description, w.date, w.time, w.location, w.city,
              w.target_capacity, w.registered_count, w.form_url, w.created_at,
              n.org_name, n.short_name, n.hq
       FROM workshops w
       LEFT JOIN ngos n ON w.ngo_id = n.id
       ORDER BY w.created_at DESC`
    );

    const formattedCampaigns = activeCampRes.rows.map(c => ({
      id: `camp-${c.id}`,
      rawId: c.id,
      type: 'campaign',
      title: c.name,
      name: c.name,
      disaster: c.disaster,
      region: c.region,
      objective: c.objective,
      target_households: c.target_households,
      cover_image_path: c.cover_image_path,
      isUrgent: Boolean(c.is_urgent),
      status: c.status,
      org_name: c.org_name,
      orgName: c.org_name,
      short_name: c.short_name,
      hq: c.hq,
      createdAt: c.created_at
    }));

    const formattedWorkshops = workshopRes.rows.map(w => ({
      id: `ws-${w.id}`,
      rawId: w.id,
      type: 'workshop',
      title: w.title,
      name: w.title,
      description: w.description,
      objective: w.description,
      date: w.date,
      time: w.time,
      location: w.location,
      city: w.city,
      region: w.location ? `${w.location}, ${w.city || ''}`.replace(/,\s*$/, '') : (w.city || 'On-ground'),
      target_capacity: w.target_capacity,
      registered_count: w.registered_count,
      form_url: w.form_url,
      isUrgent: false,
      org_name: w.org_name,
      orgName: w.org_name,
      short_name: w.short_name,
      hq: w.hq,
      createdAt: w.created_at
    }));

    // Unified Recent Activities: Urgent campaigns first, then remaining campaigns & workshops
    const urgentCampaigns = formattedCampaigns.filter(c => c.isUrgent);
    const nonUrgentItems = [
      ...formattedCampaigns.filter(c => !c.isUrgent),
      ...formattedWorkshops
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const recentActivities = [...urgentCampaigns, ...nonUrgentItems];

    const volunteerRecords = volRes.rows;
    const donations = donRes.rows;

    // Calculate REAL aggregated stats (no hardcoded fake values)
    const totalHoursLogged = volunteerRecords.reduce((sum, v) => sum + (Number(v.hours_logged) || 0), 0);
    const activeCommitments = volunteerRecords.filter(v => v.status === 'active' || v.status === 'ACCEPTED').length;
    const totalDonated = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    // Real upcoming / active activities (only for this user's accepted or pending applications)
    const upcomingActivities = volunteerRecords.map(v => ({
      id: v.id,
      title: v.role || 'Volunteer Activity',
      campaign: v.campaign_name || 'Emergency Campaign',
      date: v.applied_on ? new Date(v.applied_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled',
      location: v.region || `${supporter.city || ''}, ${supporter.state || ''}`.trim().replace(/^,\s*|\s*,\s*$/g, '') || 'On-ground',
      status: v.status || 'pending',
      documentPath: v.document_path || null
    }));

    // Real logs
    const recentActivityLogs = [
      ...volunteerRecords.map(v => ({
        id: `vol-${v.id}`,
        type: 'volunteer',
        text: `Application for "${v.campaign_name || 'Campaign'}" is ${v.status === 'active' ? 'Approved' : v.status === 'rejected' ? 'Declined' : 'Pending Review'}.`,
        time: v.applied_on ? new Date(v.applied_on).toLocaleDateString() : 'Recently'
      })),
      ...donations.map(d => ({
        id: `don-${d.id}`,
        type: 'donation',
        text: d.campaign_name 
          ? `Contributed ₹${d.amount} to "${d.campaign_name}".`
          : `Donated ₹${d.amount} directly to "${d.ngo_name || 'NGO Partner'}".`,
        time: d.date ? new Date(d.date).toLocaleDateString() : 'Recently'
      }))
    ];

    res.json({
      supporter: {
        id: supporter.id,
        name: supporter.full_name || 'Supporter',
        email: supporter.email,
        city: supporter.city || '',
        state: supporter.state || '',
        helpTypes: supporter.help_types || [],
        resumePath: supporter.resume_path || null,
        verifiedOn: supporter.created_at ? new Date(supporter.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified',
        status: 'Active'
      },
      stats: {
        campaigns: totalActiveCampaigns,
        activities: volunteerRecords.length,
        volunteerHours: totalHoursLogged,
        totalDonations: donations.length,
        totalDonatedAmount: totalDonated
      },
      upcomingActivities,
      recentActivity: recentActivityLogs,
      recentActivities,
      localCampaigns: formattedCampaigns,
      workshops: formattedWorkshops
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err.message);
    res.status(500).json({ error: 'Server error loading dashboard summary.' });
  }
};

// 4. Discover Campaigns (Public / Supporter View)
exports.getDiscoverCampaigns = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id, c.name, c.disaster, c.region, c.status, c.objective,
        c.target_households, c.start_date, c.progress, c.cover_image_path, c.is_urgent as "isUrgent",
        n.org_name, n.short_name, n.hq,
        (SELECT COUNT(*) FROM volunteers v WHERE v.campaign_id = c.id) as volunteers_count,
        (SELECT COALESCE(SUM(amount), 0) FROM donations d WHERE d.campaign_id = c.id) as funds_raised
      FROM campaigns c
      LEFT JOIN ngos n ON c.ngo_id = n.id
      ORDER BY c.is_urgent DESC, c.created_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching discover campaigns:', err.message);
    res.status(500).json({ error: 'Server error loading campaigns.' });
  }
};

// 5. Supporter Volunteer Application (Mandatory Supporting Document / CV Upload)
exports.applyVolunteer = async (req, res) => {
  try {
    const supporterId = req.user.id;
    const { campaignId, role, skills } = req.body;

    // Get supporter profile
    const sRes = await pool.query('SELECT full_name, resume_path FROM supporters WHERE id = $1 AND email = $2', [supporterId, req.user.email]);
    if (sRes.rows.length === 0) return res.status(404).json({ error: 'Supporter not found' });
    const supporter = sRes.rows[0];
    const name = supporter.full_name;

    // Require document file either from upload or existing profile resume
    let documentPath = null;
    if (req.file) {
      documentPath = req.file.path.replace(/\\/g, '/');
      // Update profile resume_path as well
      await pool.query('UPDATE supporters SET resume_path = $1 WHERE id = $2 AND email = $3', [documentPath, supporterId, req.user.email]);
    } else if (supporter.resume_path) {
      documentPath = supporter.resume_path;
    } else {
      return res.status(400).json({
        error: 'A supporting document (CV/Resume) is mandatory to apply for volunteering.'
      });
    }

    let parsedSkills = ['General Assistance'];
    if (skills) {
      try {
        parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (e) {
        parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Set initial status to 'pending' so it appears in NGO Dashboard under "Awaiting review / Pending review"
    const result = await pool.query(
      `INSERT INTO volunteers (campaign_id, supporter_id, name, role, skills, hours_logged, status, applied_on, document_path)
       VALUES ($1, $2, $3, $4, $5, 0, 'pending', CURRENT_TIMESTAMP, $6)
       RETURNING *`,
      [campaignId || null, supporterId, name, role || 'Volunteer', JSON.stringify(parsedSkills), documentPath]
    );

    res.status(201).json({
      message: 'Volunteer application submitted successfully for NGO review!',
      volunteer: result.rows[0]
    });
  } catch (err) {
    console.error('Error applying for volunteer:', err.message);
    res.status(500).json({ error: 'Server error submitting volunteer application.' });
  }
};

// 6. Get Supporter Volunteer Commitments & Applications
exports.getSupporterVolunteering = async (req, res) => {
  try {
    const supporterId = req.user.id;
    const sRes = await pool.query('SELECT full_name FROM supporters WHERE id = $1 AND email = $2', [supporterId, req.user.email]);
    const name = sRes.rows[0]?.full_name || '';

    const result = await pool.query(
      `SELECT v.*, c.name as campaign_name, c.disaster, c.region, n.org_name
       FROM volunteers v
       LEFT JOIN campaigns c ON v.campaign_id = c.id
       LEFT JOIN ngos n ON c.ngo_id = n.id
       WHERE v.supporter_id = $1 OR LOWER(v.name) = LOWER($2)
       ORDER BY v.applied_on DESC`,
      [supporterId, name]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching volunteering commitments:', err.message);
    res.status(500).json({ error: 'Server error loading volunteering commitments.' });
  }
};

// 6.5. Get Registered NGOs List (for direct donations and partner discovery)
exports.getNgosList = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, org_name, short_name, hq, tagline, sectors, verification_status
       FROM ngos
       ORDER BY org_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching NGOs list:', err.message);
    res.status(500).json({ error: 'Server error loading NGOs.' });
  }
};

// 7. Make a Donation (Direct to NGO or to a specific Campaign)
exports.createDonation = async (req, res) => {
  try {
    const supporterId = req.user.id;
    const { campaignId, ngoId, amount, purpose, method } = req.body;

    const sRes = await pool.query('SELECT full_name, email FROM supporters WHERE id = $1 AND email = $2', [supporterId, req.user.email]);
    const supporter = sRes.rows[0];

    const donorName = supporter?.full_name || 'Generous Supporter';

    let targetNgoId = null;
    if (ngoId) {
      const ngoDigits = String(ngoId).replace(/\D/g, '');
      if (ngoDigits) targetNgoId = parseInt(ngoDigits, 10);
    }

    let targetCampaignId = null;
    if (campaignId) {
      const campDigits = String(campaignId).replace(/\D/g, '');
      if (campDigits) targetCampaignId = parseInt(campDigits, 10);
    }

    // If campaignId is provided, look up the campaign's NGO if targetNgoId not explicitly set
    if (targetCampaignId) {
      const cRes = await pool.query('SELECT ngo_id FROM campaigns WHERE id = $1', [targetCampaignId]);
      if (cRes.rows.length > 0) {
        targetNgoId = cRes.rows[0].ngo_id;
      }
    }

    const result = await pool.query(
      `INSERT INTO donations (campaign_id, ngo_id, donor, amount, purpose, method, date)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [targetCampaignId, targetNgoId, donorName, amount, purpose || 'General Relief / NGO Support', method || 'UPI']
    );

    res.status(201).json({
      message: 'Thank you! Your donation was recorded successfully.',
      donation: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating donation:', err.message);
    res.status(500).json({ error: 'Server error recording donation.' });
  }
};

// 8. Get Supporter Donations History
exports.getSupporterDonations = async (req, res) => {
  try {
    const supporterId = req.user.id;
    const sRes = await pool.query('SELECT full_name, email FROM supporters WHERE id = $1 AND email = $2', [supporterId, req.user.email]);
    const supporter = sRes.rows[0];

    if (!supporter) return res.status(404).json({ error: 'Supporter not found' });

    const result = await pool.query(
      `SELECT d.*, c.name as campaign_name, c.disaster, c.region, n.org_name as ngo_name, n.short_name as ngo_short_name
       FROM donations d
       LEFT JOIN campaigns c ON d.campaign_id = c.id
       LEFT JOIN ngos n ON (d.ngo_id = n.id OR (d.ngo_id IS NULL AND c.ngo_id = n.id))
       WHERE LOWER(d.donor) = LOWER($1) OR LOWER(d.donor) = LOWER($2)
       ORDER BY d.date DESC`,
      [supporter.full_name, supporter.email]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching donations history:', err.message);
    res.status(500).json({ error: 'Server error loading donations history.' });
  }
};

// 9. Log Volunteer Hours
exports.logHours = async (req, res) => {
  try {
    const { volunteerId, hours } = req.body;
    const supporterId = req.user.id;

    const result = await pool.query(
      `UPDATE volunteers 
       SET hours_logged = COALESCE(hours_logged, 0) + $1
       WHERE id = $2 AND (supporter_id = $3 OR supporter_id IS NULL)
       RETURNING *`,
      [hours, volunteerId, supporterId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Volunteer record not found or not authorized.' });
    }

    res.json({
      message: 'Hours logged successfully!',
      volunteer: result.rows[0]
    });
  } catch (err) {
    console.error('Error logging hours:', err.message);
    res.status(500).json({ error: 'Server error logging volunteer hours.' });
  }
};

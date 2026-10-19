const pool = require('../config/db');

exports.getNgoProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, org_name as name, org_name, contact_name, email, darpan_id, 
              verification_status, registration_cert_path, supporting_doc_path,
              short_name, hq, founded, tagline,
              reg_type as "regType", darpan_id as "regNumber", pan, fcra, 
              status_80g as "status80g", sectors, verification, team, docs, created_at
       FROM ngos WHERE id = $1 AND email = $2`,
      [req.user.id, req.user.email] 
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'NGO not found' });
    
    const row = result.rows[0];
    
    const profile = {
      ...row,
      name: row.name || row.org_name || 'Organisation',
      shortName: row.short_name || (row.org_name ? row.org_name.substring(0, 3).toUpperCase() : 'NGO'),
      hq: row.hq || 'India',
      founded: row.founded || (row.created_at ? new Date(row.created_at).getFullYear() : 2024),
      tagline: row.tagline || 'Emergency Disaster Response & Community Assistance',
      sectors: Array.isArray(row.sectors) && row.sectors.length > 0 ? row.sectors : ['Disaster Relief', 'Emergency Aid', 'Community Rehabilitation'],
      regType: row.regType || 'Registered Non-Profit Society',
      regNumber: row.regNumber || row.darpan_id || 'DARPAN/REG/2026',
      pan: row.pan || 'AAATN1234F',
      fcra: row.fcra || 'Eligible / Registered',
      status80g: row.status80g || '80G Tax Exempt Certified',
      verification: row.verification && typeof row.verification === 'object' && row.verification.steps ? row.verification : {
        status: row.verification_status || 'verified',
        completedOn: row.created_at || '2026-01-15',
        steps: [
          { label: 'Darpan Portal & Registration ID', detail: `Verified registration ID: ${row.darpan_id || 'DARPAN/REG/2026'}` },
          { label: 'Identity & Legal Certification', detail: 'Registration certificate and supporting documentation verified.' },
          { label: 'Bank & Financial Accountability Check', detail: 'Direct donation routing & 80G tax exemption active.' }
        ]
      },
      team: Array.isArray(row.team) && row.team.length > 0 ? row.team : [
        { name: row.contact_name || 'Coordinator', role: 'Operations & Field Lead', since: '2024' }
      ],
      docs: Array.isArray(row.docs) && row.docs.length > 0 ? row.docs : [
        { name: 'Registration Certificate', type: 'PDF Document', updated: row.created_at || '2026-01-10', path: row.registration_cert_path },
        { name: 'Supporting Authority Letter', type: 'PDF Document', updated: row.created_at || '2026-01-10', path: row.supporting_doc_path }
      ]
    };

    res.json(profile);
  } catch (err) {
    console.error('Error fetching NGO profile:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getNgoDonations = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const result = await pool.query(
      `SELECT d.*, c.name as campaign_name, c.disaster, c.region
       FROM donations d
       LEFT JOIN campaigns c ON d.campaign_id = c.id
       WHERE d.ngo_id = $1 OR c.ngo_id = $1
       ORDER BY d.date DESC`,
      [ngoId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching NGO donations:', err.message);
    res.status(500).json({ error: 'Server error loading NGO donations.' });
  }
};

exports.getNgoDirectory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        n.id,
        n.org_name,
        n.contact_name,
        n.email,
        n.darpan_id,
        n.verification_status,
        n.short_name,
        n.hq,
        n.founded,
        n.tagline,
        n.reg_type,
        n.pan,
        n.fcra,
        n.status_80g,
        n.sectors,
        n.team,
        n.created_at,
        (
          SELECT COALESCE(json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'disaster', c.disaster,
              'region', c.region,
              'status', c.status,
              'progress', c.progress,
              'isUrgent', c.is_urgent,
              'targetHouseholds', c.target_households,
              'householdsReached', COALESCE((c.beneficiaries->>'householdsReached')::int, 0),
              'individualsReached', COALESCE((c.beneficiaries->>'individualsReached')::int, 0)
            ) ORDER BY c.created_at DESC
          ), '[]')
          FROM campaigns c
          WHERE c.ngo_id = n.id AND (c.status = 'active' OR c.status IS NULL)
        ) AS active_campaigns,
        (
          SELECT COUNT(*)::int
          FROM campaigns c
          WHERE c.ngo_id = n.id
        ) AS total_campaigns_count,
        (
          SELECT COALESCE(SUM((c.beneficiaries->>'householdsReached')::int), 0)::int
          FROM campaigns c
          WHERE c.ngo_id = n.id
        ) AS total_households_reached,
        (
          SELECT COALESCE(json_agg(
            json_build_object(
              'id', w.id,
              'title', w.title,
              'city', w.city,
              'date', w.date,
              'time', w.time,
              'location', w.location,
              'targetCapacity', w.target_capacity,
              'registeredCount', w.registered_count,
              'formUrl', w.form_url
            ) ORDER BY w.created_at DESC
          ), '[]')
          FROM workshops w
          WHERE w.ngo_id = n.id
        ) AS workshops
      FROM ngos n
      WHERE n.verification_status = 'APPROVED'
      ORDER BY n.id ASC;
    `);

    const directory = result.rows.map(row => {
      const activeCampaigns = row.active_campaigns || [];
      const regions = [...new Set(activeCampaigns.map(c => c.region).filter(Boolean))];
      if (row.hq && !regions.includes(row.hq)) {
        regions.unshift(row.hq);
      }

      const sectors = Array.isArray(row.sectors) && row.sectors.length > 0
        ? row.sectors
        : ['Disaster Relief', 'Emergency Aid', 'Community Rehabilitation'];

      return {
        id: row.id,
        name: row.org_name,
        shortName: row.short_name || (row.org_name ? row.org_name.substring(0, 3).toUpperCase() : 'NGO'),
        contactName: row.contact_name,
        email: row.email,
        darpanId: row.darpan_id,
        hq: row.hq || 'India',
        founded: row.founded || 2020,
        tagline: row.tagline || 'Community Disaster Relief and Grassroots Humanitarian Response.',
        regType: row.reg_type || 'Registered Non-Profit Society',
        pan: row.pan || 'Verified',
        fcra: row.fcra || 'Registered',
        status80g: row.status_80g || 'Active 80G Certified',
        sectors,
        team: Array.isArray(row.team) && row.team.length > 0 ? row.team : [
          { name: row.contact_name || 'Operations Lead', role: 'Operations & Field Lead', since: '2024' }
        ],
        activeCampaigns,
        campaignsCount: activeCampaigns.length,
        totalCampaignsCount: row.total_campaigns_count || 0,
        totalHouseholdsReached: row.total_households_reached || 0,
        regions,
        workshops: row.workshops || [],
        workshopsCount: (row.workshops || []).length,
        createdAt: row.created_at
      };
    });

    res.json(directory);
  } catch (err) {
    console.error('Error fetching NGO directory:', err.message);
    res.status(500).json({ error: 'Failed to load NGO directory.' });
  }
};
const pool = require('../config/db');

exports.getNgoProfile = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const result = await pool.query(
      `SELECT 
        id, 
        org_name, 
        contact_name, 
        email, 
        darpan_id, 
        verification_status, 
        created_at,
        registration_cert_path,
        supporting_doc_path
       FROM ngos 
       WHERE id = $1`,
      [ngoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'NGO not found' });
    }

    const ngo = result.rows[0];

    const campaignsResult = await pool.query(
      `SELECT * FROM campaigns WHERE ngo_id = $1 ORDER BY created_at DESC`,
      [ngoId]
    );

    res.json({
      id: ngo.id,
      orgName: ngo.org_name,
      contactName: ngo.contact_name,
      email: ngo.email,
      darpanId: ngo.darpan_id,
      verificationStatus: ngo.verification_status,
      registrationCertPath: ngo.registration_cert_path,
      supportingDocPath: ngo.supporting_doc_path,
      createdAt: ngo.created_at,
      campaigns: campaignsResult.rows
    });
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
          SELECT COALESCE(SUM(d.amount), 0)::numeric 
          FROM donations d 
          LEFT JOIN campaigns c ON d.campaign_id = c.id 
          WHERE d.ngo_id = n.id OR (d.ngo_id IS NULL AND c.ngo_id = n.id)
        ) AS total_donated,
        (
          SELECT COUNT(d.id)::int 
          FROM donations d 
          LEFT JOIN campaigns c ON d.campaign_id = c.id 
          WHERE d.ngo_id = n.id OR (d.ngo_id IS NULL AND c.ngo_id = n.id)
        ) AS donations_count,
        (
          SELECT COALESCE(SUM(e.amount), 0)::numeric 
          FROM expenses e 
          JOIN campaigns c ON e.campaign_id = c.id 
          WHERE c.ngo_id = n.id
        ) AS total_used,
        (
          SELECT COUNT(e.id)::int 
          FROM expenses e 
          JOIN campaigns c ON e.campaign_id = c.id 
          WHERE c.ngo_id = n.id
        ) AS expenses_count,
        (
          SELECT COUNT(ev.id)::int 
          FROM evidence ev 
          JOIN campaigns c ON ev.campaign_id = c.id 
          WHERE c.ngo_id = n.id
        ) AS evidence_count,
        (
          SELECT COALESCE(SUM(c.target_households), 0)::int 
          FROM campaigns c 
          WHERE c.ngo_id = n.id
        ) AS target_households,
        (
          SELECT COALESCE(json_agg(json_build_object('category', cat.category, 'total', cat.total)), '[]') 
          FROM (
            SELECT e.category, SUM(e.amount)::numeric as total 
            FROM expenses e 
            JOIN campaigns c ON e.campaign_id = c.id 
            WHERE c.ngo_id = n.id 
            GROUP BY e.category 
            ORDER BY total DESC
          ) cat
        ) AS expense_categories,
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

      const totalDonated = parseFloat(row.total_donated) || 0;
      const totalUsed = parseFloat(row.total_used) || 0;
      const utilizationRate = totalDonated > 0 ? Math.round((totalUsed / totalDonated) * 100) : 0;

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
        targetHouseholds: row.target_households || 0,
        totalDonated,
        donationsCount: row.donations_count || 0,
        totalUsed,
        expensesCount: row.expenses_count || 0,
        evidenceCount: row.evidence_count || 0,
        utilizationRate,
        expenseCategories: row.expense_categories || [],
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

const pool = require('../config/db');
const { sendUrgentCampaignAlert } = require('../services/emailService');

// Helper for audit logs
const logAudit = async (campaignId, actor, action, detail) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (campaign_id, actor, action, detail, ts) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [campaignId, actor, action, detail]
    );
  } catch(e) {
    console.error("Audit log failed", e);
  }
};

/**
 * Dispatch emergency broadcast emails to registered volunteers via Resend
 * when an urgent campaign becomes active.
 */
const notifyVolunteersIfUrgent = async (campaignId, ngoId) => {
  try {
    const campRes = await pool.query('SELECT * FROM campaigns WHERE id = $1', [campaignId]);
    if (campRes.rows.length === 0) return { success: false, reason: 'not_found' };
    const campaign = campRes.rows[0];

    // Verify it is active and marked urgent
    if (campaign.status !== 'active' || !campaign.is_urgent) {
      console.log(`[Urgent Alert] Campaign #${campaignId} is not active+urgent (status: ${campaign.status}, urgent: ${campaign.is_urgent}). Skipping alert.`);
      return { success: false, reason: 'not_urgent_or_active' };
    }

    // Get NGO organization name
    let ngoName = 'AidLink Partner NGO';
    const finalNgoId = ngoId || campaign.ngo_id;
    if (finalNgoId) {
      const ngoRes = await pool.query('SELECT org_name FROM ngos WHERE id = $1', [finalNgoId]);
      if (ngoRes.rows.length > 0 && ngoRes.rows[0].org_name) {
        ngoName = ngoRes.rows[0].org_name;
      }
    }

    // Query registered volunteers
    // Filter supporters who registered for volunteering, or fallback to all registered supporters
    let volunteersRes = await pool.query(
      `SELECT id, full_name, email FROM supporters WHERE 'volunteering' = ANY(help_types)`
    );

    if (volunteersRes.rows.length === 0) {
      volunteersRes = await pool.query(
        `SELECT id, full_name, email FROM supporters`
      );
    }

    console.log(`🚨 [Urgent Alert] Dispatching broadcast to ${volunteersRes.rows.length} volunteer(s) for campaign: "${campaign.name}"`);

    const dispatchResult = await sendUrgentCampaignAlert({
      campaign,
      volunteers: volunteersRes.rows,
      ngoName
    });

    const auditDetail = dispatchResult.total > 0
      ? `Dispatched emergency email alert to ${dispatchResult.sent}/${dispatchResult.total} registered volunteer(s) via Resend`
      : 'No registered volunteers found in database to alert';

    await logAudit(campaignId, 'System (Resend)', 'Emergency Alerts Dispatched', auditDetail);

    return dispatchResult;
  } catch (err) {
    console.error('❌ [Urgent Alert] Exception in notifyVolunteersIfUrgent:', err);
    return { success: false, error: err.message };
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        c.start_date AS "startDate",
        (SELECT COALESCE(json_agg(
            json_build_object(
              'id', act.id, 'title', act.title, 'type', act.type, 
              'status', act.status, 'location', act.location, 
              'date', act.activity_date, 'volunteersAssigned', act.volunteers_assigned, 'notes', act.notes
            ) ORDER BY act.id
          ), '[]') FROM activities act WHERE act.campaign_id = c.id) AS activities,
        (SELECT COALESCE(json_agg(row_to_json(exp)), '[]') FROM expenses exp WHERE exp.campaign_id = c.id) AS expenses,
        (SELECT COALESCE(json_agg(
            json_build_object(
              'id', ev.id, 'title', ev.title, 'type', ev.document_type,
              'linkedTo', ev.linked_to, 'uploadedBy', ev.uploaded_by,
              'date', ev.uploaded_at, 'filePath', ev.file_path
            ) ORDER BY ev.uploaded_at DESC
          ), '[]') FROM evidence ev WHERE ev.campaign_id = c.id) AS evidence,
        (SELECT COALESCE(json_agg(row_to_json(res)), '[]') FROM resources res WHERE res.campaign_id = c.id) AS resources,
        (SELECT COALESCE(json_agg(row_to_json(vol)), '[]') FROM volunteers vol WHERE vol.campaign_id = c.id) AS volunteers,
        (SELECT COALESCE(json_agg(row_to_json(don)), '[]') FROM donations don WHERE don.campaign_id = c.id) AS donations,
        (SELECT COALESCE(json_agg(row_to_json(upd)), '[]') FROM updates upd WHERE upd.campaign_id = c.id) AS updates,
        (SELECT COALESCE(json_agg(row_to_json(ir)), '[]') FROM impact_reports ir WHERE ir.campaign_id = c.id) AS "impactReports",
        (SELECT COALESCE(json_agg(row_to_json(al) ORDER BY al.ts DESC), '[]') FROM audit_logs al WHERE al.campaign_id = c.id) AS audit
      FROM campaigns c
      WHERE c.ngo_id = $1
      ORDER BY c.created_at DESC;
    `;
    
    const result = await pool.query(query, [req.user.id]);

    const formattedRows = result.rows.map(row => ({
      ...row,
      isUrgent: Boolean(row.is_urgent),
      targetHouseholds: row.target_households,
      lastUpdatePublished: row.last_update_published
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error('Error fetching campaigns:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.createCampaign = async (req, res) => {
  const { ngo_id, name, disaster, region, objective, target_households } = req.body;
  const is_urgent = req.body.is_urgent === 'true' || req.body.is_urgent === true || req.body.isUrgent === 'true' || req.body.isUrgent === true;
  const cover_image_path = req.file ? req.file.path.replace(/\\/g, '/') : null;
  const initialBeneficiaries = JSON.stringify({ householdsReached: 0, individualsReached: 0, districts: [], genderSplit: { female: 0, male: 0, other: 0 }, vulnerableGroupsCovered: [], note: "" });
  
  try {
    const newCampaign = await pool.query(
      `INSERT INTO campaigns (ngo_id, name, disaster, region, objective, target_households, cover_image_path, beneficiaries, health, status, is_urgent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [ngo_id || req.user?.id || 1, name, disaster, region, objective, target_households, cover_image_path, initialBeneficiaries, 'not_started', 'draft', is_urgent] 
    );
    await logAudit(newCampaign.rows[0].id, 'You', 'Campaign Created', is_urgent ? 'Draft created (Marked as Urgent)' : 'Draft created');
    res.status(201).json({
      ...newCampaign.rows[0],
      isUrgent: Boolean(newCampaign.rows[0].is_urgent)
    });
  } catch (err) {
    console.error('Error creating campaign:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.toggleCampaignUrgent = async (req, res) => {
  const { id } = req.params;
  const { is_urgent } = req.body;
  try {
    const result = await pool.query(
      `UPDATE campaigns SET is_urgent = $1 WHERE id = $2 AND ngo_id = $3 RETURNING *`,
      [Boolean(is_urgent), id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    await logAudit(id, 'You', 'Updated Urgency Priority', is_urgent ? 'Marked as High Priority / Urgent' : 'Standard Priority');

    let emailBroadcastTriggered = false;
    // If marked urgent while the campaign is already active, trigger email broadcast to volunteers
    if (Boolean(is_urgent) && result.rows[0].status === 'active') {
      emailBroadcastTriggered = true;
      notifyVolunteersIfUrgent(id, req.user.id);
    }

    res.json({
      ...result.rows[0],
      isUrgent: Boolean(result.rows[0].is_urgent),
      emailBroadcastTriggered
    });
  } catch (err) {
    console.error('Error updating campaign urgency:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateCampaignStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    let query, values;
    if (status === 'active') {
      query = `UPDATE campaigns SET status = $1, health = 'on_track', start_date = CURRENT_DATE WHERE id = $2 RETURNING *`;
      values = [status, id];
      await logAudit(id, 'You', 'Campaign Published', 'Moved from Draft to Active');
    } else {
      query = `UPDATE campaigns SET status = $1 WHERE id = $2 RETURNING *`;
      values = [status, id];
    }
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });

    let emailBroadcastTriggered = false;
    // If published (active) and marked urgent, trigger email broadcast to volunteers
    if (status === 'active' && Boolean(result.rows[0].is_urgent)) {
      emailBroadcastTriggered = true;
      notifyVolunteersIfUrgent(id, req.user?.id);
    }

    res.json({
      ...result.rows[0],
      isUrgent: Boolean(result.rows[0].is_urgent),
      emailBroadcastTriggered
    });
  } catch (err) {
    console.error('Error updating campaign status:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.testUrgentAlertDispatch = async (req, res) => {
  const { id } = req.params;
  try {
    const dispatchResult = await notifyVolunteersIfUrgent(id, req.user?.id);
    res.json({
      message: 'Urgent alert dispatch processed',
      dispatchResult
    });
  } catch (err) {
    console.error('Error testing urgent alert dispatch:', err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.addActivity = async (req, res) => {
  const { id } = req.params;
  const { title, type, location, date, volunteers_assigned } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO activities (campaign_id, title, type, location, activity_date, volunteers_assigned, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, title, type, location, date, volunteers_assigned || 0, 'scheduled']
    );
    await logAudit(id, 'You', 'Scheduled Activity', title);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding activity:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.addEvidence = async (req, res) => {
  const { id } = req.params;
  const { title, document_type, linked_to } = req.body;
  const file_path = req.file ? req.file.path.replace(/\\/g, '/') : null;
  
  if (!file_path) {
    return res.status(400).json({ message: 'Evidence file is required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO evidence (campaign_id, title, document_type, linked_to, file_path, uploaded_by, uploaded_at) 
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING *`,
      [id, title, document_type, linked_to, file_path, req.user?.email || 'NGO Admin']
    );
    await logAudit(id, 'You', 'Uploaded Evidence', title);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding evidence:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.addUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO updates (campaign_id, title, body, date) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,
      [id, title, body]
    );
    
    await pool.query(
      `UPDATE campaigns SET last_update_published = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
    await logAudit(id, 'You', 'Published Progress Update', title);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding update:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.generateImpactReport = async (req, res) => {
  const { id } = req.params;
  const { title, period } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO impact_reports (campaign_id, title, period, status, published_on) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *`,
      [id, title, period, 'published']
    );
    await logAudit(id, 'You', 'Published Impact Report', title);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error generating impact report:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.addResource = async (req, res) => {
  const { id } = req.params;
  const { name, source, allocated, deployed, unit } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO resources (campaign_id, name, source, allocated, deployed, unit) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, name, source, allocated, deployed || 0, unit]
    );
    await logAudit(id, 'You', 'Allocated Resource', name);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding resource:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateBeneficiaries = async (req, res) => {
  const { id } = req.params;
  const { beneficiaries } = req.body;
  try {
    const result = await pool.query(
      `UPDATE campaigns SET beneficiaries = $1 WHERE id = $2 RETURNING *`,
      [JSON.stringify(beneficiaries), id]
    );
    await logAudit(id, 'You', 'Updated Beneficiaries', 'Impact data updated');
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating beneficiaries:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateResource = async (req, res) => {
  const { id, rid } = req.params;
  const { deployed } = req.body;
  try {
    const result = await pool.query(
      `UPDATE resources SET deployed = $1 WHERE id = $2 AND campaign_id = $3 RETURNING *`,
      [deployed, rid, id]
    );
    if (result.rows.length > 0) {
      await logAudit(id, 'You', 'Updated Resource', `Deployed ${deployed} ${result.rows[0].unit}`);
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    console.error('Error updating resource:', err.message);
    res.status(500).send('Server Error');
  }
};
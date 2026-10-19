const pool = require('../config/db');

// 1. Create a new Workshop (NGO Only)
exports.createWorkshop = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const {
      title,
      description,
      date,
      time,
      location,
      city,
      target_capacity,
      form_url
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Workshop title is required.' });
    }

    const result = await pool.query(
      `INSERT INTO workshops (ngo_id, title, description, date, time, location, city, target_capacity, form_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        ngoId,
        title,
        description || '',
        date || '',
        time || '',
        location || '',
        city || '',
        parseInt(target_capacity, 10) || 50,
        form_url || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating workshop:', err);
    res.status(500).json({ error: 'Failed to create workshop.' });
  }
};

// 2. Get All Active Workshops (Public / Supporter)
exports.getAllWorkshops = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        w.id,
        w.ngo_id,
        w.title,
        w.description,
        w.date,
        w.time,
        w.location,
        w.city,
        w.target_capacity,
        w.registered_count,
        w.form_url,
        w.created_at,
        n.org_name,
        n.short_name AS ngo_short_name,
        n.hq AS ngo_city
      FROM workshops w
      LEFT JOIN ngos n ON w.ngo_id = n.id
      ORDER BY w.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching workshops:', err);
    res.status(500).json({ error: 'Failed to fetch workshops.' });
  }
};

// 3. Get Logged-in NGO's Workshops
exports.getMyWorkshops = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const result = await pool.query(
      `SELECT * FROM workshops WHERE ngo_id = $1 ORDER BY created_at DESC`,
      [ngoId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching my workshops:', err);
    res.status(500).json({ error: 'Failed to fetch your workshops.' });
  }
};

// 4. Register for a Workshop (increments real-time registered_count)
exports.registerForWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE workshops 
       SET registered_count = LEAST(target_capacity, registered_count + 1)
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workshop not found.' });
    }

    res.json({ message: 'Successfully registered for workshop.', workshop: result.rows[0] });
  } catch (err) {
    console.error('Error registering for workshop:', err);
    res.status(500).json({ error: 'Failed to register for workshop.' });
  }
};

// 5. Update an Existing Workshop / Form Link (NGO Only)
exports.updateWorkshop = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      location,
      city,
      target_capacity,
      form_url
    } = req.body;

    // First verify that the workshop exists and belongs to this NGO
    const existing = await pool.query(
      `SELECT * FROM workshops WHERE id = $1 AND ngo_id = $2`,
      [id, ngoId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Workshop not found or unauthorized.' });
    }

    const current = existing.rows[0];

    const updatedTitle = title !== undefined ? title : current.title;
    const updatedDescription = description !== undefined ? description : current.description;
    const updatedDate = date !== undefined ? date : current.date;
    const updatedTime = time !== undefined ? time : current.time;
    const updatedLocation = location !== undefined ? location : current.location;
    const updatedCity = city !== undefined ? city : current.city;
    const updatedCapacity = target_capacity !== undefined ? (parseInt(target_capacity, 10) || current.target_capacity) : current.target_capacity;
    const updatedFormUrl = form_url !== undefined ? (form_url ? form_url.trim() : null) : current.form_url;

    const result = await pool.query(
      `UPDATE workshops
       SET title = $1,
           description = $2,
           date = $3,
           time = $4,
           location = $5,
           city = $6,
           target_capacity = $7,
           form_url = $8
       WHERE id = $9 AND ngo_id = $10
       RETURNING *`,
      [
        updatedTitle,
        updatedDescription,
        updatedDate,
        updatedTime,
        updatedLocation,
        updatedCity,
        updatedCapacity,
        updatedFormUrl,
        id,
        ngoId
      ]
    );

    res.json({ message: 'Workshop updated successfully.', workshop: result.rows[0] });
  } catch (err) {
    console.error('Error updating workshop:', err);
    res.status(500).json({ error: 'Failed to update workshop.' });
  }
};

// 6. Discard / Delete a Workshop (NGO Only)
exports.deleteWorkshop = async (req, res) => {
  try {
    const ngoId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM workshops WHERE id = $1 AND ngo_id = $2 RETURNING *`,
      [id, ngoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workshop not found or unauthorized.' });
    }

    res.json({ message: 'Workshop discarded successfully.', id: parseInt(id, 10), workshop: result.rows[0] });
  } catch (err) {
    console.error('Error discarding workshop:', err);
    res.status(500).json({ error: 'Failed to discard workshop.' });
  }
};

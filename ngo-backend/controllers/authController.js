const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const registerSupporter = async (req, res) => {
  try {
    const { fullName, email, password, aadhaarId, city, state, helpTypes } = req.body;
    const cleanEmail = email ? email.trim() : '';
    const userCheck = await pool.query(
      'SELECT * FROM supporters WHERE LOWER(email) = LOWER($1) OR aadhaar_id = $2',
      [cleanEmail, aadhaarId]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email or Aadhaar ID is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newSupporter = await pool.query(
      `INSERT INTO supporters (full_name, email, password_hash, aadhaar_id, city, state, help_types) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, full_name, email, role`,
      [fullName, cleanEmail, passwordHash, aadhaarId, city, state, helpTypes]
    );

    res.status(201).json({
      message: 'Supporter account created successfully!',
      user: newSupporter.rows[0]
    });
  } catch (err) {
    console.error('Error in registerSupporter:', err.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const registerNgo = async (req, res) => {
  try {
    const { orgName, contactName, email, password, darpanId } = req.body;
    const cleanEmail = email ? email.trim() : '';
    const certFile = req.files?.['registrationCertificate']?.[0];
    const docFile = req.files?.['supportingDocument']?.[0];

    if (!certFile || !docFile) {
      return res.status(400).json({ message: 'Both documents are required.' });
    }

    const ngoCheck = await pool.query(
      'SELECT * FROM ngos WHERE LOWER(email) = LOWER($1) OR darpan_id = $2', 
      [cleanEmail, darpanId]
    );
    
    if (ngoCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Email or Darpan ID is already registered.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const query = `
      INSERT INTO ngos (
        org_name, contact_name, email, password_hash, 
        darpan_id, registration_cert_path, supporting_doc_path, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email
    `;
    
    const values = [
      orgName, 
      contactName, 
      cleanEmail, 
      passwordHash, 
      darpanId, 
      certFile.path.replace(/\\/g, '/'), // Forces forward slashes
      docFile.path.replace(/\\/g, '/'),  // Forces forward slashes
      'PENDING'
    ];

    const newNgo = await pool.query(query, values);
    res.status(201).json({
      message: 'NGO registered successfully. Pending verification.',
      user: newNgo.rows[0],
    });
  } catch (error) {
    console.error('Error in registerNgo:', error.message);
    res.status(500).json({ message: 'Server error during NGO registration.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim();

    let userQuery = await pool.query('SELECT * FROM supporters WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
    let role = 'SUPPORTER';
    let status = 'APPROVED'; 

    if (userQuery.rows.length === 0) {
      userQuery = await pool.query('SELECT * FROM ngos WHERE LOWER(email) = LOWER($1)', [cleanEmail]);
      role = 'NGO';
      if (userQuery.rows.length > 0) {
        status = userQuery.rows[0].verification_status;
      }
    }

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'No account found with this email address.' });
    }

    const user = userQuery.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    // 5. NGO Status Check
    if (role === 'NGO') {
      if (status === 'PENDING') {
        return res.status(403).json({ 
          message: 'Your NGO registration is still pending approval. Please wait for verification.' 
        });
      }
      
      if (status === 'REJECTED') {
        return res.status(403).json({ 
          message: 'Your NGO registration has been rejected. Please contact support for more information.' 
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } 
    );

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: role,
        name: user.full_name || user.org_name
      }
    });
  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

const updateNgoStatus = async (req, res) => {
  try {
    const { ngoId, status } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: "Status must be APPROVED or REJECTED" });
    }

    const result = await pool.query(
      'UPDATE ngos SET verification_status = $1 WHERE id = $2 RETURNING id, org_name, verification_status',
      [status, ngoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'NGO not found.' });
    }

    res.status(200).json({
      message: `NGO successfully updated to ${status}`,
      ngo: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating NGO status:', err.message);
    res.status(500).json({ message: 'Server error while updating status.' });
  }
};
const getPendingNgos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, org_name, contact_name, email, darpan_id, registration_cert_path, supporting_doc_path FROM ngos WHERE verification_status = 'PENDING'"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching NGOs:', err.message);
    res.status(500).json({ message: 'Server error fetching pending NGOs.' });
  }
};
module.exports = {
  registerSupporter,
  registerNgo,
  loginUser,
  updateNgoStatus,
  getPendingNgos
};
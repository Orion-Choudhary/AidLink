const express = require('express');
const router = express.Router();
const { getNgoProfile, getNgoDonations, getNgoDirectory } = require('../controllers/ngoController');
const verifyToken = require('../middleware/authMiddleware');
const { verifyNgo } = verifyToken;

// Public NGO Directory endpoint
router.get('/directory', getNgoDirectory);

// Protected NGO endpoints
router.get('/profile', verifyNgo, getNgoProfile);
router.get('/donations', verifyNgo, getNgoDonations);

module.exports = router;


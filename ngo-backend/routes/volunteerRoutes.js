const express = require('express');
const router = express.Router();
const { updateVolunteerStatus } = require('../controllers/volunteerController');
const { getPublicVolunteers } = require('../controllers/volunteerPublicController');
const verifyToken = require('../middleware/authMiddleware');

// Public route for public volunteer accountability portal
router.get('/public', getPublicVolunteers);

// Authenticated NGO route
router.put('/:id/status', verifyToken, updateVolunteerStatus);

module.exports = router;

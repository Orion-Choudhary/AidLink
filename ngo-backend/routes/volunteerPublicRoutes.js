const express = require('express');
const router = express.Router();
const volunteerPublicController = require('../controllers/volunteerPublicController');

// GET /api/volunteers/public - Public front endpoint (no auth required)
router.get('/public', volunteerPublicController.getPublicVolunteers);

module.exports = router;


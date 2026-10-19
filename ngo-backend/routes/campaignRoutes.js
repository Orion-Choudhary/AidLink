const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getCampaigns, 
  createCampaign, 
  updateCampaignStatus, 
  toggleCampaignUrgent,
  addActivity, 
  addEvidence, 
  addUpdate, 
  generateImpactReport,
  addResource,
  updateBeneficiaries,
  updateResource,
  testUrgentAlertDispatch
} = require('../controllers/campaignController');
const verifyToken = require('../middleware/authMiddleware');
const { verifyNgo } = verifyToken;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', verifyNgo, getCampaigns);
router.post('/', verifyNgo, upload.single('coverImage'), createCampaign);
router.put('/:id/status', verifyNgo, updateCampaignStatus);
router.put('/:id/urgent', verifyNgo, toggleCampaignUrgent);
router.post('/:id/activities', verifyNgo, addActivity);
router.post('/:id/evidence', verifyNgo, upload.single('evidenceFile'), addEvidence);
router.post('/:id/updates', verifyNgo, addUpdate);
router.post('/:id/impact-reports', verifyNgo, generateImpactReport);
router.post('/:id/resources', verifyNgo, addResource);
router.put('/:id/resources/:rid', verifyNgo, updateResource);
router.put('/:id/beneficiaries', verifyNgo, updateBeneficiaries);
router.post('/:id/test-alert', verifyNgo, testUrgentAlertDispatch);

module.exports = router;
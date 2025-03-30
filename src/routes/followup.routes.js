const express = require('express');
const router = express.Router();
const followupController = require('../controllers/followup.controller');

// POST /api/followup - Doctor adds diagnosis, prescription, next step
router.post('/', followupController.addFollowup);

module.exports = router; 
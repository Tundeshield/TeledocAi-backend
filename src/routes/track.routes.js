const express = require('express');
const router = express.Router();
const trackController = require('../controllers/track.controller');

// POST /api/track - Patient submits update, returns trend
router.post('/', trackController.submitUpdate);

module.exports = router; 
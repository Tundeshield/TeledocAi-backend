const express = require('express');
const router = express.Router();
const consultController = require('../controllers/consult.controller');

// POST /api/consult - Request a consult for a submission
router.post('/', consultController.requestConsult);

module.exports = router; 
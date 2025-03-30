const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/results.controller');

// GET /api/results/:id - Retrieve analysis result and consult link
router.get('/:id', resultsController.getResults);

module.exports = router; 
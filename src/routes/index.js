const express = require('express');
const router = express.Router();

// Import route modules
const uploadRoutes = require('./upload.routes');
const resultsRoutes = require('./results.routes');
const consultRoutes = require('./consult.routes');
const followupRoutes = require('./followup.routes');
const trackRoutes = require('./track.routes');

// Register routes
router.use('/upload', uploadRoutes);
router.use('/results', resultsRoutes);
router.use('/consult', consultRoutes);
router.use('/followup', followupRoutes);
router.use('/track', trackRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// POST /api/upload - Upload image + vitals, run AI analysis
router.post('/', upload.single('image'), uploadController.uploadSubmission);

module.exports = router; 
const uploadService = require('../services/upload.service');

/**
 * Upload patient submission (image + vitals)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadSubmission = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    const { vitals } = req.body;
    const result = await uploadService.processSubmission(req.file, vitals);
    
    return res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSubmission
}; 
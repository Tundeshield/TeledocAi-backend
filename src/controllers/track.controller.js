const trackService = require('../services/track.service');

/**
 * Submit patient health update
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const submitUpdate = async (req, res, next) => {
  try {
    const { submission_id, update } = req.body;
    
    if (!submission_id || !update) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID and update text are required'
      });
    }

    const result = await trackService.addUpdate(submission_id, update);
    
    return res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitUpdate
}; 
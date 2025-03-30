const followupService = require('../services/followup.service');

/**
 * Add doctor follow-up notes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addFollowup = async (req, res, next) => {
  try {
    const { submission_id, diagnosis, prescription, next_step } = req.body;
    
    if (!submission_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID is required'
      });
    }

    if (!diagnosis || !prescription || !next_step) {
      return res.status(400).json({
        status: 'error',
        message: 'Diagnosis, prescription, and next step are required'
      });
    }

    const followup = await followupService.updateConsult(
      submission_id, 
      diagnosis, 
      prescription, 
      next_step
    );
    
    return res.status(200).json({
      status: 'success',
      data: {
        summary: `${diagnosis}, ${prescription}, ${next_step}`
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFollowup
}; 
const consultService = require('../services/consult.service');

/**
 * Request a consultation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requestConsult = async (req, res, next) => {
  try {
    const { submission_id } = req.body;
    
    if (!submission_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID is required'
      });
    }

    const consult = await consultService.createConsult(submission_id);
    
    return res.status(201).json({
      status: 'success',
      data: consult
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestConsult
}; 
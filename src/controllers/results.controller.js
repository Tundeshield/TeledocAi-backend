const resultsService = require('../services/results.service');

/**
 * Get results by submission ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        status: 'error',
        message: 'Submission ID is required'
      });
    }

    const result = await resultsService.getResultsById(id);
    
    if (!result) {
      return res.status(404).json({
        status: 'error',
        message: 'Submission not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResults
}; 
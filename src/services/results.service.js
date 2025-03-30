const { supabaseClient } = require('../config/supabase');

/**
 * Get analysis results by submission ID
 * @param {string} id - Submission ID
 * @returns {Object} Analysis results and consult info
 */
const getResultsById = async (id) => {
  try {
    // Get submission data
    const { data: submission, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (submissionError) {
      console.error('Error fetching submission:', submissionError);
      return null;
    }
    
    if (!submission) return null;
    
    // Get consultation data if available
    const { data: consults, error: consultsError } = await supabaseClient
      .from('consults')
      .select('*')
      .eq('submission_id', id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    // Format and return the combined data
    return {
      id: submission.id,
      condition: submission.condition,
      confidence: submission.confidence,
      vital_alerts: submission.vital_alerts,
      consult: consults && consults.length > 0 ? {
        doctor: consults[0].doctor_id,
        link: consults[0].zoom_link,
        status: consults[0].status,
        diagnosis: consults[0].diagnosis,
        prescription: consults[0].prescription,
        next_step: consults[0].next_step
      } : null
    };
  } catch (error) {
    console.error('Error in getResultsById:', error);
    throw error;
  }
};

module.exports = {
  getResultsById,
}; 
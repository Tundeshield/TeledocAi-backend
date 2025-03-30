const { supabaseClient } = require('../config/supabase');

/**
 * Analyze patient update to determine trend
 * @param {string} update - Patient update text
 * @returns {string} Trend assessment
 */
const analyzeTrend = (update) => {
  // Simple mock analysis based on keywords for demo
  const positiveWords = ['better', 'improved', 'improving', 'good', 'well', 'healing', 'resolved'];
  const negativeWords = ['worse', 'worsening', 'bad', 'pain', 'painful', 'not improving', 'serious'];
  
  const updateLower = update.toLowerCase();
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (updateLower.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (updateLower.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'Improving';
  if (negativeScore > positiveScore) return 'Worsening';
  return 'Stable';
};

/**
 * Add patient health update
 * @param {string} submissionId - Submission ID
 * @param {string} update - Patient update text
 * @returns {Object} Trend assessment
 */
const addUpdate = async (submissionId, update) => {
  try {
    // Check if submission exists
    const { data: submission, error: submissionError } = await supabaseClient
      .from('submissions')
      .select('id')
      .eq('id', submissionId)
      .single();
    
    if (submissionError || !submission) {
      throw new Error('Submission not found');
    }
    
    // Analyze trend from update text
    const trend = analyzeTrend(update);
    
    // Insert tracking record
    const { data: tracking, error: trackingError } = await supabaseClient
      .from('tracking')
      .insert({
        submission_id: submissionId,
        update,
        trend
      })
      .select()
      .single();
    
    if (trackingError) {
      throw new Error(`Failed to add update: ${trackingError.message}`);
    }
    
    return {
      id: tracking.id,
      trend: tracking.trend
    };
  } catch (error) {
    console.error('Error in addUpdate:', error);
    throw error;
  }
};

module.exports = {
  addUpdate,
}; 
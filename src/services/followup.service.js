const { supabaseClient } = require('../config/supabase');

/**
 * Update consult with doctor's follow-up notes
 * @param {string} submissionId - Submission ID
 * @param {string} diagnosis - Doctor's diagnosis
 * @param {string} prescription - Prescribed medication
 * @param {string} nextStep - Follow-up instructions
 * @returns {Object} Updated consult
 */
const updateConsult = async (submissionId, diagnosis, prescription, nextStep) => {
  try {
    // Find the most recent consult for this submission
    const { data: consults, error: consultsError } = await supabaseClient
      .from('consults')
      .select('*')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (consultsError) {
      throw new Error(`Failed to find consultation: ${consultsError.message}`);
    }
    
    if (!consults || consults.length === 0) {
      throw new Error('No consultation found for this submission');
    }
    
    const consultId = consults[0].id;
    
    // Update the consult with doctor's notes
    const { data: updatedConsult, error: updateError } = await supabaseClient
      .from('consults')
      .update({
        diagnosis,
        prescription,
        next_step: nextStep,
        status: 'complete'
      })
      .eq('id', consultId)
      .select()
      .single();
    
    if (updateError) {
      throw new Error(`Failed to update consultation: ${updateError.message}`);
    }
    
    return {
      id: updatedConsult.id,
      diagnosis: updatedConsult.diagnosis,
      prescription: updatedConsult.prescription,
      next_step: updatedConsult.next_step,
      status: updatedConsult.status
    };
  } catch (error) {
    console.error('Error in updateConsult:', error);
    throw error;
  }
};

module.exports = {
  updateConsult,
}; 
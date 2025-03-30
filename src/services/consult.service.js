const { supabaseClient } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a mock Zoom meeting link
 * @returns {string} Mock Zoom link
 */
const generateMockZoomLink = () => {
  const meetingId = Math.floor(100000000 + Math.random() * 900000000);
  return `https://zoom.us/j/${meetingId}`;
};

/**
 * Assign a mock doctor
 * @returns {string} Mock doctor name
 */
const assignMockDoctor = () => {
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'];
  return doctors[Math.floor(Math.random() * doctors.length)];
};

/**
 * Create a new consultation request
 * @param {string} submissionId - Submission ID
 * @returns {Object} Consultation details
 */
const createConsult = async (submissionId) => {
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
    
    // Generate mock consultation data
    const doctor = assignMockDoctor();
    const zoomLink = generateMockZoomLink();
    
    // Insert consult record
    const { data: consult, error: consultError } = await supabaseClient
      .from('consults')
      .insert({
        submission_id: submissionId,
        doctor_id: doctor,
        zoom_link: zoomLink,
        status: 'pending'
      })
      .select()
      .single();
    
    if (consultError) {
      throw new Error(`Failed to create consultation: ${consultError.message}`);
    }
    
    return {
      doctor: consult.doctor_id,
      link: consult.zoom_link,
      status: consult.status
    };
  } catch (error) {
    console.error('Error in createConsult:', error);
    throw error;
  }
};

module.exports = {
  createConsult,
}; 
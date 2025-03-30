const { supabaseClient } = require('../config/supabase');
const { spawnSync } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Process a patient submission
 * @param {Object} file - Uploaded file object from multer
 * @param {string} vitals - Vitals text input
 * @returns {Object} Analysis results
 */
const processSubmission = async (file, vitals) => {
  try {
    // 1. Upload image to Supabase Storage
    const fileName = `${uuidv4()}_${path.basename(file.path)}`;
    const filePath = path.join(process.cwd(), file.path);
    
    const { data: storageData, error: storageError } = await supabaseClient.storage
      .from('uploads')
      .upload(fileName, filePath, {
        contentType: file.mimetype,
      });
    
    if (storageError) throw new Error(`Storage upload failed: ${storageError.message}`);
    
    // 2. Get the public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('uploads')
      .getPublicUrl(fileName);
    
    // 3. Insert into submissions table
    const { data: submission, error: dbError } = await supabaseClient
      .from('submissions')
      .insert({
        image_url: publicUrl,
        vitals: vitals || null,
      })
      .select()
      .single();
    
    if (dbError) throw new Error(`Database insert failed: ${dbError.message}`);
    
    // 4. Run AI analysis using Python scripts
    const imageAnalysisResult = runImageAnalysis(filePath);
    const vitalsAnalysisResult = vitals ? runVitalsAnalysis(vitals) : null;
    
    // 5. Update the submission with AI results
    const { data: updatedSubmission, error: updateError } = await supabaseClient
      .from('submissions')
      .update({
        condition: imageAnalysisResult.condition,
        confidence: imageAnalysisResult.confidence,
        vital_alerts: vitalsAnalysisResult?.alerts || null,
      })
      .eq('id', submission.id)
      .select()
      .single();
    
    if (updateError) throw new Error(`Database update failed: ${updateError.message}`);
    
    return {
      id: updatedSubmission.id,
      condition: updatedSubmission.condition,
      confidence: updatedSubmission.confidence,
      vital_alerts: updatedSubmission.vital_alerts,
    };
  } catch (error) {
    console.error('Error in processSubmission:', error);
    throw error;
  }
};

/**
 * Run image analysis using Python script
 * @param {string} imagePath - Path to the image file
 * @returns {Object} Analysis results
 */
const runImageAnalysis = (imagePath) => {
  try {
    // Use python3 from multi-stage Docker build
    const result = spawnSync('python3', ['src/scripts/analyze_image.py', imagePath], {
      encoding: 'utf-8',
    });
    
    if (result.error) {
      console.error('Error running image analysis:', result.error);
      return { condition: 'unknown', confidence: 0 };
    }
    
    if (result.status !== 0) {
      console.error('Python script execution failed:', result.stderr);
      return { condition: 'unknown', confidence: 0 };
    }
    
    return JSON.parse(result.stdout.trim());
  } catch (error) {
    console.error('Error in runImageAnalysis:', error);
    return { condition: 'unknown', confidence: 0 };
  }
};

/**
 * Run vitals analysis using Python script
 * @param {string} vitalsText - Vitals text input
 * @returns {Object} Analysis results
 */
const runVitalsAnalysis = (vitalsText) => {
  try {
    // Use python3 from multi-stage Docker build
    const result = spawnSync('python3', ['src/scripts/analyze_vitals.py', vitalsText], {
      encoding: 'utf-8',
    });
    
    if (result.error) {
      console.error('Error running vitals analysis:', result.error);
      return { alerts: null };
    }
    
    if (result.status !== 0) {
      console.error('Python script execution failed:', result.stderr);
      return { alerts: null };
    }
    
    return JSON.parse(result.stdout.trim());
  } catch (error) {
    console.error('Error in runVitalsAnalysis:', error);
    return { alerts: null };
  }
};

module.exports = {
  processSubmission,
}; 
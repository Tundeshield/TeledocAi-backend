const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

module.exports = {
  supabaseClient,
}; 
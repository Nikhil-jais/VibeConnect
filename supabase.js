/* =========================================================
   VIBECONNECT — SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL = "";

const SUPABASE_KEY = "";


/* =========================================================
   CREATE SUPABASE CLIENT
   ========================================================= */

const vibeSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   CONNECTION TEST
   ========================================================= */

console.log("VibeConnect Supabase client initialized.");

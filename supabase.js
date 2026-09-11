/* =========================================================
   VIBECONNECT — SUPABASE CONNECTION
   ========================================================= */

const SUPABASE_URL = "https://megsxkizldhtetulqttv.supabase.co";

const SUPABASE_KEY = "sb_publishable_9Zz3oZx_DrKELLf2tIrq5g_bfYgqziL";


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

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep the app running, but surface a clear setup message in the UI flows.
  console.warn("Supabase environment variables are missing.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

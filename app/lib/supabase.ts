import { createClient } from "@supabase/supabase-js";

// Obtener URL limpia sin espacios ni diagonales finales (evita error "Invalid path specified in request URL")
const getSupabaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://zjrkhyvcebchjfebpbiw.supabase.co";
  return url.trim().replace(/\/+$/, "");
};

// Obtener llave anónima de Supabase
const getSupabaseKey = () => {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcmtoeXZjZWJjaGpmZWJwYml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder";
  return key.trim();
};

export const supabase = createClient(getSupabaseUrl(), getSupabaseKey());
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente público (usado no browser)
export const supabase = createClient(supabaseUrl, supabaseAnon);

// Cliente admin com service key (usado só em Server Actions/Route Handlers)
export function supabaseAdmin() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY!);
}

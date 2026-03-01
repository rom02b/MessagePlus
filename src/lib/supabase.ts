import { createClient } from '@supabase/supabase-js';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON__: string;

const supabaseUrl = __SUPABASE_URL__;
const supabaseAnon = __SUPABASE_ANON__;

if (!supabaseUrl || !supabaseAnon) {
    console.warn(
        '[Supabase] SUPABASE_URL or SUPABASE_ANON is missing. ' +
        'Auth and history features will not work. ' +
        'Add these vars to .env.local for local dev.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnon);

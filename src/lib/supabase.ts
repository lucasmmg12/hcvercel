import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Configuración de Supabase:');
console.log('  URL:', supabaseUrl ? '✅ Definida' : '❌ No definida');
console.log('  Anon Key:', supabaseAnonKey ? '✅ Definida' : '❌ No definida');

if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = 'Missing Supabase environment variables. Please check your .env file.';
    console.error('❌', errorMsg);
    console.error('Expected variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
    throw new Error(errorMsg);
}

// Crear una única instancia del cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

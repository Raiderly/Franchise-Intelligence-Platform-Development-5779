import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bhzmquxxdydqqbvkvsph.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoem1xdXh4ZHlkcXFidmt2c3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzU5NzYsImV4cCI6MjA0OTUxMTk3Nn0.tCXVZWVcGNYcU-Wh4jDSX2sHhWHpfqOmJBK6rX8gKCs'

// Validate credentials
if (supabaseUrl === 'https://<PROJECT-ID>.supabase.co' || supabaseAnonKey === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'franchise-intel-ai'
    }
  }
})

// Export URL for debugging
export const SUPABASE_URL = supabaseUrl

// Connection test function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('franchise_brands').select('count').limit(1)
    return { success: !error, error: error?.message }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Log connection status
console.log('🔗 Supabase Client Initialized:', {
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey.substring(0, 20) + '...',
  timestamp: new Date().toISOString()
})
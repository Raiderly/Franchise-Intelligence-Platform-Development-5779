import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bhzmquxxdydqqbvuksph.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoem1xdXh4ZHlkcXFidnVrc3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NDA4MDksImV4cCI6MjA2NzAxNjgwOX0.S5NtB4ruea2_Azsyh6o_GRlnlJPhI-DfItowzWeNlMY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
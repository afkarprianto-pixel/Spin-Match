import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)

supabase
  .from('Events')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase error:', error)
    } else {
      console.log('✅ Supabase TERHUBUNG:', data)
    }
  })
  
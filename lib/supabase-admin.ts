import 'server-only'
import { createClient } from '@supabase/supabase-js'

const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const configuredServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const url = configuredUrl && /^https?:\/\//.test(configuredUrl) ? configuredUrl : 'http://127.0.0.1:54321'
const serviceRoleKey = configuredServiceRoleKey || 'development-service-role-key'

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

import { createHash, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const hash = (code: string) => createHash('sha256').update(code).digest('hex')
export async function POST(request: NextRequest) {
  const { email, activationCode, password } = await request.json() as { email?: string; activationCode?: string; password?: string }
  if (!email || !activationCode || !password || password.length < 8) return NextResponse.json({ error: 'Enter your email, activation code, and a password of at least 8 characters.' }, { status: 400 })
  const { data: profile, error } = await supabaseAdmin.from('profiles').select('id,activation_code_hash').eq('email', email.toLowerCase()).single()
  if (error || !profile?.activation_code_hash) return NextResponse.json({ error: 'This account cannot be activated.' }, { status: 400 })
  const expected = Buffer.from(profile.activation_code_hash, 'hex'); const received = Buffer.from(hash(activationCode), 'hex')
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return NextResponse.json({ error: 'Invalid activation code.' }, { status: 400 })
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, { password })
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })
  await supabaseAdmin.from('profiles').update({ activation_code_hash: null, activated_at: new Date().toISOString() }).eq('id', profile.id)
  return NextResponse.json({ ok: true })
}

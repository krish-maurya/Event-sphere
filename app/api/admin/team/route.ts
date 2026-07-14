import { createHash, randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const runtime = 'nodejs'

const hash = (code: string) =>
  createHash('sha256').update(code).digest('hex')

type RouteContext = {
  params: Promise<{
    resource: string
    id: string
  }>
}

async function requireAdmin(request: NextRequest) {
  const token = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '')

  if (!token) {
    return {
      error: 'Missing access token.',
      status: 401,
    } as const
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token)

  if (userError || !user) {
    return {
      error: 'Invalid or expired session.',
      status: 401,
    } as const
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return {
      error: 'Administrator access is required.',
      status: 403,
    } as const
  }

  return {
    user,
  } as const
}

/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  if (
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')
  ) {
    return NextResponse.json(
      {
        error: 'Supabase server credentials are not configured.',
      },
      { status: 503 }
    )
  }

  const authorization = await requireAdmin(request)

  if ('error' in authorization) {
    return NextResponse.json(
      { error: authorization.error },
      { status: authorization.status }
    )
  }

  const body = (await request.json()) as {
    email?: string
    firstName?: string
    lastName?: string
    role?: string
  }

  if (
    !body.email ||
    !body.firstName ||
    !body.lastName ||
    !['manager', 'staff'].includes(body.role ?? '')
  ) {
    return NextResponse.json(
      {
        error:
          'Enter a name, email, and a manager or staff role.',
      },
      { status: 400 }
    )
  }

  const activationCode = randomBytes(9).toString('base64url')
  const hiddenTemporaryPassword = randomBytes(32).toString('base64url')

  const { data, error } =
    await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: hiddenTemporaryPassword,
      email_confirm: true,
      user_metadata: {
        first_name: body.firstName,
        last_name: body.lastName,
      },
    })

  if (error || !data.user) {
    return NextResponse.json(
      {
        error: error?.message ?? 'Could not create team member.',
      },
      { status: 400 }
    )
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      role: body.role,
      activation_code_hash: hash(activationCode),
      activated_at: null,
    })
    .eq('id', data.user.id)

  if (profileError) {
    return NextResponse.json(
      {
        error: profileError.message,
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      id: data.user.id,
      activationCode,
    },
    { status: 201 }
  )
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const authorization = await requireAdmin(request)

    if ('error' in authorization) {
      return NextResponse.json(
        {
          error: authorization.error,
        },
        {
          status: authorization.status,
        }
      )
    }

    const { resource, id } = await context.params
    const { user } = authorization

    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json(
        {
          error: 'Invalid record id.',
        },
        {
          status: 400,
        }
      )
    }

    /* ------------------------------- BOOKINGS ------------------------------ */

    if (resource === 'bookings') {
      const { error: taskError } = await supabaseAdmin
        .from('tasks')
        .delete()
        .eq('booking_id', id)

      if (taskError) throw taskError

      const { error: bookingError, count } =
        await supabaseAdmin
          .from('bookings')
          .delete({ count: 'exact' })
          .eq('id', id)

      if (bookingError) throw bookingError

      if (!count) {
        return NextResponse.json(
          {
            error: 'Booking not found.',
          },
          {
            status: 404,
          }
        )
      }

      return NextResponse.json({ ok: true })
    }

    /* ------------------------------- MEMBERS ------------------------------- */

    if (resource === 'members') {
      if (id === user.id) {
        return NextResponse.json(
          {
            error:
              'You cannot delete your own administrator account.',
          },
          {
            status: 400,
          }
        )
      }

      const { data: member, error: memberError } =
        await supabaseAdmin
          .from('profiles')
          .select('id, role')
          .eq('id', id)
          .in('role', ['manager', 'staff'])
          .single()

      if (memberError || !member) {
        return NextResponse.json(
          {
            error: 'Team member not found.',
          },
          {
            status: 404,
          }
        )
      }

      // Remove manager assignments
      const { error: bookingError } = await supabaseAdmin
        .from('bookings')
        .update({
          manager_id: null,
        })
        .eq('manager_id', id)

      if (bookingError) throw bookingError

      // Remove task assignments
      const { error: taskError } = await supabaseAdmin
        .from('tasks')
        .update({
          assigned_to: null,
        })
        .eq('assigned_to', id)

      if (taskError) throw taskError

      // Delete auth user
      const { error: authDeleteError } =
        await supabaseAdmin.auth.admin.deleteUser(id)

      if (authDeleteError) throw authDeleteError

      // Delete profile (safe even if cascading)
      const { error: profileDeleteError } =
        await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', id)

      if (profileDeleteError) throw profileDeleteError

      return NextResponse.json({
        ok: true,
      })
    }

    return NextResponse.json(
      {
        error: 'Unsupported resource.',
      },
      {
        status: 404,
      }
    )
  } catch (error) {
    console.error('Admin resource delete failed:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Delete failed.',
      },
      {
        status: 500,
      }
    )
  }
}
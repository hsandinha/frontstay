import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'proprietario' | 'parceiros'

interface AuthSuccess {
    user: { id: string; email: string }
    role: UserRole
    error: null
}

interface AuthFailure {
    user: null
    role: null
    error: NextResponse
}

type AuthResult = AuthSuccess | AuthFailure

export async function requireAuth(
    request: NextRequest,
    allowedRoles?: UserRole[]
): Promise<AuthResult> {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll() { /* read-only */ },
            },
        }
    )

    const { data: { user }, error: sessionError } = await supabase.auth.getUser()

    if (sessionError || !user) {
        return {
            user: null,
            role: null,
            error: NextResponse.json(
                { error: 'Não autorizado. Faça login para continuar.' },
                { status: 401 }
            ),
        }
    }

    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role, active')
        .eq('auth_user_id', user.id)
        .single()

    if (userError || !userData) {
        return {
            user: null, role: null,
            error: NextResponse.json({ error: 'Usuário não encontrado no sistema.' }, { status: 401 }),
        }
    }

    if (!userData.active) {
        return {
            user: null, role: null,
            error: NextResponse.json({ error: 'Usuário desativado.' }, { status: 403 }),
        }
    }

    const role = userData.role as UserRole

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return {
            user: null, role: null,
            error: NextResponse.json(
                { error: `Acesso negado. Requer perfil: ${allowedRoles.join(' ou ')}.` },
                { status: 403 }
            ),
        }
    }

    return { user: { id: user.id, email: user.email! }, role, error: null }
}

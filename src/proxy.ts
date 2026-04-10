import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase-session'

const PROTECTED_PAGES = ['/dashboard/administrador', '/dashboard/proprietario', '/dashboard/parceiros']
const PROTECTED_API_PREFIXES = ['/api/properties']

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isProtectedPage = PROTECTED_PAGES.some(p => path.startsWith(p))
    const isProtectedApi = PROTECTED_API_PREFIXES.some(p => path.startsWith(p))

    if (!isProtectedPage && !isProtectedApi) {
        return NextResponse.next()
    }

    const { user, response, supabase } = await updateSession(request)

    if (!user) {
        if (isProtectedApi) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
        }
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', path)
        return NextResponse.redirect(loginUrl)
    }

    // Verify user has a valid role in the users table
    if (supabase) {
        const { data: userData } = await supabase
            .from('users')
            .select('role, active')
            .eq('auth_user_id', user.id)
            .single()

        if (!userData?.active) {
            if (isProtectedApi) {
                return NextResponse.json({ error: 'Usuário desativado' }, { status: 403 })
            }
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return response
}

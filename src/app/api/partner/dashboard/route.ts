import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/partner/dashboard
 * Retorna perfil do parceiro logado e prédios onde está vinculado.
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['parceiros', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
    }

    try {
        // Busca dados do usuário
        const { data: user } = await supabase
            .from('users')
            .select('id, name, email, role, active')
            .eq('auth_user_id', auth.user.id)
            .single();

        // Busca prédios vinculados ao parceiro
        const { data: propertyLinks } = await supabase
            .from('property_users')
            .select(`
                property_id,
                role,
                properties (
                    id,
                    name,
                    slug,
                    city,
                    state,
                    active
                )
            `)
            .eq('user_id', user?.id)
            .eq('role', 'parceiros');

        const properties = (propertyLinks || [])
            .map((link: any) => link.properties)
            .filter(Boolean);

        return NextResponse.json({
            success: true,
            profile: {
                name: user?.name || auth.user.email,
                email: user?.email || auth.user.email,
            },
            properties,
        });
    } catch (error: any) {
        console.error('Erro no dashboard do parceiro:', error);
        return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
    }
}

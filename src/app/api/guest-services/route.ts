import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/guest-services
 * Lista serviços de parceiros ativos disponíveis para hóspedes (público).
 */
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const { data: services, error } = await supabase
            .from('partner_services')
            .select('id, category, name, description, price, discount_text')
            .eq('active', true)
            .order('category')
            .order('name');

        if (error) {
            console.error('Erro ao buscar serviços:', error.message);
            return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
        }

        const mapped = (services || []).map((s: any) => ({
            id: s.id,
            category: s.category,
            name: s.name,
            description: s.description,
            price: s.price,
            discountText: s.discount_text,
        }));

        return NextResponse.json({ success: true, services: mapped });
    } catch (err: any) {
        console.error('Erro em GET /api/guest-services:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

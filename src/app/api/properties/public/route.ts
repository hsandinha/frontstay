import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/properties/public
 * Lista todas as propriedades ativas para a landing page pública.
 * Endpoint público (sem autenticação).
 */
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ success: true, properties: [] });
    }

    try {
        const { data: properties, error } = await supabase
            .from('properties')
            .select('id, name, slug, address, neighborhood, city, state, cover_image_url, logo_url, total_units, under_construction')
            .eq('active', true)
            .order('name');

        if (error) {
            console.error('Erro ao listar propriedades públicas:', error.message);
            return NextResponse.json({ success: true, properties: [] });
        }

        return NextResponse.json({
            success: true,
            properties: (properties || []).map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                address: [p.address, p.neighborhood, p.city, p.state].filter(Boolean).join(', '),
                coverImageUrl: p.cover_image_url,
                logoUrl: p.logo_url,
                totalUnits: p.total_units,
                underConstruction: p.under_construction || false,
            })),
        });
    } catch (error: any) {
        console.error('❌ Erro em /api/properties/public:', error);
        return NextResponse.json({ success: true, properties: [] });
    }
}

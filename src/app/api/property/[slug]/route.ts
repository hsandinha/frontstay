import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/property/[slug]
 * Retorna dados públicos de uma propriedade pelo slug.
 * Endpoint público (sem autenticação) — para a página /pagina/[slug].
 */
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
    }

    try {
        // 1. Busca a propriedade pelo slug
        const { data: property, error: propError } = await supabase
            .from('properties')
            .select('*')
            .eq('slug', slug)
            .eq('active', true)
            .maybeSingle();

        if (propError) {
            console.error('Erro ao buscar propriedade:', propError.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        if (!property) {
            return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
        }

        // 2. Busca amenidades vinculadas
        const { data: amenityLinks } = await supabase
            .from('property_amenities')
            .select('amenity_id, operating_hours, rules, amenities(id, name, icon, category)')
            .eq('property_id', property.id)
            .eq('active', true);

        const amenities = (amenityLinks || []).map((link: any) => ({
            id: link.amenities?.id || link.amenity_id,
            name: link.amenities?.name || link.amenity_id,
            icon: link.amenities?.icon || '✨',
            category: link.amenities?.category || 'geral',
            hours: link.operating_hours,
            rules: link.rules,
        }));

        // 3. Conta unidades ativas
        const { count: totalUnits } = await supabase
            .from('property_units')
            .select('id', { count: 'exact', head: true })
            .eq('property_id', property.id)
            .eq('active', true);

        // 4. Busca integração Cloudbeds para obter o propertyID
        const { data: pmsIntegration } = await supabase
            .from('property_integrations')
            .select('config')
            .eq('property_id', property.id)
            .eq('provider', 'pms')
            .eq('active', true)
            .maybeSingle();

        const cloudbedsPropertyId = pmsIntegration?.config?.property_id || pmsIntegration?.config?.propertyId || null;

        return NextResponse.json({
            success: true,
            property: {
                id: property.id,
                name: property.name,
                slug: property.slug,
                address: property.address,
                neighborhood: property.neighborhood,
                city: property.city,
                state: property.state,
                cep: property.cep,
                description: property.description,
                coverImageUrl: property.cover_image_url,
                galleryImages: property.gallery_images || [],
                logoUrl: property.logo_url,
                checkinTime: property.checkin_time || '15:00',
                checkoutTime: property.checkout_time || '11:00',
                totalUnits: totalUnits || property.total_units || 0,
                totalFloors: property.total_floors,
                latitude: property.latitude,
                longitude: property.longitude,
                supportPhone: property.support_phone,
                cloudbedsPropertyId,
                underConstruction: property.under_construction || false,
                amenities,
            },
        });
    } catch (error: any) {
        console.error('❌ Erro em /api/property/[slug]:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

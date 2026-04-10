import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = ['personal_trainer', 'cleaning', 'chef', 'massage', 'transport', 'photography', 'delivery', 'maintenance', 'other'];

/**
 * GET /api/partner/services
 * Lista serviços do parceiro logado.
 *
 * POST /api/partner/services
 * Cria novo serviço.
 *
 * PATCH /api/partner/services?id=xxx
 * Atualiza um serviço existente.
 *
 * DELETE /api/partner/services?id=xxx
 * Desativa um serviço (soft-delete).
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['parceiros', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        // Busca user ID do parceiro na tabela users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', auth.user.id)
            .single();

        if (userError || !userData) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const { data: services, error: svcError } = await supabase
            .from('partner_services')
            .select('*, partner_service_properties(property_id)')
            .eq('partner_user_id', userData.id)
            .order('created_at', { ascending: false });

        if (svcError) {
            console.error('Erro ao buscar serviços:', svcError.message);
            return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 });
        }

        const enriched = (services || []).map((s: any) => ({
            id: s.id,
            category: s.category,
            name: s.name,
            description: s.description,
            price: s.price,
            discountText: s.discount_text,
            active: s.active,
            propertyIds: (s.partner_service_properties || []).map((p: any) => p.property_id),
            createdAt: s.created_at,
        }));

        return NextResponse.json({ success: true, services: enriched });
    } catch (err: any) {
        console.error('Erro em GET /api/partner/services:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request, ['parceiros', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const body = await request.json();
        const { name, category, description, price, discountText, propertyIds } = body;

        if (!name || !category) {
            return NextResponse.json({ error: 'Nome e categoria são obrigatórios' }, { status: 400 });
        }
        if (!VALID_CATEGORIES.includes(category)) {
            return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
        }

        // Get partner user id
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', auth.user.id)
            .single();

        if (!userData) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        const { data: service, error: insertError } = await supabase
            .from('partner_services')
            .insert({
                partner_user_id: userData.id,
                category,
                name: String(name).slice(0, 200),
                description: description ? String(description).slice(0, 2000) : null,
                price: price ? String(price).slice(0, 100) : null,
                discount_text: discountText ? String(discountText).slice(0, 200) : null,
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('Erro ao criar serviço:', insertError.message);
            return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 });
        }

        // Link propertyIds
        if (Array.isArray(propertyIds) && propertyIds.length > 0) {
            const links = propertyIds.map((pid: string) => ({
                service_id: service.id,
                property_id: String(pid),
            }));
            await supabase.from('partner_service_properties').insert(links);
        }

        return NextResponse.json({ success: true, serviceId: service.id }, { status: 201 });
    } catch (err: any) {
        console.error('Erro em POST /api/partner/services:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const auth = await requireAuth(request, ['parceiros', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('id');
        if (!serviceId) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const body = await request.json();
        const { name, category, description, price, discountText, active, propertyIds } = body;

        // Verify ownership
        const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', auth.user.id).single();
        if (!userData) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        const { data: existing } = await supabase.from('partner_services').select('partner_user_id').eq('id', serviceId).single();
        if (!existing || existing.partner_user_id !== userData.id) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        const updates: Record<string, any> = { updated_at: new Date().toISOString() };
        if (name !== undefined) updates.name = String(name).slice(0, 200);
        if (category !== undefined) {
            if (!VALID_CATEGORIES.includes(category)) return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
            updates.category = category;
        }
        if (description !== undefined) updates.description = description ? String(description).slice(0, 2000) : null;
        if (price !== undefined) updates.price = price ? String(price).slice(0, 100) : null;
        if (discountText !== undefined) updates.discount_text = discountText ? String(discountText).slice(0, 200) : null;
        if (active !== undefined) updates.active = Boolean(active);

        const { error: updateError } = await supabase.from('partner_services').update(updates).eq('id', serviceId);
        if (updateError) {
            console.error('Erro ao atualizar serviço:', updateError.message);
            return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
        }

        // Update property links if provided
        if (Array.isArray(propertyIds)) {
            await supabase.from('partner_service_properties').delete().eq('service_id', serviceId);
            if (propertyIds.length > 0) {
                const links = propertyIds.map((pid: string) => ({ service_id: serviceId, property_id: String(pid) }));
                await supabase.from('partner_service_properties').insert(links);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Erro em PATCH /api/partner/services:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const auth = await requireAuth(request, ['parceiros', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const { searchParams } = new URL(request.url);
        const serviceId = searchParams.get('id');
        if (!serviceId) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', auth.user.id).single();
        if (!userData) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        const { data: existing } = await supabase.from('partner_services').select('partner_user_id').eq('id', serviceId).single();
        if (!existing || existing.partner_user_id !== userData.id) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        // Soft-delete (deactivate)
        const { error } = await supabase.from('partner_services').update({ active: false, updated_at: new Date().toISOString() }).eq('id', serviceId);
        if (error) {
            console.error('Erro ao desativar serviço:', error.message);
            return NextResponse.json({ error: 'Erro ao desativar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Erro em DELETE /api/partner/services:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

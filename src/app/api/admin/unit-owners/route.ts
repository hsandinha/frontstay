import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/unit-owners?propertyId=xxx
 * Lista proprietários de unidades de um prédio.
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    const propertyId = request.nextUrl.searchParams.get('propertyId');

    try {
        let query = supabase
            .from('unit_owners')
            .select('*, property_units(id, unit_name, property_id)')
            .order('created_at', { ascending: false });

        if (propertyId) {
            // Filter by property: get unit_ids for this property first
            const { data: units } = await supabase
                .from('property_units')
                .select('id')
                .eq('property_id', propertyId);

            const unitIds = (units || []).map((u: any) => u.id);
            if (unitIds.length === 0) {
                return NextResponse.json({ success: true, owners: [] });
            }
            query = query.in('unit_id', unitIds);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Erro ao buscar proprietários:', error.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        const owners = (data || []).map((o: any) => ({
            id: o.id,
            unitId: o.unit_id,
            unitName: (o.property_units as any)?.unit_name || '—',
            propertyId: (o.property_units as any)?.property_id || null,
            ownerName: o.owner_name,
            ownerEmail: o.owner_email,
            ownerPhone: o.owner_phone,
            ownerDocument: o.owner_document,
            revenueSharePercent: o.revenue_share_percent,
            active: o.active,
            createdAt: o.created_at,
        }));

        return NextResponse.json({ success: true, owners });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * POST /api/admin/unit-owners
 * Cria ou atualiza proprietário de unidade.
 */
export async function POST(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const body = await request.json();
        const { unitId, ownerName, ownerEmail, ownerPhone, ownerDocument, revenueSharePercent } = body;

        if (!unitId || !ownerName || !ownerEmail) {
            return NextResponse.json({ error: 'Unidade, nome e email são obrigatórios' }, { status: 400 });
        }

        const sharePercent = Number(revenueSharePercent) || 0;
        if (sharePercent < 0 || sharePercent > 100) {
            return NextResponse.json({ error: 'Percentual de receita deve ser entre 0 e 100' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('unit_owners')
            .insert({
                unit_id: String(unitId),
                owner_name: String(ownerName).slice(0, 200),
                owner_email: String(ownerEmail).slice(0, 200).toLowerCase(),
                owner_phone: ownerPhone ? String(ownerPhone).slice(0, 30) : null,
                owner_document: ownerDocument ? String(ownerDocument).slice(0, 30) : null,
                revenue_share_percent: sharePercent,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Erro ao criar proprietário:', error.message);
            return NextResponse.json({ error: 'Erro ao criar proprietário' }, { status: 500 });
        }

        return NextResponse.json({ success: true, ownerId: data.id }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/unit-owners?id=xxx
 * Atualiza proprietário existente.
 */
export async function PATCH(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const body = await request.json();
        const updates: Record<string, any> = {};

        if (body.ownerName !== undefined) updates.owner_name = String(body.ownerName).slice(0, 200);
        if (body.ownerEmail !== undefined) updates.owner_email = String(body.ownerEmail).slice(0, 200).toLowerCase();
        if (body.ownerPhone !== undefined) updates.owner_phone = body.ownerPhone ? String(body.ownerPhone).slice(0, 30) : null;
        if (body.ownerDocument !== undefined) updates.owner_document = body.ownerDocument ? String(body.ownerDocument).slice(0, 30) : null;
        if (body.revenueSharePercent !== undefined) {
            const pct = Number(body.revenueSharePercent);
            if (pct < 0 || pct > 100) return NextResponse.json({ error: 'Percentual inválido' }, { status: 400 });
            updates.revenue_share_percent = pct;
        }
        if (body.active !== undefined) updates.active = Boolean(body.active);

        const { error } = await supabase.from('unit_owners').update(updates).eq('id', id);
        if (error) {
            console.error('Erro ao atualizar proprietário:', error.message);
            return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/unit-owners?id=xxx
 * Remove proprietário (hard delete).
 */
export async function DELETE(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const { error } = await supabase.from('unit_owners').delete().eq('id', id);
        if (error) {
            console.error('Erro ao remover proprietário:', error.message);
            return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

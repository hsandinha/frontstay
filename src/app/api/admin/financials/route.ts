import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/financials?propertyId=xxx&month=YYYY-MM
 * Lista registros financeiros (admin pode ver todos).
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const propertyId = request.nextUrl.searchParams.get('propertyId');
        const month = request.nextUrl.searchParams.get('month');

        let query = supabase
            .from('financial_records')
            .select('*, property_units(unit_name)')
            .order('reference_month', { ascending: false })
            .order('created_at', { ascending: false });

        if (propertyId) query = query.eq('property_id', propertyId);
        if (month) query = query.eq('reference_month', month);

        const { data, error } = await query;
        if (error) {
            console.error('Erro ao buscar financeiro:', error.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        const records = (data || []).map((r: any) => ({
            id: r.id,
            propertyId: r.property_id,
            unitId: r.unit_id,
            unitName: (r.property_units as any)?.unit_name || null,
            type: r.type,
            category: r.category,
            description: r.description,
            amount: Number(r.amount),
            referenceMonth: r.reference_month,
            reservationId: r.reservation_id,
            createdAt: r.created_at,
        }));

        const totalRevenue = records.filter((r: any) => r.type === 'revenue').reduce((s: number, r: any) => s + r.amount, 0);
        const totalExpense = records.filter((r: any) => r.type === 'expense').reduce((s: number, r: any) => s + r.amount, 0);

        return NextResponse.json({
            success: true,
            records,
            summary: { totalRevenue, totalExpense, net: totalRevenue - totalExpense },
        });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * POST /api/admin/financials
 * Cria registro financeiro.
 */
export async function POST(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const body = await request.json();
        const { propertyId, unitId, type, category, description, amount, referenceMonth } = body;

        if (!propertyId || !type || !category || !amount || !referenceMonth) {
            return NextResponse.json({ error: 'Campos obrigatórios: propertyId, type, category, amount, referenceMonth' }, { status: 400 });
        }

        if (!['revenue', 'expense'].includes(type)) {
            return NextResponse.json({ error: 'Tipo deve ser "revenue" ou "expense"' }, { status: 400 });
        }

        if (!/^\d{4}-\d{2}$/.test(referenceMonth)) {
            return NextResponse.json({ error: 'Mês de referência deve ser YYYY-MM' }, { status: 400 });
        }

        const numAmount = Number(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json({ error: 'Valor deve ser positivo' }, { status: 400 });
        }

        // Get user ID for created_by
        const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', auth.user.id).single();

        const { data, error } = await supabase
            .from('financial_records')
            .insert({
                property_id: String(propertyId),
                unit_id: unitId ? String(unitId) : null,
                type,
                category: String(category).slice(0, 100),
                description: description ? String(description).slice(0, 500) : null,
                amount: numAmount,
                reference_month: referenceMonth,
                created_by: userData?.id || null,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Erro ao criar financeiro:', error.message);
            return NextResponse.json({ error: 'Erro ao criar registro' }, { status: 500 });
        }

        return NextResponse.json({ success: true, recordId: data.id }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/financials?id=xxx
 * Atualiza registro financeiro.
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
        const updates: Record<string, any> = { updated_at: new Date().toISOString() };

        if (body.type !== undefined) {
            if (!['revenue', 'expense'].includes(body.type)) return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
            updates.type = body.type;
        }
        if (body.category !== undefined) updates.category = String(body.category).slice(0, 100);
        if (body.description !== undefined) updates.description = body.description ? String(body.description).slice(0, 500) : null;
        if (body.amount !== undefined) {
            const n = Number(body.amount);
            if (isNaN(n) || n <= 0) return NextResponse.json({ error: 'Valor inválido' }, { status: 400 });
            updates.amount = n;
        }
        if (body.referenceMonth !== undefined) {
            if (!/^\d{4}-\d{2}$/.test(body.referenceMonth)) return NextResponse.json({ error: 'Mês inválido' }, { status: 400 });
            updates.reference_month = body.referenceMonth;
        }
        if (body.unitId !== undefined) updates.unit_id = body.unitId || null;

        const { error } = await supabase.from('financial_records').update(updates).eq('id', id);
        if (error) {
            console.error('Erro ao atualizar financeiro:', error.message);
            return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/financials?id=xxx
 * Remove registro financeiro.
 */
export async function DELETE(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const { error } = await supabase.from('financial_records').delete().eq('id', id);
        if (error) {
            console.error('Erro ao remover financeiro:', error.message);
            return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

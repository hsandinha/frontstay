import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/owner/financials?month=2026-04
 * Retorna registros financeiros (revenue/expense) das unidades do proprietário logado.
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['proprietario', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
    }

    try {
        const userEmail = auth.user.email;
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month'); // YYYY-MM optional filter

        // Busca unit_ids do proprietário
        const { data: ownerLinks, error: ownerError } = await supabase
            .from('unit_owners')
            .select('unit_id, revenue_share_percent, property_units(id, unit_name, property_id)')
            .eq('owner_email', userEmail)
            .eq('active', true);

        if (ownerError) {
            console.error('Erro ao buscar unidades do proprietário:', ownerError.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        if (!ownerLinks || ownerLinks.length === 0) {
            return NextResponse.json({ success: true, records: [], summary: { totalRevenue: 0, totalExpense: 0, net: 0 }, months: [] });
        }

        const unitIds = ownerLinks.map((l: any) => l.unit_id).filter(Boolean);
        const propertyIds = [...new Set(ownerLinks.map((l: any) => (l.property_units as any)?.property_id).filter(Boolean))];

        // Busca registros financeiros
        let query = supabase
            .from('financial_records')
            .select('*')
            .in('property_id', propertyIds)
            .order('reference_month', { ascending: false });

        if (month) {
            query = query.eq('reference_month', month);
        }

        const { data: records, error: recError } = await query;

        if (recError) {
            console.error('Erro ao buscar financeiro:', recError.message);
            return NextResponse.json({ error: 'Erro ao buscar financeiro' }, { status: 500 });
        }

        // Filtra registros: unit_id === null (custo do prédio) OU unit_id nas unidades do proprietário
        const filtered = (records || []).filter((r: any) => !r.unit_id || unitIds.includes(r.unit_id));

        // Summary  
        const totalRevenue = filtered.filter((r: any) => r.type === 'revenue').reduce((sum: number, r: any) => sum + Number(r.amount), 0);
        const totalExpense = filtered.filter((r: any) => r.type === 'expense').reduce((sum: number, r: any) => sum + Number(r.amount), 0);

        // Meses disponíveis
        const months = [...new Set(filtered.map((r: any) => r.reference_month))].sort().reverse();

        // Unit name map
        const unitMap: Record<string, string> = {};
        for (const link of ownerLinks) {
            const unit = link.property_units as any;
            if (unit) unitMap[unit.id] = unit.unit_name;
        }

        const enriched = filtered.map((r: any) => ({
            id: r.id,
            type: r.type,
            category: r.category,
            description: r.description,
            amount: Number(r.amount),
            referenceMonth: r.reference_month,
            unitId: r.unit_id,
            unitName: r.unit_id ? (unitMap[r.unit_id] || r.unit_id) : 'Prédio (geral)',
            createdAt: r.created_at,
        }));

        return NextResponse.json({
            success: true,
            records: enriched,
            summary: { totalRevenue, totalExpense, net: totalRevenue - totalExpense },
            months,
        });
    } catch (err: any) {
        console.error('Erro inesperado em /api/owner/financials:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/partner/requests
 * Lista solicitações de serviços do parceiro logado.
 *
 * PATCH /api/partner/requests?id=xxx
 * Atualiza status de uma solicitação (accept, reject, complete).
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['parceiros', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', auth.user.id)
            .single();

        if (!userData) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        // Busca IDs dos serviços do parceiro
        const { data: services } = await supabase
            .from('partner_services')
            .select('id, name')
            .eq('partner_user_id', userData.id);

        if (!services || services.length === 0) {
            return NextResponse.json({ success: true, requests: [] });
        }

        const serviceIds = services.map((s: any) => s.id);
        const serviceMap: Record<string, string> = {};
        for (const s of services) serviceMap[s.id] = s.name;

        const { data: requests, error: reqError } = await supabase
            .from('service_requests')
            .select('*')
            .in('service_id', serviceIds)
            .order('created_at', { ascending: false });

        if (reqError) {
            console.error('Erro ao buscar solicitações:', reqError.message);
            return NextResponse.json({ error: 'Erro ao buscar solicitações' }, { status: 500 });
        }

        const enriched = (requests || []).map((r: any) => ({
            id: r.id,
            serviceId: r.service_id,
            serviceName: serviceMap[r.service_id] || '—',
            propertyId: r.property_id,
            requesterName: r.requester_name,
            requesterType: r.requester_type,
            requesterEmail: r.requester_email,
            requesterPhone: r.requester_phone,
            unitName: r.unit_name,
            scheduledDate: r.scheduled_date,
            scheduledTime: r.scheduled_time,
            notes: r.notes,
            status: r.status,
            respondedAt: r.responded_at,
            completedAt: r.completed_at,
            createdAt: r.created_at,
        }));

        return NextResponse.json({ success: true, requests: enriched });
    } catch (err: any) {
        console.error('Erro em GET /api/partner/requests:', err.message);
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
        const requestId = searchParams.get('id');
        if (!requestId) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const body = await request.json();
        const { status } = body;

        const VALID_STATUSES = ['accepted', 'rejected', 'completed', 'cancelled'];
        if (!status || !VALID_STATUSES.includes(status)) {
            return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
        }

        // Verify ownership: request → service → partner
        const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', auth.user.id).single();
        if (!userData) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        const { data: req } = await supabase.from('service_requests').select('service_id').eq('id', requestId).single();
        if (!req) return NextResponse.json({ error: 'Solicitação não encontrada' }, { status: 404 });

        const { data: svc } = await supabase.from('partner_services').select('partner_user_id').eq('id', req.service_id).single();
        if (!svc || svc.partner_user_id !== userData.id) {
            return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
        }

        const updates: Record<string, any> = { status, updated_at: new Date().toISOString() };
        if (status === 'accepted' || status === 'rejected') updates.responded_at = new Date().toISOString();
        if (status === 'completed') updates.completed_at = new Date().toISOString();

        const { error: updateError } = await supabase.from('service_requests').update(updates).eq('id', requestId);
        if (updateError) {
            console.error('Erro ao atualizar solicitação:', updateError.message);
            return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Erro em PATCH /api/partner/requests:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

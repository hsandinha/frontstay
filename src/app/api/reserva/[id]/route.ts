import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reserva/[id]
 * Retorna dados públicos (sanitizados) da reserva para visualização do hóspede.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = getSupabaseAdmin();

        if (!supabase) {
            return NextResponse.json({ error: 'Banco não configurado' }, { status: 500 });
        }

        // Busca por pms_reservation_id
        const { data: reservation, error } = await supabase
            .from('reservations')
            .select('pms_reservation_id, guest_name, first_name, last_name, guest_email, room_name, room_type_name, check_in_date, check_out_date, status, pms_status, total, balance, source, special_requests, created_at, updated_at, property_id')
            .eq('pms_reservation_id', id)
            .single();

        if (error || !reservation) {
            return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
        }

        // Calcula noites
        let nights = 0;
        if (reservation.check_in_date && reservation.check_out_date) {
            const d1 = new Date(reservation.check_in_date + 'T12:00:00');
            const d2 = new Date(reservation.check_out_date + 'T12:00:00');
            nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
        }

        // Calcula status de pagamento
        const total = reservation.total ? Number(reservation.total) : null;
        const balance = reservation.balance ? Number(reservation.balance) : null;
        let paymentStatus: 'paid' | 'partial' | 'pending' | 'unknown' = 'unknown';
        if (total !== null && balance !== null) {
            if (balance <= 0) paymentStatus = 'paid';
            else if (balance < total) paymentStatus = 'partial';
            else paymentStatus = 'pending';
        }

        // Busca property name/address
        let propertyName: string | null = null;
        let propertyAddress: string | null = null;
        if (reservation.property_id) {
            const { data: prop } = await supabase
                .from('properties')
                .select('name, address, city, state')
                .eq('id', reservation.property_id)
                .maybeSingle();
            if (prop) {
                propertyName = prop.name;
                const parts = [prop.address, prop.city, prop.state].filter(Boolean);
                propertyAddress = parts.length > 0 ? parts.join(', ') : null;
            }
        }

        // Busca configurações de suporte
        const { data: settings } = await supabase
            .from('settings')
            .select('support_whatsapp')
            .eq('id', 'default')
            .maybeSingle();

        // Timeline
        const timeline: Array<{ label: string; description: string; date: string | null; tone: string }> = [];

        if (reservation.created_at) {
            timeline.push({
                label: 'Reserva criada',
                description: 'Sua reserva foi registrada no sistema.',
                date: reservation.created_at,
                tone: 'success',
            });
        }

        if (reservation.status === 'confirmed') {
            timeline.push({
                label: 'Reserva confirmada',
                description: 'O pagamento foi confirmado e a reserva está ativa.',
                date: reservation.updated_at,
                tone: 'success',
            });
        }

        if (reservation.status === 'canceled') {
            timeline.push({
                label: 'Reserva cancelada',
                description: 'O cancelamento foi registrado no sistema.',
                date: reservation.updated_at,
                tone: 'warning',
            });
        }

        // Sort by date desc
        timeline.sort((a, b) => Date.parse(b.date || '') - Date.parse(a.date || ''));

        return NextResponse.json({
            success: true,
            reservation: {
                id: reservation.pms_reservation_id,
                guestName: reservation.guest_name,
                firstName: reservation.first_name,
                email: reservation.guest_email ? `${reservation.guest_email.slice(0, 3)}***` : null,
                roomName: reservation.room_name || reservation.room_type_name || 'Hospedagem FrontStay',
                checkInDate: reservation.check_in_date,
                checkOutDate: reservation.check_out_date,
                nights,
                status: reservation.status,
                total,
                balance,
                paidAmount: total !== null ? Math.max((total) - (balance || 0), 0) : null,
                paymentStatus,
                source: reservation.source,
                specialRequests: reservation.special_requests,
                propertyName,
                propertyAddress,
            },
            timeline,
            supportWhatsapp: settings?.support_whatsapp || null,
        });
    } catch (err: any) {
        console.error('❌ Erro em /api/reserva/[id]:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

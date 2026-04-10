import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/owner/dashboard
 * Retorna dados do proprietário logado: unidades, reservas e stats.
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['proprietario', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
    }

    try {
        // Busca email do usuário logado
        const userEmail = auth.user.email;

        // Busca unidades do proprietário via unit_owners
        const { data: ownerLinks, error: ownerError } = await supabase
            .from('unit_owners')
            .select(`
                id,
                revenue_share_percent,
                active,
                unit_id,
                property_units (
                    id,
                    unit_name,
                    room_name,
                    floor,
                    unit_type,
                    bedrooms,
                    max_guests,
                    active,
                    property_id,
                    properties (
                        id,
                        name,
                        slug,
                        address,
                        city,
                        state,
                        active
                    )
                )
            `)
            .eq('owner_email', userEmail)
            .eq('active', true);

        if (ownerError) {
            console.error('Erro ao buscar unidades do proprietário:', ownerError.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        if (!ownerLinks || ownerLinks.length === 0) {
            return NextResponse.json({
                success: true,
                properties: [],
                reservations: [],
                stats: { totalUnits: 0, activeReservations: 0, occupancyRate: 0 },
            });
        }

        // Agrupa unidades por prédio
        const propertyMap = new Map<string, any>();
        const allRoomNames: string[] = [];
        const allPropertyIds: string[] = [];

        for (const link of ownerLinks) {
            const unit = link.property_units as any;
            if (!unit) continue;

            const property = unit.properties as any;
            if (!property) continue;

            const propertyId = property.id;
            allPropertyIds.push(propertyId);

            if (!propertyMap.has(propertyId)) {
                propertyMap.set(propertyId, {
                    ...property,
                    units: [],
                });
            }

            propertyMap.get(propertyId).units.push({
                id: unit.id,
                unitName: unit.unit_name,
                roomName: unit.room_name,
                floor: unit.floor,
                unitType: unit.unit_type,
                bedrooms: unit.bedrooms,
                maxGuests: unit.max_guests,
                active: unit.active,
                revenueSharePercent: link.revenue_share_percent,
            });

            if (unit.room_name) {
                allRoomNames.push(unit.room_name);
            }
        }

        const properties = Array.from(propertyMap.values());
        const uniquePropertyIds = [...new Set(allPropertyIds)];

        // Busca reservas dos quartos do proprietário
        const today = new Date().toISOString().split('T')[0];
        let reservations: any[] = [];

        if (allRoomNames.length > 0 && uniquePropertyIds.length > 0) {
            const { data: resData, error: resError } = await supabase
                .from('reservations')
                .select('pms_reservation_id, guest_name, room_name, check_in_date, check_out_date, status, pms_status, property_id')
                .in('property_id', uniquePropertyIds)
                .in('room_name', allRoomNames)
                .gte('check_out_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                .order('check_in_date', { ascending: false })
                .limit(100);

            if (resError) {
                console.error('Erro ao buscar reservas:', resError.message);
            } else {
                reservations = (resData || []).map(r => ({
                    id: r.pms_reservation_id,
                    guestName: r.guest_name,
                    roomName: r.room_name,
                    checkIn: r.check_in_date,
                    checkOut: r.check_out_date,
                    status: r.status,
                    pmsStatus: r.pms_status,
                    propertyId: r.property_id,
                }));
            }
        }

        // Stats
        const activeReservations = reservations.filter(r =>
            r.checkIn <= today && r.checkOut >= today &&
            !['canceled', 'no_show'].includes(r.status)
        ).length;

        const occupancyRate = allRoomNames.length > 0
            ? Math.round((activeReservations / allRoomNames.length) * 100)
            : 0;

        return NextResponse.json({
            success: true,
            properties,
            reservations,
            stats: {
                totalUnits: allRoomNames.length,
                activeReservations,
                occupancyRate,
                totalProperties: properties.length,
            },
        });
    } catch (error: any) {
        console.error('Erro no dashboard do proprietário:', error);
        return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
    }
}

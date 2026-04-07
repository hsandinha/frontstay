import 'server-only';

import type { PostgrestError } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export interface GuestProfilePayload {
    name: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    taxId?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
}

export interface GuestPortalReservation {
    id: string | number;
    pmsReservationId: string | null;
    roomName: string;
    checkInDate: string | null;
    checkOutDate: string | null;
    status: string;
    pmsStatus: string | null;
    total: number | null;
    balance: number | null;
    paidAmount: number | null;
    paymentStatus: 'paid' | 'partial' | 'pending' | 'unknown';
    specialRequests: string | null;
    propertyId: string | null;
    source: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface GuestPortalGuest {
    id: string | null;
    name: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    taxId: string | null;
    firstSeenAt: string | null;
    lastSeenAt: string | null;
}

export interface GuestPortalSummary {
    totalBookings: number;
    activeReservations: number;
    futureReservations: number;
    completedStays: number;
    pendingPaymentAmount: number;
}

export interface GuestPortalData {
    guest: GuestPortalGuest | null;
    reservations: GuestPortalReservation[];
    summary: GuestPortalSummary;
}

function normalizeEmail(value: unknown) {
    return String(value || '').trim().toLowerCase();
}

function normalizeDigits(value: unknown) {
    return String(value || '').replace(/\D/g, '');
}

function toNullableNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;

    if (typeof value === 'string') {
        const cleaned = value.replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        if (!cleaned) return null;

        const parsed = Number(cleaned);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function isMissingColumnError(error: PostgrestError | null) {
    return Boolean(error?.message && /column/i.test(error.message));
}

async function findExistingProfile(data: GuestProfilePayload): Promise<string | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const taxId = normalizeDigits(data.taxId);
    const email = normalizeEmail(data.email);
    const phone = String(data.phone || '').trim();

    if (taxId.length >= 8) {
        const { data: existing } = await supabase
            .from('guest_profiles')
            .select('id')
            .eq('tax_id', taxId)
            .maybeSingle();

        if (existing?.id) return existing.id as string;
    }

    if (email.includes('@')) {
        const { data: existing } = await supabase
            .from('guest_profiles')
            .select('id')
            .ilike('email', email)
            .maybeSingle();

        if (existing?.id) return existing.id as string;
    }

    if (phone.length >= 8) {
        const { data: existing } = await supabase
            .from('guest_profiles')
            .select('id')
            .eq('phone', phone)
            .maybeSingle();

        if (existing?.id) return existing.id as string;
    }

    return null;
}

export async function findOrCreateGuestProfile(data: GuestProfilePayload): Promise<string | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const now = new Date().toISOString();
    const existingId = await findExistingProfile(data);
    const payload = {
        name: data.name || [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || 'Hóspede FrontStay',
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        email: normalizeEmail(data.email) || null,
        phone: data.phone?.trim() || null,
        tax_id: normalizeDigits(data.taxId) || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || 'BR',
        updated_at: now,
        last_seen_at: now,
    };

    if (existingId) {
        const { error } = await supabase
            .from('guest_profiles')
            .update(payload)
            .eq('id', existingId);

        if (error) {
            console.warn('⚠️ Não foi possível atualizar guest_profile existente:', error.message);
        }

        return existingId;
    }

    const { data: created, error } = await supabase
        .from('guest_profiles')
        .insert({
            ...payload,
            first_seen_at: now,
            created_at: now,
        })
        .select('id')
        .maybeSingle();

    if (error) {
        console.warn('⚠️ Não foi possível criar guest_profile:', error.message);
        return await findExistingProfile(data);
    }

    return (created?.id as string | undefined) || null;
}

function mapGuest(profile: Record<string, any> | null, reservations: Record<string, any>[]): GuestPortalGuest | null {
    if (profile) {
        return {
            id: typeof profile.id === 'string' ? profile.id : null,
            name: String(profile.name || [profile.first_name, profile.last_name].filter(Boolean).join(' ')).trim() || 'Hóspede FrontStay',
            firstName: typeof profile.first_name === 'string' ? profile.first_name : null,
            lastName: typeof profile.last_name === 'string' ? profile.last_name : null,
            email: normalizeEmail(profile.email),
            phone: typeof profile.phone === 'string' ? profile.phone : null,
            city: typeof profile.city === 'string' ? profile.city : null,
            state: typeof profile.state === 'string' ? profile.state : null,
            country: typeof profile.country === 'string' ? profile.country : null,
            taxId: typeof profile.tax_id === 'string' ? profile.tax_id : null,
            firstSeenAt: typeof profile.first_seen_at === 'string' ? profile.first_seen_at : null,
            lastSeenAt: typeof profile.last_seen_at === 'string' ? profile.last_seen_at : null,
        };
    }

    const lastReservation = reservations[0];
    if (!lastReservation) return null;

    return {
        id: null,
        name: String(lastReservation.guest_name || [lastReservation.first_name, lastReservation.last_name].filter(Boolean).join(' ')).trim() || 'Hóspede FrontStay',
        firstName: typeof lastReservation.first_name === 'string' ? lastReservation.first_name : null,
        lastName: typeof lastReservation.last_name === 'string' ? lastReservation.last_name : null,
        email: normalizeEmail(lastReservation.guest_email),
        phone: typeof lastReservation.guest_phone === 'string' ? lastReservation.guest_phone : null,
        city: typeof lastReservation.city === 'string' ? lastReservation.city : null,
        state: typeof lastReservation.state === 'string' ? lastReservation.state : null,
        country: typeof lastReservation.country === 'string' ? lastReservation.country : 'BR',
        taxId: typeof lastReservation.tax_id === 'string' ? lastReservation.tax_id : null,
        firstSeenAt: typeof lastReservation.created_at === 'string' ? lastReservation.created_at : null,
        lastSeenAt: typeof lastReservation.updated_at === 'string' ? lastReservation.updated_at : null,
    };
}

function mapReservation(row: Record<string, any>): GuestPortalReservation {
    const total = toNullableNumber(row.total);
    const balance = toNullableNumber(row.balance);
    const paidAmount = total !== null
        ? Math.max(total - (balance || 0), 0)
        : null;

    let paymentStatus: GuestPortalReservation['paymentStatus'] = 'unknown';

    if (total !== null && balance !== null) {
        if (balance <= 0) paymentStatus = 'paid';
        else if (balance < total) paymentStatus = 'partial';
        else paymentStatus = 'pending';
    }

    return {
        id: String(row.id || row.pms_reservation_id || `${row.guest_email}-${row.check_in_date}`),
        pmsReservationId: row.pms_reservation_id ? String(row.pms_reservation_id) : null,
        roomName: String(row.room_name || row.room_type_name || 'Hospedagem FrontStay'),
        checkInDate: typeof row.check_in_date === 'string' ? row.check_in_date : null,
        checkOutDate: typeof row.check_out_date === 'string' ? row.check_out_date : null,
        status: String(row.status || 'confirmed'),
        pmsStatus: row.pms_status ? String(row.pms_status) : null,
        total,
        balance,
        paidAmount,
        paymentStatus,
        specialRequests: typeof row.special_requests === 'string' ? row.special_requests : null,
        propertyId: row.property_id ? String(row.property_id) : null,
        source: row.source ? String(row.source) : null,
        createdAt: typeof row.created_at === 'string' ? row.created_at : null,
        updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
    };
}

function buildSummary(reservations: GuestPortalReservation[]): GuestPortalSummary {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return reservations.reduce<GuestPortalSummary>((summary, reservation) => {
        const checkIn = reservation.checkInDate ? new Date(`${reservation.checkInDate}T12:00:00`) : null;
        const checkOut = reservation.checkOutDate ? new Date(`${reservation.checkOutDate}T12:00:00`) : null;

        summary.totalBookings += 1;

        if (checkIn && checkOut) {
            if (checkIn <= today && checkOut >= today) {
                summary.activeReservations += 1;
            } else if (checkIn > today) {
                summary.futureReservations += 1;
            } else if (checkOut < today) {
                summary.completedStays += 1;
            }
        }

        if (reservation.paymentStatus === 'pending' || reservation.paymentStatus === 'partial') {
            summary.pendingPaymentAmount += reservation.balance || 0;
        }

        return summary;
    }, {
        totalBookings: 0,
        activeReservations: 0,
        futureReservations: 0,
        completedStays: 0,
        pendingPaymentAmount: 0,
    });
}

export async function getGuestPortalData(email: string): Promise<GuestPortalData> {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        throw new Error('O FrontStay ainda não está conectado ao mesmo Supabase do inhouse.');
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail.includes('@')) {
        throw new Error('Informe um e-mail válido para consultar suas reservas.');
    }

    const [{ data: profile }, { data: reservations, error: reservationsError }] = await Promise.all([
        supabase
            .from('guest_profiles')
            .select('*')
            .ilike('email', normalizedEmail)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase
            .from('reservations')
            .select('*')
            .ilike('guest_email', normalizedEmail)
            .order('check_in_date', { ascending: false }),
    ]);

    if (reservationsError) {
        throw new Error(`Não foi possível carregar as reservas: ${reservationsError.message}`);
    }

    const reservationRows = Array.isArray(reservations) ? reservations : [];
    const mappedReservations = reservationRows.map((row) => mapReservation(row as Record<string, any>));
    const guest = mapGuest(profile as Record<string, any> | null, reservationRows as Record<string, any>[]);

    return {
        guest,
        reservations: mappedReservations,
        summary: buildSummary(mappedReservations),
    };
}

export async function saveReservationToSharedDatabase(input: {
    reservationId: string | number;
    propertyId?: string | null;
    roomTypeId?: string | null;
    roomName?: string | null;
    startDate: string;
    endDate: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    document?: string | null;
    totalAmount?: number | null;
    paymentMethod?: string | null;
    specialRequests?: string | null;
    promoCode?: string | null;
}) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return { stored: false, guestProfileId: null, reservation: null, error: 'Supabase não configurado no FrontStay.' };
    }

    const normalizedEmail = normalizeEmail(input.email);
    const totalAmount = typeof input.totalAmount === 'number' && Number.isFinite(input.totalAmount)
        ? input.totalAmount
        : null;
    const now = new Date().toISOString();
    const guestName = `${input.firstName} ${input.lastName}`.trim();

    const guestProfileId = await findOrCreateGuestProfile({
        name: guestName,
        firstName: input.firstName,
        lastName: input.lastName,
        email: normalizedEmail,
        phone: input.phone || null,
        taxId: input.document || null,
    });

    const richPayload = {
        pms_reservation_id: String(input.reservationId),
        property_id: input.propertyId || null,
        guest_name: guestName,
        guest_phone: input.phone?.trim() || null,
        guest_email: normalizedEmail,
        room_name: input.roomName || 'Hospedagem FrontStay',
        room_id: input.roomTypeId || null,
        room_type_name: input.roomName || null,
        check_in_date: input.startDate,
        check_out_date: input.endDate,
        status: 'confirmed',
        pms_status: 'confirmed',
        first_name: input.firstName,
        last_name: input.lastName,
        tax_id: normalizeDigits(input.document),
        total: totalAmount,
        balance: totalAmount,
        source: 'frontstay-site',
        special_requests: input.specialRequests || null,
        custom_fields: {
            payment_method: input.paymentMethod || null,
            promo_code: input.promoCode || null,
            guest_profile_id: guestProfileId,
        },
        updated_at: now,
    };

    const minimalPayload = {
        pms_reservation_id: String(input.reservationId),
        guest_email: normalizedEmail,
        guest_name: guestName,
        room_name: input.roomName || 'Hospedagem FrontStay',
        check_in_date: input.startDate,
        check_out_date: input.endDate,
        updated_at: now,
    };

    let response = await supabase
        .from('reservations')
        .upsert(richPayload, { onConflict: 'pms_reservation_id' })
        .select('*')
        .maybeSingle();

    if (response.error && isMissingColumnError(response.error)) {
        response = await supabase
            .from('reservations')
            .upsert(minimalPayload, { onConflict: 'pms_reservation_id' })
            .select('*')
            .maybeSingle();
    }

    if (response.error) {
        console.warn('⚠️ Não foi possível persistir a reserva no banco compartilhado:', response.error.message);
        return {
            stored: false,
            guestProfileId,
            reservation: null,
            error: response.error.message,
        };
    }

    return {
        stored: true,
        guestProfileId,
        reservation: response.data ? mapReservation(response.data as Record<string, any>) : null,
        error: null,
    };
}

export async function updateGuestProfileByEmail(email: string, updates: Partial<GuestProfilePayload>) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        throw new Error('Supabase não configurado no FrontStay.');
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail.includes('@')) {
        throw new Error('Informe um e-mail válido.');
    }

    const payload = {
        name: updates.name || undefined,
        phone: updates.phone?.trim() || undefined,
        city: updates.city || undefined,
        state: updates.state || undefined,
        country: updates.country || undefined,
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
    };

    const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    );

    const { data, error } = await supabase
        .from('guest_profiles')
        .update(cleanedPayload)
        .ilike('email', normalizedEmail)
        .select('*')
        .maybeSingle();

    if (error) {
        throw new Error(`Não foi possível atualizar o cadastro: ${error.message}`);
    }

    if (!data) {
        await findOrCreateGuestProfile({
            name: updates.name || 'Hóspede FrontStay',
            email: normalizedEmail,
            phone: updates.phone || null,
            city: updates.city || null,
            state: updates.state || null,
            country: updates.country || 'BR',
        });
    }

    return getGuestPortalData(normalizedEmail);
}

export async function updateReservationById(params: {
    email: string;
    reservationId: string;
    checkInDate?: string | null;
    checkOutDate?: string | null;
    specialRequests?: string | null;
}) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        throw new Error('Supabase não configurado no FrontStay.');
    }

    const normalizedEmail = normalizeEmail(params.email);
    if (!normalizedEmail.includes('@')) {
        throw new Error('Informe um e-mail válido.');
    }

    const updatePayload = {
        check_in_date: params.checkInDate || undefined,
        check_out_date: params.checkOutDate || undefined,
        special_requests: params.specialRequests ?? undefined,
        updated_at: new Date().toISOString(),
    };

    const cleanedPayload = Object.fromEntries(
        Object.entries(updatePayload).filter(([, value]) => value !== undefined)
    );

    const { error } = await supabase
        .from('reservations')
        .update(cleanedPayload)
        .ilike('guest_email', normalizedEmail)
        .eq('id', params.reservationId);

    if (error) {
        throw new Error(`Não foi possível alterar a reserva: ${error.message}`);
    }

    return getGuestPortalData(normalizedEmail);
}

import 'server-only';

import { getSupabaseAdmin } from './supabase-admin';

// --- Types ---
export interface Property {
    id: string;
    name: string;
    slug: string;
    backendUrl: string | null;
    address: string | null;
    city: string | null;
    state: string;
    timezone: string;
    active: boolean;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PropertyUnit {
    id: string;
    propertyId: string;
    unitName: string;
    roomName: string | null;
    floor: string | null;
    unitType: string;
    bedrooms: number;
    maxGuests: number;
    active: boolean;
}

export interface PropertyIntegration {
    id: string;
    propertyId: string;
    provider: string;
    providerType: string;
    config: Record<string, string>;
    active: boolean;
}

export interface PropertyWithDetails extends Property {
    units: PropertyUnit[];
    integrations: PropertyIntegration[];
    stats: {
        totalUnits: number;
        activeReservations: number;
    };
}

// --- Helpers ---
function mapProperty(row: any): Property {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        backendUrl: row.backend_url,
        address: row.address,
        city: row.city,
        state: row.state,
        timezone: row.timezone,
        active: row.active,
        logoUrl: row.logo_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapUnit(row: any): PropertyUnit {
    return {
        id: row.id,
        propertyId: row.property_id,
        unitName: row.unit_name,
        roomName: row.room_name,
        floor: row.floor,
        unitType: row.unit_type,
        bedrooms: row.bedrooms,
        maxGuests: row.max_guests,
        active: row.active,
    };
}

function mapIntegration(row: any): PropertyIntegration {
    return {
        id: row.id,
        propertyId: row.property_id,
        provider: row.provider,
        providerType: row.provider_type,
        config: row.config || {},
        active: row.active,
    };
}

// --- CRUD ---

export async function listProperties(): Promise<Property[]> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('name');

    if (error) {
        console.error('Erro ao listar properties:', error.message);
        return [];
    }

    return (data || []).map(mapProperty);
}

export async function getPropertyById(id: string): Promise<PropertyWithDetails | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data: prop, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !prop) return null;

    // Fetch units
    const { data: units } = await supabase
        .from('property_units')
        .select('*')
        .eq('property_id', id)
        .order('unit_name');

    // Fetch integrations
    const { data: integrations } = await supabase
        .from('property_integrations')
        .select('*')
        .eq('property_id', id);

    // Count active reservations
    const today = new Date().toISOString().split('T')[0];
    const { count: activeReservations } = await supabase
        .from('reservations')
        .select('id', { count: 'exact', head: true })
        .eq('property_id', id)
        .lte('check_in_date', today)
        .gte('check_out_date', today);

    return {
        ...mapProperty(prop),
        units: (units || []).map(mapUnit),
        integrations: (integrations || []).map(mapIntegration),
        stats: {
            totalUnits: (units || []).length,
            activeReservations: activeReservations || 0,
        },
    };
}

export async function createProperty(input: {
    name: string;
    slug: string;
    address?: string;
    city?: string;
    state?: string;
    timezone?: string;
}): Promise<Property> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase não configurado');

    // Gera ID a partir do slug
    const id = input.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const { data, error } = await supabase
        .from('properties')
        .insert({
            id,
            name: input.name,
            slug: id,
            address: input.address || null,
            city: input.city || null,
            state: input.state || 'BA',
            timezone: input.timezone || 'America/Sao_Paulo',
            active: true,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapProperty(data);
}

export async function updateProperty(
    id: string,
    input: Partial<{
        name: string;
        address: string;
        city: string;
        state: string;
        timezone: string;
        active: boolean;
        logoUrl: string;
    }>
): Promise<Property> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase não configurado');

    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name;
    if (input.address !== undefined) updateData.address = input.address;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.state !== undefined) updateData.state = input.state;
    if (input.timezone !== undefined) updateData.timezone = input.timezone;
    if (input.active !== undefined) updateData.active = input.active;
    if (input.logoUrl !== undefined) updateData.logo_url = input.logoUrl;

    const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapProperty(data);
}

// --- Units ---

export async function addUnit(input: {
    propertyId: string;
    unitName: string;
    roomName?: string;
    floor?: string;
    unitType?: string;
    bedrooms?: number;
    maxGuests?: number;
}): Promise<PropertyUnit> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase
        .from('property_units')
        .insert({
            property_id: input.propertyId,
            unit_name: input.unitName,
            room_name: input.roomName || input.unitName,
            floor: input.floor || null,
            unit_type: input.unitType || 'studio',
            bedrooms: input.bedrooms || 1,
            max_guests: input.maxGuests || 2,
            active: true,
        })
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapUnit(data);
}

export async function updateUnit(
    unitId: string,
    input: Partial<{
        unitName: string;
        roomName: string;
        floor: string;
        unitType: string;
        bedrooms: number;
        maxGuests: number;
        active: boolean;
    }>
): Promise<PropertyUnit> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase não configurado');

    const updateData: any = {};
    if (input.unitName !== undefined) updateData.unit_name = input.unitName;
    if (input.roomName !== undefined) updateData.room_name = input.roomName;
    if (input.floor !== undefined) updateData.floor = input.floor;
    if (input.unitType !== undefined) updateData.unit_type = input.unitType;
    if (input.bedrooms !== undefined) updateData.bedrooms = input.bedrooms;
    if (input.maxGuests !== undefined) updateData.max_guests = input.maxGuests;
    if (input.active !== undefined) updateData.active = input.active;

    const { data, error } = await supabase
        .from('property_units')
        .update(updateData)
        .eq('id', unitId)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapUnit(data);
}

export async function deleteUnit(unitId: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase não configurado');

    const { error } = await supabase
        .from('property_units')
        .delete()
        .eq('id', unitId);

    if (error) throw new Error(error.message);
}

// --- Integrations ---

export async function upsertIntegration(input: {
    propertyId: string;
    provider: string;
    providerType: string;
    config: Record<string, string>;
}): Promise<PropertyIntegration> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error('Supabase não configurado');

    const { data, error } = await supabase
        .from('property_integrations')
        .upsert(
            {
                property_id: input.propertyId,
                provider: input.provider,
                provider_type: input.providerType,
                config: input.config,
                active: true,
            },
            { onConflict: 'property_id,provider' }
        )
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapIntegration(data);
}

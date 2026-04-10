import { NextRequest, NextResponse } from 'next/server';
import {
    listProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    addUnit,
    updateUnit,
    deleteUnit,
    upsertIntegration,
} from '@/lib/properties';
import { requireAuth } from '@/lib/require-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    try {
        const id = request.nextUrl.searchParams.get('id');

        if (id) {
            const property = await getPropertyById(id);
            if (!property) {
                return NextResponse.json(
                    { success: false, error: 'Prédio não encontrado.' },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, property });
        }

        const properties = await listProperties();
        return NextResponse.json({ success: true, properties });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || 'Erro ao buscar prédios.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    try {
        const body = await request.json();
        const action = body?.action || 'create-property';

        switch (action) {
            case 'create-property': {
                const name = String(body?.name || '').trim();
                const slug = String(body?.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

                if (!name || !slug) {
                    return NextResponse.json(
                        { success: false, error: 'Nome e slug são obrigatórios.' },
                        { status: 400 }
                    );
                }

                const property = await createProperty({
                    name,
                    slug,
                    address: body?.address,
                    city: body?.city,
                    state: body?.state,
                    timezone: body?.timezone,
                });

                return NextResponse.json({ success: true, property });
            }

            case 'update-property': {
                const id = String(body?.id || '').trim();
                if (!id) {
                    return NextResponse.json(
                        { success: false, error: 'ID do prédio é obrigatório.' },
                        { status: 400 }
                    );
                }

                const property = await updateProperty(id, {
                    name: body?.name,
                    address: body?.address,
                    city: body?.city,
                    state: body?.state,
                    timezone: body?.timezone,
                    active: body?.active,
                    logoUrl: body?.logoUrl,
                });

                return NextResponse.json({ success: true, property });
            }

            case 'add-unit': {
                const propertyId = String(body?.propertyId || '').trim();
                const unitName = String(body?.unitName || '').trim();

                if (!propertyId || !unitName) {
                    return NextResponse.json(
                        { success: false, error: 'Property ID e nome da unidade são obrigatórios.' },
                        { status: 400 }
                    );
                }

                const unit = await addUnit({
                    propertyId,
                    unitName,
                    roomName: body?.roomName,
                    floor: body?.floor,
                    unitType: body?.unitType,
                    bedrooms: body?.bedrooms ? Number(body.bedrooms) : undefined,
                    maxGuests: body?.maxGuests ? Number(body.maxGuests) : undefined,
                });

                return NextResponse.json({ success: true, unit });
            }

            case 'update-unit': {
                const unitId = String(body?.unitId || '').trim();
                if (!unitId) {
                    return NextResponse.json(
                        { success: false, error: 'ID da unidade é obrigatório.' },
                        { status: 400 }
                    );
                }

                const unit = await updateUnit(unitId, {
                    unitName: body?.unitName,
                    roomName: body?.roomName,
                    floor: body?.floor,
                    unitType: body?.unitType,
                    bedrooms: body?.bedrooms ? Number(body.bedrooms) : undefined,
                    maxGuests: body?.maxGuests ? Number(body.maxGuests) : undefined,
                    active: body?.active,
                });

                return NextResponse.json({ success: true, unit });
            }

            case 'delete-unit': {
                const unitId = String(body?.unitId || '').trim();
                if (!unitId) {
                    return NextResponse.json(
                        { success: false, error: 'ID da unidade é obrigatório.' },
                        { status: 400 }
                    );
                }

                await deleteUnit(unitId);
                return NextResponse.json({ success: true });
            }

            case 'upsert-integration': {
                const propertyId = String(body?.propertyId || '').trim();
                const provider = String(body?.provider || '').trim();
                const providerType = String(body?.providerType || '').trim();

                if (!propertyId || !provider || !providerType) {
                    return NextResponse.json(
                        { success: false, error: 'Property ID, provider e tipo são obrigatórios.' },
                        { status: 400 }
                    );
                }

                const integration = await upsertIntegration({
                    propertyId,
                    provider,
                    providerType,
                    config: body?.config || {},
                });

                return NextResponse.json({ success: true, integration });
            }

            default:
                return NextResponse.json(
                    { success: false, error: `Ação desconhecida: ${action}` },
                    { status: 400 }
                );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error?.message || 'Erro interno.' },
            { status: 500 }
        );
    }
}

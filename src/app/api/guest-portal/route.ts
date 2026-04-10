import { NextRequest, NextResponse } from 'next/server';
import {
    cancelReservationById,
    findOrCreateGuestProfile,
    getGuestPortalData,
    updateGuestProfileByEmail,
    updateReservationById,
} from '@/lib/guest-portal';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get('email') || '';
        const payload = await getGuestPortalData(email);

        return NextResponse.json({
            success: true,
            ...payload,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || 'Não foi possível carregar o portal do hóspede.',
            },
            { status: 400 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const action = body?.action || 'login';
        const email = String(body?.email || '').trim().toLowerCase();

        if (!email.includes('@')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Informe um e-mail válido.',
                },
                { status: 400 }
            );
        }

        if (action === 'register') {
            const name = String(body?.name || '').trim();

            if (!name) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Informe o nome completo para concluir o cadastro.',
                    },
                    { status: 400 }
                );
            }

            await findOrCreateGuestProfile({
                name,
                firstName: body?.firstName || null,
                lastName: body?.lastName || null,
                email,
                phone: body?.phone || null,
                taxId: body?.document || null,
            });
        }

        const payload = await getGuestPortalData(email);

        return NextResponse.json({
            success: true,
            message: action === 'register'
                ? 'Cadastro compartilhado criado com sucesso.'
                : 'Portal do hóspede carregado com sucesso.',
            ...payload,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || 'Não foi possível autenticar o hóspede.',
            },
            { status: 400 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const target = body?.target;
        const email = String(body?.email || '').trim().toLowerCase();

        if (target === 'profile') {
            const payload = await updateGuestProfileByEmail(email, {
                name: body?.name,
                phone: body?.phone,
                city: body?.city,
                state: body?.state,
                country: body?.country,
            });

            return NextResponse.json({
                success: true,
                message: 'Cadastro atualizado com sucesso.',
                ...payload,
            });
        }

        if (target === 'reservation') {
            const reservationId = String(body?.reservationId || '').trim();

            if (!reservationId) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Reserva não identificada.',
                    },
                    { status: 400 }
                );
            }

            const payload = await updateReservationById({
                email,
                reservationId,
                checkInDate: body?.checkInDate,
                checkOutDate: body?.checkOutDate,
                specialRequests: body?.specialRequests,
            });

            return NextResponse.json({
                success: true,
                message: 'Reserva atualizada no backend compartilhado.',
                ...payload,
            });
        }

        if (target === 'cancel') {
            const reservationId = String(body?.reservationId || '').trim();

            if (!reservationId) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Reserva não identificada.',
                    },
                    { status: 400 }
                );
            }

            const payload = await cancelReservationById({
                email,
                reservationId,
            });

            return NextResponse.json({
                success: true,
                message: 'Reserva cancelada com sucesso.',
                ...payload,
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Operação inválida para o portal do hóspede.',
            },
            { status: 400 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error?.message || 'Não foi possível atualizar os dados do hóspede.',
            },
            { status: 400 }
        );
    }
}

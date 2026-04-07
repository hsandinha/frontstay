import { NextRequest, NextResponse } from 'next/server';
import { createCloudbedsReservation } from '@/lib/cloudbeds';
import { saveReservationToSharedDatabase } from '@/lib/guest-portal';

export const dynamic = 'force-dynamic';

function normalizePaymentMethod(method: unknown) {
    if (method === 'credit') return 'credit';
    if (method === 'pix') return 'ebanking';
    if (method === 'pay_pal') return 'pay_pal';
    return 'cash';
}

function extractReservationId(payload: any) {
    return payload?.reservationID
        || payload?.reservationId
        || payload?.data?.reservationID
        || payload?.data?.reservationId
        || null;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const propertyID = body?.propertyID || body?.propertyId;
        const roomTypeID = body?.roomTypeID || body?.roomTypeId;
        const rateID = body?.rateID || body?.ratePlanId || body?.ratePlanID || undefined;
        const guestFirstName = body?.guestFirstName || body?.firstName;
        const guestLastName = body?.guestLastName || body?.lastName;
        const guestEmail = body?.guestEmail || body?.email;

        if (!propertyID || !roomTypeID || !body?.startDate || !body?.endDate || !guestFirstName || !guestLastName || !guestEmail) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Campos obrigatórios: propertyId, roomTypeId, startDate, endDate, firstName, lastName e email.',
                },
                { status: 400 }
            );
        }

        const adults = Number(body?.adults || body?.guests || 1);
        const children = Number(body?.children || 0);

        const result = await createCloudbedsReservation({
            propertyID,
            roomTypeID,
            rateID,
            startDate: body.startDate,
            endDate: body.endDate,
            guestFirstName,
            guestLastName,
            guestEmail,
            guestPhone: body?.guestPhone || body?.phone || '',
            guestCountry: body?.guestCountry || 'BR',
            guestZip: body?.guestZip || '00000000',
            guestGender: body?.guestGender || 'N/A',
            estimatedArrivalTime: body?.estimatedArrivalTime || '14:00',
            paymentMethod: normalizePaymentMethod(body?.paymentMethod),
            rooms: [
                {
                    roomTypeID,
                    rateID,
                    quantity: 1,
                },
            ],
            adults: [
                {
                    roomTypeID,
                    quantity: adults,
                },
            ],
            children: [
                {
                    roomTypeID,
                    quantity: children,
                },
            ],
            promoCode: body?.promoCode || undefined,
            thirdPartyIdentifier: 'frontstay-site',
            sendEmailConfirmation: true,
        });

        if (result?.success === false) {
            return NextResponse.json(
                {
                    success: false,
                    error: result?.message || 'O Cloudbeds recusou a criação da reserva.',
                    data: result,
                },
                { status: 400 }
            );
        }

        const reservationId = extractReservationId(result);
        const sharedDbResult = reservationId
            ? await saveReservationToSharedDatabase({
                reservationId,
                propertyId: propertyID,
                roomTypeId: roomTypeID,
                roomName: body?.roomName || body?.roomTypeName || null,
                startDate: body.startDate,
                endDate: body.endDate,
                firstName: guestFirstName,
                lastName: guestLastName,
                email: guestEmail,
                phone: body?.guestPhone || body?.phone || '',
                document: body?.document || null,
                totalAmount: Number(body?.totalAmount || 0),
                paymentMethod: String(body?.paymentMethod || ''),
                specialRequests: body?.specialRequests || null,
                promoCode: body?.promoCode || null,
            })
            : { stored: false, guestProfileId: null, reservation: null, error: 'Reserva criada sem ID retornado pelo Cloudbeds.' };

        const message = reservationId
            ? `Reserva ${reservationId} criada no Cloudbeds.${sharedDbResult.stored ? ' Seu cadastro e a reserva já estão visíveis no painel do hóspede.' : ''}`
            : 'Reserva criada no Cloudbeds com sucesso.';

        return NextResponse.json({
            success: true,
            message,
            reservationId,
            guestProfileId: sharedDbResult.guestProfileId || null,
            portalStored: sharedDbResult.stored,
            portalError: sharedDbResult.error || null,
            data: result,
        });
    } catch (error: any) {
        console.error('❌ Erro ao criar reserva no Cloudbeds:', error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || 'Falha ao criar reserva no Cloudbeds.',
            },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getRoomAvailability } from '@/lib/cloudbeds';

export const dynamic = 'force-dynamic';

function isValidDateInput(value: string | null): value is string {
    return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const propertyID = searchParams.get('propertyID') || undefined;
    const guestsRaw = searchParams.get('guests');
    const guests = Number.isFinite(Number(guestsRaw)) && Number(guestsRaw) > 0
        ? Number(guestsRaw)
        : 1;

    if (!isValidDateInput(startDate) || !isValidDateInput(endDate)) {
        return NextResponse.json(
            {
                success: false,
                error: 'Informe `startDate` e `endDate` no formato YYYY-MM-DD.',
            },
            { status: 400 }
        );
    }

    if (new Date(endDate) < new Date(startDate)) {
        return NextResponse.json(
            {
                success: false,
                error: 'A data final não pode ser menor que a data inicial.',
            },
            { status: 400 }
        );
    }

    try {
        const items = await getRoomAvailability({
            startDate,
            endDate,
            propertyID,
            adults: guests,
        });

        return NextResponse.json({
            success: true,
            count: items.length,
            items,
        });
    } catch (error: any) {
        console.error('❌ Erro ao consultar disponibilidade no Cloudbeds:', error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || 'Falha ao consultar disponibilidade no Cloudbeds.',
            },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createCloudbedsReservation } from '@/lib/cloudbeds';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body?.startDate || !body?.endDate || !body?.firstName || !body?.lastName || !body?.email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Campos mínimos obrigatórios: startDate, endDate, firstName, lastName e email.',
                },
                { status: 400 }
            );
        }

        const result = await createCloudbedsReservation(body);

        return NextResponse.json({
            success: true,
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

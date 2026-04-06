import { NextResponse } from 'next/server';

import { validateBookingCoupon } from '../../../../lib/booking-coupons';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = validateBookingCoupon(body || {});

        if (!result.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.message,
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message,
            coupon: result.coupon,
        });
    } catch {
        return NextResponse.json(
            {
                success: false,
                error: 'Não foi possível validar o cupom informado.',
            },
            { status: 500 }
        );
    }
}

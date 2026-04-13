import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedBookingCoupons } from '../../../../lib/booking-coupons';

export const dynamic = 'force-dynamic';

/**
 * GET /api/coupons/featured
 * Lista cupons ativos e em destaque para exibição no frontend.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hotelId = searchParams.get('hotelId') || undefined;
        const coupons = await getFeaturedBookingCoupons(hotelId);

        return NextResponse.json({
            success: true,
            coupons: coupons.map(c => ({
                code: c.code,
                label: c.label,
                description: c.description,
            })),
        });
    } catch {
        return NextResponse.json({ success: true, coupons: [] });
    }
}

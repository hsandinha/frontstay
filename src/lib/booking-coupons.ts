import { getSupabaseAdmin } from './supabase-admin';

export type BookingCouponRule = {
    code: string;
    label: string;
    description: string;
    type: 'percent' | 'fixed';
    value: number;
    minTotal?: number;
    minNights?: number;
    hotelIds?: string[];
    expiresAt?: string;
    active: boolean;
};

export type AppliedBookingCoupon = {
    code: string;
    label: string;
    description: string;
    discountAmount: number;
    finalAmount: number;
    formattedDiscountAmount: string;
    formattedFinalAmount: string;
};

export type ValidateBookingCouponInput = {
    code?: string;
    hotelId?: string;
    totalAmount?: number;
    nightCount?: number;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export function formatCurrency(value: number) {
    return currencyFormatter.format(Math.max(0, value || 0));
}

/**
 * Busca cupons ativos do banco de dados.
 */
async function fetchCouponsFromDB(): Promise<BookingCouponRule[]> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar cupons:', error.message);
            return [];
        }

        return (data || []).map(c => ({
            code: c.code,
            label: c.label,
            description: c.description || '',
            type: c.type as 'percent' | 'fixed',
            value: Number(c.value),
            minTotal: c.min_total ? Number(c.min_total) : undefined,
            minNights: c.min_nights ? Number(c.min_nights) : undefined,
            hotelIds: c.hotel_ids || [],
            expiresAt: c.expires_at || undefined,
            active: c.active,
        }));
    } catch (err) {
        console.error('Erro ao buscar cupons:', err);
        return [];
    }
}

export async function getFeaturedBookingCoupons(hotelId?: string) {
    const coupons = await fetchCouponsFromDB();
    return coupons.filter((coupon) => {
        if (!coupon.active) return false;
        // Filtra expirados
        if (coupon.expiresAt) {
            const expiresAt = new Date(`${coupon.expiresAt}T23:59:59`);
            if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) return false;
        }
        if (!hotelId || !coupon.hotelIds || coupon.hotelIds.length === 0) return true;
        return coupon.hotelIds.includes(hotelId);
    });
}

export async function validateBookingCoupon(input: ValidateBookingCouponInput) {
    const normalizedCode = input.code?.trim().toUpperCase() || '';
    const totalAmount = Number(input.totalAmount) || 0;
    const nightCount = Number(input.nightCount) || 0;
    const hotelId = input.hotelId || '';

    if (!normalizedCode) {
        return {
            valid: false,
            message: 'Informe um cupom para aplicar o desconto.',
        };
    }

    if (totalAmount <= 0) {
        return {
            valid: false,
            message: 'Selecione um período disponível antes de aplicar o cupom.',
        };
    }

    // Busca cupons do banco
    const coupons = await fetchCouponsFromDB();
    const coupon = coupons.find((item) => item.code === normalizedCode);

    if (!coupon || !coupon.active) {
        return {
            valid: false,
            message: 'Cupom não encontrado ou indisponível no momento.',
        };
    }

    if (coupon.hotelIds?.length && !coupon.hotelIds.includes(hotelId)) {
        return {
            valid: false,
            message: 'Esse cupom não é válido para a hospedagem selecionada.',
        };
    }

    if (coupon.expiresAt) {
        const expiresAt = new Date(`${coupon.expiresAt}T23:59:59`);

        if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
            return {
                valid: false,
                message: 'Esse cupom expirou e não pode mais ser utilizado.',
            };
        }
    }

    if (coupon.minTotal && totalAmount < coupon.minTotal) {
        return {
            valid: false,
            message: `Esse cupom exige um valor mínimo de ${formatCurrency(coupon.minTotal)}.`,
        };
    }

    if (coupon.minNights && nightCount < coupon.minNights) {
        return {
            valid: false,
            message: `Esse cupom exige pelo menos ${coupon.minNights} noite(s) na reserva.`,
        };
    }

    const calculatedDiscount = coupon.type === 'percent'
        ? totalAmount * (coupon.value / 100)
        : coupon.value;

    const discountAmount = Math.min(calculatedDiscount, totalAmount);
    const finalAmount = Math.max(totalAmount - discountAmount, 0);

    return {
        valid: true,
        message: `Cupom ${coupon.code} aplicado com sucesso.`,
        coupon: {
            code: coupon.code,
            label: coupon.label,
            description: coupon.description,
            discountAmount,
            finalAmount,
            formattedDiscountAmount: formatCurrency(discountAmount),
            formattedFinalAmount: formatCurrency(finalAmount),
        } satisfies AppliedBookingCoupon,
    };
}

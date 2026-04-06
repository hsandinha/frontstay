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

const BOOKING_COUPONS: BookingCouponRule[] = [
    {
        code: 'BEMVINDO10',
        label: '10% OFF',
        description: 'Desconto de boas-vindas para reservas a partir de R$ 350.',
        type: 'percent',
        value: 10,
        minTotal: 350,
        hotelIds: ['inhouse'],
        expiresAt: '2026-12-31',
        active: true,
    },
    {
        code: 'LONGSTAY150',
        label: 'R$ 150 OFF',
        description: 'Economize R$ 150 em hospedagens com 3 noites ou mais.',
        type: 'fixed',
        value: 150,
        minTotal: 900,
        minNights: 3,
        hotelIds: ['inhouse'],
        expiresAt: '2026-12-31',
        active: true,
    },
    {
        code: 'FRONT5',
        label: '5% OFF',
        description: 'Desconto rápido para fechar sua reserva hoje.',
        type: 'percent',
        value: 5,
        minTotal: 250,
        hotelIds: ['inhouse'],
        expiresAt: '2026-12-31',
        active: true,
    },
];

export function formatCurrency(value: number) {
    return currencyFormatter.format(Math.max(0, value || 0));
}

export function getFeaturedBookingCoupons(hotelId?: string) {
    return BOOKING_COUPONS.filter((coupon) => {
        if (!coupon.active) return false;
        if (!hotelId || !coupon.hotelIds || coupon.hotelIds.length === 0) return true;
        return coupon.hotelIds.includes(hotelId);
    });
}

export function validateBookingCoupon(input: ValidateBookingCouponInput) {
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

    const coupon = BOOKING_COUPONS.find((item) => item.code === normalizedCode);

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

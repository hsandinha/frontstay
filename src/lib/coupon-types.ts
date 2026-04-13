/**
 * Tipos e utilitários de cupons usáveis no client-side.
 */

export type AppliedBookingCoupon = {
    code: string;
    label: string;
    description: string;
    discountAmount: number;
    finalAmount: number;
    formattedDiscountAmount: string;
    formattedFinalAmount: string;
};

export type FeaturedCoupon = {
    code: string;
    label: string;
    description: string;
};

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

export function formatCurrency(value: number) {
    return currencyFormatter.format(Math.max(0, value || 0));
}

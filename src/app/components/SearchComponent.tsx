'use client';

import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrency, getFeaturedBookingCoupons, type AppliedBookingCoupon } from '../../lib/booking-coupons';

type AvailabilityStatus = 'available' | 'unavailable' | 'neutral';

export type SearchFilters = {
    hotelId: string;
    hotelLabel: string;
    guests: number;
    startDate: string;
    endDate: string;
    amenities: string[];
};

export type CalendarAvailabilityDay = {
    date: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isSelectedRange: boolean;
    availability: AvailabilityStatus;
    rate: number | null;
};

export type AvailableProperty = {
    id: number;
    nome: string;
    endereco: string;
    preco: number;
    imagem: string;
    fotos?: string[];
    disponiveis?: number;
    origem?: 'cloudbeds' | 'catalogo';
    descricao?: string;
    propertyId?: string | null;
    roomTypeId?: string | null;
    ratePlanId?: string | null;
    maxGuests?: number | null;
    amenities?: string[];
};

interface SearchComponentProps {
    onSearch?: (filters: SearchFilters) => Promise<void> | void;
    isLoading?: boolean;
    calendarDays?: CalendarAvailabilityDay[];
    calendarMonthLabel?: string;
    dailyRateText?: string;
    totalStayText?: string;
    totalStayAmount?: number;
    nightCount?: number;
    availableProperties?: AvailableProperty[];
    feedbackMessage?: string;
    searchStatus?: 'idle' | 'loading' | 'success' | 'error';
}

const hotelOptions = [
    { label: 'InHouse', value: 'inhouse' },
];

const amenityOptions = [
    { label: 'Academia', value: 'gym', emoji: '🏃‍♂️' },
    { label: 'Co-working', value: 'coworking', emoji: '💼' },
    { label: 'Estacionamento', value: 'parking', emoji: '🚗' },
    { label: 'Lavanderia', value: 'laundry', emoji: '🧺' },
    { label: 'Recepção 24h', value: 'front-desk', emoji: '🏨' },
    { label: 'Piscina', value: 'pool', emoji: '🏊' },
];

const weekDayHeaders = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function toInputDate(date: Date) {
    return date.toISOString().split('T')[0];
}

function parseDate(value: string) {
    return new Date(`${value}T12:00:00`);
}

function formatMonthLabel(value: string) {
    const label = parseDate(value).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });

    return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatDisplayDate(value: string) {
    return parseDate(value).toLocaleDateString('pt-BR');
}

function getDefaultDates() {
    const start = new Date();
    start.setDate(start.getDate() + 7);

    const end = new Date();
    end.setDate(end.getDate() + 8);

    return {
        startDate: toInputDate(start),
        endDate: toInputDate(end),
    };
}

function buildNeutralCalendar(startDate: string, endDate: string): CalendarAvailabilityDay[] {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const firstDayOfMonth = new Date(start.getFullYear(), start.getMonth(), 1, 12);
    const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0, 12);
    const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
    const totalCells = startWeekDay + lastDayOfMonth.getDate() > 35 ? 42 : 35;
    const gridStart = new Date(firstDayOfMonth);

    gridStart.setDate(firstDayOfMonth.getDate() - startWeekDay);

    return Array.from({ length: totalCells }, (_, index) => {
        const current = new Date(gridStart);
        current.setDate(gridStart.getDate() + index);

        return {
            date: toInputDate(current),
            dayNumber: current.getDate(),
            isCurrentMonth: current.getMonth() === start.getMonth(),
            isSelectedRange: current >= start && current <= end,
            availability: 'neutral' as const,
            rate: null,
        };
    });
}

function shiftMonthDate(value: string, amount: number) {
    const base = parseDate(value);
    return toInputDate(new Date(base.getFullYear(), base.getMonth() + amount, 1, 12));
}

function normalizeImageSrc(value: string) {
    if (!value) return '/logo.png';
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
        return value;
    }

    return `/${value}`;
}

const defaultDates = getDefaultDates();

const SearchComponent = ({
    onSearch,
    isLoading = false,
    calendarDays = [],
    calendarMonthLabel,
    dailyRateText = 'Selecione um período para consultar a diária no Cloudbeds.',
    totalStayText = 'Total a calcular',
    totalStayAmount = 0,
    nightCount = 0,
    availableProperties = [],
    feedbackMessage = '',
    searchStatus = 'idle',
}: SearchComponentProps) => {
    const [hotelId, setHotelId] = useState('inhouse');
    const [hospedes, setHospedes] = useState(1);
    const [dataInicio, setDataInicio] = useState(defaultDates.startDate);
    const [dataFim, setDataFim] = useState(defaultDates.endDate);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
    const [modalStep, setModalStep] = useState<'calendar' | 'details' | 'guest' | 'payment'>('calendar');
    const [calendarFeedback, setCalendarFeedback] = useState('');
    const [displayedMonth, setDisplayedMonth] = useState(defaultDates.startDate);
    const [guestForm, setGuestForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        document: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'pix'>('credit');
    const [cardForm, setCardForm] = useState({
        holderName: '',
        number: '',
        expiry: '',
        cvv: '',
    });
    const [couponCode, setCouponCode] = useState('');
    const [couponFeedback, setCouponFeedback] = useState('');
    const [couponFeedbackTone, setCouponFeedbackTone] = useState<'neutral' | 'success' | 'error'>('neutral');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedBookingCoupon | null>(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const [isSubmittingReservation, setIsSubmittingReservation] = useState(false);
    const [reservationFeedback, setReservationFeedback] = useState('');
    const [reservationFeedbackTone, setReservationFeedbackTone] = useState<'neutral' | 'success' | 'error'>('neutral');

    const selectedHotel = useMemo(
        () => hotelOptions.find((hotel) => hotel.value === hotelId) ?? hotelOptions[0],
        [hotelId]
    );

    const previewDays = calendarDays.length > 0 ? calendarDays : buildNeutralCalendar(dataInicio, dataFim);
    const primaryProperty = useMemo(() => {
        if (availableProperties.length === 0) {
            return undefined;
        }

        return availableProperties.find((property) => property.id === selectedPropertyId) ?? availableProperties[0];
    }, [availableProperties, selectedPropertyId]);
    const propertyGallery = useMemo(() => {
        if (!primaryProperty) {
            return ['/logo.png'];
        }

        const sources = [primaryProperty.imagem, ...(primaryProperty.fotos || [])]
            .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
            .map((value) => normalizeImageSrc(value));

        return Array.from(new Set(sources));
    }, [primaryProperty]);
    const primaryPropertyImage = propertyGallery[selectedPhotoIndex] || propertyGallery[0] || '/logo.png';
    const featuredCoupons = useMemo(() => getFeaturedBookingCoupons(hotelId), [hotelId]);
    const summaryBaseTotalText = totalStayAmount > 0 ? formatCurrency(totalStayAmount) : totalStayText;
    const summaryFinalTotalText = appliedCoupon ? appliedCoupon.formattedFinalAmount : summaryBaseTotalText;

    const calendarDataMap = useMemo(
        () => new Map(previewDays.map((day) => [day.date, day])),
        [previewDays]
    );

    useEffect(() => {
        if (availableProperties.length === 0) {
            setSelectedPropertyId(null);
            return;
        }

        setSelectedPropertyId((current) => {
            if (current !== null && availableProperties.some((property) => property.id === current)) {
                return current;
            }

            return availableProperties[0].id;
        });
    }, [availableProperties]);

    useEffect(() => {
        setSelectedPhotoIndex(0);
        setIsPhotoLightboxOpen(false);
    }, [primaryProperty?.id]);

    const handleSelectPreviousPhoto = () => {
        setSelectedPhotoIndex((current) =>
            current === 0 ? propertyGallery.length - 1 : current - 1
        );
    };

    const handleSelectNextPhoto = () => {
        setSelectedPhotoIndex((current) =>
            current === propertyGallery.length - 1 ? 0 : current + 1
        );
    };

    const modalCalendarDays = useMemo(() => {
        const monthStart = parseDate(displayedMonth);
        const rangeStart = parseDate(dataInicio);
        const rangeEnd = parseDate(dataFim);
        const firstDayOfMonth = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1, 12);
        const lastDayOfMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 12);
        const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
        const totalCells = startWeekDay + lastDayOfMonth.getDate() > 35 ? 42 : 35;
        const gridStart = new Date(firstDayOfMonth);

        gridStart.setDate(firstDayOfMonth.getDate() - startWeekDay);

        return Array.from({ length: totalCells }, (_, index) => {
            const current = new Date(gridStart);
            current.setDate(gridStart.getDate() + index);
            const dateKey = toInputDate(current);
            const existing = calendarDataMap.get(dateKey);

            return {
                date: dateKey,
                dayNumber: current.getDate(),
                isCurrentMonth: current.getMonth() === monthStart.getMonth(),
                isSelectedRange: current >= rangeStart && current <= rangeEnd,
                availability: existing?.availability || 'neutral',
                rate: existing?.rate ?? null,
            };
        });
    }, [calendarDataMap, dataFim, dataInicio, displayedMonth]);

    const resetReservationState = () => {
        setReservationFeedback('');
        setReservationFeedbackTone('neutral');
    };

    const resetCouponState = (clearInput = false) => {
        setAppliedCoupon(null);
        setCouponFeedback('');
        setCouponFeedbackTone('neutral');

        if (clearInput) {
            setCouponCode('');
        }
    };

    const handleAmenityToggle = (value: string) => {
        setSelectedAmenities((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };

    const handleSearch = async (overrides?: Partial<SearchFilters>) => {
        await onSearch?.({
            hotelId: overrides?.hotelId ?? hotelId,
            hotelLabel: overrides?.hotelLabel ?? selectedHotel.label,
            guests: overrides?.guests ?? hospedes,
            startDate: overrides?.startDate ?? dataInicio,
            endDate: overrides?.endDate ?? dataFim,
            amenities: overrides?.amenities ?? selectedAmenities,
        });
    };

    const handleGuestCountChange = async (nextValue: number) => {
        const safeValue = Math.max(1, nextValue);
        setHospedes(safeValue);
        resetCouponState();

        if (isCalendarModalOpen) {
            await handleSearch({
                guests: safeValue,
                startDate: dataInicio,
                endDate: dataFim,
            });
        }
    };

    const rangeHasUnavailableDays = (startDate: string, endDate: string) => {
        const start = parseDate(startDate);
        const end = parseDate(endDate);

        for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
            const currentDay = calendarDataMap.get(toInputDate(cursor));

            if (!currentDay || currentDay.availability !== 'available') {
                return true;
            }
        }

        return false;
    };

    const openCalendarModal = async () => {
        setSelectionStep('start');
        setModalStep('calendar');
        setCalendarFeedback('');
        setDisplayedMonth(dataInicio);
        setIsCalendarModalOpen(true);

        if (!isLoading) {
            await handleSearch();
        }
    };

    const handleModalDayClick = async (day: CalendarAvailabilityDay) => {
        if (!day.isCurrentMonth) return;

        if (isLoading) {
            setCalendarFeedback('Consultando disponibilidade no Cloudbeds, aguarde um instante.');
            return;
        }

        if (day.availability !== 'available') {
            setCalendarFeedback('Dia indisponível, favor selecionar os dias disponíveis destacados em verde.');
            return;
        }

        if (selectionStep === 'start') {
            setDataInicio(day.date);
            setDataFim(day.date);
            setSelectionStep('end');
            setCalendarFeedback('');
            resetCouponState();
            return;
        }

        const nextStartDate = dataInicio;
        const nextEndDate = parseDate(day.date) < parseDate(nextStartDate) ? nextStartDate : day.date;

        if (rangeHasUnavailableDays(nextStartDate, nextEndDate)) {
            setCalendarFeedback('Dia indisponível, favor selecionar os dias disponíveis destacados em verde.');
            return;
        }

        setDataFim(nextEndDate);
        setCalendarFeedback('');
        resetCouponState();
        await handleSearch({ startDate: nextStartDate, endDate: nextEndDate });
        setModalStep('details');
    };

    const handleGuestFormChange = (field: keyof typeof guestForm, value: string) => {
        setGuestForm((current) => ({ ...current, [field]: value }));
        resetReservationState();
    };

    const handleCardFormChange = (field: keyof typeof cardForm, value: string) => {
        setCardForm((current) => ({ ...current, [field]: value }));
        resetReservationState();
    };

    const isGuestStepReady = Boolean(
        guestForm.firstName &&
        guestForm.lastName &&
        guestForm.email &&
        guestForm.phone &&
        guestForm.document
    );

    const isCardPayment = paymentMethod === 'credit' || paymentMethod === 'debit';
    const isPaymentReady = paymentMethod === 'pix'
        ? true
        : Boolean(
            cardForm.holderName &&
            cardForm.number &&
            cardForm.expiry &&
            cardForm.cvv
        );

    const handleApplyCoupon = async () => {
        const normalizedCode = couponCode.trim().toUpperCase();

        if (!normalizedCode) {
            setAppliedCoupon(null);
            setCouponFeedback('Informe um cupom para aplicar o desconto.');
            setCouponFeedbackTone('error');
            return;
        }

        if (totalStayAmount <= 0 || nightCount <= 0) {
            setAppliedCoupon(null);
            setCouponFeedback('Selecione um período disponível antes de validar o cupom.');
            setCouponFeedbackTone('error');
            return;
        }

        setIsApplyingCoupon(true);
        setCouponFeedback('');
        setCouponFeedbackTone('neutral');

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: normalizedCode,
                    hotelId,
                    totalAmount: totalStayAmount,
                    nightCount,
                }),
            });

            const payload = await response.json();

            if (!response.ok || !payload?.success || !payload?.coupon) {
                throw new Error(payload?.error || 'Não foi possível validar o cupom informado.');
            }

            setCouponCode(normalizedCode);
            setAppliedCoupon(payload.coupon as AppliedBookingCoupon);
            setCouponFeedback(payload?.message || `Cupom ${normalizedCode} aplicado com sucesso.`);
            setCouponFeedbackTone('success');
        } catch (error: any) {
            setAppliedCoupon(null);
            setCouponFeedback(error?.message || 'Não foi possível validar o cupom informado.');
            setCouponFeedbackTone('error');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponFeedback('Cupom removido da sua hospedagem.');
        setCouponFeedbackTone('neutral');
    };

    const handleProceedToInter = async () => {
        if (!isPaymentReady || !primaryProperty) {
            return;
        }

        if (!primaryProperty.propertyId || !primaryProperty.roomTypeId) {
            setReservationFeedback('Não foi possível identificar a unidade no Cloudbeds para concluir a reserva.');
            setReservationFeedbackTone('error');
            return;
        }

        setIsSubmittingReservation(true);
        setReservationFeedback('Confirmando reserva...');
        setReservationFeedbackTone('neutral');

        try {
            const response = await fetch('/api/cloudbeds/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: primaryProperty.propertyId,
                    roomTypeId: primaryProperty.roomTypeId,
                    ratePlanId: primaryProperty.ratePlanId,
                    startDate: dataInicio,
                    endDate: dataFim,
                    firstName: guestForm.firstName.trim(),
                    lastName: guestForm.lastName.trim(),
                    email: guestForm.email.trim(),
                    phone: guestForm.phone.trim(),
                    document: guestForm.document.trim(),
                    adults: hospedes,
                    paymentMethod,
                    promoCode: appliedCoupon?.code,
                    totalAmount: appliedCoupon?.finalAmount ?? totalStayAmount,
                    roomName: primaryProperty.nome,
                }),
            });

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error || 'Não foi possível concluir a reserva no Cloudbeds.');
            }

            const reservationId = payload?.reservationId ?? payload?.data?.reservationID ?? payload?.data?.reservationId ?? null;

            if (typeof window !== 'undefined') {
                window.localStorage.setItem('frontstay-guest-session', JSON.stringify({
                    email: guestForm.email.trim(),
                    name: `${guestForm.firstName.trim()} ${guestForm.lastName.trim()}`.trim(),
                }));
            }

            const successMessage = payload?.message
                || (reservationId
                    ? `Reserva ${reservationId} criada com sucesso.`
                    : 'Reserva criada com sucesso.');

            setReservationFeedback(successMessage);
            setReservationFeedbackTone('success');
        } catch (error: any) {
            setReservationFeedback(error?.message || 'Não foi possível concluir a reserva no Cloudbeds.');
            setReservationFeedbackTone('error');
        } finally {
            setIsSubmittingReservation(false);
        }
    };

    const getDayClasses = (day: CalendarAvailabilityDay) => {
        if (!day.isCurrentMonth) {
            return 'border-transparent bg-slate-100 text-slate-300';
        }

        if (day.isSelectedRange && day.availability === 'available') {
            return 'border-emerald-300 bg-emerald-100 text-emerald-900';
        }

        if (day.isSelectedRange && day.availability === 'unavailable') {
            return 'border-rose-300 bg-rose-100 text-rose-900';
        }

        if (day.availability === 'available') {
            return 'border-emerald-200 bg-emerald-50 text-emerald-900';
        }

        if (day.availability === 'unavailable') {
            return 'border-rose-200 bg-rose-50 text-rose-900';
        }

        if (day.isSelectedRange) {
            return 'border-sky-200 bg-sky-50 text-sky-900';
        }

        return 'border-slate-200 bg-white text-slate-700';
    };

    const renderCalendarGrid = (days: CalendarAvailabilityDay[], compact = false) => (
        <>
            <div className="mt-3 grid grid-cols-7 gap-2">
                {weekDayHeaders.map((label) => (
                    <div key={label} className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </div>
                ))}

                {days.map((day) => (
                    <button
                        key={day.date}
                        type="button"
                        onClick={() => handleModalDayClick(day)}
                        className={`${compact ? 'min-h-[84px]' : 'min-h-[76px]'} rounded-lg border p-2 text-left transition ${getDayClasses(day)} ${day.isCurrentMonth ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="text-sm font-semibold">{day.dayNumber}</div>
                            {day.isSelectedRange && day.isCurrentMonth ? (
                                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                            ) : null}
                        </div>
                        <div className="mt-4 text-[11px] font-semibold">
                            {day.rate ? `R$ ${Math.round(day.rate).toLocaleString('pt-BR')}` : ' '}
                        </div>
                    </button>
                ))}
            </div>
        </>
    );

    return (
        <>
            <div className="w-full bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1.6fr_88px] gap-2 items-end mb-4">
                    <div>
                        <label className="block text-xs font-questa-regular text-black mb-1">Hotel</label>
                        <div className="relative">
                            <select
                                value={hotelId}
                                onChange={(e) => {
                                    setHotelId(e.target.value);
                                    resetCouponState(true);
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs text-black font-questa-regular focus:ring-1 focus:ring-primary-teal focus:border-primary-teal appearance-none bg-white"
                            >
                                {hotelOptions.map((hotel) => (
                                    <option key={hotel.value} value={hotel.value}>
                                        {hotel.label}
                                    </option>
                                ))}
                            </select>
                            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-questa-regular text-black mb-1">Período</label>
                        <button
                            type="button"
                            onClick={openCalendarModal}
                            className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-xs text-black transition hover:border-primary-teal hover:bg-slate-50"
                        >
                            <span>{formatDisplayDate(dataInicio)} → {formatDisplayDate(dataFim)}</span>
                            <span>📅</span>
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-questa-regular text-gray-600 mb-1">Hóspedes</label>
                        <div className="flex items-center justify-center gap-1 border border-gray-200 rounded-md px-1 py-2 bg-white w-16 text-black">
                            <button
                                type="button"
                                onClick={() => setHospedes(Math.max(1, hospedes - 1))}
                                className="w-3 h-3 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
                            >
                                <span className="text-[10px] font-bold">−</span>
                            </button>
                            <span className="text-center font-questa-regular text-xs min-w-[12px]">{hospedes}</span>
                            <button
                                type="button"
                                onClick={() => setHospedes(hospedes + 1)}
                                className="w-3 h-3 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
                            >
                                <span className="text-[10px] font-bold">+</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 flex items-center justify-center flex-col">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {amenityOptions.map((option) => {
                            const selected = selectedAmenities.includes(option.value);

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleAmenityToggle(option.value)}
                                    className={`flex items-center gap-1 px-3 py-1 border rounded-full transition-all text-xs text-black font-questa-regular ${selected
                                        ? 'border-primary-teal bg-teal-50'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                                        }`}
                                >
                                    <span className="text-sm">{option.emoji}</span>
                                    {option.label}
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 ml-1"
                                        checked={selected}
                                        readOnly
                                    />
                                </button>
                            );
                        })}
                    </div>

                </div>
            </div>

            {isCalendarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl">
                        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-950">
                                    {modalStep === 'calendar'
                                        ? 'Selecionar período'
                                        : modalStep === 'details'
                                            ? 'Sua hospedagem'
                                            : modalStep === 'guest'
                                                ? 'Seu cadastro'
                                                : 'Pagamento'}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {modalStep === 'calendar'
                                        ? `${selectionStep === 'start' ? 'Escolha a data de entrada' : 'Agora escolha a data de saída'} • ${selectedHotel.label}`
                                        : modalStep === 'details'
                                            ? `Revise sua hospedagem e ajuste os hóspedes • ${selectedHotel.label}`
                                            : modalStep === 'guest'
                                                ? `Preencha seus dados para continuar • ${selectedHotel.label}`
                                                : `Escolha como deseja pagar • ${selectedHotel.label}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDisplayedMonth(shiftMonthDate(displayedMonth, -1))}
                                    className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    ←
                                </button>
                                <span className="min-w-[160px] text-center text-sm font-medium text-slate-800">
                                    {formatMonthLabel(displayedMonth)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setDisplayedMonth(shiftMonthDate(displayedMonth, 1))}
                                    className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    →
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsCalendarModalOpen(false)}
                                    className="ml-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>

                        <div className={`mt-4 grid items-start gap-4 ${modalStep === 'calendar' ? 'lg:grid-cols-[1.35fr_0.9fr]' : 'lg:grid-cols-[minmax(0,1fr)_340px]'}`}>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                {modalStep === 'calendar' ? (
                                    <>
                                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                                                Disponível
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                                                Indisponível
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <span className="h-2.5 w-2.5 rounded-full bg-sky-500"></span>
                                                Período selecionado
                                            </span>
                                        </div>

                                        {searchStatus !== 'idle' && feedbackMessage ? (
                                            <div className={`mt-3 rounded-lg border px-3 py-2 text-sm ${searchStatus === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : searchStatus === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
                                                {feedbackMessage}
                                            </div>
                                        ) : null}

                                        {calendarFeedback ? (
                                            <div className={`mt-3 rounded-lg border px-3 py-2 text-sm ${calendarFeedback.includes('indisponível') ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
                                                {calendarFeedback}
                                            </div>
                                        ) : null}

                                        {renderCalendarGrid(modalCalendarDays, true)}
                                    </>
                                ) : primaryProperty ? (
                                    <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                                        <div className="p-3 md:p-4">
                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setIsPhotoLightboxOpen(true)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        event.preventDefault();
                                                        setIsPhotoLightboxOpen(true);
                                                    }
                                                }}
                                                className="group relative overflow-hidden rounded-xl bg-slate-100 outline-none focus:ring-2 focus:ring-emerald-300"
                                                aria-label="Ampliar foto da hospedagem"
                                            >
                                                <div className="relative aspect-[5/4] md:aspect-[4/3]">
                                                    <Image
                                                        src={primaryPropertyImage}
                                                        alt={primaryProperty.nome}
                                                        fill
                                                        sizes="(min-width: 1024px) 36vw, 100vw"
                                                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                                    />
                                                </div>

                                                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                                                    <div className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                                        {selectedPhotoIndex + 1}/{propertyGallery.length}
                                                    </div>
                                                    {primaryProperty.origem === 'cloudbeds' ? (
                                                        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">Cloudbeds</span>
                                                    ) : null}
                                                </div>

                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/10 to-transparent px-3 pb-3 pt-8 text-white">
                                                    <span className="text-xs font-medium">Clique para ampliar</span>
                                                    <span className="rounded-full bg-white/15 px-2 py-1 text-[11px] font-semibold backdrop-blur-sm">Zoom</span>
                                                </div>

                                                {propertyGallery.length > 1 ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                handleSelectPreviousPhoto();
                                                            }}
                                                            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                                                            aria-label="Foto anterior"
                                                        >
                                                            ←
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                handleSelectNextPhoto();
                                                            }}
                                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                                                            aria-label="Próxima foto"
                                                        >
                                                            →
                                                        </button>
                                                    </>
                                                ) : null}
                                            </div>

                                            {propertyGallery.length > 1 ? (
                                                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                                                    {propertyGallery.map((photo, index) => (
                                                        <button
                                                            key={`${photo}-${index}`}
                                                            type="button"
                                                            onClick={() => setSelectedPhotoIndex(index)}
                                                            className={`relative aspect-square overflow-hidden rounded-lg border transition ${selectedPhotoIndex === index ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-slate-300'}`}
                                                        >
                                                            <Image
                                                                src={photo}
                                                                alt={`${primaryProperty.nome} foto ${index + 1}`}
                                                                fill
                                                                sizes="72px"
                                                                className="object-cover"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : null}

                                            <div className="mt-4 flex items-start justify-between gap-3">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-slate-950">{primaryProperty.nome}</h4>
                                                    <p className="mt-1 text-sm text-slate-600">{primaryProperty.endereco}</p>
                                                </div>
                                            </div>
                                            {primaryProperty.descricao ? (
                                                <p className="mt-3 text-xs leading-relaxed text-slate-500">{primaryProperty.descricao}</p>
                                            ) : null}

                                            {primaryProperty.maxGuests || (primaryProperty.amenities && primaryProperty.amenities.length > 0) ? (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {primaryProperty.maxGuests ? (
                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                                                            Até {primaryProperty.maxGuests} hóspede(s)
                                                        </span>
                                                    ) : null}
                                                    {(primaryProperty.amenities || []).slice(0, 4).map((amenity) => (
                                                        <span
                                                            key={amenity}
                                                            className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : null}

                                            <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                                                <div>
                                                    <div className="text-xs text-slate-500">Diária</div>
                                                    <div className="font-semibold text-slate-950">R$ {primaryProperty.preco.toLocaleString('pt-BR')}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-slate-500">Disponibilidade</div>
                                                    <div className="font-semibold text-emerald-700">
                                                        {typeof primaryProperty.disponiveis === 'number'
                                                            ? `${primaryProperty.disponiveis} unidade(s)`
                                                            : 'Sob consulta'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
                                        Selecione um período disponível para visualizar sua hospedagem.
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                                {modalStep === 'calendar' ? (
                                    <>
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-slate-500">Resumo da seleção</div>
                                            <div className="mt-1 text-sm text-slate-700">{formatDisplayDate(dataInicio)} → {formatDisplayDate(dataFim)}</div>
                                        </div>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="flex items-center justify-between gap-3">
                                                <span>Hóspedes</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { void handleGuestCountChange(hospedes - 1); }}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white disabled:opacity-50"
                                                        disabled={isLoading || hospedes <= 1}
                                                    >
                                                        −
                                                    </button>
                                                    <strong className="min-w-[18px] text-center">{hospedes}</strong>
                                                    <button
                                                        type="button"
                                                        onClick={() => { void handleGuestCountChange(hospedes + 1); }}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white disabled:opacity-50"
                                                        disabled={isLoading}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between gap-3">
                                                <span>Diária atual</span>
                                                <strong>{dailyRateText}</strong>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between gap-3">
                                                <span>Total estimado</span>
                                                <strong>{totalStayText}</strong>
                                            </div>
                                        </div>
                                        {isLoading ? (
                                            <div className="text-sm text-slate-500">
                                                Atualizando disponibilidade automaticamente...
                                            </div>
                                        ) : null}
                                    </>
                                ) : modalStep === 'details' ? (
                                    <>
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-slate-500">Etapa 1 de 3</div>
                                            <div className="text-base font-semibold text-slate-950">Revise sua hospedagem</div>
                                        </div>

                                        {availableProperties.length > 1 ? (
                                            <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Escolha sua unidade</div>
                                                <div className="space-y-2">
                                                    {availableProperties.map((property) => {
                                                        const isSelected = property.id === primaryProperty?.id;

                                                        return (
                                                            <button
                                                                key={property.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedPropertyId(property.id);
                                                                    resetReservationState();
                                                                }}
                                                                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${isSelected ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'}`}
                                                            >
                                                                <div>
                                                                    <div className="font-semibold">{property.nome}</div>
                                                                    <div className="text-xs text-slate-500">{property.maxGuests ? `Até ${property.maxGuests} hóspede(s)` : property.endereco}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-semibold">R$ {property.preco.toLocaleString('pt-BR')}</div>
                                                                    <div className="text-xs text-slate-500">{typeof property.disponiveis === 'number' ? `${property.disponiveis} unidade(s)` : 'Disponível'}</div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Resumo da hospedagem</div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Hospedagem</span>
                                                    <strong>{selectedHotel.label}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Período</span>
                                                    <strong>{formatDisplayDate(dataInicio)} → {formatDisplayDate(dataFim)}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Hóspedes</span>
                                                    <strong>{hospedes}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Noites</span>
                                                    <strong>{nightCount}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Diária</span>
                                                    <strong>{dailyRateText}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Subtotal</span>
                                                    <strong>{summaryBaseTotalText}</strong>
                                                </div>
                                                {appliedCoupon ? (
                                                    <div className="flex items-center justify-between gap-3 text-emerald-700">
                                                        <span>Cupom ({appliedCoupon.code})</span>
                                                        <strong>- {appliedCoupon.formattedDiscountAmount}</strong>
                                                    </div>
                                                ) : null}
                                                <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 text-base">
                                                    <span className="font-semibold">Total final</span>
                                                    <strong className="text-slate-950">{summaryFinalTotalText}</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cupom de desconto</div>
                                            <div className="flex flex-col gap-2 sm:flex-row">
                                                <input
                                                    type="text"
                                                    placeholder="Digite seu cupom"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponFeedback('');
                                                        setCouponFeedbackTone('neutral');
                                                    }}
                                                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => { void handleApplyCoupon(); }}
                                                    disabled={isApplyingCoupon || !couponCode.trim()}
                                                    className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isApplyingCoupon ? 'Validando...' : 'Aplicar'}
                                                </button>
                                            </div>

                                            {featuredCoupons.length > 0 ? (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {featuredCoupons.map((coupon) => (
                                                        <button
                                                            key={coupon.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setCouponCode(coupon.code);
                                                                setCouponFeedback(`${coupon.label} disponível para esta hospedagem.`);
                                                                setCouponFeedbackTone('neutral');
                                                            }}
                                                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                                                        >
                                                            {coupon.code} • {coupon.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : null}

                                            {couponFeedback ? (
                                                <div className={`mt-3 rounded-lg border px-3 py-2 text-sm ${couponFeedbackTone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : couponFeedbackTone === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                                                    {couponFeedback}
                                                </div>
                                            ) : null}

                                            {appliedCoupon ? (
                                                <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div>
                                                            <div className="font-semibold">{appliedCoupon.label} • {appliedCoupon.code}</div>
                                                            <p className="mt-1 text-emerald-700">{appliedCoupon.description}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveCoupon}
                                                            className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setModalStep('calendar');
                                                    setSelectionStep('start');
                                                    setCalendarFeedback('');
                                                }}
                                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Alterar datas
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setModalStep('guest')}
                                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                                            >
                                                Continuar
                                            </button>
                                        </div>
                                    </>
                                ) : modalStep === 'guest' ? (
                                    <>
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-slate-500">Etapa 2 de 3</div>
                                            <div className="text-base font-semibold text-slate-950">Cadastro do hóspede</div>
                                        </div>

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <input
                                                type="text"
                                                placeholder="Nome"
                                                value={guestForm.firstName}
                                                onChange={(e) => handleGuestFormChange('firstName', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Sobrenome"
                                                value={guestForm.lastName}
                                                onChange={(e) => handleGuestFormChange('lastName', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                            <input
                                                type="email"
                                                placeholder="E-mail"
                                                value={guestForm.email}
                                                onChange={(e) => handleGuestFormChange('email', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 sm:col-span-2"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Telefone"
                                                value={guestForm.phone}
                                                onChange={(e) => handleGuestFormChange('phone', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                            <input
                                                type="text"
                                                placeholder="CPF"
                                                value={guestForm.document}
                                                onChange={(e) => handleGuestFormChange('document', e.target.value)}
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Resumo rápido</div>
                                            <div className="flex items-center justify-between gap-3">
                                                <span>Hospedagem</span>
                                                <strong>{primaryProperty?.nome || selectedHotel.label}</strong>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <span>Subtotal</span>
                                                <strong>{summaryBaseTotalText}</strong>
                                            </div>
                                            {appliedCoupon ? (
                                                <div className="mt-1 flex items-center justify-between gap-3 text-emerald-700">
                                                    <span>Cupom ({appliedCoupon.code})</span>
                                                    <strong>- {appliedCoupon.formattedDiscountAmount}</strong>
                                                </div>
                                            ) : null}
                                            <div className="mt-1 flex items-center justify-between gap-3">
                                                <span>Total final</span>
                                                <strong>{summaryFinalTotalText}</strong>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setModalStep('details')}
                                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setModalStep('payment')}
                                                disabled={!isGuestStepReady}
                                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Ir para pagamento
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-slate-500">Etapa 3 de 3</div>
                                            <div className="text-base font-semibold text-slate-950">Escolha a forma de pagamento</div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPaymentMethod('pix');
                                                    resetReservationState();
                                                }}
                                                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${paymentMethod === 'pix' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                PIX
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPaymentMethod('credit');
                                                    resetReservationState();
                                                }}
                                                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${paymentMethod === 'credit' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                Crédito
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPaymentMethod('debit');
                                                    resetReservationState();
                                                }}
                                                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${paymentMethod === 'debit' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                                            >
                                                Débito
                                            </button>
                                        </div>

                                        {isCardPayment ? (
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                <input
                                                    type="text"
                                                    placeholder="Nome no cartão"
                                                    value={cardForm.holderName}
                                                    onChange={(e) => handleCardFormChange('holderName', e.target.value)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 sm:col-span-2"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Número do cartão"
                                                    value={cardForm.number}
                                                    onChange={(e) => handleCardFormChange('number', e.target.value)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 sm:col-span-2"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Validade"
                                                    value={cardForm.expiry}
                                                    onChange={(e) => handleCardFormChange('expiry', e.target.value)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="CVV"
                                                    value={cardForm.cvv}
                                                    onChange={(e) => handleCardFormChange('cvv', e.target.value)}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                                                <div className="font-semibold">Pagamento via PIX</div>
                                                <p className="mt-1 text-emerald-800">Ao confirmar, o pagamento PIX é gerado pelo Banco Inter.</p>
                                            </div>
                                        )}

                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Resumo final</div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Hospedagem</span>
                                                    <strong>{primaryProperty?.nome || selectedHotel.label}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Hóspedes</span>
                                                    <strong>{hospedes}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Pagamento</span>
                                                    <strong>{paymentMethod === 'pix' ? 'PIX' : paymentMethod === 'credit' ? 'Cartão de crédito' : 'Cartão de débito'}</strong>
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Subtotal</span>
                                                    <strong>{summaryBaseTotalText}</strong>
                                                </div>
                                                {appliedCoupon ? (
                                                    <div className="flex items-center justify-between gap-3 text-emerald-700">
                                                        <span>Cupom ({appliedCoupon.code})</span>
                                                        <strong>- {appliedCoupon.formattedDiscountAmount}</strong>
                                                    </div>
                                                ) : null}
                                                <div className="flex items-center justify-between gap-3">
                                                    <span>Total final</span>
                                                    <strong className="text-slate-950">{summaryFinalTotalText}</strong>
                                                </div>
                                            </div>
                                        </div>

                                        {reservationFeedback ? (
                                            <div className={`rounded-xl border px-3 py-3 text-sm ${reservationFeedbackTone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : reservationFeedbackTone === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
                                                <div>{reservationFeedback}</div>
                                            </div>
                                        ) : null}

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setModalStep('guest')}
                                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Voltar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleProceedToInter}
                                                disabled={!isPaymentReady || isSubmittingReservation}
                                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSubmittingReservation
                                                    ? 'Confirmando...'
                                                    : paymentMethod === 'pix'
                                                        ? 'Gerar PIX e reservar'
                                                        : paymentMethod === 'credit'
                                                            ? 'Confirmar no crédito'
                                                            : 'Confirmar no débito'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isPhotoLightboxOpen && primaryProperty ? (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl">
                        <button
                            type="button"
                            onClick={() => setIsPhotoLightboxOpen(false)}
                            className="absolute right-0 top-0 z-10 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                            Fechar ✕
                        </button>

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                            <div className="relative aspect-[16/10] bg-black">
                                <Image
                                    src={primaryPropertyImage}
                                    alt={`${primaryProperty.nome} ampliada`}
                                    fill
                                    sizes="100vw"
                                    className="object-contain"
                                />

                                <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                    {selectedPhotoIndex + 1}/{propertyGallery.length}
                                </div>

                                {propertyGallery.length > 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSelectPreviousPhoto}
                                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
                                            aria-label="Foto anterior"
                                        >
                                            ←
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSelectNextPhoto}
                                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
                                            aria-label="Próxima foto"
                                        >
                                            →
                                        </button>
                                    </>
                                ) : null}
                            </div>

                            {propertyGallery.length > 1 ? (
                                <div className="grid grid-cols-5 gap-2 border-t border-white/10 bg-slate-900/95 p-3 md:grid-cols-8">
                                    {propertyGallery.map((photo, index) => (
                                        <button
                                            key={`lightbox-${photo}-${index}`}
                                            type="button"
                                            onClick={() => setSelectedPhotoIndex(index)}
                                            className={`relative aspect-square overflow-hidden rounded-lg border transition ${selectedPhotoIndex === index ? 'border-emerald-400 ring-2 ring-emerald-300/40' : 'border-slate-700 hover:border-slate-500'}`}
                                        >
                                            <Image
                                                src={photo}
                                                alt={`${primaryProperty.nome} miniatura ${index + 1}`}
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default SearchComponent;
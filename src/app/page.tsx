'use client';

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchComponent, { AvailableProperty, CalendarAvailabilityDay, SearchFilters } from './components/SearchComponent';
import HeroBanner from './components/HeroBanner';
import PropertyCard from './components/PropertyCard';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
type CalendarPreviewStatus = 'available' | 'unavailable' | 'neutral';

type CalendarPreview = {
    monthLabel: string;
    days: CalendarAvailabilityDay[];
    dailyRateText: string;
    totalStayText: string;
    totalStayAmount: number;
    nightCount: number;
};

type RangeDayInfo = {
    date: string;
    roomsAvailable?: number;
    closedToArrival?: boolean;
    closedToDeparture?: boolean;
    rate?: number | string | null;
    totalRate?: number | string | null;
};

const FALLBACK_PROPERTIES: AvailableProperty[] = [
    {
        id: 1,
        nome: 'FrontStay Esopo Vale do Sereno',
        endereco: 'Alameda Flamboiant, 285 - Vale do Sereno, Nova Lima - MG',
        preco: 400,
        imagem: 'esopo.png',
        origem: 'catalogo',
        slug: 'esopo',
    },
    {
        id: 2,
        nome: 'FrontStay City Santo Agostinho',
        endereco: 'Rua Tenente Brito Melo, 1383 - Santo Agostinho, Belo Horizonte - MG',
        preco: 400,
        imagem: 'citydesign.png',
        origem: 'catalogo',
        slug: 'city',
    },
    {
        id: 3,
        nome: 'FrontStay Ágora Expominas',
        endereco: 'Rua Herculano Pena, 806 - Nova Suíça, Belo Horizonte - MG',
        preco: 400,
        imagem: 'agora.jpg',
        origem: 'catalogo',
        slug: 'agora',
    },
    {
        id: 4,
        nome: 'FrontStay Lourdes',
        endereco: 'Rua Professor Antonio Aleixo, 465 - Lourdes, Belo Horizonte - MG',
        preco: 400,
        imagem: 'lourdes.jpeg',
        origem: 'catalogo',
        slug: 'lourdes',
    },
    {
        id: 5,
        nome: 'FrontStay Savassi',
        endereco: 'Rua Pernambuco, 284 - Savassi, Belo Horizonte - MG',
        preco: 400,
        imagem: 'funcionarios.jpeg',
        origem: 'catalogo',
        slug: 'savassi',
    },
    {
        id: 6,
        nome: 'FrontStay Shopping Cidade',
        endereco: 'Rua São Paulo, 957 - Centro, Belo Horizonte - MG',
        preco: 400,
        imagem: 'centro.jpeg',
        origem: 'catalogo',
        slug: 'shopping-cidade',
    },
    {
        id: 7,
        nome: 'FrontStay Icon Centro',
        endereco: 'Rua Goitacazes - Centro, Belo Horizonte - MG',
        preco: 400,
        imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
        origem: 'catalogo',
        slug: 'icon',
    },
];

function parseDate(value: string) {
    return new Date(`${value}T12:00:00`);
}

function toDateKey(date: Date) {
    return date.toISOString().split('T')[0];
}

function formatMonthLabel(value: string) {
    const label = parseDate(value).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
    });

    return label.charAt(0).toUpperCase() + label.slice(1);
}

function getMonthRange(startValue: string, endValue: string) {
    const startBase = parseDate(startValue);
    const endBase = parseDate(endValue);
    const monthStart = new Date(startBase.getFullYear(), startBase.getMonth(), 1, 12);
    const monthEnd = new Date(endBase.getFullYear(), endBase.getMonth() + 1, 0, 12);

    return {
        monthStart: toDateKey(monthStart),
        monthEnd: toDateKey(monthEnd),
    };
}

function isItemAvailableForRange(item: any, startDate: string, endDate: string) {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const dailyRates = Array.isArray(item?.dailyRates) ? item.dailyRates : [];

    if (dailyRates.length === 0) {
        return (Number(item?.availableRooms) || 0) > 0;
    }

    const byDate = new Map<string, RangeDayInfo>(
        dailyRates
            .filter((day: any): day is RangeDayInfo => typeof day?.date === 'string')
            .map((day: RangeDayInfo) => [day.date, day])
    );

    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
        const key = toDateKey(cursor);
        const day = byDate.get(key);

        if (!day) return false;
        if ((Number(day?.roomsAvailable) || 0) <= 0) return false;
        if (key === startDate && Boolean(day?.closedToArrival)) return false;
        if (key === endDate && Boolean(day?.closedToDeparture)) return false;
    }

    return true;
}

function getRangeMetrics(item: any, startDate: string, endDate: string) {
    const dailyRates = Array.isArray(item?.dailyRates) ? item.dailyRates : [];
    const byDate = new Map<string, RangeDayInfo>(
        dailyRates
            .filter((day: any): day is RangeDayInfo => typeof day?.date === 'string')
            .map((day: RangeDayInfo) => [day.date, day])
    );

    const rates: number[] = [];
    const availabilities: number[] = [];

    for (let cursor = new Date(parseDate(startDate)); cursor <= parseDate(endDate); cursor.setDate(cursor.getDate() + 1)) {
        const day = byDate.get(toDateKey(cursor));
        const value = Number(day?.totalRate || day?.rate) || 0;
        const roomsAvailable = Number(day?.roomsAvailable) || 0;

        if (value > 0) {
            rates.push(value);
        }

        availabilities.push(roomsAvailable);
    }

    const lowestDailyRate = rates.length > 0
        ? Math.min(...rates)
        : Math.round(Number(item?.totalRate || item?.rate) || 0);

    const availableRooms = availabilities.length > 0
        ? Math.min(...availabilities)
        : Number(item?.availableRooms) || 0;

    return {
        lowestDailyRate,
        availableRooms,
    };
}

function buildCalendarPreview(
    startDate: string,
    endDate: string,
    items: any[],
    statusOverride?: CalendarPreviewStatus
): CalendarPreview {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    const firstDayOfMonth = new Date(start.getFullYear(), start.getMonth(), 1, 12);
    const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0, 12);
    const startWeekDay = (firstDayOfMonth.getDay() + 6) % 7;
    const totalCells = startWeekDay + lastDayOfMonth.getDate() > 35 ? 42 : 35;
    const gridStart = new Date(firstDayOfMonth);

    gridStart.setDate(firstDayOfMonth.getDate() - startWeekDay);

    const dailyFromCloudbeds = items.flatMap((item) =>
        Array.isArray(item?.dailyRates) ? item.dailyRates : []
    );

    const cloudbedsByDate = new Map<string, { minRate: number | null; roomsAvailable: number }>();

    dailyFromCloudbeds.forEach((daily: any) => {
        const key = typeof daily?.date === 'string' ? daily.date : '';
        if (!key) return;

        const current = cloudbedsByDate.get(key);
        const currentRate = Number(daily?.totalRate || daily?.rate) || 0;
        const currentAvailability = Number(daily?.roomsAvailable) || 0;

        if (!current) {
            cloudbedsByDate.set(key, {
                minRate: currentRate > 0 ? currentRate : null,
                roomsAvailable: currentAvailability,
            });
            return;
        }

        const nextMinRate =
            currentRate > 0
                ? (current.minRate === null ? currentRate : Math.min(current.minRate, currentRate))
                : current.minRate;

        cloudbedsByDate.set(key, {
            minRate: nextMinRate,
            roomsAvailable: Math.max(current.roomsAvailable, currentAvailability),
        });
    });

    const hasAvailability = Array.from(cloudbedsByDate.values()).some((day) => day.roomsAvailable > 0);
    const previewStatus = statusOverride || (hasAvailability ? 'available' : 'unavailable');

    const days: CalendarAvailabilityDay[] = Array.from({ length: totalCells }, (_, index) => {
        const current = new Date(gridStart);
        current.setDate(gridStart.getDate() + index);
        const isSelectedRange = current >= start && current <= end;
        const cloudbedsInfo = cloudbedsByDate.get(toDateKey(current));

        return {
            date: toDateKey(current),
            dayNumber: current.getDate(),
            isCurrentMonth: current.getMonth() === start.getMonth(),
            isSelectedRange,
            availability: cloudbedsInfo
                ? (cloudbedsInfo.roomsAvailable > 0 ? 'available' : 'unavailable')
                : (isSelectedRange ? previewStatus : 'neutral'),
            rate: cloudbedsInfo?.minRate ?? null,
        };
    });

    const selectedRangeRates = days
        .filter((day) => day.isSelectedRange && day.rate && day.rate > 0)
        .map((day) => Number(day.rate));

    const minRate = selectedRangeRates.length > 0
        ? Math.min(...selectedRangeRates)
        : null;
    const totalStayValue = selectedRangeRates.reduce((sum, rate) => sum + rate, 0);
    const nightCount = selectedRangeRates.length;

    let dailyRateText = 'Consulte o valor da diária para o período selecionado.';
    let totalStayText = 'Total a calcular';

    if (minRate) {
        dailyRateText = `R$ ${Math.round(minRate).toLocaleString('pt-BR')} / diária`;
    } else if (previewStatus === 'unavailable') {
        dailyRateText = 'Sem disponibilidade para o período consultado';
    }

    if (totalStayValue > 0) {
        totalStayText = `R$ ${Math.round(totalStayValue).toLocaleString('pt-BR')}`;
    } else if (previewStatus === 'unavailable') {
        totalStayText = 'Indisponível';
    }

    return {
        monthLabel: formatMonthLabel(startDate),
        days,
        dailyRateText,
        totalStayText,
        totalStayAmount: totalStayValue,
        nightCount,
    };
}

const HomePage = () => {
    const [availableProperties, setAvailableProperties] = useState<AvailableProperty[]>([]);
    const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
    const [feedbackMessage, setFeedbackMessage] = useState(
        'Selecione o hotel, o período e consulte a disponibilidade com cores no calendário.'
    );
    const [calendarPreview, setCalendarPreview] = useState<CalendarPreview | null>(null);
    const [landingProperties, setLandingProperties] = useState<AvailableProperty[]>(FALLBACK_PROPERTIES);

    // Busca prédios do banco para a landing page
    useEffect(() => {
        fetch('/api/properties/public')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.success && Array.isArray(data.properties) && data.properties.length > 0) {
                    const mapped: AvailableProperty[] = data.properties.map((p: any, i: number) => {
                        // Usa imagem do banco se existir, senão tenta fallback pelo slug
                        const fallback = FALLBACK_PROPERTIES.find(fp => fp.slug === p.slug);
                        return {
                            id: i + 1,
                            nome: p.name,
                            endereco: p.address || '',
                            preco: 0,
                            imagem: p.coverImageUrl || fallback?.imagem || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940',
                            slug: p.slug,
                            underConstruction: p.underConstruction || false,
                            origem: 'catalogo' as const,
                        };
                    });
                    setLandingProperties(mapped);
                }
            })
            .catch(() => { /* mantém fallback */ });
    }, []);

    const handleSearch = async (filters: SearchFilters) => {
        setSearchStatus('loading');
        setFeedbackMessage(`Consultando disponibilidade e diária do hotel ${filters.hotelLabel} no Cloudbeds...`);

        try {
            const { monthStart, monthEnd } = getMonthRange(filters.startDate, filters.endDate);
            const params = new URLSearchParams({
                startDate: monthStart,
                endDate: monthEnd,
                guests: String(filters.guests),
                hotelId: filters.hotelId,
            });

            if (filters.amenities.length > 0) {
                params.set('amenities', filters.amenities.join(','));
            }

            const response = await fetch(`/api/cloudbeds/availability?${params.toString()}`, {
                cache: 'no-store',
            });

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error || 'Não foi possível consultar o Cloudbeds.');
            }

            const items = Array.isArray(payload.items) ? payload.items : [];
            setCalendarPreview(buildCalendarPreview(filters.startDate, filters.endDate, items));

            const availableItems = items.filter((item: any) =>
                isItemAvailableForRange(item, filters.startDate, filters.endDate)
            );

            if (availableItems.length === 0) {
                setAvailableProperties([]);
                setSearchStatus('success');
                setFeedbackMessage(`O hotel ${filters.hotelLabel} está indisponível no período selecionado.`);
                return;
            }

            const mappedProperties: AvailableProperty[] = availableItems.map((item: any, index: number) => {
                const metrics = getRangeMetrics(item, filters.startDate, filters.endDate);

                const fallbackImage = FALLBACK_PROPERTIES[index % FALLBACK_PROPERTIES.length]?.imagem || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200';
                const photoGallery = Array.isArray(item.photoUrls) ? item.photoUrls.filter(Boolean) : [];
                const amenities = item?.raw?.roomTypeFeatures && typeof item.raw.roomTypeFeatures === 'object'
                    ? Object.values(item.raw.roomTypeFeatures).filter((feature): feature is string => typeof feature === 'string' && Boolean(feature.trim()))
                    : [];

                return {
                    id: index + 1,
                    nome: item.name || `Unidade ${index + 1}`,
                    endereco: item.propertyID
                        ? `${filters.hotelLabel} • Property ${item.propertyID} • disponibilidade via Cloudbeds`
                        : `${filters.hotelLabel} • disponibilidade via Cloudbeds`,
                    preco: Math.round(metrics.lowestDailyRate || 0),
                    imagem: item.mainPhotoUrl || photoGallery[0] || fallbackImage,
                    fotos: photoGallery,
                    disponiveis: metrics.availableRooms,
                    origem: 'cloudbeds',
                    descricao: item.description || undefined,
                    propertyId: item.propertyID || null,
                    roomTypeId: item.id || item?.raw?.roomTypeID || null,
                    ratePlanId: item.ratePlanID || item?.raw?.rateID || null,
                    maxGuests: typeof item.maxGuests === 'number' ? item.maxGuests : null,
                    amenities,
                };
            });

            setAvailableProperties(mappedProperties);
            setSearchStatus('success');
            setFeedbackMessage('');
        } catch (error: any) {
            setCalendarPreview(buildCalendarPreview(filters.startDate, filters.endDate, [], 'neutral'));
            setAvailableProperties([]);
            setSearchStatus('error');
            setFeedbackMessage(error?.message || 'Falha ao consultar o Cloudbeds. O catálogo local foi mantido como fallback.');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <HeroBanner />

            <section className="relative -mt-12 pb-4">
                <div className="max-w-7xl mx-auto px-6">
                    <SearchComponent
                        onSearch={handleSearch}
                        isLoading={searchStatus === 'loading'}
                        calendarDays={calendarPreview?.days}
                        calendarMonthLabel={calendarPreview?.monthLabel}
                        dailyRateText={calendarPreview?.dailyRateText}
                        totalStayText={calendarPreview?.totalStayText}
                        totalStayAmount={calendarPreview?.totalStayAmount}
                        nightCount={calendarPreview?.nightCount}
                        availableProperties={searchStatus === 'success' ? availableProperties : []}
                        feedbackMessage={feedbackMessage}
                        searchStatus={searchStatus}
                    />
                </div>
            </section>

            <section className="pt-8 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 max-w-2xl">
                        <h2 className="text-2xl font-questa-bold text-gray-900">Conheça nossos imóveis</h2>
                        <p className="mt-2 text-sm text-gray-600 font-questa-regular">
                            Espaços selecionados para estadias flexíveis, com conforto, praticidade e localização estratégica.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {landingProperties.map((prop) => (
                            <PropertyCard key={`${prop.slug || prop.origem}-${prop.id}`} property={prop} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;

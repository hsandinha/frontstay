import 'server-only';

export const CLOUDBEDS_API_BASE = 'https://api.cloudbeds.com/api/v1.3';

type CloudbedsRawRoomType = Record<string, unknown>;
type CloudbedsRawRatePlan = Record<string, unknown>;

export interface CloudbedsAvailabilityDailyRate {
    date: string;
    rate: number | null;
    totalRate: number | null;
    roomsAvailable: number;
    closedToArrival: boolean;
    closedToDeparture: boolean;
    minLos: number | null;
    maxLos: number | null;
}

export interface CloudbedsAvailabilityItem {
    id: string;
    name: string;
    description: string | null;
    availableRooms: number;
    rate: number | null;
    totalRate: number | null;
    currency: string;
    maxGuests: number | null;
    propertyID: string | null;
    ratePlanID: string | null;
    isDerived: boolean;
    dailyRates: CloudbedsAvailabilityDailyRate[];
    photoUrls: string[];
    mainPhotoUrl: string | null;
    raw: CloudbedsRawRoomType;
}

function getCloudbedsApiKey(): string {
    const apiKey = process.env.CLOUDBEDS_CHECKIN_API_KEY || process.env.CLOUDBEDS_API_KEY;

    if (!apiKey) {
        throw new Error('CLOUDBEDS_CHECKIN_API_KEY não configurada no FrontStay.');
    }

    return apiKey;
}

function toNullableNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;

    if (typeof value === 'string') {
        const normalized = value.replace(/\s/g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        if (!normalized) return null;

        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function toBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }

    return false;
}

function pickString(source: CloudbedsRawRoomType, keys: string[]): string | undefined {
    for (const key of keys) {
        const value = source[key];
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
    }

    return undefined;
}

function pickNumber(source: CloudbedsRawRoomType, keys: string[]): number | null {
    for (const key of keys) {
        const parsed = toNullableNumber(source[key]);
        if (parsed !== null) {
            return parsed;
        }
    }

    return null;
}

function asObjectArray<T extends Record<string, unknown>>(payload: unknown): T[] {
    if (Array.isArray(payload)) {
        return payload.filter((item): item is T => !!item && typeof item === 'object');
    }

    if (payload && typeof payload === 'object') {
        return Object.values(payload as Record<string, unknown>).filter(
            (item): item is T => !!item && typeof item === 'object'
        );
    }

    return [];
}

function pickRate(roomType: CloudbedsRawRoomType): number | null {
    const directRate = pickNumber(roomType, [
        'rate',
        'baseRate',
        'base_rate',
        'amount',
        'price',
        'dailyRate',
        'averageRate',
        'totalRate',
    ]);

    if (directRate !== null) return directRate;

    const nestedCandidates = ['rates', 'ratePlans', 'dailyRates'];

    for (const key of nestedCandidates) {
        const value = roomType[key];
        if (Array.isArray(value) && value.length > 0 && value[0] && typeof value[0] === 'object') {
            const nestedRate = pickNumber(value[0] as CloudbedsRawRoomType, ['amount', 'rate', 'price', 'baseRate']);
            if (nestedRate !== null) {
                return nestedRate;
            }
        }
    }

    return null;
}

function normalizePhotoUrls(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.flatMap((item) => {
        if (typeof item === 'string' && item.trim()) {
            return [item.trim()];
        }

        if (item && typeof item === 'object') {
            const url = pickString(item as CloudbedsRawRoomType, [
                'url',
                'photo',
                'photoUrl',
                'photoURL',
                'image',
                'imageUrl',
                'imageURL',
                'src',
            ]);

            return url ? [url] : [];
        }

        return [];
    });
}

async function getRoomTypeCatalog(propertyID?: string): Promise<CloudbedsAvailabilityItem[]> {
    try {
        const payload = await cloudbedsGet('/getRoomTypes', {
            ...(propertyID ? { propertyID } : {}),
        });

        const rawItems = asObjectArray<CloudbedsRawRoomType>(payload?.data || payload?.roomTypes || payload);
        return rawItems.map(normalizeRoomType);
    } catch (error) {
        console.warn('⚠️ Não foi possível carregar as fotos dos quartos no Cloudbeds:', error);
        return [];
    }
}

function enrichAvailabilityWithRoomTypeData(
    item: CloudbedsAvailabilityItem,
    roomTypes: Map<string, CloudbedsAvailabilityItem>
): CloudbedsAvailabilityItem {
    const matchedRoomType = roomTypes.get(item.id)
        || Array.from(roomTypes.values()).find((roomType) => roomType.name === item.name);

    if (!matchedRoomType) {
        return item;
    }

    return {
        ...item,
        description: item.description || matchedRoomType.description,
        maxGuests: item.maxGuests ?? matchedRoomType.maxGuests,
        propertyID: item.propertyID ?? matchedRoomType.propertyID,
        photoUrls: matchedRoomType.photoUrls,
        mainPhotoUrl: matchedRoomType.mainPhotoUrl,
        raw: {
            ...matchedRoomType.raw,
            ...item.raw,
        },
    };
}

function normalizeRoomType(roomType: CloudbedsRawRoomType, index: number): CloudbedsAvailabilityItem {
    const id = pickString(roomType, ['roomTypeID', 'roomTypeId', 'roomID', 'roomId', 'id']) || `room-type-${index + 1}`;
    const name = pickString(roomType, ['roomTypeName', 'name', 'roomName', 'roomType']) || `Unidade ${index + 1}`;
    const description = pickString(roomType, ['roomTypeDescription', 'description', 'roomDescription']) || null;
    const availableRooms = pickNumber(roomType, ['roomsAvailable', 'availableRooms', 'available', 'allotment']) || 0;
    const rate = pickRate(roomType);
    const currency = pickString(roomType, ['currency', 'currencyCode', 'currency_code']) || 'BRL';
    const maxGuests = pickNumber(roomType, ['maxGuests', 'maxOccupancy', 'adultsIncluded', 'maxPeople']);
    const propertyID = pickString(roomType, ['propertyID', 'propertyId']) || null;
    const photoUrls = normalizePhotoUrls(
        roomType.roomTypePhotos
        || roomType.photos
        || roomType.images
        || roomType.gallery
    );

    return {
        id,
        name,
        description,
        availableRooms,
        rate,
        totalRate: rate,
        currency,
        maxGuests,
        propertyID,
        ratePlanID: null,
        isDerived: false,
        dailyRates: [],
        photoUrls,
        mainPhotoUrl: photoUrls[0] || null,
        raw: roomType,
    };
}

function normalizeRatePlan(ratePlan: CloudbedsRawRatePlan, index: number): CloudbedsAvailabilityItem {
    const id = pickString(ratePlan, ['roomTypeID', 'roomTypeId', 'rateID', 'rateId', 'id']) || `room-type-${index + 1}`;
    const name = pickString(ratePlan, ['roomTypeName', 'roomName', 'name']) || `Unidade ${index + 1}`;
    const availableRooms = pickNumber(ratePlan, ['roomsAvailable']) || 0;
    const roomRate = pickNumber(ratePlan, ['roomRate', 'rate']);
    const totalRate = pickNumber(ratePlan, ['totalRate']);
    const maxGuests = pickNumber(ratePlan, ['maxGuests', 'maxOccupancy', 'adultsIncluded', 'maxPeople']);
    const propertyID = pickString(ratePlan, ['propertyID', 'propertyId']) || null;
    const ratePlanID = pickString(ratePlan, ['ratePlanID', 'ratePlanId']) || null;
    const isDerived = toBoolean(ratePlan.isDerived);

    const detailedRaw = asObjectArray<CloudbedsRawRatePlan>(ratePlan.roomRateDetailed);
    const dailyRates = detailedRaw.map((daily) => ({
        date: pickString(daily, ['date']) || '',
        rate: pickNumber(daily, ['rate']),
        totalRate: pickNumber(daily, ['totalRate']),
        roomsAvailable: pickNumber(daily, ['roomsAvailable']) || 0,
        closedToArrival: toBoolean(daily.closedToArrival),
        closedToDeparture: toBoolean(daily.closedToDeparture),
        minLos: pickNumber(daily, ['minLos']),
        maxLos: pickNumber(daily, ['maxLos']),
    })).filter((day) => !!day.date);

    return {
        id,
        name,
        description: null,
        availableRooms,
        rate: roomRate,
        totalRate,
        currency: 'BRL',
        maxGuests,
        propertyID,
        ratePlanID,
        isDerived,
        dailyRates,
        photoUrls: [],
        mainPhotoUrl: null,
        raw: ratePlan,
    };
}

async function cloudbedsGet(path: string, params: Record<string, string>) {
    const apiKey = getCloudbedsApiKey();
    const url = new URL(`${CLOUDBEDS_API_BASE}${path}`);

    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        }
    });

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudbeds retornou ${response.status}: ${errorText.slice(0, 300)}`);
    }

    return response.json();
}

function appendFormValue(params: URLSearchParams, key: string, value: unknown) {
    if (value === null || value === undefined || value === '') {
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => appendFormValue(params, `${key}[${index}]`, item));
        return;
    }

    if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([nestedKey, nestedValue]) => {
            appendFormValue(params, `${key}[${nestedKey}]`, nestedValue);
        });
        return;
    }

    params.append(key, String(value));
}

async function cloudbedsPost(path: string, data: Record<string, unknown>) {
    const apiKey = getCloudbedsApiKey();
    const formData = new URLSearchParams();

    Object.entries(data).forEach(([key, value]) => {
        appendFormValue(formData, key, value);
    });

    const response = await fetch(`${CLOUDBEDS_API_BASE}${path}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: formData.toString(),
        cache: 'no-store',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudbeds retornou ${response.status}: ${errorText.slice(0, 300)}`);
    }

    return response.json();
}

export async function getRoomAvailability(params: {
    startDate: string;
    endDate: string;
    propertyID?: string;
    adults?: number;
}) {
    const [payload, roomTypeCatalog] = await Promise.all([
        cloudbedsGet('/getRatePlans', {
            startDate: params.startDate,
            endDate: params.endDate,
            detailedRates: 'true',
            adults: String(params.adults || 1),
            ...(params.propertyID ? { propertyID: params.propertyID } : {}),
        }),
        getRoomTypeCatalog(params.propertyID),
    ]);

    const roomTypeMap = new Map(roomTypeCatalog.map((item) => [item.id, item]));

    if (payload?.success && Array.isArray(payload?.data)) {
        const ratePlanItems = asObjectArray<CloudbedsRawRatePlan>(payload.data);

        return ratePlanItems
            .map(normalizeRatePlan)
            .map((item) => enrichAvailabilityWithRoomTypeData(item, roomTypeMap))
            .sort((a, b) => {
                const rateA = a.rate ?? Number.MAX_SAFE_INTEGER;
                const rateB = b.rate ?? Number.MAX_SAFE_INTEGER;
                return rateA - rateB;
            });
    }

    return roomTypeCatalog
        .sort((a, b) => {
            const rateA = a.rate ?? Number.MAX_SAFE_INTEGER;
            const rateB = b.rate ?? Number.MAX_SAFE_INTEGER;
            return rateA - rateB;
        });
}

export async function createCloudbedsReservation(data: Record<string, unknown>) {
    return cloudbedsPost('/postReservation', data);
}

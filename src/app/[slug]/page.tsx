'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Amenity = {
    id: string;
    name: string;
    icon: string;
    category: string;
    hours: string | null;
    rules: string | null;
};

type RoomType = {
    id: string;
    name: string;
    description: string | null;
    availableRooms: number;
    rate: number | null;
    totalRate: number | null;
    maxGuests: number | null;
    photoUrls: string[];
    mainPhotoUrl: string | null;
    amenities: string[];
};

type PropertyData = {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
    cep: string | null;
    description: string | null;
    coverImageUrl: string | null;
    galleryImages: string[];
    logoUrl: string | null;
    checkinTime: string;
    checkoutTime: string;
    totalUnits: number;
    totalFloors: number | null;
    latitude: number | null;
    longitude: number | null;
    supportPhone: string | null;
    cloudbedsPropertyId: string | null;
    underConstruction: boolean;
    amenities: Amenity[];
};

// Imagens fallback para prédios sem cover cadastrado
const FALLBACK_IMAGES: Record<string, string> = {
    'esopo': '/esopo.png',
    'city': '/citydesign.png',
    'agora': '/agora.jpg',
    'lourdes': '/lourdes.jpeg',
    'savassi': '/funcionarios.jpeg',
    'shopping-cidade': '/centro.jpeg',
    'icon': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
};

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940';

const STEPS = [
    { icon: '📝', title: 'Reserva e Liberação', desc: 'Após a reserva aqui no site, envie seus documentos pelo nosso portal para garantir sua liberação no prédio através do nosso check-in 100% digital.' },
    { icon: '🔑', title: 'Entrada e Acesso', desc: 'As informações da sua estadia, incluindo a senha para acesso direto ao apartamento, chegarão automaticamente via WhatsApp a partir do horário de check-in.' },
    { icon: '👋', title: 'Sua Estadia e Checkout', desc: 'Aproveite a sua estadia com os diferenciais InHouse! No dia de ir embora, basta responder nossa mensagem no WhatsApp sinalizando sua saída. Simples assim.' },
];

export default function ImovelPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeImage, setActiveImage] = useState(0);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [roomPhotoIndex, setRoomPhotoIndex] = useState<Record<string, number>>({});

    // Date Picker States
    const [checkInDate, setCheckInDate] = useState(() => { const d = new Date(); return d.toISOString().split('T')[0]; });
    const [checkOutDate, setCheckOutDate] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; });
    const [guests, setGuests] = useState(1);
    const [searchTriggered, setSearchTriggered] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetch(`/api/property/${slug}`)
            .then(res => res.ok ? res.json() : res.json().then(d => { throw new Error(d.error || 'Não encontrado'); }))
            .then(data => {
                setProperty(data.property);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);

    // Fetch room types from Cloudbeds
    useEffect(() => {
        // Se for InHouse, forçamos o valor 'ALL' para trazer tudo do Cloudbeds sem filtro de ID
        const pId = property?.cloudbedsPropertyId || (slug === 'inhouse' ? 'ALL' : null);
        if (!pId) return;

        if (!searchTriggered && roomTypes.length === 0) {
            // Load initially for today/tomorrow without strict trigger
            fetchRooms(checkInDate, checkOutDate, guests, pId);
        } else if (searchTriggered) {
            fetchRooms(checkInDate, checkOutDate, guests, pId);
            setSearchTriggered(false);
        }
    }, [property?.cloudbedsPropertyId, searchTriggered, slug]);

    const fetchRooms = (ci: string, co: string, g: number, pId: string) => {
        if (!ci || !co) return;
        setRoomsLoading(true);
        const pidParam = pId && pId !== 'ALL' ? `&propertyID=${pId}` : '';
        
        fetch(`/api/cloudbeds/availability?startDate=${ci}&endDate=${co}&guests=${g}${pidParam}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.success && Array.isArray(data.items)) {
                    setRoomTypes(data.items.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description || null,
                        availableRooms: item.availableRooms || 0,
                        rate: item.rate || item.totalRate || null,
                        totalRate: item.totalRate || item.rate || null,
                        maxGuests: item.maxGuests || null,
                        photoUrls: item.photoUrls || [],
                        mainPhotoUrl: item.mainPhotoUrl || null,
                        amenities: item.raw?.roomTypeFeatures
                            ? Object.values(item.raw.roomTypeFeatures).filter((f: any) => typeof f === 'string' && f.trim())
                            : [],
                    })));
                } else {
                    setRoomTypes([]);
                }
            })
            .catch(err => console.error('Erro ao carregar quartos:', err))
            .finally(() => setRoomsLoading(false));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                    <div className="text-6xl mb-6">🏢</div>
                    <h1 className="text-2xl font-questa-bold text-gray-900 mb-3">Imóvel não encontrado</h1>
                    <p className="text-gray-600 mb-8">O imóvel que você procura não está disponível ou não existe.</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-[#0a2540] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0d3156] transition-colors">
                        ← Voltar para o início
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const coverImage = property.coverImageUrl || FALLBACK_IMAGES[property.slug] || FALLBACK_COVER;
    const allImages = property.galleryImages.length > 0 ? [coverImage, ...property.galleryImages] : [coverImage];
    const fullAddress = [property.address, property.neighborhood, property.city, property.state].filter(Boolean).join(', ');

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="relative bg-[#0a2540]">
                <div className="relative h-[420px] md:h-[520px] overflow-hidden">
                    <Image
                        src={allImages[activeImage]}
                        alt={property.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Gallery dots */}
                    {allImages.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            {allImages.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Gallery arrows */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={() => setActiveImage(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => setActiveImage(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-questa-bold leading-tight">
                                    {property.name}
                                </h1>
                                {property.underConstruction && (
                                    <span className="px-4 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-full shadow-lg animate-pulse">
                                        🚧 Em Construção
                                    </span>
                                )}
                            </div>
                            {fullAddress && (
                                <div className="flex items-center gap-2 text-white/80">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-sm md:text-base">{fullAddress}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Breadcrumbs */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
                        <Link href="/" className="hover:text-blue-700 transition-colors">FrontStay</Link>
                        <span>/</span>
                        <span>Hospedagem</span>
                        {property.city && (
                            <>
                                <span>/</span>
                                <span>{property.city}</span>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-gray-900 font-bold">{property.name}</span>
                    </nav>
                </div>
            </div>

            {/* Content 2-Column Charlie Layout */}
            <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12 lg:gap-16">

                {/* Left Column: Info */}
                <div className="flex-1 lg:max-w-3xl">

                    {/* Description */}
                    {property.description && (
                        <section className="mb-10">
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">{property.description}</p>
                        </section>
                    )}

                    {/* Amenities + Property highlights (Charlie Style) */}
                    <section className="mb-10">
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-4">
                            {property.amenities.map(a => (
                                <div key={a.id} className="flex items-center gap-3 text-gray-700">
                                    <span className="text-2xl opacity-80">{a.icon}</span>
                                    <div>
                                        <span className="font-medium">{a.name}</span>
                                        {a.hours && <span className="text-xs text-gray-500 block">({a.hours})</span>}
                                    </div>
                                </div>
                            ))}
                            {/* Static Highlights */}
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-2xl opacity-80">🔐</span>
                                <div>
                                    <span className="font-medium">Check-in 100% Digital</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-2xl opacity-80">📱</span>
                                <div>
                                    <span className="font-medium">Suporte via WhatsApp</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Checkin and Links */}
                    <section className="mb-12 space-y-6 border-y border-gray-100 py-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">📥</div>
                                <span className="text-sm font-medium">Check-in à partir das {property.checkinTime}h</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-800">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">📤</div>
                                <span className="text-sm font-medium">Check-out até as {property.checkoutTime}h</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                            <Link href="/termos" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2 w-fit">
                                📄 Políticas de estadia e cancelamento
                            </Link>
                            <Link href="/faq" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2 w-fit">
                                ❓ Dúvidas frequentes (F.A.Q)
                            </Link>
                        </div>
                    </section>

                    {/* How to book — Vertical Charlie Style but Frontstay dark glass elements */}
                    <section className="mb-10">
                        <h2 className="text-2xl font-questa-bold mb-8 text-gray-900">Como se hospedar na FrontStay</h2>
                        <div className="flex flex-col gap-8">
                            {STEPS.map((step, i) => (
                                <div key={i} className="flex gap-5 items-start">
                                    <div className="w-12 h-12 flex-shrink-0 bg-[#0a2540] text-white rounded-full flex items-center justify-center text-xl shadow-lg shadow-blue-900/20">
                                        {step.icon}
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-gray-800 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column: Sticky Booking Card - Padrão Branco/Limpo */}
                <div className="lg:w-[400px]">
                    <div 
                        className="sticky top-24 bg-white text-gray-900 p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
                        style={{ borderRadius: '32px' }}
                    >

                        <h2 className="text-2xl font-questa-bold text-gray-900 mb-6">Faça sua reserva</h2>

                        <div className="space-y-4">
                            {/* Dates Selector */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-3">
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Check-in</label>
                                    <input
                                        type="date"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        className="w-full bg-transparent text-gray-900 font-medium focus:outline-none border-b border-gray-200 pb-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Check-out</label>
                                    <input
                                        type="date"
                                        value={checkOutDate}
                                        min={checkInDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        className="w-full bg-transparent text-gray-900 font-medium focus:outline-none border-b border-gray-200 pb-1"
                                    />
                                </div>
                            </div>

                            {/* Guests Selector */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">Hóspedes</span>
                                <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-1">
                                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-md transition-colors text-gray-700">−</button>
                                    <span className="font-bold w-4 text-center text-gray-900">{guests}</span>
                                    <button onClick={() => setGuests(guests + 1)} className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-md transition-colors text-gray-700">+</button>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    window.location.href = `/?hotel=${property.slug}&checkin=${checkInDate}&checkout=${checkOutDate}&guests=${guests}&checkout_flow=true`;
                                }}
                                className="w-full bg-[#1c1c1c] text-white hover:bg-black transition-colors py-4 rounded-2xl font-bold text-lg shadow-lg mt-2"
                            >
                                Garanta sua estadia
                            </button>
                        </div>

                        {property.supportPhone && (
                            <p className="text-center text-xs text-gray-500 mt-6 font-medium">
                                Dúvidas? <a href={`https://wa.me/55${property.supportPhone.replace(/\D/g, '')}`} className="underline hover:text-gray-900" target="_blank" rel="noopener noreferrer">Fale no WhatsApp</a>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Room Types — from Cloudbeds (only when NOT under construction) */}
            <div id="rooms-section" className="mt-16 pt-16 border-t border-gray-200">
                {!property.underConstruction && !!(property.cloudbedsPropertyId || slug === 'inhouse') && (
                    <section>
                        <h2 className="text-2xl font-questa-bold text-gray-900 mb-6">Faça sua reserva</h2>
                        {roomsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <span className="ml-3 text-gray-600">Consultando disponibilidade...</span>
                            </div>
                        ) : roomTypes.length === 0 ? (
                            <div className="py-12 bg-gray-50 border border-gray-100 rounded-3xl text-center">
                                <h3 className="text-lg font-questa-bold text-gray-900 mb-2">Nenhum quarto disponível</h3>
                                <p className="text-sm text-gray-500">Tente buscar para outras datas no calendário.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {roomTypes.map((room) => {
                                    const currentPhoto = roomPhotoIndex[room.id] || 0;
                                    const photos = room.photoUrls.length > 0 ? room.photoUrls : (room.mainPhotoUrl ? [room.mainPhotoUrl] : []);
                                    const hasPhotos = photos.length > 0;
                                    const isAvailable = room.availableRooms > 0;
                                    const amenityList = (room.amenities as string[]).slice(0, 8);

                                    return (
                                        <div key={room.id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr]">
                                                {/* Room photo - Grid resolve o bug de altura do Safari/Chrome */}
                                                <div className="relative w-full h-64 md:h-auto bg-gray-100 overflow-hidden">
                                                    {hasPhotos ? (
                                                        <>
                                                            {/* Trocando next/Image por nativo para contornar cache/domínio Next */}
                                                            <img
                                                                src={photos[currentPhoto] || photos[0]}
                                                                alt={room.name}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                            {photos.length > 1 && (
                                                                <>
                                                                    <button
                                                                        onClick={() => setRoomPhotoIndex(prev => ({ ...prev, [room.id]: currentPhoto === 0 ? photos.length - 1 : currentPhoto - 1 }))}
                                                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setRoomPhotoIndex(prev => ({ ...prev, [room.id]: currentPhoto === photos.length - 1 ? 0 : currentPhoto + 1 }))}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all z-10"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                                    </button>
                                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                                                                        {photos.map((_, i) => (
                                                                            <button key={i} onClick={() => setRoomPhotoIndex(prev => ({ ...prev, [room.id]: i }))} className={`w-2 h-2 rounded-full transition-all ${i === currentPhoto ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                            <span className="text-4xl mb-2">📸</span>
                                                            <span className="text-sm font-medium">Sem foto</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Room info - Estilo Charlie */}
                                                <div className="p-6 md:p-8 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-4 mb-1">
                                                            <div>
                                                                <h3 className="text-2xl font-questa-bold text-[#1c1c1c]">{room.name}</h3>
                                                                {room.maxGuests && (
                                                                    <p className="text-sm text-gray-500 mt-1">Até {room.maxGuests} {room.maxGuests === 1 ? 'hóspede' : 'hóspedes'} por quarto</p>
                                                                )}
                                                            </div>
                                                            {isAvailable && room.availableRooms <= 3 && (
                                                                <span className="flex-shrink-0 px-3 py-1 bg-[#ff385c] text-white text-xs font-bold rounded-lg">Últimas vagas</span>
                                                            )}
                                                        </div>

                                                        {/* Amenities */}
                                                        {amenityList.length > 0 && (
                                                            <div className="flex flex-wrap gap-x-5 gap-y-3 mt-6">
                                                                {amenityList.map((amenity, i) => (
                                                                    <span key={i} className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                                                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        {amenity}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-8">
                                                        {isAvailable ? (
                                                            <div className="flex items-end justify-between">
                                                                <div>
                                                                    {room.rate ? (
                                                                        <>
                                                                            <p className="text-[28px] font-questa-bold text-[#1c1c1c] leading-none">
                                                                                R$ {room.rate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                                <span className="text-sm font-normal text-gray-500 ml-2">por noite</span>
                                                                            </p>
                                                                            <p className="text-[13px] text-gray-500 mt-2 underline">total de R$ {((room.totalRate || room.rate) * 1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                                            <p className="text-[13px] text-gray-500">1 noite, 1 quarto, {guests} hóspede{guests > 1 ? 's' : ''}</p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-sm text-gray-600">Valor sob consulta</p>
                                                                    )}
                                                                </div>
                                                                <Link
                                                                    href={`/?hotel=${property.slug}&checkin=${checkInDate}&checkout=${checkOutDate}&guests=${guests}&checkout_flow=true`}
                                                                    className="inline-flex flex-shrink-0 items-center justify-center bg-[#1c1c1c] text-white px-8 py-3.5 rounded-[12px] font-bold text-sm hover:bg-black transition-all shadow-md"
                                                                >
                                                                    Reserve agora
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className="pt-2">
                                                                <div className="w-full bg-gray-50 border border-gray-100 text-gray-400 text-center py-4 rounded-full text-[15px] font-medium">
                                                                    Indisponível nestas datas
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}
            </div>

            <Footer />
        </div>
    );
}

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

    // Fetch room types from Cloudbeds when property loads
    useEffect(() => {
        if (!property?.cloudbedsPropertyId) return;
        setRoomsLoading(true);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startDate = today.toISOString().split('T')[0];
        const endDate = tomorrow.toISOString().split('T')[0];

        fetch(`/api/cloudbeds/availability?startDate=${startDate}&endDate=${endDate}&propertyID=${property.cloudbedsPropertyId}&guests=1`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.success && Array.isArray(data.items)) {
                    setRoomTypes(data.items.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description || null,
                        availableRooms: item.availableRooms || 0,
                        rate: item.rate || item.totalRate || null,
                        maxGuests: item.maxGuests || null,
                        photoUrls: item.photoUrls || [],
                        mainPhotoUrl: item.mainPhotoUrl || null,
                        amenities: item.raw?.roomTypeFeatures
                            ? Object.values(item.raw.roomTypeFeatures).filter((f: any) => typeof f === 'string' && f.trim())
                            : [],
                    })));
                }
            })
            .catch(err => console.error('Erro ao carregar quartos:', err))
            .finally(() => setRoomsLoading(false));
    }, [property?.cloudbedsPropertyId]);

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

            {/* Promotional & Security Banners */}
            <div className="bg-[#0a2540] text-center text-white text-xs font-medium px-4 py-2 flex flex-col md:flex-row md:items-center justify-center gap-2 border-b border-white/10 shadow-sm">
                <span className="bg-amber-500 text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">Atenção a Golpes</span>
                <span className="opacity-90">Utilize sempre nossos canais oficiais. A FrontStay não envia áudio ou realiza ligações no WhatsApp. Proteja-se!</span>
            </div>
            <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 border-b border-blue-900 shadow-inner px-4 py-3 text-center">
                <Link href="/" className="inline-flex flex-col md:flex-row md:items-center justify-center gap-1 md:gap-3 group">
                    <span className="text-blue-100 font-bold tracking-tight group-hover:text-white transition-colors">
                        <span className="text-white">FrontStay Black ✦</span> A melhor tarifa sempre no nosso site!
                    </span>
                    <span className="text-white text-sm md:text-base border-b border-white/40 group-hover:border-white transition-all">
                        Reserve pelo sistema oficial e garanta seu check-in automatizado.
                    </span>
                </Link>
            </div>

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

            {/* Right Column: Sticky Booking Card - FrontStay Design */}
            <div className="lg:w-[400px]">
                <div className="sticky top-24 bg-[#0a2540] text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/30 blur-[60px] rounded-full pointer-events-none" />
                    
                    <h2 className="text-2xl font-questa-bold text-white mb-6 relative z-10">Faça sua reserva</h2>
                    
                    <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-md relative z-10 border border-white/10">
                        <p className="text-xs text-blue-200 uppercase font-semibold mb-1 tracking-wider">Período de estadia</p>
                        <p className="text-sm font-medium">Consulte nossos quartos e datas na ferramenta de seleção abaixo.</p>
                    </div>

                    <button 
                        onClick={() => {
                            const roomsEl = document.getElementById('rooms-section');
                            if (roomsEl) {
                                roomsEl.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.location.href = `/?hotel=${property.slug}`;
                            }
                        }}
                        className="w-full relative z-10 bg-white text-[#0a2540] hover:bg-gray-100 transition-colors py-4 rounded-xl font-bold text-lg shadow-xl shadow-black/20"
                    >
                        Garanta sua estadia
                    </button>
                    
                    {property.supportPhone && (
                        <p className="text-center text-xs text-blue-200 mt-6 relative z-10">
                            Dúvidas? <a href={`https://wa.me/55${property.supportPhone.replace(/\D/g, '')}`} className="underline" target="_blank" rel="noopener noreferrer">Fale no WhatsApp</a>
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Room Types — from Cloudbeds (only when NOT under construction) */}
        <div id="rooms-section" className="mt-16 pt-16 border-t border-gray-200">
            {!property.underConstruction && (roomTypes.length > 0 || roomsLoading) && (
                    <section>
                        <h2 className="text-2xl font-questa-bold text-gray-900 mb-6">Faça sua reserva</h2>
                        {roomsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <span className="ml-3 text-gray-600">Consultando disponibilidade...</span>
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
                                        <div key={room.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Room photo */}
                                                <div className="relative w-full md:w-[320px] h-64 md:h-full flex-shrink-0 bg-gray-100">
                                                    {hasPhotos ? (
                                                        <>
                                                            <Image
                                                                src={photos[currentPhoto] || photos[0]}
                                                                alt={room.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(min-width: 768px) 380px, 100vw"
                                                            />
                                                            {photos.length > 1 && (
                                                                <>
                                                                    <button
                                                                        onClick={() => setRoomPhotoIndex(prev => ({ ...prev, [room.id]: currentPhoto === 0 ? photos.length - 1 : currentPhoto - 1 }))}
                                                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setRoomPhotoIndex(prev => ({ ...prev, [room.id]: currentPhoto === photos.length - 1 ? 0 : currentPhoto + 1 }))}
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-all"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                                    </button>
                                                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                                                        {photos.map((_, i) => (
                                                                            <button key={i} onClick={() => setRoomPhotoIndex(prev => ({ ...prev, [room.id]: i }))} className={`w-2 h-2 rounded-full transition-all ${i === currentPhoto ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                                                        ))}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                            <span className="text-5xl">🏨</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Room info */}
                                                <div className="flex-1 p-6 flex flex-col">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-xl font-questa-bold text-gray-900">{room.name}</h3>
                                                            {room.maxGuests && (
                                                                <p className="text-sm text-gray-500 mt-0.5">Até {room.maxGuests} hóspedes por quarto</p>
                                                            )}
                                                        </div>
                                                        {isAvailable && room.availableRooms <= 3 && (
                                                            <span className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">Últimas vagas</span>
                                                        )}
                                                    </div>

                                                    {/* Amenities */}
                                                    {amenityList.length > 0 && (
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
                                                            {amenityList.map((amenity, i) => (
                                                                <span key={i} className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                                                                    <span className="text-gray-400">✓</span>
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="mt-auto pt-5">
                                                        {isAvailable ? (
                                                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                                                <div>
                                                                    {room.rate ? (
                                                                        <>
                                                                            <p className="text-2xl font-questa-bold text-gray-900">
                                                                                R$ {room.rate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                                <span className="text-sm font-normal text-gray-500 ml-1">por noite</span>
                                                                            </p>
                                                                            <p className="text-xs text-gray-400 mt-0.5">1 noite, 1 quarto, 1 hóspede</p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="text-sm text-gray-600">Valor sob consulta</p>
                                                                    )}
                                                                </div>
                                                                <Link
                                                                    href={`/?hotel=${property.slug}`}
                                                                    className="inline-flex items-center gap-2 bg-[#0a2540] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d3156] transition-all hover:shadow-lg"
                                                                >
                                                                    Reserve agora
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className="border-t border-gray-100 pt-4">
                                                                <p className="text-sm text-gray-400 text-center py-2 bg-gray-50 rounded-xl">
                                                                    Indisponível nestas datas
                                                                </p>
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
            </div>

            <Footer />
        </div>
    );
}

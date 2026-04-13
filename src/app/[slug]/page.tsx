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
    { icon: '📝', title: 'Faça sua reserva', desc: 'Reserve pelo nosso site e receba a confirmação por e-mail e WhatsApp.' },
    { icon: '📱', title: 'Envie seus documentos', desc: 'Complete o check-in online, envie seus documentos para liberar o acesso ao prédio.' },
    { icon: '🔑', title: 'Acesse o apartamento', desc: 'Na data do check-in, receba as instruções de entrada via WhatsApp a partir das 15h.' },
    { icon: '👋', title: 'Checkout simples', desc: 'No dia do checkout, basta sair e nos avisar pelo WhatsApp. Simples assim!' },
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
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <nav className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-gray-900 transition-colors">FrontStay</Link>
                        <span>›</span>
                        <span>Hospedagem</span>
                        {property.city && (
                            <>
                                <span>›</span>
                                <span>{property.city}</span>
                            </>
                        )}
                        <span>›</span>
                        <span className="text-gray-900 font-medium">{property.name}</span>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
                {/* Amenities + Check-in/out */}
                <section>
                    <div className="flex flex-wrap gap-3">
                        {property.amenities.map(a => (
                            <div key={a.id} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition-colors group">
                                <span className="text-lg">{a.icon}</span>
                                <span className="font-medium">{a.name}</span>
                                {a.hours && (
                                    <span className="text-xs text-gray-400 hidden group-hover:inline">({a.hours})</span>
                                )}
                            </div>
                        ))}
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm text-emerald-700">
                            <span className="text-lg">📥</span>
                            <span className="font-medium">Check-in à partir das {property.checkinTime}h</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-50 rounded-xl border border-orange-200 text-sm text-orange-700">
                            <span className="text-lg">📤</span>
                            <span className="font-medium">Check-out até as {property.checkoutTime}h</span>
                        </div>
                    </div>
                </section>

                {/* Description */}
                {property.description && (
                    <section className="bg-white">
                        <h2 className="text-xl font-questa-bold text-gray-900 mb-4">Sobre o {property.name}</h2>
                        <p className="text-gray-600 leading-relaxed max-w-3xl whitespace-pre-line">{property.description}</p>
                    </section>
                )}

                {/* Property highlights */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.totalUnits > 0 && (
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                            <div className="text-2xl mb-2">🏢</div>
                            <p className="text-2xl font-questa-bold text-gray-900">{property.totalUnits}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Apartamentos</p>
                        </div>
                    )}
                    {property.totalFloors && (
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                            <div className="text-2xl mb-2">🏗️</div>
                            <p className="text-2xl font-questa-bold text-gray-900">{property.totalFloors}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Andares</p>
                        </div>
                    )}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                        <div className="text-2xl mb-2">🔐</div>
                        <p className="text-lg font-questa-bold text-gray-900">Check-in</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">100% Digital</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
                        <div className="text-2xl mb-2">📱</div>
                        <p className="text-lg font-questa-bold text-gray-900">Suporte</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Via WhatsApp</p>
                    </div>
                </section>

                {/* How to book — inspired by StayCharlie */}
                <section className="bg-gradient-to-br from-[#0a2540] to-[#1a3a5c] rounded-3xl p-8 md:p-12 text-white">
                    <h2 className="text-2xl font-questa-bold mb-8 text-center">Como se hospedar na FrontStay</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {STEPS.map((step, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 backdrop-blur-sm">
                                    {step.icon}
                                </div>
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                                    {i + 1}
                                </div>
                                <h3 className="font-semibold mb-2">{step.title}</h3>
                                <p className="text-white/70 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Room Types — from Cloudbeds (only when NOT under construction) */}
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
                                                <div className="relative w-full md:w-[380px] h-64 md:h-auto flex-shrink-0 bg-gray-100">
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

                {/* CTA */}
                <section className="text-center py-8">
                    {property.underConstruction ? (
                        <>
                            <div className="inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-200 px-8 py-5 rounded-2xl mb-4">
                                <span className="text-3xl">🚧</span>
                                <div className="text-left">
                                    <h2 className="text-xl font-questa-bold text-amber-800">Imóvel em construção</h2>
                                    <p className="text-sm text-amber-600">Em breve você poderá reservar neste endereço.</p>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">Quer ser notificado quando abrir? Entre em contato pelo WhatsApp.</p>
                            {property.supportPhone && (
                                <a
                                    href={`https://wa.me/55${property.supportPhone.replace(/\D/g, '')}?text=Olá! Gostaria de ser avisado quando o ${property.name} estiver disponível para reservas.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-4 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all"
                                >
                                    💬 Fale pelo WhatsApp
                                </a>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-questa-bold text-gray-900 mb-3">Pronto para reservar?</h2>
                            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                Confira a disponibilidade e os melhores preços diretamente no nosso site.
                            </p>
                            <Link
                                href={`/?hotel=${property.slug}`}
                                className="inline-flex items-center gap-3 bg-[#0a2540] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#0d3156] transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Reserve agora
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </>
                    )}
                </section>

                {/* Policies link */}
                <section className="border-t border-gray-100 pt-6 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                        <Link href="/termos" className="hover:text-gray-900 transition-colors underline underline-offset-2">Políticas de estadia e cancelamento</Link>
                        <span>·</span>
                        <Link href="/faq" className="hover:text-gray-900 transition-colors underline underline-offset-2">Dúvidas frequentes (F.A.Q)</Link>
                        {property.supportPhone && (
                            <>
                                <span>·</span>
                                <a href={`https://wa.me/55${property.supportPhone.replace(/\D/g, '')}`} className="hover:text-gray-900 transition-colors underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                                    WhatsApp: {property.supportPhone}
                                </a>
                            </>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}

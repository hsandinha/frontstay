'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

/* ───── Types ───── */

type GuestPortalGuest = {
    id: string | null;
    name: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    taxId: string | null;
    firstSeenAt: string | null;
    lastSeenAt: string | null;
};

type GuestPortalTimelineItem = {
    id: string;
    label: string;
    description: string;
    createdAt: string | null;
    tone: 'info' | 'success' | 'warning' | 'neutral';
};

type GuestPortalReservation = {
    id: string | number;
    pmsReservationId: string | null;
    roomName: string;
    checkInDate: string | null;
    checkOutDate: string | null;
    status: string;
    pmsStatus: string | null;
    total: number | null;
    balance: number | null;
    paidAmount: number | null;
    paymentStatus: 'paid' | 'partial' | 'pending' | 'unknown';
    specialRequests: string | null;
    propertyId: string | null;
    propertyName: string | null;
    propertyAddress: string | null;
    source: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    accessCode: string | null;
    checkinCompleted: boolean;
    checkinLinkSent: boolean;
    notificationSent: boolean;
    paymentMethod: string | null;
    promoCode: string | null;
    timeline: GuestPortalTimelineItem[];
};

type GuestPortalSummary = {
    totalBookings: number;
    activeReservations: number;
    futureReservations: number;
    completedStays: number;
    pendingPaymentAmount: number;
};

type GuestPortalCompanion = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    documentType: string | null;
    isPrimary: boolean;
};

type GuestPortalSettings = {
    wifiNetwork: string | null;
    wifiPassword: string | null;
    condoRules: string | null;
    supportWhatsapp: string | null;
    propertyAddress: string | null;
};

type PortalResponse = {
    guest: GuestPortalGuest | null;
    reservations: GuestPortalReservation[];
    summary: GuestPortalSummary;
    companions: GuestPortalCompanion[];
    settings: GuestPortalSettings;
};

type GuestService = {
    id: string;
    category: string;
    name: string;
    description: string | null;
    price: string | null;
    discountText: string | null;
};

type TabType = 'visao-geral' | 'reservas' | 'gestao-estadia' | 'servicos' | 'cupons' | 'conectividade' | 'perfil';

/* ───── Constants ───── */

const emptySummary: GuestPortalSummary = {
    totalBookings: 0, activeReservations: 0, futureReservations: 0, completedStays: 0, pendingPaymentAmount: 0,
};

const emptySettings: GuestPortalSettings = {
    wifiNetwork: null, wifiPassword: null, condoRules: null, supportWhatsapp: null, propertyAddress: null,
};

const INHOUSE_APP_URL = 'https://inhouse.frontstay.com.br';
const SUPPORT_WHATSAPP = '553171268574';

const CATEGORY_ICONS: Record<string, string> = {
    personal_trainer: '🏋️', cleaning: '🧹', chef: '🍳', massage: '💆',
    transport: '🚗', photography: '📸', delivery: '📦', maintenance: '🔧', other: '💼',
};

const CATEGORY_LABELS: Record<string, string> = {
    personal_trainer: 'Personal Trainer', cleaning: 'Limpeza', chef: 'Chef Particular', massage: 'Massagem',
    transport: 'Transporte', photography: 'Fotografia', delivery: 'Entrega', maintenance: 'Manutenção', other: 'Outros',
};

const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'visao-geral', label: 'Visão Geral', icon: '🏠' },
    { key: 'reservas', label: 'Minhas Reservas', icon: '🏨' },
    { key: 'gestao-estadia', label: 'Gestão de Estadia', icon: '🔑' },
    { key: 'servicos', label: 'Serviços', icon: '💼' },
    { key: 'cupons', label: 'Cupons de Desconto', icon: '🎟️' },
    { key: 'conectividade', label: 'Conectividade', icon: '📶' },
    { key: 'perfil', label: 'Meu Perfil', icon: '👤' },
];

/* ───── Helpers ───── */

function formatCurrency(value: number | null) {
    if (value === null || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value: string | null) {
    if (!value) return '—';
    return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR');
}

function formatDateShort(value: string | null) {
    if (!value) return '—';
    const d = new Date(`${value}T12:00:00`);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatDateTime(value: string | null) {
    if (!value) return '—';
    return new Date(value).toLocaleString('pt-BR');
}

function getStatusLabel(status: string | null | undefined) {
    switch ((status || '').toLowerCase()) {
        case 'confirmed': return 'Confirmada';
        case 'checked_in': return 'Hospedado';
        case 'checked_out': case 'completed': return 'Finalizada';
        case 'canceled': case 'cancelled': return 'Cancelada';
        case 'not_confirmed': return 'Pendente';
        default: return status || 'Em análise';
    }
}

function getStatusColor(status: string | null | undefined) {
    switch ((status || '').toLowerCase()) {
        case 'confirmed': return 'bg-emerald-100 text-emerald-700';
        case 'checked_in': return 'bg-blue-100 text-blue-700';
        case 'checked_out': case 'completed': return 'bg-gray-100 text-gray-700';
        case 'canceled': case 'cancelled': return 'bg-red-100 text-red-700';
        case 'not_confirmed': return 'bg-amber-100 text-amber-700';
        default: return 'bg-amber-100 text-amber-700';
    }
}

function getHoursUntilCheckIn(checkInDate: string | null) {
    if (!checkInDate) return Number.POSITIVE_INFINITY;
    const timestamp = Date.parse(`${checkInDate}T14:00:00`);
    if (Number.isNaN(timestamp)) return Number.POSITIVE_INFINITY;
    return (timestamp - Date.now()) / (1000 * 60 * 60);
}

function getPaymentBadge(ps: string) {
    switch (ps) {
        case 'paid': return 'bg-emerald-100 text-emerald-700';
        case 'partial': return 'bg-amber-100 text-amber-700';
        case 'pending': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-600';
    }
}

function getPaymentLabel(ps: string) {
    switch (ps) {
        case 'paid': return 'Pago';
        case 'partial': return 'Parcial';
        case 'pending': return 'Pendente';
        default: return 'Sem baixa';
    }
}

function whatsappUrl(phone: string, msg: string) {
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
}

/* ───── Component ───── */

export default function HospedeDashboardClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [sessionEmail, setSessionEmail] = useState('');
    const [lookupEmail, setLookupEmail] = useState('');
    const [data, setData] = useState<PortalResponse>({
        guest: null, reservations: [], summary: emptySummary, companions: [], settings: emptySettings,
    });
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingReservation, setIsSavingReservation] = useState(false);
    const [isCancelingReservation, setIsCancelingReservation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedReservationId, setSelectedReservationId] = useState<string>('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [services, setServices] = useState<GuestService[]>([]);
    const [servicesLoading, setServicesLoading] = useState(false);

    const [profileForm, setProfileForm] = useState({ name: '', phone: '', city: '', state: '', country: 'BR' });
    const [reservationForm, setReservationForm] = useState({ checkInDate: '', checkOutDate: '', specialRequests: '' });

    const selectedReservation = useMemo(() => {
        return data.reservations.find(r => String(r.id) === selectedReservationId) || null;
    }, [data.reservations, selectedReservationId]);

    const whatsappNumber = data.settings.supportWhatsapp?.replace(/\D/g, '') || SUPPORT_WHATSAPP;
    const selectedCode = selectedReservation?.pmsReservationId || (selectedReservation ? String(selectedReservation.id) : '');
    const checkinUrl = selectedCode ? `${INHOUSE_APP_URL}/checkin/${selectedCode}` : `${INHOUSE_APP_URL}/checkin`;

    // Reservations split
    const activeReservations = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return data.reservations.filter(r => {
            const ci = r.checkInDate ? new Date(`${r.checkInDate}T12:00:00`) : null;
            const co = r.checkOutDate ? new Date(`${r.checkOutDate}T12:00:00`) : null;
            const st = (r.status || r.pmsStatus || '').toLowerCase();
            return ci && co && ci <= today && co >= today && !['canceled', 'cancelled'].includes(st);
        });
    }, [data.reservations]);

    const futureReservations = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return data.reservations.filter(r => {
            const ci = r.checkInDate ? new Date(`${r.checkInDate}T12:00:00`) : null;
            const st = (r.status || r.pmsStatus || '').toLowerCase();
            return ci && ci > today && !['canceled', 'cancelled'].includes(st);
        });
    }, [data.reservations]);

    const canManageReservation = Boolean(
        selectedReservation
        && !['canceled', 'cancelled', 'checked_in', 'checked_out', 'completed'].includes((selectedReservation.status || selectedReservation.pmsStatus || '').toLowerCase())
        && getHoursUntilCheckIn(selectedReservation.checkInDate) >= 48
    );

    // Sync profile form
    useEffect(() => {
        if (!data.guest) { setProfileForm({ name: '', phone: '', city: '', state: '', country: 'BR' }); return; }
        setProfileForm({ name: data.guest.name || '', phone: data.guest.phone || '', city: data.guest.city || '', state: data.guest.state || '', country: data.guest.country || 'BR' });
    }, [data.guest]);

    // Sync reservation form
    useEffect(() => {
        if (!selectedReservation) { setReservationForm({ checkInDate: '', checkOutDate: '', specialRequests: '' }); return; }
        setReservationForm({ checkInDate: selectedReservation.checkInDate || '', checkOutDate: selectedReservation.checkOutDate || '', specialRequests: selectedReservation.specialRequests || '' });
    }, [selectedReservation]);

    // Load portal
    const loadPortal = async (email: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail.includes('@')) { setErrorMessage('Informe um e-mail válido.'); setIsLoading(false); return; }

        setIsLoading(true);
        setErrorMessage('');
        try {
            const res = await fetch(`/api/guest-portal?email=${encodeURIComponent(normalizedEmail)}`, { cache: 'no-store' });
            const payload = await res.json();
            if (!res.ok || !payload?.success) throw new Error(payload?.error || 'Não foi possível carregar o portal.');

            setSessionEmail(normalizedEmail);
            setLookupEmail(normalizedEmail);
            setData({
                guest: payload.guest,
                reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
                summary: payload.summary || emptySummary,
                companions: Array.isArray(payload.companions) ? payload.companions : [],
                settings: payload.settings || emptySettings,
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem('frontstay-guest-session', JSON.stringify({ email: normalizedEmail, name: payload?.guest?.name || '' }));
            }

            const first = Array.isArray(payload.reservations) ? payload.reservations[0] : null;
            setSelectedReservationId(first ? String(first.id) : '');
        } catch (error: any) {
            setData({ guest: null, reservations: [], summary: emptySummary, companions: [], settings: emptySettings });
            setErrorMessage(error?.message || 'Erro ao carregar informações.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load services
    const loadServices = useCallback(async () => {
        setServicesLoading(true);
        try {
            const res = await fetch('/api/guest-services');
            const payload = await res.json();
            if (payload.success) setServices(payload.services || []);
        } catch { /* ignore */ } finally {
            setServicesLoading(false);
        }
    }, []);

    // Init
    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem('frontstay-guest-session') : null;
        const storedEmail = stored ? (() => { try { return JSON.parse(stored)?.email || ''; } catch { return ''; } })() : '';
        const initialEmail = emailFromQuery || storedEmail;
        if (initialEmail) { void loadPortal(initialEmail); return; }
        setIsLoading(false);
    }, [searchParams]);

    // Load services when tab changes
    useEffect(() => {
        if (activeTab === 'servicos' && services.length === 0) loadServices();
    }, [activeTab, services.length, loadServices]);

    const handleEmailLookup = async (e: React.FormEvent) => {
        e.preventDefault(); setSuccessMessage(''); await loadPortal(lookupEmail);
    };

    const setDataFromPayload = (payload: any) => {
        setData({
            guest: payload.guest,
            reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
            summary: payload.summary || emptySummary,
            companions: Array.isArray(payload.companions) ? payload.companions : data.companions,
            settings: payload.settings || data.settings,
        });
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionEmail) return;
        setIsSavingProfile(true); setErrorMessage(''); setSuccessMessage('');
        try {
            const res = await fetch('/api/guest-portal', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'profile', email: sessionEmail, ...profileForm }) });
            const payload = await res.json();
            if (!res.ok || !payload?.success) throw new Error(payload?.error || 'Erro ao atualizar cadastro.');
            setDataFromPayload(payload);
            setSuccessMessage('Cadastro atualizado com sucesso.');
        } catch (error: any) { setErrorMessage(error?.message || 'Erro ao atualizar cadastro.'); } finally { setIsSavingProfile(false); }
    };

    const handleSaveReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionEmail || !selectedReservationId) return;
        setIsSavingReservation(true); setErrorMessage(''); setSuccessMessage('');
        try {
            const res = await fetch('/api/guest-portal', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'reservation', email: sessionEmail, reservationId: selectedReservationId, ...reservationForm }) });
            const payload = await res.json();
            if (!res.ok || !payload?.success) throw new Error(payload?.error || 'Erro ao alterar reserva.');
            setDataFromPayload(payload);
            setSuccessMessage('Reserva atualizada com sucesso.');
        } catch (error: any) { setErrorMessage(error?.message || 'Erro ao alterar reserva.'); } finally { setIsSavingReservation(false); }
    };

    const handleCancelReservation = async () => {
        if (!sessionEmail || !selectedReservation) return;
        const code = selectedReservation.pmsReservationId || String(selectedReservation.id);
        if (typeof window !== 'undefined' && !window.confirm(`Deseja realmente cancelar a reserva ${code}?`)) return;
        setIsCancelingReservation(true); setErrorMessage(''); setSuccessMessage('');
        try {
            const res = await fetch('/api/guest-portal', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target: 'cancel', email: sessionEmail, reservationId: String(selectedReservation.id) }) });
            const payload = await res.json();
            if (!res.ok || !payload?.success) throw new Error(payload?.error || 'Erro ao cancelar reserva.');
            setDataFromPayload(payload);
            setSuccessMessage('Reserva cancelada com sucesso.');
        } catch (error: any) { setErrorMessage(error?.message || 'Erro ao cancelar reserva.'); } finally { setIsCancelingReservation(false); }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') window.localStorage.removeItem('frontstay-guest-session');
        router.push('/login');
    };

    const guestFirstName = data.guest?.firstName || data.guest?.name?.split(' ')[0] || '';
    const guestInitial = (data.guest?.name || 'H')[0].toUpperCase();

    /* ───── Render ───── */

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - same pattern as proprietario/admin */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="FrontStay" width={65} height={65} className="object-contain" />
                            <h1 className="text-lg font-bold text-gray-900">Hóspede</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {data.guest && (
                                <span className="hidden md:inline text-sm text-gray-600">
                                    Bem vindo, <strong>{guestFirstName}</strong>
                                </span>
                            )}
                            <div className="relative">
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">{guestInitial}</div>
                                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sair</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline font-medium hidden md:inline">Sair</button>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* ─── Tabs ─── */}
                <div className="mb-6">
                    {/* Desktop */}
                    <div className="hidden md:flex gap-1 overflow-x-auto border-b border-gray-200 pb-0">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => { setActiveTab(tab.key); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.key ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                    {/* Mobile menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => { setActiveTab(tab.key); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === tab.key ? 'bg-blue-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <span>{tab.icon}</span> {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {/* Mobile current tab */}
                    <div className="md:hidden flex gap-1 overflow-x-auto pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                            >
                                <span>{tab.icon}</span> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Email lookup (if no session) ─── */}
                {!data.guest && !isLoading && (
                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Acesse seu portal do hóspede</h2>
                        <p className="text-sm text-gray-600 mb-4">Informe o e-mail usado na reserva para visualizar suas estadias.</p>
                        <form onSubmit={handleEmailLookup} className="flex flex-col gap-3 md:flex-row md:items-end">
                            <div className="flex-1">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Seu e-mail</label>
                                <input type="email" value={lookupEmail} onChange={e => setLookupEmail(e.target.value)} placeholder="voce@exemplo.com"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-blue-900 focus:border-blue-900" />
                            </div>
                            <button type="submit" className="px-5 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors">Consultar minhas reservas</button>
                        </form>
                    </section>
                )}

                {/* Messages */}
                {errorMessage && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
                {successMessage && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div>}

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        <span className="ml-3 text-gray-600">Carregando dados...</span>
                    </div>
                )}

                {/* ═══════════════════ VISÃO GERAL ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'visao-geral' && (
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reservas Ativas</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.summary.activeReservations}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Serviços Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reservas Futuras</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.summary.futureReservations}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Hospedagens Realizadas</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.summary.completedStays}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Cupons Utilizados</p>
                                    <p className="text-2xl font-bold text-gray-900">{data.reservations.filter(r => r.promoCode).length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Main content: Reservas + Hoje sidebar */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
                            {/* Próximas Reservas */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900">Próximas Reservas</h3>
                                <p className="text-sm text-gray-500 mb-5">Suas estadias programadas</p>

                                {[...activeReservations, ...futureReservations].length === 0 ? (
                                    <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                                        Nenhuma reserva ativa ou futura encontrada.
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {[...activeReservations, ...futureReservations].map(reservation => {
                                            const status = reservation.status || reservation.pmsStatus || '';
                                            const hoursUntil = getHoursUntilCheckIn(reservation.checkInDate);
                                            const canCheckin = !reservation.checkinCompleted && hoursUntil <= 24 && hoursUntil > 0 && !['canceled', 'cancelled', 'checked_out', 'completed'].includes(status.toLowerCase());
                                            const code = reservation.pmsReservationId || String(reservation.id);
                                            const ciUrl = `${INHOUSE_APP_URL}/checkin/${code}`;
                                            const canCancel = !['canceled', 'cancelled', 'checked_in', 'checked_out', 'completed'].includes(status.toLowerCase()) && hoursUntil >= 48;

                                            return (
                                                <div key={String(reservation.id)} className="border border-gray-200 rounded-xl p-5">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900">{reservation.propertyName || reservation.roomName}</h4>
                                                            {reservation.propertyAddress && (
                                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                    {reservation.propertyAddress}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                                                            {getStatusLabel(status)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-6 mb-4 bg-gray-50 rounded-lg px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Período</p>
                                                                <p className="text-sm font-medium text-gray-900">{formatDateShort(reservation.checkInDate)} - {formatDateShort(reservation.checkOutDate)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            <div>
                                                                <p className="text-xs text-gray-500">Valor Total</p>
                                                                <p className="text-sm font-medium text-gray-900">{formatCurrency(reservation.total)}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 flex-wrap">
                                                        {canCheckin && (
                                                            <a href={ciUrl} target="_blank" rel="noreferrer"
                                                                className="flex-1 min-w-[140px] px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-bold text-center hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                Check-in
                                                            </a>
                                                        )}
                                                        <button onClick={() => { setSelectedReservationId(String(reservation.id)); setActiveTab('reservas'); }}
                                                            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                            Detalhes
                                                        </button>
                                                        {canCancel && (
                                                            <button onClick={() => { setSelectedReservationId(String(reservation.id)); handleCancelReservation(); }}
                                                                className="px-4 py-2.5 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                                                Cancelar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Hoje - sidebar */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900">Hoje</h3>
                                <p className="text-sm text-gray-500 mb-5">{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</p>

                                {activeReservations.length === 0 ? (
                                    <p className="text-sm text-gray-400">Nenhum evento para hoje.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {activeReservations.map(r => {
                                            const events: { time: string; label: string; desc: string; color: string }[] = [];
                                            if (!r.checkinCompleted) events.push({ time: '14:00', label: 'Check-in', desc: r.propertyName || r.roomName, color: 'bg-blue-900' });
                                            else events.push({ time: '14:00', label: 'Check-in realizado', desc: r.propertyName || r.roomName, color: 'bg-emerald-500' });

                                            return events.map((evt, i) => (
                                                <div key={`${r.id}-${i}`} className="flex gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-3 h-3 rounded-full ${evt.color} mt-1`} />
                                                        <div className="w-px flex-1 bg-gray-200" />
                                                    </div>
                                                    <div className={`flex-1 rounded-lg p-3 ${evt.color === 'bg-blue-900' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                                                        <p className={`text-xs font-bold ${evt.color === 'bg-blue-900' ? 'text-blue-700' : 'text-emerald-700'}`}>
                                                            <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {evt.time}
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900 mt-0.5">{evt.label}</p>
                                                        <p className="text-xs text-gray-500">{evt.desc}</p>
                                                    </div>
                                                </div>
                                            ));
                                        })}
                                    </div>
                                )}

                                <button onClick={() => setActiveTab('reservas')}
                                    className="w-full mt-5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    Ver Calendário Completo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════ MINHAS RESERVAS ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'reservas' && (
                    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                        {/* Left: List */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Minhas Reservas</h3>
                                        <p className="text-sm text-gray-500">{data.summary.totalBookings} reserva(s) encontrada(s)</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {data.reservations.length === 0 ? (
                                        <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
                                            Nenhuma reserva encontrada.
                                        </div>
                                    ) : data.reservations.map(reservation => {
                                        const status = reservation.status || reservation.pmsStatus;
                                        return (
                                            <button key={String(reservation.id)} type="button" onClick={() => setSelectedReservationId(String(reservation.id))}
                                                className={`w-full rounded-xl border p-4 text-left transition ${selectedReservationId === String(reservation.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{reservation.propertyName || reservation.roomName}</p>
                                                        <p className="text-sm text-gray-500 mt-1">{formatDate(reservation.checkInDate)} → {formatDate(reservation.checkOutDate)}</p>
                                                        {reservation.pmsReservationId && <p className="text-xs text-gray-400 mt-1">#{reservation.pmsReservationId}</p>}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>{getStatusLabel(status)}</span>
                                                        <span className="text-sm font-bold text-gray-900">{formatCurrency(reservation.total)}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: Detail */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Detalhes da Reserva</h3>
                                {selectedReservation ? (
                                    <>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xl font-bold text-gray-900">{selectedReservation.propertyName || selectedReservation.roomName}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedReservation.status || selectedReservation.pmsStatus)}`}>{getStatusLabel(selectedReservation.status || selectedReservation.pmsStatus)}</span>
                                        </div>
                                        {selectedReservation.propertyAddress && <p className="text-sm text-gray-500 mb-3">{selectedReservation.propertyAddress}</p>}

                                        <div className="grid gap-3 sm:grid-cols-2 mb-4">
                                            <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Período</span><br /><span className="font-medium">{formatDate(selectedReservation.checkInDate)} → {formatDate(selectedReservation.checkOutDate)}</span></div>
                                            <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Pagamento</span><br /><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold mr-2 ${getPaymentBadge(selectedReservation.paymentStatus)}`}>{getPaymentLabel(selectedReservation.paymentStatus)}</span><span className="font-medium">{formatCurrency(selectedReservation.total)}</span></div>
                                            <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Check-in online</span><br /><span className="font-medium">{selectedReservation.checkinCompleted ? '✓ Concluído' : selectedReservation.checkinLinkSent ? 'Link enviado' : 'Pendente'}</span></div>
                                            <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Código de acesso</span><br /><span className="font-medium font-mono">{selectedReservation.accessCode || 'Liberado mais perto da entrada'}</span></div>
                                        </div>

                                        {selectedReservation.balance && selectedReservation.balance > 0 ? (
                                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800 mb-4">
                                                <strong>Saldo pendente: {formatCurrency(selectedReservation.balance)}</strong>
                                                <br />
                                                <a href={whatsappUrl(whatsappNumber, `Olá! Quero regularizar o pagamento da reserva ${selectedCode}.`)} target="_blank" rel="noreferrer" className="text-red-700 underline text-xs mt-1 inline-block">Quitar saldo com suporte</a>
                                            </div>
                                        ) : null}

                                        <div className="flex gap-2 flex-wrap">
                                            <a href={checkinUrl} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors">Abrir check-in</a>
                                            <a href={whatsappUrl(whatsappNumber, `Olá! Preciso de ajuda com a reserva ${selectedCode}.`)} target="_blank" rel="noreferrer" className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Suporte</a>
                                            <button type="button" onClick={handleCancelReservation} disabled={!canManageReservation || isCancelingReservation}
                                                className="px-4 py-2.5 border border-red-200 bg-red-50 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                                {isCancelingReservation ? 'Cancelando...' : 'Cancelar reserva'}
                                            </button>
                                        </div>

                                        {/* Timeline */}
                                        {selectedReservation.timeline.length > 0 && (
                                            <div className="mt-5 border-t border-gray-100 pt-5">
                                                <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Timeline</h4>
                                                <div className="space-y-3">
                                                    {selectedReservation.timeline.map(item => (
                                                        <div key={item.id} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                                                            <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${item.tone === 'success' ? 'bg-emerald-500' : item.tone === 'warning' ? 'bg-amber-500' : item.tone === 'info' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                                            <div>
                                                                <span className="font-semibold text-gray-900">{item.label}</span>
                                                                <span className="text-xs text-gray-400 ml-2">{item.createdAt ? formatDateTime(item.createdAt) : ''}</span>
                                                                <p className="text-gray-600 mt-0.5">{item.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
                                        Selecione uma reserva para ver detalhes.
                                    </div>
                                )}
                            </div>

                            {/* Edit reservation */}
                            {selectedReservation && canManageReservation && (
                                <form onSubmit={handleSaveReservation} className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Editar Reserva</h3>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <input type="date" value={reservationForm.checkInDate} onChange={e => setReservationForm(f => ({ ...f, checkInDate: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                        <input type="date" value={reservationForm.checkOutDate} onChange={e => setReservationForm(f => ({ ...f, checkOutDate: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                    </div>
                                    <textarea value={reservationForm.specialRequests} onChange={e => setReservationForm(f => ({ ...f, specialRequests: e.target.value }))} placeholder="Solicitações especiais" rows={3}
                                        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                    <button type="submit" disabled={isSavingReservation} className="mt-3 w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 disabled:opacity-50">
                                        {isSavingReservation ? 'Salvando...' : 'Salvar alteração'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════ GESTÃO DE ESTADIA ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'gestao-estadia' && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Check-in / Check-out</h3>
                            <div className="space-y-3">
                                <a href={checkinUrl} target="_blank" rel="noreferrer" className="block w-full px-4 py-3 bg-emerald-600 text-white rounded-lg text-sm font-bold text-center hover:bg-emerald-500 transition-colors">✅ Fazer check-in online</a>
                                <a href={whatsappUrl(whatsappNumber, `Olá! Gostaria de solicitar check-out${selectedCode ? ` da reserva ${selectedCode}` : ''}.`)} target="_blank" rel="noreferrer"
                                    className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-50">{selectedReservation?.checkinCompleted ? '✓ Check-in concluído' : 'Solicitar check-out'}</a>
                                <p className="text-xs text-gray-500">Check-in disponível 24h antes da data reservada</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Código de Acesso</h3>
                            {selectedReservation?.accessCode ? (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                                    <p className="text-sm text-emerald-700">Seu código de acesso</p>
                                    <p className="mt-1 text-3xl font-bold tracking-widest text-emerald-800">{selectedReservation.accessCode}</p>
                                    <p className="mt-2 text-xs text-emerald-600">Válido durante o período da sua estadia</p>
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">O código será liberado após o check-in.</div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Visitantes</h3>
                            <a href={whatsappUrl(whatsappNumber, `Olá! Gostaria de autorizar um visitante${selectedCode ? ` para a reserva ${selectedCode}` : ''}.`)} target="_blank" rel="noreferrer"
                                className="block w-full px-4 py-3 bg-blue-900 text-white rounded-lg text-sm font-bold text-center hover:bg-blue-800 mb-2">Autorizar visitante</a>
                            <p className="text-xs text-gray-500">Gerencie quem pode acessar o edifício durante sua estadia</p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Portaria e Concierge</h3>
                            <a href={whatsappUrl(whatsappNumber, `Olá! Preciso de apoio${selectedCode ? ` com a reserva ${selectedCode}` : ''}.`)} target="_blank" rel="noreferrer"
                                className="block w-full px-4 py-3 bg-blue-900 text-white rounded-lg text-sm font-bold text-center hover:bg-blue-800 mb-2">💬 Enviar mensagem</a>
                            <a href={whatsappUrl(whatsappNumber, `Olá! Gostaria de saber sobre encomendas${selectedCode ? ` da reserva ${selectedCode}` : ''}.`)} target="_blank" rel="noreferrer"
                                className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-50">📦 Consultar encomendas</a>
                        </div>

                        {(data.settings.wifiNetwork || data.settings.wifiPassword) && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">WiFi</h3>
                                {data.settings.wifiNetwork && <div className="rounded-lg bg-gray-50 p-3 text-sm mb-2"><span className="text-gray-500">Rede</span><br /><span className="font-medium">{data.settings.wifiNetwork}</span></div>}
                                {data.settings.wifiPassword && <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Senha</span><br /><span className="font-mono font-medium">{data.settings.wifiPassword}</span></div>}
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Documentos e Regras</h3>
                            <a href="/termos-de-servico" className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-50 mb-2">📄 Termos de serviço</a>
                            <a href="/politica-de-privacidade" className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium text-center hover:bg-gray-50">🔐 Política de privacidade</a>
                        </div>

                        {/* Companions */}
                        {data.companions.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-2">
                                <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Acompanhantes</h3>
                                <div className="space-y-2">
                                    {data.companions.map(c => (
                                        <div key={c.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
                                            <div><span className="font-medium text-gray-900">{c.name}</span><br /><span className="text-xs text-gray-500">{[c.email, c.phone].filter(Boolean).join(' • ') || 'Sem dados'}</span></div>
                                            {c.isPrimary && <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">Principal</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {data.settings.condoRules && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 md:col-span-2">
                                <h3 className="text-sm uppercase tracking-wide text-blue-700 mb-3">Regras do Condomínio</h3>
                                <div className="whitespace-pre-line text-sm text-blue-900">{data.settings.condoRules}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════ SERVIÇOS ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'servicos' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Serviços Disponíveis</h3>
                            <p className="text-sm text-gray-500 mb-5">Profissionais e serviços para sua estadia</p>

                            {servicesLoading ? (
                                <div className="flex items-center justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /><span className="ml-2 text-sm text-gray-600">Carregando...</span></div>
                            ) : services.length === 0 ? (
                                <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                                    Nenhum serviço disponível no momento. Em breve teremos parceiros cadastrados.
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {services.map(service => (
                                        <div key={service.id} className="rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-3">
                                                <div className="text-2xl">{CATEGORY_ICONS[service.category] || '💼'}</div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900">{service.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{CATEGORY_LABELS[service.category] || service.category}</p>
                                                    {service.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{service.description}</p>}
                                                    {service.price && <p className="text-sm font-medium text-blue-700 mt-2">{service.price}</p>}
                                                    {service.discountText && <p className="text-xs text-emerald-600 mt-1">{service.discountText}</p>}
                                                    <a href={whatsappUrl(whatsappNumber, `Olá! Gostaria de agendar ${service.name}${selectedCode ? ` para a reserva ${selectedCode}` : ''}.`)}
                                                        target="_blank" rel="noreferrer"
                                                        className="mt-3 block w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold text-center hover:bg-blue-800 transition-colors">
                                                        Agendar
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Building services */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Serviços do Edifício</h3>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { icon: '🧹', name: 'Limpeza', msg: 'Olá! Gostaria de solicitar limpeza.' },
                                    { icon: '📦', name: 'Encomendas', msg: 'Olá! Gostaria de saber sobre encomendas.' },
                                    { icon: '👥', name: 'Visitantes', msg: 'Olá! Gostaria de autorizar um visitante.' },
                                    { icon: '💬', name: 'Portaria', msg: 'Olá! Preciso falar com a portaria.' },
                                ].map(item => (
                                    <a key={item.name} href={whatsappUrl(whatsappNumber, selectedCode ? `${item.msg.slice(0, -1)} para a reserva ${selectedCode}.` : item.msg)}
                                        target="_blank" rel="noreferrer" className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center hover:bg-gray-100 transition-colors">
                                        <div className="text-2xl">{item.icon}</div>
                                        <div className="mt-2 text-sm font-semibold text-gray-800">{item.name}</div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Common areas */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Áreas Comuns</h3>
                            <p className="text-sm text-gray-600 mb-4">Solicite a reserva de áreas comuns do edifício</p>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { icon: '🏊', name: 'Piscina', hours: '08:00 - 20:00' },
                                    { icon: '🏋️', name: 'Academia', hours: '06:00 - 22:00' },
                                    { icon: '🎉', name: 'Salão de Festas', hours: 'Cap. 40 pessoas' },
                                    { icon: '💼', name: 'Sala de Reunião', hours: 'Cap. 12 pessoas' },
                                    { icon: '🧘', name: 'Espaço Zen', hours: 'Yoga e Meditação' },
                                    { icon: '🎮', name: 'Espaço Gamer', hours: 'Jogos e Entretenimento' },
                                ].map(area => (
                                    <div key={area.name} className="rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                        <div className="text-3xl">{area.icon}</div>
                                        <p className="mt-2 font-bold text-gray-900">{area.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{area.hours}</p>
                                        <a href={whatsappUrl(whatsappNumber, `Olá! Gostaria de reservar ${area.name}${selectedCode ? ` para a reserva ${selectedCode}` : ''}.`)}
                                            target="_blank" rel="noreferrer"
                                            className="mt-3 block w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-sm font-bold text-center hover:bg-blue-800 transition-colors">
                                            Reservar
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════ CUPONS DE DESCONTO ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'cupons' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Cupons de Desconto</h3>
                            <p className="text-sm text-gray-500 mb-5">Seus cupons e promoções de parceiros</p>

                            {data.reservations.filter(r => r.promoCode).length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700">Cupons utilizados nas suas reservas</h4>
                                    {data.reservations.filter(r => r.promoCode).map(r => (
                                        <div key={String(r.id)} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div>
                                                <span className="text-sm font-mono font-bold text-blue-700">{r.promoCode}</span>
                                                <p className="text-xs text-gray-500 mt-0.5">{r.propertyName || r.roomName} · {formatDate(r.checkInDate)}</p>
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">Utilizado</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                                    Nenhum cupom utilizado ainda. Fique de olho nas promoções dos nossos parceiros!
                                </div>
                            )}

                            {services.filter(s => s.discountText).length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Descontos de parceiros para hóspedes</h4>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {services.filter(s => s.discountText).map(s => (
                                            <div key={s.id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                                <p className="text-sm font-bold text-gray-900">{s.name}</p>
                                                <p className="text-sm text-emerald-700 mt-1">{s.discountText}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════════════ CONECTIVIDADE ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'conectividade' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Conectividade</h3>
                            <p className="text-sm text-gray-500 mb-5">Informações de WiFi e acesso digital</p>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">WiFi do Apartamento</h4>
                                    {data.settings.wifiNetwork || data.settings.wifiPassword ? (
                                        <div className="space-y-2">
                                            {data.settings.wifiNetwork && (
                                                <div className="rounded-lg bg-gray-50 p-4"><span className="text-sm text-gray-500">Rede</span><br /><span className="text-lg font-bold text-gray-900">{data.settings.wifiNetwork}</span></div>
                                            )}
                                            {data.settings.wifiPassword && (
                                                <div className="rounded-lg bg-gray-50 p-4"><span className="text-sm text-gray-500">Senha</span><br /><span className="text-lg font-mono font-bold text-gray-900">{data.settings.wifiPassword}</span></div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
                                            As informações de WiFi serão disponibilizadas após o check-in.
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Acesso Digital</h4>
                                    {selectedReservation?.accessCode ? (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                                            <p className="text-sm text-emerald-700">Código de acesso à fechadura</p>
                                            <p className="mt-2 text-4xl font-bold tracking-widest text-emerald-800">{selectedReservation.accessCode}</p>
                                            <p className="mt-3 text-xs text-emerald-600">Válido durante o período da sua estadia</p>
                                        </div>
                                    ) : (
                                        <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-500">
                                            O código de acesso será liberado após o check-in.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <a href={whatsappUrl(whatsappNumber, `Olá! Estou com problemas de conectividade${selectedCode ? ` na reserva ${selectedCode}` : ''}.`)}
                                    target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    💬 Problemas com acesso? Fale conosco
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════ MEU PERFIL ═══════════════════ */}
                {!isLoading && data.guest && activeTab === 'perfil' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Meu Perfil</h3>
                            <p className="text-sm text-gray-500 mb-5">Atualize suas informações de cadastro</p>

                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">{guestInitial}</div>
                                <div>
                                    <p className="font-bold text-gray-900">{data.guest.name}</p>
                                    <p className="text-sm text-gray-500">{data.guest.email}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                                    <input type="text" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <input type="text" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                        <input type="text" value={profileForm.city} onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <input type="text" value={profileForm.state} onChange={e => setProfileForm(f => ({ ...f, state: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" />
                                    </div>
                                </div>
                                <button type="submit" disabled={isSavingProfile} className="w-full px-4 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-bold hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {isSavingProfile ? 'Salvando...' : 'Atualizar cadastro'}
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 mb-4">Informações da conta</h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">E-mail</span><br /><span className="font-medium">{data.guest.email}</span></div>
                                <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Telefone</span><br /><span className="font-medium">{data.guest.phone || 'Não informado'}</span></div>
                                <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Primeiro acesso</span><br /><span className="font-medium">{data.guest.firstSeenAt ? formatDateTime(data.guest.firstSeenAt) : '—'}</span></div>
                                <div className="rounded-lg bg-gray-50 p-3 text-sm"><span className="text-gray-500">Último acesso</span><br /><span className="font-medium">{data.guest.lastSeenAt ? formatDateTime(data.guest.lastSeenAt) : '—'}</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

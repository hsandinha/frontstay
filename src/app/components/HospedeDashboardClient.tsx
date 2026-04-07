'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
    source: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

type GuestPortalSummary = {
    totalBookings: number;
    activeReservations: number;
    futureReservations: number;
    completedStays: number;
    pendingPaymentAmount: number;
};

type PortalResponse = {
    guest: GuestPortalGuest | null;
    reservations: GuestPortalReservation[];
    summary: GuestPortalSummary;
};

const emptySummary: GuestPortalSummary = {
    totalBookings: 0,
    activeReservations: 0,
    futureReservations: 0,
    completedStays: 0,
    pendingPaymentAmount: 0,
};

function formatCurrency(value: number | null) {
    if (value === null || !Number.isFinite(value)) return '—';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

function formatDate(value: string | null) {
    if (!value) return '—';

    return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR');
}

function getPaymentBadge(paymentStatus: GuestPortalReservation['paymentStatus']) {
    switch (paymentStatus) {
        case 'paid':
            return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        case 'partial':
            return 'border-amber-200 bg-amber-50 text-amber-700';
        case 'pending':
            return 'border-rose-200 bg-rose-50 text-rose-700';
        default:
            return 'border-slate-200 bg-slate-50 text-slate-700';
    }
}

function getPaymentLabel(paymentStatus: GuestPortalReservation['paymentStatus']) {
    switch (paymentStatus) {
        case 'paid':
            return 'Pago';
        case 'partial':
            return 'Parcial';
        case 'pending':
            return 'Pendente';
        default:
            return 'Sem baixa';
    }
}

export default function HospedeDashboardClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [sessionEmail, setSessionEmail] = useState('');
    const [lookupEmail, setLookupEmail] = useState('');
    const [data, setData] = useState<PortalResponse>({
        guest: null,
        reservations: [],
        summary: emptySummary,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingReservation, setIsSavingReservation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedReservationId, setSelectedReservationId] = useState<string>('');
    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
        city: '',
        state: '',
        country: 'BR',
    });
    const [reservationForm, setReservationForm] = useState({
        checkInDate: '',
        checkOutDate: '',
        specialRequests: '',
    });

    const selectedReservation = useMemo(() => {
        return data.reservations.find((reservation) => String(reservation.id) === selectedReservationId) || null;
    }, [data.reservations, selectedReservationId]);

    useEffect(() => {
        if (!data.guest) {
            setProfileForm({
                name: '',
                phone: '',
                city: '',
                state: '',
                country: 'BR',
            });
            return;
        }

        setProfileForm({
            name: data.guest.name || '',
            phone: data.guest.phone || '',
            city: data.guest.city || '',
            state: data.guest.state || '',
            country: data.guest.country || 'BR',
        });
    }, [data.guest]);

    useEffect(() => {
        if (!selectedReservation) {
            setReservationForm({
                checkInDate: '',
                checkOutDate: '',
                specialRequests: '',
            });
            return;
        }

        setReservationForm({
            checkInDate: selectedReservation.checkInDate || '',
            checkOutDate: selectedReservation.checkOutDate || '',
            specialRequests: selectedReservation.specialRequests || '',
        });
    }, [selectedReservation]);

    const loadPortal = async (email: string) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.includes('@')) {
            setErrorMessage('Informe um e-mail válido para acessar o painel.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await fetch(`/api/guest-portal?email=${encodeURIComponent(normalizedEmail)}`, {
                cache: 'no-store',
            });
            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error || 'Não foi possível carregar o portal do hóspede.');
            }

            setSessionEmail(normalizedEmail);
            setLookupEmail(normalizedEmail);
            setData({
                guest: payload.guest,
                reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
                summary: payload.summary || emptySummary,
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem('frontstay-guest-session', JSON.stringify({
                    email: normalizedEmail,
                    name: payload?.guest?.name || '',
                }));
            }

            const firstReservation = Array.isArray(payload.reservations) ? payload.reservations[0] : null;
            setSelectedReservationId(firstReservation ? String(firstReservation.id) : '');
        } catch (error: any) {
            setData({ guest: null, reservations: [], summary: emptySummary });
            setErrorMessage(error?.message || 'Não foi possível carregar suas informações.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        const storedSession = typeof window !== 'undefined'
            ? window.localStorage.getItem('frontstay-guest-session')
            : null;

        const storedEmail = storedSession
            ? (() => {
                try {
                    const parsed = JSON.parse(storedSession);
                    return typeof parsed?.email === 'string' ? parsed.email : '';
                } catch {
                    return '';
                }
            })()
            : '';

        const initialEmail = emailFromQuery || storedEmail;

        if (initialEmail) {
            void loadPortal(initialEmail);
            return;
        }

        setIsLoading(false);
    }, [searchParams]);

    const handleEmailLookup = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccessMessage('');
        await loadPortal(lookupEmail);
    };

    const handleSaveProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!sessionEmail) return;

        setIsSavingProfile(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/guest-portal', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target: 'profile',
                    email: sessionEmail,
                    ...profileForm,
                }),
            });
            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error || 'Não foi possível atualizar o cadastro.');
            }

            setData({
                guest: payload.guest,
                reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
                summary: payload.summary || emptySummary,
            });
            setSuccessMessage(payload?.message || 'Cadastro atualizado com sucesso.');
        } catch (error: any) {
            setErrorMessage(error?.message || 'Não foi possível atualizar o cadastro.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSaveReservation = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!sessionEmail || !selectedReservationId) return;

        setIsSavingReservation(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/guest-portal', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target: 'reservation',
                    email: sessionEmail,
                    reservationId: selectedReservationId,
                    ...reservationForm,
                }),
            });
            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error || 'Não foi possível alterar a reserva.');
            }

            setData({
                guest: payload.guest,
                reservations: Array.isArray(payload.reservations) ? payload.reservations : [],
                summary: payload.summary || emptySummary,
            });
            setSuccessMessage(payload?.message || 'Reserva atualizada com sucesso.');
        } catch (error: any) {
            setErrorMessage(error?.message || 'Não foi possível alterar a reserva.');
        } finally {
            setIsSavingReservation(false);
        }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('frontstay-guest-session');
        }

        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FrontStay • Portal do hóspede</p>
                        <h1 className="mt-1 text-2xl font-semibold text-slate-950">Acompanhe sua reserva em tempo real</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Voltar ao site
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <form onSubmit={handleEmailLookup} className="flex flex-col gap-3 md:flex-row md:items-end">
                        <div className="flex-1">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Seu e-mail</label>
                            <input
                                type="email"
                                value={lookupEmail}
                                onChange={(event) => setLookupEmail(event.target.value)}
                                placeholder="voce@exemplo.com"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Consultar minhas reservas
                        </button>
                    </form>

                    {errorMessage ? (
                        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorMessage}
                        </div>
                    ) : null}

                    {successMessage ? (
                        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            {successMessage}
                        </div>
                    ) : null}
                </section>

                {isLoading ? (
                    <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                        Carregando dados do backend compartilhado...
                    </section>
                ) : null}

                {!isLoading && data.guest ? (
                    <>
                        <section className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Reservas ativas</div>
                                <div className="mt-2 text-3xl font-semibold text-slate-950">{data.summary.activeReservations}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Reservas futuras</div>
                                <div className="mt-2 text-3xl font-semibold text-slate-950">{data.summary.futureReservations}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Hospedagens realizadas</div>
                                <div className="mt-2 text-3xl font-semibold text-slate-950">{data.summary.completedStays}</div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Pagamento pendente</div>
                                <div className="mt-2 text-2xl font-semibold text-slate-950">{formatCurrency(data.summary.pendingPaymentAmount)}</div>
                            </div>
                        </section>

                        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <div className="text-xs uppercase tracking-wide text-slate-500">Cadastro compartilhado</div>
                                            <h2 className="mt-1 text-xl font-semibold text-slate-950">{data.guest.name}</h2>
                                        </div>
                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {data.summary.totalBookings} reserva(s)
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl bg-slate-50 p-3 text-sm">
                                            <div className="text-slate-500">E-mail</div>
                                            <div className="font-medium text-slate-900">{data.guest.email}</div>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 p-3 text-sm">
                                            <div className="text-slate-500">Telefone</div>
                                            <div className="font-medium text-slate-900">{data.guest.phone || 'Não informado'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">Minhas reservas</div>
                                    <div className="mt-4 space-y-3">
                                        {data.reservations.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                                Ainda não encontramos reservas vinculadas a este e-mail.
                                            </div>
                                        ) : data.reservations.map((reservation) => (
                                            <button
                                                key={String(reservation.id)}
                                                type="button"
                                                onClick={() => setSelectedReservationId(String(reservation.id))}
                                                className={`w-full rounded-xl border p-4 text-left transition ${selectedReservationId === String(reservation.id) ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                            >
                                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                    <div>
                                                        <div className="text-base font-semibold text-slate-950">{reservation.roomName}</div>
                                                        <div className="mt-1 text-sm text-slate-600">
                                                            {formatDate(reservation.checkInDate)} → {formatDate(reservation.checkOutDate)}
                                                        </div>
                                                        {reservation.pmsReservationId ? (
                                                            <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                                Cloudbeds #{reservation.pmsReservationId}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                    <div className="flex flex-col gap-2 text-right">
                                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentBadge(reservation.paymentStatus)}`}>
                                                            {getPaymentLabel(reservation.paymentStatus)}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-900">{formatCurrency(reservation.total)}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">Meu perfil</div>
                                    <div className="mt-4 grid gap-3">
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                                            placeholder="Nome completo"
                                            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                        <input
                                            type="text"
                                            value={profileForm.phone}
                                            onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                                            placeholder="Telefone"
                                            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                        />
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <input
                                                type="text"
                                                value={profileForm.city}
                                                onChange={(event) => setProfileForm((current) => ({ ...current, city: event.target.value }))}
                                                placeholder="Cidade"
                                                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                            <input
                                                type="text"
                                                value={profileForm.state}
                                                onChange={(event) => setProfileForm((current) => ({ ...current, state: event.target.value }))}
                                                placeholder="Estado"
                                                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSavingProfile}
                                        className="mt-4 w-full rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSavingProfile ? 'Salvando...' : 'Atualizar cadastro'}
                                    </button>
                                </form>

                                <form onSubmit={handleSaveReservation} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">Alterar reserva</div>

                                    {selectedReservation ? (
                                        <>
                                            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                                                <div className="font-semibold text-slate-900">{selectedReservation.roomName}</div>
                                                <div className="mt-1">Pagamento: {formatCurrency(selectedReservation.paidAmount)} pago • saldo {formatCurrency(selectedReservation.balance)}</div>
                                            </div>

                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                <input
                                                    type="date"
                                                    value={reservationForm.checkInDate}
                                                    onChange={(event) => setReservationForm((current) => ({ ...current, checkInDate: event.target.value }))}
                                                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                />
                                                <input
                                                    type="date"
                                                    value={reservationForm.checkOutDate}
                                                    onChange={(event) => setReservationForm((current) => ({ ...current, checkOutDate: event.target.value }))}
                                                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                                />
                                            </div>

                                            <textarea
                                                value={reservationForm.specialRequests}
                                                onChange={(event) => setReservationForm((current) => ({ ...current, specialRequests: event.target.value }))}
                                                placeholder="Solicitações especiais ou ajustes da reserva"
                                                rows={4}
                                                className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                                            />

                                            <button
                                                type="submit"
                                                disabled={isSavingReservation}
                                                className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSavingReservation ? 'Salvando alteração...' : 'Salvar alteração da reserva'}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                            Selecione uma reserva para visualizar pagamento e fazer alterações.
                                        </div>
                                    )}
                                </form>
                            </div>
                        </section>
                    </>
                ) : null}
            </main>
        </div>
    );
}

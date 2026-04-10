'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type TabType = 'visao-geral' | 'reservas' | 'financeiro' | 'documentos';

type Unit = {
    id: string;
    unitName: string;
    roomName: string;
    floor: string | null;
    unitType: string;
    bedrooms: number;
    maxGuests: number;
    active: boolean;
    revenueSharePercent: number;
};

type Property = {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    city: string | null;
    state: string;
    active: boolean;
    units: Unit[];
};

type Reservation = {
    id: string;
    guestName: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    status: string;
    pmsStatus: string;
    propertyId: string;
};

type Stats = {
    totalUnits: number;
    activeReservations: number;
    occupancyRate: number;
    totalProperties: number;
};

type FinancialRecord = {
    id: string;
    type: 'revenue' | 'expense';
    category: string;
    description: string | null;
    amount: number;
    referenceMonth: string;
    unitId: string | null;
    unitName: string;
    createdAt: string;
};

type FinancialSummary = {
    totalRevenue: number;
    totalExpense: number;
    net: number;
};

type Document = {
    id: string;
    category: string;
    title: string;
    fileUrl: string;
    fileSizeBytes: number | null;
    mimeType: string | null;
    unitId: string | null;
    unitName: string;
    createdAt: string;
};

function statusLabel(status: string) {
    const map: Record<string, { label: string; color: string }> = {
        confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
        checked_in: { label: 'Hospedado', color: 'bg-blue-100 text-blue-800' },
        checked_out: { label: 'Check-out', color: 'bg-gray-100 text-gray-700' },
        canceled: { label: 'Cancelada', color: 'bg-red-100 text-red-700' },
        no_show: { label: 'No-show', color: 'bg-yellow-100 text-yellow-800' },
        not_confirmed: { label: 'Pendente', color: 'bg-orange-100 text-orange-800' },
    };
    return map[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
}

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}

export default function ProprietarioDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [stats, setStats] = useState<Stats>({ totalUnits: 0, activeReservations: 0, occupancyRate: 0, totalProperties: 0 });
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [reservationFilter, setReservationFilter] = useState<'all' | 'active' | 'past'>('all');

    // Financeiro
    const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
    const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({ totalRevenue: 0, totalExpense: 0, net: 0 });
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [finLoading, setFinLoading] = useState(false);

    // Documentos
    const [documents, setDocuments] = useState<Document[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);
    const [docCategoryFilter, setDocCategoryFilter] = useState<string>('all');

    useEffect(() => {
        fetch('/api/owner/dashboard')
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) { router.push('/login'); return; }
                    throw new Error('Erro ao carregar dados');
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setProperties(data.properties || []);
                setReservations(data.reservations || []);
                setStats(data.stats || { totalUnits: 0, activeReservations: 0, occupancyRate: 0, totalProperties: 0 });
                if (data.properties?.length > 0) {
                    setSelectedPropertyId(data.properties[0].id);
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [router]);

    // Load financials when tab changes or month filter changes
    useEffect(() => {
        if (activeTab !== 'financeiro') return;
        setFinLoading(true);
        const url = selectedMonth ? `/api/owner/financials?month=${selectedMonth}` : '/api/owner/financials';
        fetch(url)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!data) return;
                setFinancialRecords(data.records || []);
                setFinancialSummary(data.summary || { totalRevenue: 0, totalExpense: 0, net: 0 });
                if (!selectedMonth && data.months?.length > 0) {
                    setAvailableMonths(data.months);
                }
            })
            .finally(() => setFinLoading(false));
    }, [activeTab, selectedMonth]);

    // Load documents when tab changes
    useEffect(() => {
        if (activeTab !== 'documentos') return;
        setDocsLoading(true);
        fetch('/api/owner/documents')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (!data) return;
                setDocuments(data.documents || []);
            })
            .finally(() => setDocsLoading(false));
    }, [activeTab]);

    const handleLogout = async () => {
        const { createClient } = await import('@/lib/supabase-browser');
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];
    const today = new Date().toISOString().split('T')[0];

    const filteredReservations = reservations.filter(r => {
        if (selectedPropertyId && r.propertyId !== selectedPropertyId) return false;
        if (reservationFilter === 'active') return r.checkOut >= today && !['canceled', 'no_show'].includes(r.status);
        if (reservationFilter === 'past') return r.checkOut < today || ['canceled', 'no_show'].includes(r.status);
        return true;
    });

    const tabs: { key: TabType; label: string; icon: string }[] = [
        { key: 'visao-geral', label: 'Visão Geral', icon: '📊' },
        { key: 'reservas', label: 'Reservas', icon: '📋' },
        { key: 'financeiro', label: 'Financeiro', icon: '💰' },
        { key: 'documentos', label: 'Documentos', icon: '📄' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="FrontStay" width={65} height={65} className="object-contain" />
                            <h1 className="text-lg font-bold text-gray-900">Proprietário</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">P</div>
                                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sair</button>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Tabs */}
                <div className="mb-6 flex gap-1 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setIsMobileMenuOpen(false); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        <span className="ml-3 text-gray-600">Carregando dados...</span>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* No properties */}
                {!loading && !error && properties.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-4">🏢</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Nenhum imóvel vinculado</h2>
                        <p className="text-gray-600">Entre em contato com a administração para vincular seus imóveis.</p>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && properties.length > 0 && (
                    <>
                        {/* Property selector */}
                        {properties.length > 1 && (
                            <div className="mb-6">
                                <select
                                    value={selectedPropertyId || ''}
                                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                                >
                                    {properties.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* ──────── VISÃO GERAL ──────── */}
                        {activeTab === 'visao-geral' && selectedProperty && (
                            <div className="space-y-6">
                                {/* Stats cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Imóveis</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Unidades</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalUnits}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Reservas Ativas</p>
                                        <p className="text-2xl font-bold text-blue-700">{stats.activeReservations}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Ocupação</p>
                                        <p className="text-2xl font-bold text-green-700">{stats.occupancyRate}%</p>
                                    </div>
                                </div>

                                {/* Property info */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedProperty.name}</h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {[selectedProperty.address, selectedProperty.city, selectedProperty.state].filter(Boolean).join(', ')}
                                    </p>

                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Suas Unidades</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {selectedProperty.units.map(unit => (
                                            <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-gray-900">{unit.unitName}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${unit.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                        {unit.active ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 space-y-1">
                                                    {unit.floor && <p>Andar: {unit.floor}</p>}
                                                    <p>{unit.bedrooms} quarto(s) · até {unit.maxGuests} hósp.</p>
                                                    {unit.revenueSharePercent > 0 && (
                                                        <p className="text-blue-600 font-medium">Receita: {unit.revenueSharePercent}%</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent reservations preview */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-gray-700">Reservas Recentes</h3>
                                        <button onClick={() => setActiveTab('reservas')} className="text-xs text-blue-600 hover:underline">Ver todas</button>
                                    </div>
                                    {filteredReservations.length === 0 ? (
                                        <p className="text-sm text-gray-500">Nenhuma reserva encontrada.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredReservations.slice(0, 5).map(r => {
                                                const s = statusLabel(r.status);
                                                return (
                                                    <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{r.guestName || 'Hóspede'}</p>
                                                            <p className="text-xs text-gray-500">{r.roomName} · {formatDate(r.checkIn)} → {formatDate(r.checkOut)}</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ──────── RESERVAS ──────── */}
                        {activeTab === 'reservas' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    {(['all', 'active', 'past'] as const).map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setReservationFilter(f)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${reservationFilter === f ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {f === 'all' ? 'Todas' : f === 'active' ? 'Ativas' : 'Passadas'}
                                        </button>
                                    ))}
                                </div>

                                {filteredReservations.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                        <p className="text-gray-500">Nenhuma reserva encontrada com este filtro.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Hóspede</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Quarto</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Check-in</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Check-out</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredReservations.map(r => {
                                                        const s = statusLabel(r.status);
                                                        return (
                                                            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="px-4 py-3 font-medium text-gray-900">{r.guestName || '—'}</td>
                                                                <td className="px-4 py-3 text-gray-600">{r.roomName}</td>
                                                                <td className="px-4 py-3 text-gray-600">{formatDate(r.checkIn)}</td>
                                                                <td className="px-4 py-3 text-gray-600">{formatDate(r.checkOut)}</td>
                                                                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span></td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──────── FINANCEIRO ──────── */}
                        {activeTab === 'financeiro' && (
                            <div className="space-y-6">
                                {/* Summary cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Receita Total</p>
                                        <p className="text-2xl font-bold text-green-700">R$ {financialSummary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Despesas</p>
                                        <p className="text-2xl font-bold text-red-600">R$ {financialSummary.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Resultado Líquido</p>
                                        <p className={`text-2xl font-bold ${financialSummary.net >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                            R$ {financialSummary.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                {/* Month filter */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-gray-600">Filtrar por mês:</label>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                                    >
                                        <option value="">Todos</option>
                                        {availableMonths.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Records table */}
                                {finLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                                        <span className="ml-2 text-sm text-gray-600">Carregando financeiro...</span>
                                    </div>
                                ) : financialRecords.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                        <div className="text-4xl mb-3">💰</div>
                                        <p className="text-gray-500">Nenhum registro financeiro encontrado.</p>
                                        <p className="text-xs text-gray-400 mt-1">Os lançamentos serão adicionados pela administração.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Mês</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
                                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Unidade</th>
                                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {financialRecords.map(r => (
                                                        <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-gray-600">{r.referenceMonth}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                                                    {r.type === 'revenue' ? 'Receita' : 'Despesa'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600 capitalize">{r.category.replace(/_/g, ' ')}</td>
                                                            <td className="px-4 py-3 text-gray-600">{r.description || '—'}</td>
                                                            <td className="px-4 py-3 text-gray-600 text-xs">{r.unitName}</td>
                                                            <td className={`px-4 py-3 text-right font-medium ${r.type === 'revenue' ? 'text-green-700' : 'text-red-600'}`}>
                                                                {r.type === 'revenue' ? '+' : '-'} R$ {r.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──────── DOCUMENTOS ──────── */}
                        {activeTab === 'documentos' && (
                            <div className="space-y-4">
                                {/* Category filter */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {['all', 'contract', 'condo_rules', 'meeting_minutes', 'maintenance_report', 'tax', 'personal', 'other'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setDocCategoryFilter(cat)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${docCategoryFilter === cat ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {cat === 'all' ? 'Todos' : cat === 'contract' ? 'Contratos' : cat === 'condo_rules' ? 'Regras' : cat === 'meeting_minutes' ? 'Atas' : cat === 'maintenance_report' ? 'Manutenção' : cat === 'tax' ? 'Fiscal' : cat === 'personal' ? 'Pessoal' : 'Outros'}
                                        </button>
                                    ))}
                                </div>

                                {docsLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                                        <span className="ml-2 text-sm text-gray-600">Carregando documentos...</span>
                                    </div>
                                ) : (() => {
                                    const filtered = docCategoryFilter === 'all' ? documents : documents.filter(d => d.category === docCategoryFilter);
                                    return filtered.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                            <div className="text-4xl mb-3">📄</div>
                                            <p className="text-gray-500">Nenhum documento encontrado.</p>
                                            <p className="text-xs text-gray-400 mt-1">Os documentos serão disponibilizados pela administração.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {filtered.map(doc => (
                                                <a
                                                    key={doc.id}
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-2xl">
                                                            {doc.mimeType?.includes('pdf') ? '📕' : doc.mimeType?.includes('image') ? '🖼️' : doc.mimeType?.includes('spreadsheet') || doc.mimeType?.includes('excel') ? '📊' : '📄'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 truncate">{doc.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5 capitalize">{doc.category.replace(/_/g, ' ')}</p>
                                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                                <span>{doc.unitName}</span>
                                                                {doc.fileSizeBytes && <span>· {(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>}
                                                                <span>· {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

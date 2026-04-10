'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type TabType = 'visao-geral' | 'servicos' | 'solicitacoes';

type Property = {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    state: string;
    active: boolean;
};

type Service = {
    id: string;
    category: string;
    name: string;
    description: string | null;
    price: string | null;
    discountText: string | null;
    active: boolean;
    propertyIds: string[];
    createdAt: string;
};

type ServiceRequest = {
    id: string;
    serviceId: string;
    serviceName: string;
    propertyId: string;
    requesterName: string;
    requesterType: string;
    requesterEmail: string | null;
    requesterPhone: string | null;
    unitName: string | null;
    scheduledDate: string | null;
    scheduledTime: string | null;
    notes: string | null;
    status: string;
    respondedAt: string | null;
    completedAt: string | null;
    createdAt: string;
};

const CATEGORY_LABELS: Record<string, string> = {
    personal_trainer: 'Personal Trainer',
    cleaning: 'Limpeza',
    chef: 'Chef / Cozinheiro',
    massage: 'Massagem',
    transport: 'Transporte',
    photography: 'Fotografia',
    delivery: 'Delivery',
    maintenance: 'Manutenção',
    other: 'Outro',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    accepted: { label: 'Aceita', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Recusada', color: 'bg-red-100 text-red-700' },
    completed: { label: 'Concluída', color: 'bg-blue-100 text-blue-800' },
    cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-600' },
};

export default function ParceirosDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    // Serviços
    const [services, setServices] = useState<Service[]>([]);
    const [svcLoading, setSvcLoading] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [svcForm, setSvcForm] = useState({ name: '', category: 'other', description: '', price: '', discountText: '', propertyIds: [] as string[] });
    const [svcSaving, setSvcSaving] = useState(false);

    // Solicitações
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [reqLoading, setReqLoading] = useState(false);
    const [reqFilter, setReqFilter] = useState<string>('all');

    useEffect(() => {
        fetch('/api/partner/dashboard')
            .then(async (res) => {
                if (!res.ok) {
                    if (res.status === 401) { router.push('/login'); return; }
                    throw new Error('Erro ao carregar dados');
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setProfile(data.profile || null);
                setProperties(data.properties || []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [router]);

    const fetchServices = () => {
        setSvcLoading(true);
        fetch('/api/partner/services')
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setServices(data.services || []); })
            .finally(() => setSvcLoading(false));
    };

    const fetchRequests = () => {
        setReqLoading(true);
        fetch('/api/partner/requests')
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setRequests(data.requests || []); })
            .finally(() => setReqLoading(false));
    };

    useEffect(() => {
        if (activeTab === 'servicos') fetchServices();
        if (activeTab === 'solicitacoes') fetchRequests();
    }, [activeTab]);

    const openNewService = () => {
        setEditingService(null);
        setSvcForm({ name: '', category: 'other', description: '', price: '', discountText: '', propertyIds: [] });
        setShowServiceForm(true);
    };

    const openEditService = (svc: Service) => {
        setEditingService(svc);
        setSvcForm({
            name: svc.name,
            category: svc.category,
            description: svc.description || '',
            price: svc.price || '',
            discountText: svc.discountText || '',
            propertyIds: svc.propertyIds,
        });
        setShowServiceForm(true);
    };

    const saveService = async () => {
        if (!svcForm.name || !svcForm.category) return;
        setSvcSaving(true);
        try {
            if (editingService) {
                await fetch(`/api/partner/services?id=${editingService.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(svcForm),
                });
            } else {
                await fetch('/api/partner/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(svcForm),
                });
            }
            setShowServiceForm(false);
            fetchServices();
        } finally {
            setSvcSaving(false);
        }
    };

    const deactivateService = async (id: string) => {
        await fetch(`/api/partner/services?id=${id}`, { method: 'DELETE' });
        fetchServices();
    };

    const updateRequestStatus = async (id: string, status: string) => {
        await fetch(`/api/partner/requests?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchRequests();
    };

    const handleLogout = async () => {
        const { createClient } = await import('@/lib/supabase-browser');
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const tabs: { key: TabType; label: string; icon: string }[] = [
        { key: 'visao-geral', label: 'Visão Geral', icon: '📊' },
        { key: 'servicos', label: 'Meus Serviços', icon: '🛎️' },
        { key: 'solicitacoes', label: 'Solicitações', icon: '📋' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="FrontStay" width={65} height={65} className="object-contain" />
                            <h1 className="text-lg font-bold text-gray-900">Parceiro</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                                        {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
                                    </div>
                                    <span className="text-sm text-gray-600 hidden sm:inline">{profile?.name || 'Parceiro'}</span>
                                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                                            <p className="text-xs text-gray-500">{profile?.email}</p>
                                        </div>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">Sair</button>
                                    </div>
                                )}
                            </div>
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
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? 'bg-purple-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                        <span className="ml-3 text-gray-600">Carregando dados...</span>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* ──────── VISÃO GERAL ──────── */}
                        {activeTab === 'visao-geral' && (
                            <div className="space-y-6">
                                {/* Profile card */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-2xl">
                                            {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">{profile?.name || 'Parceiro'}</h2>
                                            <p className="text-sm text-gray-500">{profile?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Properties linked */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Prédios Vinculados</h3>
                                    {properties.length === 0 ? (
                                        <p className="text-sm text-gray-500">Nenhum prédio vinculado. Entre em contato com a administração.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {properties.map(p => (
                                                <div key={p.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                            {p.active ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{[p.city, p.state].filter(Boolean).join(', ')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick stats placeholder */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Prédios</p>
                                        <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Serviços Ativos</p>
                                        <p className="text-2xl font-bold text-purple-700">{services.filter(s => s.active).length || '—'}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Solicitações</p>
                                        <p className="text-2xl font-bold text-orange-600">{requests.filter(r => r.status === 'pending').length || '—'}</p>
                                    </div>
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-sm text-gray-500">Concluídos no Mês</p>
                                        <p className="text-2xl font-bold text-green-700">
                                            {(() => {
                                                const now = new Date();
                                                const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                                                const count = requests.filter(r => r.status === 'completed' && r.completedAt?.startsWith(month)).length;
                                                return count || '0';
                                            })()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ──────── MEUS SERVIÇOS ──────── */}
                        {activeTab === 'servicos' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-900">Meus Serviços</h2>
                                    <button onClick={openNewService} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors">
                                        + Novo Serviço
                                    </button>
                                </div>

                                {/* Service form modal */}
                                {showServiceForm && (
                                    <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-4">{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Nome *</label>
                                                <input value={svcForm.name} onChange={e => setSvcForm({ ...svcForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Ex: Massagem Relaxante" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Categoria *</label>
                                                <select value={svcForm.category} onChange={e => setSvcForm({ ...svcForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                                                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                                                        <option key={k} value={k}>{v}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                                                <textarea value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Descreva seu serviço..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Preço</label>
                                                <input value={svcForm.price} onChange={e => setSvcForm({ ...svcForm, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Ex: R$ 150/hora" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Desconto para hóspedes</label>
                                                <input value={svcForm.discountText} onChange={e => setSvcForm({ ...svcForm, discountText: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Ex: 10% de desconto" />
                                            </div>
                                            {properties.length > 0 && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs text-gray-600 mb-1">Prédios onde atua</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {properties.map(p => (
                                                            <label key={p.id} className="flex items-center gap-1.5 text-sm text-gray-700">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={svcForm.propertyIds.includes(p.id)}
                                                                    onChange={e => {
                                                                        const ids = e.target.checked
                                                                            ? [...svcForm.propertyIds, p.id]
                                                                            : svcForm.propertyIds.filter(id => id !== p.id);
                                                                        setSvcForm({ ...svcForm, propertyIds: ids });
                                                                    }}
                                                                    className="rounded border-gray-300"
                                                                />
                                                                {p.name}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <button onClick={saveService} disabled={svcSaving || !svcForm.name} className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 disabled:opacity-50 transition-colors">
                                                {svcSaving ? 'Salvando...' : editingService ? 'Salvar' : 'Criar'}
                                            </button>
                                            <button onClick={() => setShowServiceForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {svcLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                                        <span className="ml-2 text-sm text-gray-600">Carregando serviços...</span>
                                    </div>
                                ) : services.length === 0 ? (
                                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                        <div className="text-4xl mb-3">🛎️</div>
                                        <p className="text-gray-500">Nenhum serviço cadastrado ainda.</p>
                                        <p className="text-xs text-gray-400 mt-1">Clique em &quot;+ Novo Serviço&quot; para começar.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {services.map(svc => (
                                            <div key={svc.id} className={`bg-white rounded-xl border p-5 ${svc.active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 text-sm">{svc.name}</h4>
                                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                                                            {CATEGORY_LABELS[svc.category] || svc.category}
                                                        </span>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${svc.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                        {svc.active ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                                {svc.description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{svc.description}</p>}
                                                {svc.price && <p className="text-sm font-medium text-gray-800">{svc.price}</p>}
                                                {svc.discountText && <p className="text-xs text-green-600 mt-1">{svc.discountText}</p>}
                                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                                    <button onClick={() => openEditService(svc)} className="text-xs text-purple-700 hover:underline">Editar</button>
                                                    {svc.active && (
                                                        <button onClick={() => deactivateService(svc.id)} className="text-xs text-red-600 hover:underline">Desativar</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ──────── SOLICITAÇÕES ──────── */}
                        {activeTab === 'solicitacoes' && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-gray-900">Solicitações de Serviço</h2>

                                {/* Status filter */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setReqFilter(f)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${reqFilter === f ? 'bg-purple-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                                        >
                                            {f === 'all' ? 'Todas' : (STATUS_LABELS[f]?.label || f)}
                                        </button>
                                    ))}
                                </div>

                                {reqLoading ? (
                                    <div className="flex items-center justify-center py-10">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
                                        <span className="ml-2 text-sm text-gray-600">Carregando solicitações...</span>
                                    </div>
                                ) : (() => {
                                    const filtered = reqFilter === 'all' ? requests : requests.filter(r => r.status === reqFilter);
                                    return filtered.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                            <div className="text-4xl mb-3">📋</div>
                                            <p className="text-gray-500">Nenhuma solicitação encontrada.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {filtered.map(req => {
                                                const st = STATUS_LABELS[req.status] || { label: req.status, color: 'bg-gray-100 text-gray-600' };
                                                return (
                                                    <div key={req.id} className="bg-white rounded-xl border border-gray-200 p-5">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 text-sm">{req.serviceName}</h4>
                                                                <p className="text-xs text-gray-500 mt-0.5">Solicitado por: {req.requesterName} ({req.requesterType === 'guest' ? 'Hóspede' : req.requesterType === 'owner' ? 'Proprietário' : 'Admin'})</p>
                                                            </div>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
                                                            {req.scheduledDate && <div><span className="text-gray-400">Data:</span> {new Date(req.scheduledDate + 'T12:00:00').toLocaleDateString('pt-BR')}</div>}
                                                            {req.scheduledTime && <div><span className="text-gray-400">Hora:</span> {req.scheduledTime}</div>}
                                                            {req.unitName && <div><span className="text-gray-400">Unidade:</span> {req.unitName}</div>}
                                                            {req.requesterPhone && <div><span className="text-gray-400">Tel:</span> {req.requesterPhone}</div>}
                                                        </div>

                                                        {req.notes && <p className="text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg p-2">{req.notes}</p>}

                                                        {req.status === 'pending' && (
                                                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                                                <button onClick={() => updateRequestStatus(req.id, 'accepted')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                                                                    Aceitar
                                                                </button>
                                                                <button onClick={() => updateRequestStatus(req.id, 'rejected')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                                                                    Recusar
                                                                </button>
                                                            </div>
                                                        )}

                                                        {req.status === 'accepted' && (
                                                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                                                <button onClick={() => updateRequestStatus(req.id, 'completed')} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                                                                    Marcar Concluída
                                                                </button>
                                                                <button onClick={() => updateRequestStatus(req.id, 'cancelled')} className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-medium hover:bg-gray-600">
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        )}

                                                        <p className="text-xs text-gray-400 mt-2">Criada em {new Date(req.createdAt).toLocaleDateString('pt-BR')}</p>
                                                    </div>
                                                );
                                            })}
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

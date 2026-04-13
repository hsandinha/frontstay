'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// --- Types ---
type TabType = 'visao-geral' | 'predios' | 'proprietarios' | 'financeiro' | 'documentos';

interface Property {
    id: string;
    name: string;
    slug: string;
    backendUrl: string | null;
    address: string | null;
    city: string | null;
    state: string;
    timezone: string;
    active: boolean;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PropertyUnit {
    id: string;
    propertyId: string;
    unitName: string;
    roomName: string | null;
    floor: string | null;
    unitType: string;
    bedrooms: number;
    maxGuests: number;
    active: boolean;
}

interface PropertyIntegration {
    id: string;
    propertyId: string;
    provider: string;
    providerType: string;
    config: Record<string, string>;
    active: boolean;
}

interface PropertyWithDetails extends Property {
    units: PropertyUnit[];
    integrations: PropertyIntegration[];
    stats: { totalUnits: number; activeReservations: number };
}

interface UnitOwner {
    id: string;
    unitId: string;
    unitName: string;
    propertyId: string | null;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string | null;
    ownerDocument: string | null;
    revenueSharePercent: number;
    active: boolean;
}

interface FinancialRecord {
    id: string;
    propertyId: string;
    unitId: string | null;
    unitName: string | null;
    type: 'revenue' | 'expense';
    category: string;
    description: string | null;
    amount: number;
    referenceMonth: string;
    createdAt: string;
}

interface PropertyDocument {
    id: string;
    propertyId: string;
    unitId: string | null;
    unitName: string | null;
    category: string;
    title: string;
    fileUrl: string;
    fileSizeBytes: number | null;
    mimeType: string | null;
    visibleToOwner: boolean;
    createdAt: string;
}

const PROVIDER_LABELS: Record<string, string> = {
    lock: 'Fechadura',
    pms: 'PMS',
    whatsapp: 'WhatsApp',
    email: 'E-mail',
};

const PROVIDER_TYPE_OPTIONS: Record<string, { value: string; label: string }[]> = {
    lock: [
        { value: 'ttlock', label: 'TTLock / DLock' },
        { value: 'facial', label: 'Reconhecimento Facial' },
        { value: 'yale', label: 'Yale' },
        { value: 'nenhum', label: 'Sem fechadura' },
    ],
    pms: [
        { value: 'cloudbeds', label: 'Cloudbeds' },
        { value: 'stays', label: 'Stays.net' },
        { value: 'manual', label: 'Manual (sem PMS)' },
    ],
    whatsapp: [
        { value: 'meta', label: 'Meta Business API' },
        { value: 'nenhum', label: 'Desabilitado' },
    ],
    email: [
        { value: 'sendgrid', label: 'SendGrid' },
        { value: 'ses', label: 'Amazon SES' },
        { value: 'nenhum', label: 'Desabilitado' },
    ],
};

const UNIT_TYPE_OPTIONS = [
    { value: 'studio', label: 'Studio' },
    { value: '1quarto', label: '1 Quarto' },
    { value: '2quartos', label: '2 Quartos' },
    { value: '3quartos', label: '3 Quartos' },
    { value: 'cobertura', label: 'Cobertura' },
    { value: 'loft', label: 'Loft' },
];

const PROVIDER_CONFIG_FIELDS: Record<string, { key: string; label: string; type?: string; placeholder?: string }[]> = {
    ttlock: [
        { key: 'client_id', label: 'Client ID', placeholder: 'TTLock Client ID' },
        { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: 'TTLock Client Secret' },
        { key: 'username', label: 'Usuário', placeholder: 'Conta TTLock' },
        { key: 'password', label: 'Senha (MD5)', type: 'password', placeholder: 'Senha MD5 da conta' },
    ],
    cloudbeds: [
        { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'Cloudbeds API Key' },
        { key: 'property_id', label: 'Property ID', placeholder: 'ID do hotel no Cloudbeds' },
    ],
    meta: [
        { key: 'phone_number_id', label: 'Phone Number ID', placeholder: 'ID do número WhatsApp' },
        { key: 'access_token', label: 'Access Token', type: 'password', placeholder: 'Token permanente Meta' },
        { key: 'business_account_id', label: 'Business Account ID', placeholder: 'ID da conta Business' },
    ],
    sendgrid: [
        { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'SendGrid API Key' },
        { key: 'from_email', label: 'E-mail Remetente', placeholder: 'noreply@exemplo.com' },
        { key: 'from_name', label: 'Nome Remetente', placeholder: 'FrontStay' },
    ],
    ses: [
        { key: 'region', label: 'Região AWS', placeholder: 'us-east-1' },
        { key: 'from_email', label: 'E-mail Remetente', placeholder: 'noreply@exemplo.com' },
        { key: 'access_key_id', label: 'Access Key ID', type: 'password', placeholder: 'AWS Access Key' },
        { key: 'secret_access_key', label: 'Secret Access Key', type: 'password', placeholder: 'AWS Secret Key' },
    ],
};

const STATE_OPTIONS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const FIN_CATEGORY_OPTIONS = [
    { value: 'rental', label: 'Aluguel' },
    { value: 'cleaning', label: 'Limpeza' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'commission', label: 'Comissão' },
    { value: 'condo_fee', label: 'Condomínio' },
    { value: 'tax', label: 'Imposto' },
    { value: 'other', label: 'Outro' },
];

const DOC_CATEGORY_OPTIONS = [
    { value: 'contract', label: 'Contrato' },
    { value: 'condo_rules', label: 'Regras do Condomínio' },
    { value: 'meeting_minutes', label: 'Ata de Reunião' },
    { value: 'maintenance_report', label: 'Relatório de Manutenção' },
    { value: 'tax', label: 'Fiscal' },
    { value: 'personal', label: 'Pessoal' },
    { value: 'other', label: 'Outro' },
];

export default function AdministradorDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('predios');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Data
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetails | null>(null);
    const [unitsCache, setUnitsCache] = useState<Record<string, PropertyUnit[]>>({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showIntegrationModal, setShowIntegrationModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);

    // Forms
    const [createForm, setCreateForm] = useState({
        name: '', slug: '', address: '', city: '', state: 'BA',
    });
    const [unitForm, setUnitForm] = useState({
        unitName: '', roomName: '', floor: '', unitType: 'studio', bedrooms: 1, maxGuests: 2,
    });
    const [integrationForm, setIntegrationForm] = useState<{
        provider: string;
        providerType: string;
        config: Record<string, string>;
    }>({
        provider: 'lock', providerType: 'ttlock', config: {},
    });

    // --- Proprietários ---
    const [owners, setOwners] = useState<UnitOwner[]>([]);
    const [ownersLoading, setOwnersLoading] = useState(false);
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [editingOwner, setEditingOwner] = useState<UnitOwner | null>(null);
    const [ownerForm, setOwnerForm] = useState({ unitId: '', ownerName: '', ownerEmail: '', ownerPhone: '', ownerDocument: '', revenueSharePercent: 0 });
    const [ownerPropertyFilter, setOwnerPropertyFilter] = useState<string>('');

    // --- Financeiro ---
    const [finRecords, setFinRecords] = useState<FinancialRecord[]>([]);
    const [finLoading, setFinLoading] = useState(false);
    const [showFinModal, setShowFinModal] = useState(false);
    const [finForm, setFinForm] = useState({ propertyId: '', unitId: '', type: 'revenue' as string, category: 'rental', description: '', amount: '', referenceMonth: '' });
    const [finPropertyFilter, setFinPropertyFilter] = useState<string>('');

    // --- Documentos ---
    const [documents, setDocuments] = useState<PropertyDocument[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);
    const [showDocModal, setShowDocModal] = useState(false);
    const [docForm, setDocForm] = useState({ propertyId: '', unitId: '', category: 'contract', title: '', fileUrl: '', visibleToOwner: true });
    const [docPropertyFilter, setDocPropertyFilter] = useState<string>('');

    // --- API Calls ---
    const fetchProperties = useCallback(async () => {
        try {
            const res = await fetch('/api/properties');
            const data = await res.json();
            if (data.success) {
                setProperties(data.properties || []);
            }
        } catch {
            console.error('Erro ao carregar prédios');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPropertyDetails = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/properties?id=${encodeURIComponent(id)}`);
            const data = await res.json();
            if (data.success && data.property) {
                setSelectedProperty(data.property);
                if (data.property.units) {
                    setUnitsCache(prev => ({ ...prev, [id]: data.property.units }));
                }
            }
        } catch {
            console.error('Erro ao carregar detalhes do prédio');
        }
    }, []);

    const getUnitsForProperty = useCallback(async (propertyId: string): Promise<PropertyUnit[]> => {
        if (unitsCache[propertyId]) return unitsCache[propertyId];
        if (selectedProperty?.id === propertyId) {
            setUnitsCache(prev => ({ ...prev, [propertyId]: selectedProperty.units }));
            return selectedProperty.units;
        }
        try {
            const res = await fetch(`/api/properties?id=${encodeURIComponent(propertyId)}`);
            const data = await res.json();
            if (data.success && data.property?.units) {
                setUnitsCache(prev => ({ ...prev, [propertyId]: data.property.units }));
                return data.property.units;
            }
        } catch { /* ignore */ }
        return [];
    }, [unitsCache, selectedProperty]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // --- Fetch unit owners ---
    const fetchOwners = useCallback(async (propertyId?: string) => {
        setOwnersLoading(true);
        try {
            const url = propertyId ? `/api/admin/unit-owners?propertyId=${propertyId}` : '/api/admin/unit-owners';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) setOwners(data.owners || []);
        } catch { /* */ } finally { setOwnersLoading(false); }
    }, []);

    // --- Fetch financials ---
    const fetchFinancials = useCallback(async (propertyId?: string) => {
        setFinLoading(true);
        try {
            const url = propertyId ? `/api/admin/financials?propertyId=${propertyId}` : '/api/admin/financials';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) setFinRecords(data.records || []);
        } catch { /* */ } finally { setFinLoading(false); }
    }, []);

    // --- Fetch documents ---
    const fetchDocuments = useCallback(async (propertyId?: string) => {
        setDocsLoading(true);
        try {
            const url = propertyId ? `/api/admin/documents?propertyId=${propertyId}` : '/api/admin/documents';
            const res = await fetch(url);
            const data = await res.json();
            if (data.success) setDocuments(data.documents || []);
        } catch { /* */ } finally { setDocsLoading(false); }
    }, []);

    // Auto-fetch when switching tabs
    useEffect(() => {
        if (activeTab === 'proprietarios') fetchOwners(ownerPropertyFilter || undefined);
    }, [activeTab, ownerPropertyFilter, fetchOwners]);
    useEffect(() => {
        if (activeTab === 'financeiro') fetchFinancials(finPropertyFilter || undefined);
    }, [activeTab, finPropertyFilter, fetchFinancials]);
    useEffect(() => {
        if (activeTab === 'documentos') fetchDocuments(docPropertyFilter || undefined);
    }, [activeTab, docPropertyFilter, fetchDocuments]);

    const clearMessages = () => { setError(''); setSuccess(''); };

    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setError('');
        setTimeout(() => setSuccess(''), 4000);
    };
    const showError = (msg: string) => {
        setError(msg);
        setSuccess('');
    };

    // --- Unit Owners Handlers ---
    const handleSaveOwner = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        setActionLoading(true);
        try {
            if (editingOwner) {
                const res = await fetch(`/api/admin/unit-owners?id=${editingOwner.id}`, {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ownerForm),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
            } else {
                const res = await fetch('/api/admin/unit-owners', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ownerForm),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
            }
            setShowOwnerModal(false);
            showSuccess(editingOwner ? 'Proprietário atualizado!' : 'Proprietário criado!');
            fetchOwners(ownerPropertyFilter || undefined);
        } catch (err: any) { showError(err.message); } finally { setActionLoading(false); }
    };

    const handleDeleteOwner = async (id: string) => {
        if (!confirm('Remover proprietário desta unidade?')) return;
        try {
            await fetch(`/api/admin/unit-owners?id=${id}`, { method: 'DELETE' });
            showSuccess('Proprietário removido');
            fetchOwners(ownerPropertyFilter || undefined);
        } catch { showError('Erro ao remover'); }
    };

    // --- Financial Handlers ---
    const handleSaveFinancial = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/financials', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setShowFinModal(false);
            showSuccess('Registro financeiro criado!');
            fetchFinancials(finPropertyFilter || undefined);
        } catch (err: any) { showError(err.message); } finally { setActionLoading(false); }
    };

    const handleDeleteFinancial = async (id: string) => {
        if (!confirm('Remover registro financeiro?')) return;
        try {
            await fetch(`/api/admin/financials?id=${id}`, { method: 'DELETE' });
            showSuccess('Registro removido');
            fetchFinancials(finPropertyFilter || undefined);
        } catch { showError('Erro ao remover'); }
    };

    // --- Document Handlers ---
    const handleSaveDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/admin/documents', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(docForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setShowDocModal(false);
            showSuccess('Documento adicionado!');
            fetchDocuments(docPropertyFilter || undefined);
        } catch (err: any) { showError(err.message); } finally { setActionLoading(false); }
    };

    const handleDeleteDocument = async (id: string) => {
        if (!confirm('Remover documento?')) return;
        try {
            await fetch(`/api/admin/documents?id=${id}`, { method: 'DELETE' });
            showSuccess('Documento removido');
            fetchDocuments(docPropertyFilter || undefined);
        } catch { showError('Erro ao remover'); }
    };

    // --- Handlers ---
    const handleCreateProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create-property', ...createForm }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setShowCreateModal(false);
            setCreateForm({ name: '', slug: '', address: '', city: '', state: 'BA' });
            showSuccess(`Prédio "${data.property.name}" criado com sucesso.`);
            await fetchProperties();
        } catch (err: any) {
            showError(err.message || 'Erro ao criar prédio.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleProperty = async (prop: Property) => {
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update-property', id: prop.id, active: !prop.active }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            showSuccess(`Prédio ${!prop.active ? 'ativado' : 'desativado'}.`);
            await fetchProperties();
            if (selectedProperty?.id === prop.id) {
                await fetchPropertyDetails(prop.id);
            }
        } catch (err: any) {
            showError(err.message || 'Erro ao atualizar prédio.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddUnit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProperty) return;
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: editingUnit ? 'update-unit' : 'add-unit',
                    propertyId: selectedProperty.id,
                    unitId: editingUnit?.id,
                    ...unitForm,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setShowUnitModal(false);
            setEditingUnit(null);
            setUnitForm({ unitName: '', roomName: '', floor: '', unitType: 'studio', bedrooms: 1, maxGuests: 2 });
            showSuccess(editingUnit ? 'Unidade atualizada.' : 'Unidade adicionada.');
            await fetchPropertyDetails(selectedProperty.id);
        } catch (err: any) {
            showError(err.message || 'Erro ao salvar unidade.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUnit = async (unitId: string) => {
        if (!selectedProperty || !confirm('Remover esta unidade?')) return;
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete-unit', unitId }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            showSuccess('Unidade removida.');
            await fetchPropertyDetails(selectedProperty.id);
        } catch (err: any) {
            showError(err.message || 'Erro ao remover unidade.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveIntegration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProperty) return;
        clearMessages();
        setActionLoading(true);
        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'upsert-integration',
                    propertyId: selectedProperty.id,
                    provider: integrationForm.provider,
                    providerType: integrationForm.providerType,
                    config: integrationForm.config,
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setShowIntegrationModal(false);
            showSuccess('Integração salva.');
            await fetchPropertyDetails(selectedProperty.id);
        } catch (err: any) {
            showError(err.message || 'Erro ao salvar integração.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = () => { router.push('/login'); };
    const handleTabChange = (tab: TabType) => { setActiveTab(tab); setIsMobileMenuOpen(false); };

    const totalUnits = properties.reduce((sum) => sum, 0);
    const activeProperties = properties.filter(p => p.active).length;

    return (
        <div className="min-h-screen bg-gray-50 font-questa-regular">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="FrontStay Logo" width={65} height={65} className="object-contain" />
                            <h1 className="text-ml font-questa-bold text-gray-900">Admin</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                                    {!imageError ? (
                                        <Image src="/public/user-photo.jpg" alt="Foto do Usuário" width={40} height={40}
                                            className="object-cover w-full h-full" onError={() => setImageError(true)} />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-questa-bold text-sm">A</div>
                                    )}
                                </div>
                                <span className="text-sm text-gray-600">Bem vindo, Admin</span>
                            </div>
                            <button onClick={handleLogout} className="text-sm text-blue-900 hover:text-blue-950 font-questa-medium">Sair</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Mobile */}
                    <div className="flex lg:hidden items-center justify-between py-3">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center gap-2 text-gray-700 font-questa-medium">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                            <span className="text-sm">Menu</span>
                        </button>
                        <span className="text-sm text-gray-900 font-questa-bold">
                            {{ 'visao-geral': 'Visão Geral', predios: 'Gestão de Prédios', proprietarios: 'Proprietários', financeiro: 'Financeiro', documentos: 'Documentos' }[activeTab]}
                        </span>
                    </div>
                    {isMobileMenuOpen && (
                        <nav className="lg:hidden pb-4 space-y-1">
                            {[
                                { key: 'visao-geral' as TabType, label: 'Visão Geral', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                                { key: 'predios' as TabType, label: 'Gestão de Prédios', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                                { key: 'proprietarios' as TabType, label: 'Proprietários', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                                { key: 'financeiro' as TabType, label: 'Financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { key: 'documentos' as TabType, label: 'Documentos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                            ].map(tab => (
                                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                                    className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === tab.key ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                    </svg>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    )}
                    {/* Desktop */}
                    <nav className="hidden lg:flex gap-8">
                        {[
                            { key: 'visao-geral' as TabType, label: 'Visão Geral', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                            { key: 'predios' as TabType, label: 'Gestão de Prédios', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                            { key: 'proprietarios' as TabType, label: 'Proprietários', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
                            { key: 'financeiro' as TabType, label: 'Financeiro', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { key: 'documentos' as TabType, label: 'Documentos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                                className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.key ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                                </svg>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Feedback */}
            {(error || success) && (
                <div className="max-w-7xl mx-auto px-6 pt-4">
                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
                    {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* --- VISÃO GERAL --- */}
                {activeTab === 'visao-geral' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Total Prédios</p>
                                <p className="text-3xl font-questa-bold text-gray-900">{properties.length}</p>
                                <p className="text-xs text-gray-400 mt-1">{activeProperties} ativos</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Unidades Cadastradas</p>
                                <p className="text-3xl font-questa-bold text-gray-900">{selectedProperty?.stats.totalUnits ?? '—'}</p>
                                <p className="text-xs text-gray-400 mt-1">Selecione um prédio para ver</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Reservas Ativas (prédio)</p>
                                <p className="text-3xl font-questa-bold text-gray-900">{selectedProperty?.stats.activeReservations ?? '—'}</p>
                                <p className="text-xs text-gray-400 mt-1">Hospedagens em andamento</p>
                            </div>
                        </div>

                        {/* Property list */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-questa-bold text-gray-900">Prédios Cadastrados</h3>
                                <button onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-questa-bold hover:bg-blue-800 transition-colors flex items-center gap-2">
                                    + Novo Prédio
                                </button>
                            </div>
                            {loading ? (
                                <div className="p-12 text-center text-gray-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto mb-3"></div>
                                    Carregando...
                                </div>
                            ) : properties.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <p className="text-4xl mb-3">🏢</p>
                                    <p>Nenhum prédio cadastrado.</p>
                                    <button onClick={() => setShowCreateModal(true)} className="mt-3 text-blue-900 font-questa-bold text-sm hover:underline">
                                        Cadastrar primeiro prédio →
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {properties.map(prop => (
                                        <div key={prop.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${prop.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900">{prop.name}</h4>
                                                    <p className="text-xs text-gray-500">{prop.address || 'Sem endereço'} · {prop.city || ''}, {prop.state}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 font-mono">{prop.slug}</span>
                                                <button onClick={() => { handleTabChange('predios'); fetchPropertyDetails(prop.id); }}
                                                    className="text-sm text-blue-900 hover:text-blue-700 font-questa-bold px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                                                    Gerenciar →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Subdomain status */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-questa-bold text-gray-900">Subdomínios Operacionais</h3>
                                <p className="text-xs text-gray-400 mt-1">Clique para acessar o dashboard operacional de cada prédio</p>
                            </div>
                            {!loading && properties.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {properties.map(prop => {
                                        const subdomainUrl = `https://${prop.slug}.frontstay.com.br`;
                                        return (
                                            <div key={prop.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2.5 h-2.5 rounded-full ${prop.active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                                                    <div>
                                                        <h4 className="font-questa-bold text-gray-900 text-sm">{prop.name}</h4>
                                                        <p className="text-xs text-gray-400 font-mono">{prop.slug}.frontstay.com.br</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${prop.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {prop.active ? 'Online' : 'Offline'}
                                                    </span>
                                                    <a
                                                        href={subdomainUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-900 hover:text-blue-700 font-questa-bold px-3 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                                                    >
                                                        Abrir
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : !loading ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    Nenhum subdomínio configurado.
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* --- GESTÃO DE PRÉDIOS --- */}
                {activeTab === 'predios' && (
                    <div className="space-y-6 animate-fade-in-up">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4 flex-wrap">
                                <h3 className="text-lg font-questa-bold text-gray-900">Prédio:</h3>
                                {loading ? (
                                    <span className="text-sm text-gray-400">Carregando...</span>
                                ) : properties.length === 0 ? (
                                    <span className="text-sm text-gray-400">Nenhum prédio cadastrado</span>
                                ) : (
                                    <select
                                        value={selectedProperty?.id || ''}
                                        onChange={(e) => {
                                            if (e.target.value) fetchPropertyDetails(e.target.value);
                                        }}
                                        className="border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        <option value="">Selecione um prédio</option>
                                        {properties.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                )}
                                {selectedProperty && (
                                    <span className="text-sm text-gray-500">{selectedProperty.address || ''}</span>
                                )}
                            </div>
                            <button onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-questa-bold hover:bg-blue-800 transition-colors flex items-center gap-2 whitespace-nowrap">
                                + Novo Prédio
                            </button>
                        </div>

                        {!selectedProperty ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
                                <p className="text-5xl mb-4">🏢</p>
                                <p className="text-lg">Selecione um prédio para gerenciar</p>
                                <p className="text-sm mt-1">ou cadastre um novo prédio</p>
                            </div>
                        ) : (
                            <>
                                {/* Property Info */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-questa-bold text-gray-900">{selectedProperty.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{selectedProperty.address || 'Sem endereço'} · {selectedProperty.city || ''}, {selectedProperty.state}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedProperty.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {selectedProperty.active ? 'Ativo' : 'Inativo'}
                                            </span>
                                            <button onClick={() => handleToggleProperty(selectedProperty)}
                                                disabled={actionLoading}
                                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                                                {selectedProperty.active ? 'Desativar' : 'Ativar'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase">Slug</span>
                                            <p className="font-mono text-gray-700">{selectedProperty.slug}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase">Timezone</span>
                                            <p className="text-gray-700">{selectedProperty.timezone}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase">Unidades</span>
                                            <p className="font-questa-bold text-gray-900">{selectedProperty.stats.totalUnits}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-xs uppercase">Reservas Ativas</span>
                                            <p className="font-questa-bold text-gray-900">{selectedProperty.stats.activeReservations}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Integrations */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                        <h4 className="font-questa-bold text-gray-900">Integrações</h4>
                                        <button onClick={() => { setIntegrationForm({ provider: 'lock', providerType: 'ttlock', config: {} }); setShowIntegrationModal(true); }}
                                            className="text-sm text-blue-900 hover:text-blue-700 font-questa-bold">
                                            + Adicionar
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {selectedProperty.integrations.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 text-sm">Nenhuma integração configurada.</div>
                                        ) : (
                                            selectedProperty.integrations.map(integ => (
                                                <div key={integ.id} className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${integ.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <div>
                                                            <span className="font-questa-bold text-gray-800 text-sm">{PROVIDER_LABELS[integ.provider] || integ.provider}</span>
                                                            <span className="text-xs text-gray-400 ml-2">{integ.providerType}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => {
                                                        setIntegrationForm({ provider: integ.provider, providerType: integ.providerType, config: integ.config || {} });
                                                        setShowIntegrationModal(true);
                                                    }} className="text-xs text-gray-500 hover:text-blue-900 transition-colors">
                                                        Editar
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Units */}
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                                        <h4 className="font-questa-bold text-gray-900">Unidades ({selectedProperty.units.length})</h4>
                                        <button onClick={() => {
                                            setEditingUnit(null);
                                            setUnitForm({ unitName: '', roomName: '', floor: '', unitType: 'studio', bedrooms: 1, maxGuests: 2 });
                                            setShowUnitModal(true);
                                        }} className="text-sm text-blue-900 hover:text-blue-700 font-questa-bold">
                                            + Adicionar Unidade
                                        </button>
                                    </div>
                                    {selectedProperty.units.length === 0 ? (
                                        <div className="p-8 text-center text-gray-400">
                                            <p className="text-3xl mb-2">🏠</p>
                                            <p className="text-sm">Nenhuma unidade cadastrada neste prédio.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
                                            {selectedProperty.units.map(unit => (
                                                <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all group relative">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="text-lg font-questa-bold text-gray-900">Apt {unit.unitName}</h5>
                                                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${unit.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                                            {unit.active ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        {unit.floor && <p>Andar: {unit.floor}</p>}
                                                        <p>Tipo: {UNIT_TYPE_OPTIONS.find(o => o.value === unit.unitType)?.label || unit.unitType}</p>
                                                        <p>{unit.bedrooms} quarto(s) · até {unit.maxGuests} hóspedes</p>
                                                    </div>
                                                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => {
                                                            setEditingUnit(unit);
                                                            setUnitForm({
                                                                unitName: unit.unitName,
                                                                roomName: unit.roomName || '',
                                                                floor: unit.floor || '',
                                                                unitType: unit.unitType,
                                                                bedrooms: unit.bedrooms,
                                                                maxGuests: unit.maxGuests,
                                                            });
                                                            setShowUnitModal(true);
                                                        }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs py-2 rounded transition-colors">
                                                            Editar
                                                        </button>
                                                        <button onClick={() => handleDeleteUnit(unit.id)}
                                                            className="flex-1 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 text-xs py-2 rounded transition-colors">
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add unit placeholder */}
                                            <button onClick={() => {
                                                setEditingUnit(null);
                                                setUnitForm({ unitName: '', roomName: '', floor: '', unitType: 'studio', bedrooms: 1, maxGuests: 2 });
                                                setShowUnitModal(true);
                                            }} className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center text-gray-400 hover:border-blue-900 hover:text-blue-900 transition-all min-h-[160px]">
                                                <span className="text-3xl mb-1">+</span>
                                                <span className="font-questa-bold text-sm">Nova Unidade</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* --- PROPRIETÁRIOS --- */}
                {activeTab === 'proprietarios' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-questa-bold text-gray-900">Proprietários de Unidades</h2>
                            <button onClick={() => { setEditingOwner(null); setOwnerForm({ unitId: '', ownerName: '', ownerEmail: '', ownerPhone: '', ownerDocument: '', revenueSharePercent: 0 }); setShowOwnerModal(true); }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-800 transition-colors">
                                + Novo Proprietário
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Filtrar por prédio:</label>
                            <select value={ownerPropertyFilter} onChange={e => setOwnerPropertyFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white">
                                <option value="">Todos</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {ownersLoading ? (
                            <div className="flex items-center justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /><span className="ml-2 text-sm text-gray-600">Carregando...</span></div>
                        ) : owners.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center"><p className="text-gray-500">Nenhum proprietário cadastrado.</p></div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b"><tr>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Unidade</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Receita %</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                                            <th className="text-right px-4 py-3 font-medium text-gray-600">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {owners.map(o => (
                                                <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{o.ownerName}</td>
                                                    <td className="px-4 py-3 text-gray-600">{o.ownerEmail}</td>
                                                    <td className="px-4 py-3 text-gray-600">{o.unitName}</td>
                                                    <td className="px-4 py-3 text-blue-700 font-medium">{o.revenueSharePercent}%</td>
                                                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{o.active ? 'Ativo' : 'Inativo'}</span></td>
                                                    <td className="px-4 py-3 text-right space-x-2">
                                                        <button onClick={() => { setEditingOwner(o); setOwnerForm({ unitId: o.unitId, ownerName: o.ownerName, ownerEmail: o.ownerEmail, ownerPhone: o.ownerPhone || '', ownerDocument: o.ownerDocument || '', revenueSharePercent: o.revenueSharePercent }); setShowOwnerModal(true); }} className="text-xs text-blue-700 hover:underline">Editar</button>
                                                        <button onClick={() => handleDeleteOwner(o.id)} className="text-xs text-red-600 hover:underline">Remover</button>
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

                {/* --- FINANCEIRO --- */}
                {activeTab === 'financeiro' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-questa-bold text-gray-900">Registros Financeiros</h2>
                            <button onClick={() => { setFinForm({ propertyId: properties[0]?.id || '', unitId: '', type: 'revenue', category: 'rental', description: '', amount: '', referenceMonth: new Date().toISOString().slice(0, 7) }); setShowFinModal(true); }}
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-800 transition-colors">
                                + Novo Registro
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Filtrar por prédio:</label>
                            <select value={finPropertyFilter} onChange={e => setFinPropertyFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white">
                                <option value="">Todos</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {finLoading ? (
                            <div className="flex items-center justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /><span className="ml-2 text-sm text-gray-600">Carregando...</span></div>
                        ) : finRecords.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center"><p className="text-gray-500">Nenhum registro financeiro.</p></div>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b"><tr>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Mês</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Categoria</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
                                            <th className="text-left px-4 py-3 font-medium text-gray-600">Unidade</th>
                                            <th className="text-right px-4 py-3 font-medium text-gray-600">Valor</th>
                                            <th className="text-right px-4 py-3 font-medium text-gray-600">Ações</th>
                                        </tr></thead>
                                        <tbody>
                                            {finRecords.map(r => (
                                                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-600">{r.referenceMonth}</td>
                                                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.type === 'revenue' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{r.type === 'revenue' ? 'Receita' : 'Despesa'}</span></td>
                                                    <td className="px-4 py-3 text-gray-600 capitalize">{FIN_CATEGORY_OPTIONS.find(c => c.value === r.category)?.label || r.category}</td>
                                                    <td className="px-4 py-3 text-gray-600">{r.description || '—'}</td>
                                                    <td className="px-4 py-3 text-gray-600 text-xs">{r.unitName || 'Geral'}</td>
                                                    <td className={`px-4 py-3 text-right font-medium ${r.type === 'revenue' ? 'text-green-700' : 'text-red-600'}`}>{r.type === 'revenue' ? '+' : '-'} R$ {r.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                    <td className="px-4 py-3 text-right"><button onClick={() => handleDeleteFinancial(r.id)} className="text-xs text-red-600 hover:underline">Remover</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- DOCUMENTOS --- */}
                {activeTab === 'documentos' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-questa-bold text-gray-900">Gestão de Documentos</h2>
                            <button onClick={() => { setDocForm({ propertyId: properties[0]?.id || '', unitId: '', category: 'contract', title: '', fileUrl: '', visibleToOwner: true }); setShowDocModal(true); }}
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-800 transition-colors">
                                + Novo Documento
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Filtrar por prédio:</label>
                            <select value={docPropertyFilter} onChange={e => setDocPropertyFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white">
                                <option value="">Todos</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        {docsLoading ? (
                            <div className="flex items-center justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /><span className="ml-2 text-sm text-gray-600">Carregando...</span></div>
                        ) : documents.length === 0 ? (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center"><p className="text-gray-500">Nenhum documento cadastrado.</p></div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {documents.map(doc => (
                                    <div key={doc.id} className="bg-white rounded-lg border border-gray-200 p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div className="text-2xl">{doc.mimeType?.includes('pdf') ? '📕' : doc.mimeType?.includes('image') ? '🖼️' : '📄'}</div>
                                                <div className="min-w-0">
                                                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-900 hover:text-blue-700 truncate block">{doc.title}</a>
                                                    <p className="text-xs text-gray-500 capitalize">{DOC_CATEGORY_OPTIONS.find(c => c.value === doc.category)?.label || doc.category}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteDocument(doc.id)} className="text-xs text-red-600 hover:underline shrink-0 ml-2">Remover</button>
                                        </div>
                                        <div className="text-xs text-gray-400 space-y-0.5 mt-2">
                                            <p>{doc.unitName || 'Geral'} · {new Date(doc.createdAt).toLocaleDateString('pt-BR')}</p>
                                            <p>{doc.visibleToOwner ? '👁 Visível ao proprietário' : '🔒 Somente admin'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- MODAL: Novo Prédio --- */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-gray-900 mb-5">Novo Prédio</h3>
                        <form onSubmit={handleCreateProperty} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Nome do Empreendimento *</label>
                                <input type="text" required value={createForm.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                        setCreateForm(f => ({ ...f, name, slug }));
                                    }}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                    placeholder="Ex: FrontStay Savassi" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Slug (URL) *</label>
                                <input type="text" required value={createForm.slug}
                                    onChange={(e) => setCreateForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                                    className="w-full border-gray-300 rounded-lg text-sm font-mono focus:ring-blue-900 focus:border-blue-900"
                                    placeholder="frontstay-savassi" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Endereço</label>
                                <input type="text" value={createForm.address}
                                    onChange={(e) => setCreateForm(f => ({ ...f, address: e.target.value }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                    placeholder="Rua, número, bairro" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Cidade</label>
                                    <input type="text" value={createForm.city}
                                        onChange={(e) => setCreateForm(f => ({ ...f, city: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                        placeholder="Belo Horizonte" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Estado</label>
                                    <select value={createForm.state}
                                        onChange={(e) => setCreateForm(f => ({ ...f, state: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg font-questa-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {actionLoading ? 'Salvando...' : 'Criar Prédio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: Unidade --- */}
            {showUnitModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-gray-900 mb-5">{editingUnit ? 'Editar Unidade' : 'Nova Unidade'}</h3>
                        <form onSubmit={handleAddUnit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Nº da Unidade *</label>
                                    <input type="text" required value={unitForm.unitName}
                                        onChange={(e) => setUnitForm(f => ({ ...f, unitName: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                        placeholder="101" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Nome do Quarto</label>
                                    <input type="text" value={unitForm.roomName}
                                        onChange={(e) => setUnitForm(f => ({ ...f, roomName: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                        placeholder="Suite Master" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Andar</label>
                                    <input type="text" value={unitForm.floor}
                                        onChange={(e) => setUnitForm(f => ({ ...f, floor: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900"
                                        placeholder="1º" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Tipo</label>
                                    <select value={unitForm.unitType}
                                        onChange={(e) => setUnitForm(f => ({ ...f, unitType: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        {UNIT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Quartos</label>
                                    <input type="number" min={0} max={10} value={unitForm.bedrooms}
                                        onChange={(e) => setUnitForm(f => ({ ...f, bedrooms: Number(e.target.value) }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Máx. Hóspedes</label>
                                    <input type="number" min={1} max={20} value={unitForm.maxGuests}
                                        onChange={(e) => setUnitForm(f => ({ ...f, maxGuests: Number(e.target.value) }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => { setShowUnitModal(false); setEditingUnit(null); }}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg font-questa-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {actionLoading ? 'Salvando...' : (editingUnit ? 'Atualizar' : 'Adicionar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: Integração --- */}
            {showIntegrationModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-gray-900 mb-5">Configurar Integração</h3>
                        <form onSubmit={handleSaveIntegration} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Tipo de Serviço</label>
                                <select value={integrationForm.provider}
                                    onChange={(e) => {
                                        const provider = e.target.value;
                                        const firstOption = PROVIDER_TYPE_OPTIONS[provider]?.[0]?.value || '';
                                        setIntegrationForm({ provider, providerType: firstOption, config: {} });
                                    }}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                    {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Provedor</label>
                                <select value={integrationForm.providerType}
                                    onChange={(e) => setIntegrationForm(f => ({ ...f, providerType: e.target.value, config: {} }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                    {(PROVIDER_TYPE_OPTIONS[integrationForm.provider] || []).map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Credential fields */}
                            {(PROVIDER_CONFIG_FIELDS[integrationForm.providerType] || []).length > 0 && (
                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <p className="text-sm font-questa-medium text-gray-700">Credenciais</p>
                                    {(PROVIDER_CONFIG_FIELDS[integrationForm.providerType] || []).map(field => (
                                        <div key={field.key}>
                                            <label className="block text-xs text-gray-600 mb-1">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                placeholder={field.placeholder}
                                                value={integrationForm.config[field.key] || ''}
                                                onChange={(e) => setIntegrationForm(f => ({
                                                    ...f,
                                                    config: { ...f.config, [field.key]: e.target.value },
                                                }))}
                                                className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900 px-3 py-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowIntegrationModal(false)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg font-questa-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {actionLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* --- MODAL: Proprietário --- */}
            {showOwnerModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-gray-900 mb-5">{editingOwner ? 'Editar Proprietário' : 'Novo Proprietário'}</h3>
                        <form onSubmit={handleSaveOwner} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Prédio *</label>
                                <select required value={ownerPropertyFilter} disabled={!!editingOwner}
                                    onChange={(e) => {
                                        setOwnerPropertyFilter(e.target.value);
                                        setOwnerForm(f => ({ ...f, unitId: '' }));
                                        if (e.target.value) getUnitsForProperty(e.target.value);
                                    }}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900 disabled:bg-gray-100">
                                    <option value="">Selecione o prédio</option>
                                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Unidade *</label>
                                <select required value={ownerForm.unitId}
                                    onChange={e => setOwnerForm(f => ({ ...f, unitId: e.target.value }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                    <option value="">Selecione a unidade</option>
                                    {(unitsCache[ownerPropertyFilter] || selectedProperty?.units || []).map((u) => (
                                        <option key={u.id} value={u.id}>{u.unitName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Nome *</label>
                                    <input type="text" required value={ownerForm.ownerName} onChange={e => setOwnerForm(f => ({ ...f, ownerName: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="Nome completo" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Email *</label>
                                    <input type="email" required value={ownerForm.ownerEmail} onChange={e => setOwnerForm(f => ({ ...f, ownerEmail: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="email@exemplo.com" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Telefone</label>
                                    <input type="text" value={ownerForm.ownerPhone} onChange={e => setOwnerForm(f => ({ ...f, ownerPhone: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="(31) 99999-0000" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">CPF/CNPJ</label>
                                    <input type="text" value={ownerForm.ownerDocument} onChange={e => setOwnerForm(f => ({ ...f, ownerDocument: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="000.000.000-00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">% Repasse de Receita</label>
                                <input type="number" min="0" max="100" step="0.01" value={ownerForm.revenueSharePercent}
                                    onChange={e => setOwnerForm(f => ({ ...f, revenueSharePercent: parseFloat(e.target.value) || 0 }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowOwnerModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg font-questa-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {actionLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: Registro Financeiro --- */}
            {showFinModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-gray-900 mb-5">Novo Registro Financeiro</h3>
                        <form onSubmit={handleSaveFinancial} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Prédio *</label>
                                    <select required value={finForm.propertyId} onChange={e => { setFinForm(f => ({ ...f, propertyId: e.target.value, unitId: '' })); if (e.target.value) getUnitsForProperty(e.target.value); }}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        <option value="">Selecione</option>
                                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Unidade</label>
                                    <select value={finForm.unitId} onChange={e => setFinForm(f => ({ ...f, unitId: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        <option value="">Geral (prédio)</option>
                                        {(unitsCache[finForm.propertyId] || []).map((u) => (
                                            <option key={u.id} value={u.id}>{u.unitName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Tipo *</label>
                                    <select required value={finForm.type} onChange={e => setFinForm(f => ({ ...f, type: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        <option value="revenue">Receita</option>
                                        <option value="expense">Despesa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Categoria *</label>
                                    <select required value={finForm.category} onChange={e => setFinForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        {FIN_CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Mês Referência *</label>
                                    <input type="month" required value={finForm.referenceMonth} onChange={e => setFinForm(f => ({ ...f, referenceMonth: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Valor (R$) *</label>
                                    <input type="number" required min="0.01" step="0.01" value={finForm.amount}
                                        onChange={e => setFinForm(f => ({ ...f, amount: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="0.00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Descrição</label>
                                <input type="text" value={finForm.description} onChange={e => setFinForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="Descrição do lançamento" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowFinModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg font-questa-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {actionLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: Documento --- */}
            {showDocModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-gray-900 mb-5">Novo Documento</h3>
                        <form onSubmit={handleSaveDocument} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Prédio *</label>
                                    <select required value={docForm.propertyId} onChange={e => { setDocForm(f => ({ ...f, propertyId: e.target.value, unitId: '' })); if (e.target.value) getUnitsForProperty(e.target.value); }}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        <option value="">Selecione</option>
                                        {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Unidade</label>
                                    <select value={docForm.unitId} onChange={e => setDocForm(f => ({ ...f, unitId: e.target.value }))}
                                        className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                        <option value="">Geral (prédio)</option>
                                        {(unitsCache[docForm.propertyId] || []).map((u) => (
                                            <option key={u.id} value={u.id}>{u.unitName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Título *</label>
                                <input type="text" required value={docForm.title} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="Nome do documento" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">Categoria *</label>
                                <select required value={docForm.category} onChange={e => setDocForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900">
                                    {DOC_CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1 font-questa-medium">URL do Arquivo *</label>
                                <input type="url" required value={docForm.fileUrl} onChange={e => setDocForm(f => ({ ...f, fileUrl: e.target.value }))}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-900 focus:border-blue-900" placeholder="https://..." />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="visibleToOwner" checked={docForm.visibleToOwner}
                                    onChange={e => setDocForm(f => ({ ...f, visibleToOwner: e.target.checked }))}
                                    className="rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                                <label htmlFor="visibleToOwner" className="text-sm text-gray-700">Visível para o proprietário</label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowDocModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancelar</button>
                                <button type="submit" disabled={actionLoading}
                                    className="px-5 py-2 bg-blue-900 text-white rounded-lg font-questa-bold text-sm hover:bg-blue-800 disabled:opacity-50 transition-colors">
                                    {actionLoading ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

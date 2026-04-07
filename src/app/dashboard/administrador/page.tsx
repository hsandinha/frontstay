'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// --- Types ---
type TabType = 'visao-geral' | 'inventario' | 'acesso' | 'limpeza';
type RoomStatus = 'disponivel' | 'ocupado' | 'sujo' | 'manutencao';

interface CleaningTask {
    id: string;
    roomNumber: string;
    buildingName: string;
    checkoutTime: string;
    status: 'pendente' | 'concluido';
    priority: 'alta' | 'normal';
    nextCheckIn?: string;
}

interface Room {
    id: string;
    number: string;
    floor: string;
    status: RoomStatus;
    lockId: string;
    lockBattery: number;
    lastCleaning?: string;
}

interface Building {
    id: string;
    name: string;
    address: string;
    rooms: Room[];
}

// --- Mock Data ---
const INITIAL_BUILDINGS: Building[] = [
    {
        id: '1',
        name: 'FrontStay Esopo',
        address: 'Alameda Flamboiant, 285',
        rooms: [
            { id: '101', number: '101', floor: '1º', status: 'ocupado', lockId: 'LK-9921', lockBattery: 85, lastCleaning: '2024-01-07' },
            { id: '102', number: '102', floor: '1º', status: 'disponivel', lockId: 'LK-9922', lockBattery: 42, lastCleaning: '2024-01-08' },
            { id: '201', number: '201', floor: '2º', status: 'sujo', lockId: 'LK-9923', lockBattery: 12, lastCleaning: '2024-01-05' },
            { id: '202', number: '202', floor: '2º', status: 'manutencao', lockId: 'LK-9924', lockBattery: 90, lastCleaning: '2024-01-02' },
        ]
    },
    {
        id: '2',
        name: 'FrontStay City Design',
        address: 'Rua Tenente Brito Melo',
        rooms: [
            { id: '301', number: '301', floor: '3º', status: 'disponivel', lockId: 'LK-8801', lockBattery: 78 },
            { id: '302', number: '302', floor: '3º', status: 'ocupado', lockId: 'LK-8802', lockBattery: 65 },
        ]
    }
];

const getDailyCleaningTasks = (): CleaningTask[] => {
    return [
        {
            id: '1',
            roomNumber: '101',
            buildingName: 'FrontStay Esopo',
            checkoutTime: '11:00',
            status: 'pendente',
            priority: 'alta',
            nextCheckIn: '14:00'
        },
        {
            id: '2',
            roomNumber: '302',
            buildingName: 'FrontStay City Design',
            checkoutTime: '10:30',
            status: 'pendente',
            priority: 'normal'
        },
        {
            id: '3',
            roomNumber: '201',
            buildingName: 'FrontStay Esopo',
            checkoutTime: '09:00',
            status: 'concluido',
            priority: 'normal'
        }
    ];
};

// --- Componente RelatorioLimpeza ---
const RelatorioLimpeza = () => {
    const [tasks, setTasks] = useState<CleaningTask[]>(() => getDailyCleaningTasks());

    const handleCompleteTask = (taskId: string) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId
                    ? { ...task, status: 'concluido' }
                    : task
            )
        );
        // Aqui adicionaria a lógica para atualizar o banco de dados
        console.log(`Limpeza do quarto ${taskId} concluída`);
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-questa-bold text-neutral-dark">Relatório de Limpeza Diária</h3>
                    <p className="text-sm text-neutral-medium">Gerenciamento de camareiras e rotação de quartos</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm font-questa-bold text-neutral-dark">
                        {tasks.filter(t => t.status === 'pendente').length} Pendentes
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Coluna Pendentes */}
                <div className="space-y-4">
                    <h4 className="font-questa-bold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-orange"></span>
                        Limpeza Pendente
                    </h4>
                    {tasks.filter(t => t.status === 'pendente').map(task => (
                        <div key={task.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{task.buildingName}</span>
                                    <h5 className="text-xl font-questa-bold text-secondary-purple">Apt {task.roomNumber}</h5>
                                </div>
                                {task.priority === 'alta' && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                                        Prioridade Alta
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <span>🕒 Checkout:</span>
                                    <span className="font-medium">{task.checkoutTime}</span>
                                </div>
                                {task.nextCheckIn && (
                                    <div className="flex items-center gap-2 text-primary-teal-dark">
                                        <span>🔜 Próximo Check-in:</span>
                                        <span className="font-bold">{task.nextCheckIn}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleCompleteTask(task.id)}
                                className="w-full py-2 bg-primary-teal text-white rounded-md font-questa-bold text-sm hover:bg-primary-teal-dark transition-colors shadow-sm"
                            >
                                Concluir Limpeza
                            </button>
                        </div>
                    ))}
                    {tasks.filter(t => t.status === 'pendente').length === 0 && (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-400">
                            <p>Nenhuma limpeza pendente</p>
                        </div>
                    )}
                </div>

                {/* Coluna Concluídos */}
                <div className="space-y-4">
                    <h4 className="font-questa-bold text-gray-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-support-green"></span>
                        Concluídos Hoje
                    </h4>
                    {tasks.filter(t => t.status === 'concluido').map(task => (
                        <div key={task.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm opacity-75 hover:opacity-100 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{task.buildingName}</span>
                                    <h5 className="text-lg font-questa-bold text-gray-700 strike-through">Apt {task.roomNumber}</h5>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                    Concluído
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                <span>✓</span> Pront para check-in
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function AdministradorDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [buildings, setBuildings] = useState<Building[]>(INITIAL_BUILDINGS);
    const [selectedBuilding, setSelectedBuilding] = useState<Building>(INITIAL_BUILDINGS[0]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // States for Access Control
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [accessForm, setAccessForm] = useState({
        roomId: '',
        checkIn: '',
        checkOut: ''
    });

    // Simulate API fetch for battery levels
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulated live update
            console.log('Syncing lock status from API...');
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        router.push('/login');
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    const getStatusColor = (status: RoomStatus) => {
        switch (status) {
            case 'disponivel': return 'bg-support-green text-white';
            case 'ocupado': return 'bg-secondary-purple text-white';
            case 'sujo': return 'bg-accent-orange text-white';
            case 'manutencao': return 'bg-support-pink text-white';
            default: return 'bg-neutral-light text-neutral-dark';
        }
    };

    const handleGenerateCode = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate code generation logic
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-questa-regular">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/logo.png"
                                alt="FrontStay Logo"
                                width={65}
                                height={65}
                                className="object-contain"
                            />
                            <h1 className="text-ml font-questa-bold text-gray-900">Admin</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                                    {!imageError ? (
                                        <Image
                                            src="/public/user-photo.jpg"
                                            alt="Foto do Usuário"
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-questa-bold text-sm">
                                            A
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm text-gray-600 font-questa-regular">Bem vindo, Admin</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-blue-900 hover:text-blue-950 font-questa-medium"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs - Desktop & Mobile */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden items-center justify-between py-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="flex items-center gap-2 text-gray-700 font-questa-medium"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                            <span className="text-sm">Menu</span>
                        </button>
                        <span className="text-sm text-gray-900 font-questa-bold">
                            {activeTab === 'visao-geral' && 'Visão Geral'}
                            {activeTab === 'inventario' && 'Gestão de Inventário'}
                            {activeTab === 'acesso' && 'Controle de Acesso'}
                            {activeTab === 'limpeza' && 'Relatório de Limpeza'}
                        </span>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <nav className="lg:hidden pb-4 space-y-1">
                            <button
                                onClick={() => handleTabChange('visao-geral')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'visao-geral'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Visão Geral
                            </button>
                            <button
                                onClick={() => handleTabChange('inventario')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'inventario'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Gestão de Inventário
                            </button>
                            <button
                                onClick={() => handleTabChange('acesso')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'acesso'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Controle de Acesso
                            </button>
                            <button
                                onClick={() => handleTabChange('limpeza')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'limpeza'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Relatório de Limpeza
                            </button>
                        </nav>
                    )}

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <nav className="hidden lg:flex gap-8">
                        <button
                            onClick={() => handleTabChange('visao-geral')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'visao-geral'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Visão Geral
                        </button>
                        <button
                            onClick={() => handleTabChange('inventario')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'inventario'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Gestão de Inventário
                        </button>
                        <button
                            onClick={() => handleTabChange('acesso')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'acesso'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Controle de Acesso
                        </button>
                        <button
                            onClick={() => handleTabChange('limpeza')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'limpeza'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Relatório de Limpeza
                        </button>
                    </nav>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto">

                    {/* --- VISÃO GERAL --- */}
                    {activeTab === 'visao-geral' && (
                        <div className="space-y-8 animate-fade-in-up">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-neutral-medium mb-1 uppercase tracking-wide">Total Usuários</p>
                                            <p className="text-2xl font-questa-bold text-secondary-purple">1.248</p>
                                        </div>
                                        <div className="text-4xl opacity-80">👥</div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-neutral-medium mb-1 uppercase tracking-wide">Total Imóveis</p>
                                            <p className="text-2xl font-questa-bold text-secondary-purple">342</p>
                                        </div>
                                        <div className="text-4xl opacity-80">🏘️</div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-neutral-medium mb-1 uppercase tracking-wide">Reservas Ativas</p>
                                            <p className="text-2xl font-questa-bold text-secondary-purple">89</p>
                                        </div>
                                        <div className="text-4xl opacity-80">📅</div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-neutral-medium mb-1 uppercase tracking-wide">Receita Mensal</p>
                                            <p className="text-2xl font-questa-bold text-secondary-purple">R$ 890k</p>
                                        </div>
                                        <div className="text-4xl opacity-80">💰</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-xl font-questa-bold text-neutral-dark mb-4 border-b border-neutral-lighter pb-2">Atividades Recentes</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="text-lg bg-green-100 p-1 rounded">✅</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-questa-medium text-neutral-dark">Nova propriedade aprovada</p>
                                                <p className="text-xs text-neutral-medium">há 5 minutos</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="text-lg bg-blue-100 p-1 rounded">👤</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-questa-medium text-neutral-dark">Novo usuário cadastrado</p>
                                                <p className="text-xs text-neutral-medium">há 15 minutos</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="text-lg bg-yellow-100 p-1 rounded">⚠️</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-questa-medium text-neutral-dark">Bateria Fraca - Quarto 201</p>
                                                <p className="text-xs text-neutral-medium">há 30 minutos</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-xl font-questa-bold text-neutral-dark mb-4 border-b border-neutral-lighter pb-2">Pendências Operacionais</h3>
                                    <div className="space-y-4">
                                        <div className="border-l-4 border-accent-orange pl-4 py-2 bg-neutral-lighter/30 rounded-r-lg">
                                            <p className="text-sm font-questa-medium text-neutral-dark">3 quartos precisam de limpeza</p>
                                            <button
                                                onClick={() => setActiveTab('inventario')}
                                                className="text-xs text-primary-teal hover:text-primary-teal-dark mt-1 font-questa-bold uppercase"
                                            >
                                                Gerenciar →
                                            </button>
                                        </div>
                                        <div className="border-l-4 border-support-pink pl-4 py-2 bg-neutral-lighter/30 rounded-r-lg">
                                            <p className="text-sm font-questa-medium text-neutral-dark">2 fechaduras com bateria crítica (&lt;20%)</p>
                                            <button className="text-xs text-primary-teal hover:text-primary-teal-dark mt-1 font-questa-bold uppercase">
                                                Verificar →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- GESTÃO DE INVENTÁRIO --- */}
                    {activeTab === 'inventario' && (
                        <div className="space-y-6 animate-fade-in-up">
                            {/* Toolbar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-questa-bold text-neutral-dark">Prédio:</h3>
                                    <select
                                        value={selectedBuilding.id}
                                        onChange={(e) => {
                                            const building = buildings.find(b => b.id === e.target.value);
                                            if (building) setSelectedBuilding(building);
                                        }}
                                        className="border-neutral-light rounded-lg text-sm focus:ring-secondary-purple focus:border-secondary-purple"
                                    >
                                        {buildings.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-neutral-medium ml-2">{selectedBuilding.address}</span>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-primary-teal text-white px-4 py-2 rounded-lg text-sm font-questa-bold hover:bg-primary-teal-dark transition-all flex items-center gap-2"
                                >
                                    + Novo Prédio
                                </button>
                            </div>

                            {/* Mapa de Unidades */}
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-questa-bold text-neutral-dark">Mapa de Unidades</h3>
                                    <div className="flex gap-3 text-xs">
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-support-green"></span> Disponível</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-secondary-purple"></span> Ocupado</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-accent-orange"></span> Sujo</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-support-pink"></span> Manutenção</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {selectedBuilding.rooms.map((room) => (
                                        <div key={room.id} className="border border-neutral-light rounded-lg p-4 hover:shadow-md transition-all relative overflow-hidden group">
                                            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${getStatusColor(room.status)}`}>
                                                {room.status.toUpperCase()}
                                            </div>

                                            <div className="mt-2">
                                                <h4 className="text-2xl font-questa-bold text-neutral-dark">Apt {room.number}</h4>
                                                <p className="text-sm text-neutral-medium">{room.floor} Andar</p>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-neutral-lighter space-y-2 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-neutral-medium">Fechadura:</span>
                                                    <span className="font-mono text-neutral-dark">{room.lockId}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-neutral-medium">Bateria:</span>
                                                    <span className={`font-bold ${room.lockBattery < 20 ? 'text-red-500 animate-pulse' : 'text-support-green'}`}>
                                                        {room.lockBattery}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-neutral-medium">Limpeza:</span>
                                                    <span className="text-neutral-dark">{room.lastCleaning || 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="flex-1 bg-neutral-lighter hover:bg-neutral-light text-neutral-dark text-xs py-2 rounded">
                                                    Editar
                                                </button>
                                                <button className="flex-1 bg-neutral-lighter hover:bg-neutral-light text-neutral-dark text-xs py-2 rounded">
                                                    Histórico
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Room Button (Placeholder) */}
                                    <button className="border-2 border-dashed border-neutral-light rounded-lg p-4 flex flex-col items-center justify-center text-neutral-medium hover:border-primary-teal hover:text-primary-teal transition-all min-h-[180px]">
                                        <span className="text-4xl mb-2">+</span>
                                        <span className="font-questa-bold">Adicionar Quarto</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CONTROLE DE ACESSO --- */}
                    {activeTab === 'acesso' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Form */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-xl font-questa-bold text-neutral-dark mb-6">Gerar Acesso Temporário</h3>
                                    <form onSubmit={handleGenerateCode} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-questa-medium text-neutral-dark mb-1">Selecione o Quarto</label>
                                            <select
                                                className="w-full border-neutral-light rounded-lg focus:ring-primary-teal focus:border-primary-teal"
                                                required
                                                onChange={(e) => setAccessForm({ ...accessForm, roomId: e.target.value })}
                                            >
                                                <option value="">Selecione...</option>
                                                {selectedBuilding.rooms.map(room => (
                                                    <option key={room.id} value={room.id}>Apt {room.number} - {selectedBuilding.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-questa-medium text-neutral-dark mb-1">Check-in (Início)</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full border-neutral-light rounded-lg focus:ring-primary-teal focus:border-primary-teal text-sm"
                                                    required
                                                    onChange={(e) => setAccessForm({ ...accessForm, checkIn: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-questa-medium text-neutral-dark mb-1">Check-out (Fim)</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full border-neutral-light rounded-lg focus:ring-primary-teal focus:border-primary-teal text-sm"
                                                    required
                                                    onChange={(e) => setAccessForm({ ...accessForm, checkOut: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-secondary-purple text-white py-3 rounded-lg font-questa-bold hover:bg-secondary-purple-light transition-all shadow-lg shadow-purple-900/10 mt-4"
                                        >
                                            Gerar Senha de Acesso
                                        </button>
                                    </form>
                                </div>

                                {/* Result Display */}
                                <div className="bg-gradient-to-br from-secondary-purple to-secondary-purple-dark text-white p-8 rounded-lg shadow-lg relative overflow-hidden flex flex-col justify-center items-center text-center">
                                    <div className="absolute inset-0 bg-geometric-pattern opacity-10"></div>

                                    {generatedCode ? (
                                        <div className="relative z-10 animate-fade-in-up w-full">
                                            <p className="text-secondary-purple-light/80 font-questa-medium uppercase tracking-widest text-sm mb-4">Senha Gerada com Sucesso</p>

                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
                                                <span className="font-mono text-6xl font-bold tracking-widest text-white drop-shadow-lg">
                                                    {generatedCode}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-sm text-white/80">
                                                <p>Validade: <span className="text-white font-bold">12/01 14:00</span> até <span className="text-white font-bold">15/01 11:00</span></p>
                                                <p>Quarto: <span className="text-white font-bold">Apt {buildings.flatMap(b => b.rooms).find(r => r.id === accessForm.roomId)?.number || '---'}</span></p>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`Sua senha de acesso para o FrontStay é: ${generatedCode}`);
                                                    alert('Copiado para a área de transferência!');
                                                }}
                                                className="mt-8 bg-white text-secondary-purple px-6 py-2 rounded-full text-sm font-bold hover:bg-neutral-lighter transition-colors"
                                            >
                                                Copiar Mensagem
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative z-10 text-white/40">
                                            <div className="text-6xl mb-4">🔒</div>
                                            <p className="font-questa-medium">Preencha o formulário para gerar<br />uma senha temporária.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- RELATÓRIO DE LIMPEZA --- */}
                    {activeTab === 'limpeza' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <RelatorioLimpeza />
                        </div>
                    )}
                </div>
            </main>

            {/* Modal de Cadastro de Prédio */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in-up">
                        <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Novo Prédio</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm text-neutral-dark mb-1">Nome do Empreendimento</label>
                                <input type="text" className="w-full border-neutral-light rounded-lg" placeholder="Ex: FrontStay Savassi" />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-dark mb-1">Endereço Completo</label>
                                <input type="text" className="w-full border-neutral-light rounded-lg" placeholder="Rua..." />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-neutral-medium hover:text-neutral-dark"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 bg-primary-teal text-white rounded-lg font-bold"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

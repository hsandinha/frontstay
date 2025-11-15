'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TabType = 'visao-geral' | 'servicos' | 'solicitacoes';

type ServicoType = {
    id: number;
    nome: string;
    categoria: string;
    descricao: string;
    preco: string;
    desconto: string;
    ativo: boolean;
};

type SolicitacaoType = {
    id: number;
    servico: string;
    solicitante: string;
    tipoSolicitante: 'Hóspede' | 'Proprietário';
    imovel: string;
    data: string;
    horario: string;
    status: 'Pendente' | 'Aceito' | 'Recusado' | 'Concluído';
    observacoes: string;
};

export default function ParceirosDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estados para formulário de serviço
    const [nomeServico, setNomeServico] = useState('');
    const [categoriaServico, setCategoriaServico] = useState('');
    const [descricaoServico, setDescricaoServico] = useState('');
    const [precoServico, setPrecoServico] = useState('');
    const [descontoServico, setDescontoServico] = useState('');

    const handleLogout = () => {
        router.push('/login');
    };

    // Mock de dados
    const parceiro = {
        nome: 'Empresa Parceira',
        email: 'contato@parceiro.com',
        telefone: '(31) 98765-4321',
        categoria: 'Restaurante', // Pode ser: Restaurante, Manutenção, Personal, Academia, Maquiadora, etc
        avaliacao: 4.8,
        totalAvaliacoes: 127,
    };

    const servicos: ServicoType[] = [
        {
            id: 1,
            nome: 'Almoço Executivo Delivery',
            categoria: 'Restaurante',
            descricao: 'Refeições balanceadas entregues no imóvel',
            preco: 'R$ 35,00',
            desconto: '10%',
            ativo: true
        },
        {
            id: 2,
            nome: 'Manutenção Elétrica',
            categoria: 'Manutenção',
            descricao: 'Reparos e instalações elétricas em geral',
            preco: 'R$ 150,00',
            desconto: '15%',
            ativo: true
        },
        {
            id: 3,
            nome: 'Personal Trainer',
            categoria: 'Personal',
            descricao: 'Treinos personalizados no imóvel ou online',
            preco: 'R$ 120,00',
            desconto: '20%',
            ativo: true
        },
        {
            id: 4,
            nome: 'Maquiagem para Eventos',
            categoria: 'Maquiadora',
            descricao: 'Maquiagem profissional para festas e eventos',
            preco: 'R$ 180,00',
            desconto: '15%',
            ativo: true
        },
        {
            id: 5,
            nome: 'Limpeza Completa',
            categoria: 'Limpeza',
            descricao: 'Limpeza profunda de todos os ambientes',
            preco: 'R$ 200,00',
            desconto: '10%',
            ativo: true
        },
        {
            id: 6,
            nome: 'Massagem Relaxante',
            categoria: 'Massagem',
            descricao: 'Sessão de massagem terapêutica no imóvel',
            preco: 'R$ 140,00',
            desconto: '20%',
            ativo: false
        },
    ];


    const solicitacoes: SolicitacaoType[] = [
        {
            id: 1,
            servico: 'Limpeza Profissional Completa',
            solicitante: 'Maria Santos',
            tipoSolicitante: 'Proprietário',
            imovel: 'Apartamento Vista Mar - Copacabana, Rio de Janeiro',
            data: '2025-11-18',
            horario: '10:00',
            status: 'Pendente',
            observacoes: 'Limpeza completa após hóspede de longa temporada'
        },
        {
            id: 2,
            servico: 'Check-in/Check-out',
            solicitante: 'Pedro Oliveira',
            tipoSolicitante: 'Hóspede',
            imovel: 'Loft Centro - São Paulo, SP',
            data: '2025-11-17',
            horario: '15:00',
            status: 'Pendente',
            observacoes: 'Check-in para família com 2 crianças'
        },
        {
            id: 3,
            servico: 'Manutenção Elétrica',
            solicitante: 'Carlos Mendes',
            tipoSolicitante: 'Proprietário',
            imovel: 'Casa Jardim - Belo Horizonte, MG',
            data: '2025-11-16',
            horario: '14:00',
            status: 'Aceito',
            observacoes: 'Troca de chuveiro e verificação de disjuntores'
        },
        {
            id: 4,
            servico: 'Limpeza Profissional Completa',
            solicitante: 'Ana Paula',
            tipoSolicitante: 'Hóspede',
            imovel: 'Apartamento Praia - Santos, SP',
            data: '2025-11-12',
            horario: '09:00',
            status: 'Concluído',
            observacoes: 'Limpeza pós-evento'
        },
    ];

    const stats = {
        servicosAtivos: servicos.filter(s => s.ativo).length,
        solicitacoesPendentes: solicitacoes.filter(s => s.status === 'Pendente').length,
        receitaMes: 'R$ 18.500',
        servicosConcluidos: solicitacoes.filter(s => s.status === 'Concluído').length,
    };

    // Função para retornar ícone e cor por categoria
    const getCategoriaInfo = (categoria: string) => {
        const categorias: Record<string, { icone: string; cor: string; bgCor: string }> = {
            'Restaurante': { icone: '🍽️', cor: 'text-orange-700', bgCor: 'bg-orange-100' },
            'Manutenção': { icone: '🔧', cor: 'text-gray-700', bgCor: 'bg-gray-100' },
            'Personal': { icone: '💪', cor: 'text-blue-700', bgCor: 'bg-blue-100' },
            'Academia': { icone: '🏋️', cor: 'text-purple-700', bgCor: 'bg-purple-100' },
            'Maquiadora': { icone: '💄', cor: 'text-pink-700', bgCor: 'bg-pink-100' },
            'Limpeza': { icone: '🧹', cor: 'text-cyan-700', bgCor: 'bg-cyan-100' },
            'Transporte': { icone: '🚗', cor: 'text-indigo-700', bgCor: 'bg-indigo-100' },
            'Massagem': { icone: '💆', cor: 'text-green-700', bgCor: 'bg-green-100' },
            'Estética': { icone: '✨', cor: 'text-yellow-700', bgCor: 'bg-yellow-100' },
            'Nutricionista': { icone: '🥗', cor: 'text-lime-700', bgCor: 'bg-lime-100' },
            'Lavanderia': { icone: '👔', cor: 'text-teal-700', bgCor: 'bg-teal-100' },
            'Chef': { icone: '👨‍🍳', cor: 'text-red-700', bgCor: 'bg-red-100' },
            'Jardinagem': { icone: '🌿', cor: 'text-emerald-700', bgCor: 'bg-emerald-100' },
            'Segurança': { icone: '🛡️', cor: 'text-slate-700', bgCor: 'bg-slate-100' },
            'Fotografia': { icone: '📸', cor: 'text-violet-700', bgCor: 'bg-violet-100' },
            'Turismo': { icone: '🗺️', cor: 'text-amber-700', bgCor: 'bg-amber-100' },
            'Recepção': { icone: '🔑', cor: 'text-rose-700', bgCor: 'bg-rose-100' },
            'Outros': { icone: '📦', cor: 'text-gray-700', bgCor: 'bg-gray-100' },
        };
        return categorias[categoria] || categorias['Outros'];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-questa-bold">
                                <span className="text-blue-900">front</span>
                                <span className="text-gray-900">stay</span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab('visao-geral')}
                                className={`px-4 py-2 rounded-lg text-sm font-questa-medium transition-colors ${activeTab === 'visao-geral'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                📊 Visão Geral
                            </button>
                            <button
                                onClick={() => setActiveTab('servicos')}
                                className={`px-4 py-2 rounded-lg text-sm font-questa-medium transition-colors ${activeTab === 'servicos'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                🛠️ Meus Serviços
                            </button>
                            <button
                                onClick={() => setActiveTab('solicitacoes')}
                                className={`px-4 py-2 rounded-lg text-sm font-questa-medium transition-colors flex items-center gap-2 ${activeTab === 'solicitacoes'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                📋 Solicitações
                                {stats.solicitacoesPendentes > 0 && (
                                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                                        {stats.solicitacoesPendentes}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-questa-bold">
                                    {parceiro.nome.charAt(0)}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-questa-bold text-gray-900">Parceiro</p>
                                    <p className="text-xs text-gray-500 font-questa-regular">{parceiro.categoria}</p>
                                </div>
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <div className="p-4 border-b border-gray-200">
                                        <p className="font-questa-bold text-gray-900">{parceiro.nome}</p>
                                        <p className="text-sm text-gray-500 font-questa-regular">{parceiro.email}</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <span className="text-amber-500">⭐</span>
                                            <span className="text-sm font-questa-bold text-gray-900">{parceiro.avaliacao}</span>
                                            <span className="text-xs text-gray-500">({parceiro.totalAvaliacoes} avaliações)</span>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setIsProfileModalOpen(true);
                                                setIsProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Meu Perfil
                                        </button>
                                        <button
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Configurações
                                        </button>
                                        <button
                                            onClick={() => setIsProfileOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            Suporte FrontStay
                                        </button>
                                    </div>

                                    <div className="p-2 border-t border-gray-200">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setActiveTab('visao-geral');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-lg text-sm font-questa-medium transition-colors text-left ${activeTab === 'visao-geral'
                                        ? 'bg-blue-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    📊 Visão Geral
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('servicos');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-lg text-sm font-questa-medium transition-colors text-left ${activeTab === 'servicos'
                                        ? 'bg-blue-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    🛠️ Meus Serviços
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('solicitacoes');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`px-4 py-3 rounded-lg text-sm font-questa-medium transition-colors text-left flex items-center justify-between ${activeTab === 'solicitacoes'
                                        ? 'bg-blue-900 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span>📋 Solicitações</span>
                                    {stats.solicitacoesPendentes > 0 && (
                                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                                            {stats.solicitacoesPendentes}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Visão Geral */}
                {activeTab === 'visao-geral' && (
                    <div className="space-y-6">
                        {/* Cards de Estatísticas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500 font-questa-regular mb-1">Serviços Ativos</p>
                                        <p className="text-2xl sm:text-3xl font-questa-bold text-blue-900">{stats.servicosAtivos}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500 font-questa-regular mb-1">Solicitações Pendentes</p>
                                        <p className="text-2xl sm:text-3xl font-questa-bold text-orange-500">{stats.solicitacoesPendentes}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500 font-questa-regular mb-1">Avaliação Média</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-2xl sm:text-3xl font-questa-bold text-amber-500">{parceiro.avaliacao}</p>
                                            <span className="text-amber-500">⭐</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500 font-questa-regular mb-1">Receita Mês</p>
                                        <p className="text-xl sm:text-2xl font-questa-bold text-green-600">{stats.receitaMes}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Serviços em Destaque e Solicitações Recentes */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Serviços em Destaque */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-questa-bold text-gray-900">Serviços Mais Solicitados</h3>
                                </div>
                                <div className="p-4 sm:p-6 space-y-4">
                                    {servicos.slice(0, 3).map((servico) => {
                                        const catInfo = getCategoriaInfo(servico.categoria);
                                        return (
                                            <div key={servico.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${catInfo.bgCor}`}>
                                                    <span className="text-2xl">{catInfo.icone}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-questa-bold text-gray-900">{servico.nome}</h4>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-questa-medium ${catInfo.bgCor} ${catInfo.cor}`}>
                                                            {servico.categoria}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 font-questa-regular mb-2">{servico.descricao}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-questa-bold text-blue-900">{servico.preco}</span>
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-questa-medium rounded">
                                                            {servico.desconto} desconto
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Solicitações Recentes */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-questa-bold text-gray-900">Solicitações Recentes</h3>
                                </div>
                                <div className="p-4 sm:p-6 space-y-3">
                                    {solicitacoes.slice(0, 4).map((solicitacao) => (
                                        <div key={solicitacao.id} className={`border-l-4 pl-4 py-2 ${solicitacao.status === 'Pendente' ? 'border-orange-500' :
                                            solicitacao.status === 'Aceito' ? 'border-blue-500' :
                                                solicitacao.status === 'Concluído' ? 'border-green-500' : 'border-gray-300'
                                            }`}>
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-questa-bold text-gray-900 text-sm">{solicitacao.servico}</h4>
                                                    <p className="text-xs text-gray-600 font-questa-regular mt-1">
                                                        {solicitacao.data} • {solicitacao.horario}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-questa-medium rounded whitespace-nowrap ${solicitacao.status === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                                                    solicitacao.status === 'Aceito' ? 'bg-blue-100 text-blue-700' :
                                                        solicitacao.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {solicitacao.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Aba Serviços */}
                {activeTab === 'servicos' && (
                    <div className="space-y-6">
                        {/* Formulário Cadastro de Serviço */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-xl font-questa-bold text-gray-900 mb-4">Cadastrar Novo Serviço</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-questa-medium text-gray-700 mb-2">Nome do Serviço</label>
                                    <input
                                        type="text"
                                        value={nomeServico}
                                        onChange={(e) => setNomeServico(e.target.value)}
                                        placeholder="Ex: Limpeza Profissional"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-questa-medium text-gray-700 mb-2">Categoria</label>
                                    <select
                                        value={categoriaServico}
                                        onChange={(e) => setCategoriaServico(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        <option value="Restaurante">🍽️ Restaurante</option>
                                        <option value="Manutenção">🔧 Manutenção</option>
                                        <option value="Personal">💪 Personal Trainer</option>
                                        <option value="Academia">🏋️ Academia</option>
                                        <option value="Maquiadora">💄 Maquiadora</option>
                                        <option value="Limpeza">🧹 Limpeza</option>
                                        <option value="Transporte">🚗 Transporte</option>
                                        <option value="Massagem">💆 Massagem/Spa</option>
                                        <option value="Estética">✨ Estética</option>
                                        <option value="Nutricionista">🥗 Nutricionista</option>
                                        <option value="Lavanderia">👔 Lavanderia</option>
                                        <option value="Chef">👨‍🍳 Chef Particular</option>
                                        <option value="Jardinagem">🌿 Jardinagem</option>
                                        <option value="Segurança">🛡️ Segurança</option>
                                        <option value="Fotografia">📸 Fotografia</option>
                                        <option value="Turismo">🗺️ Guia Turístico</option>
                                        <option value="Outros">📦 Outros</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-questa-medium text-gray-700 mb-2">Descrição</label>
                                    <textarea
                                        value={descricaoServico}
                                        onChange={(e) => setDescricaoServico(e.target.value)}
                                        placeholder="Descreva detalhadamente o serviço oferecido"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-questa-medium text-gray-700 mb-2">Preço (R$)</label>
                                    <input
                                        type="text"
                                        value={precoServico}
                                        onChange={(e) => setPrecoServico(e.target.value)}
                                        placeholder="150,00"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-questa-medium text-gray-700 mb-2">Desconto FrontStay (%)</label>
                                    <input
                                        type="text"
                                        value={descontoServico}
                                        onChange={(e) => setDescontoServico(e.target.value)}
                                        placeholder="10"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button className="px-6 py-3 bg-blue-900 text-white rounded-lg font-questa-bold hover:bg-blue-950 transition-colors">
                                    Cadastrar Serviço
                                </button>
                                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-questa-medium hover:bg-gray-300 transition-colors">
                                    Limpar Formulário
                                </button>
                            </div>
                        </div>

                        {/* Lista de Serviços */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <h2 className="text-xl font-questa-bold text-gray-900">Meus Serviços Cadastrados</h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {servicos.map((servico) => (
                                    <div key={servico.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-questa-bold text-gray-900 text-lg">{servico.nome}</h3>
                                                    <span className={`px-3 py-1 text-xs font-questa-medium rounded-full ${servico.ativo
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {servico.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 font-questa-regular mb-3">{servico.descricao}</p>
                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-gray-500 font-questa-medium">Categoria:</span>
                                                        <span className={`px-2 py-1 rounded font-questa-medium flex items-center gap-1 ${getCategoriaInfo(servico.categoria).bgCor} ${getCategoriaInfo(servico.categoria).cor}`}>
                                                            <span>{getCategoriaInfo(servico.categoria).icone}</span>
                                                            <span>{servico.categoria}</span>
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-gray-500 font-questa-medium">Preço:</span>
                                                        <span className="font-questa-bold text-blue-900">{servico.preco}</span>
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-gray-500 font-questa-medium">Desconto:</span>
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-questa-bold">{servico.desconto}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-col gap-2">
                                                <button className="px-4 py-2 border border-blue-900 text-blue-900 rounded-lg text-sm font-questa-medium hover:bg-blue-50 transition-colors">
                                                    Editar
                                                </button>
                                                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-300 transition-colors">
                                                    {servico.ativo ? 'Desativar' : 'Ativar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Aba Solicitações */}
                {activeTab === 'solicitacoes' && (
                    <div className="space-y-6">
                        {/* Filtros */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium">
                                    Todas ({solicitacoes.length})
                                </button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50">
                                    Pendentes ({solicitacoes.filter(s => s.status === 'Pendente').length})
                                </button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50">
                                    Aceitas ({solicitacoes.filter(s => s.status === 'Aceito').length})
                                </button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50">
                                    Concluídas ({solicitacoes.filter(s => s.status === 'Concluído').length})
                                </button>
                            </div>
                        </div>

                        {/* Lista de Solicitações */}
                        <div className="space-y-4">
                            {solicitacoes.map((solicitacao) => (
                                <div key={solicitacao.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="font-questa-bold text-gray-900 text-lg">{solicitacao.servico}</h3>
                                                <span className={`px-3 py-1 text-xs font-questa-bold rounded-full ${solicitacao.status === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                                                    solicitacao.status === 'Aceito' ? 'bg-blue-100 text-blue-700' :
                                                        solicitacao.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {solicitacao.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">Solicitante</p>
                                                    <p className="text-sm text-gray-900 font-questa-regular">{solicitacao.solicitante}</p>
                                                    <span className="text-xs text-gray-500">({solicitacao.tipoSolicitante})</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">Imóvel</p>
                                                    <p className="text-sm text-gray-900 font-questa-regular">{solicitacao.imovel}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">Data e Horário</p>
                                                    <p className="text-sm text-gray-900 font-questa-bold">
                                                        {solicitacao.data} às {solicitacao.horario}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">Observações</p>
                                                    <p className="text-sm text-gray-600 font-questa-regular">{solicitacao.observacoes}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        {solicitacao.status === 'Pendente' && (
                                            <div className="flex flex-col gap-2 sm:w-auto w-full">
                                                <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-questa-bold hover:bg-green-700 transition-colors">
                                                    ✓ Aceitar
                                                </button>
                                                <button className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                                    📅 Reagendar
                                                </button>
                                                <button className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-questa-medium hover:bg-red-700 transition-colors">
                                                    ✕ Recusar
                                                </button>
                                            </div>
                                        )}
                                        {solicitacao.status === 'Aceito' && (
                                            <div className="flex flex-col gap-2 sm:w-auto w-full">
                                                <button className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-questa-bold hover:bg-green-700 transition-colors">
                                                    ✓ Marcar como Concluído
                                                </button>
                                                <button className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                                    📅 Reagendar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

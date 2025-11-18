'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    const [edificiosSelecionados, setEdificiosSelecionados] = useState<string[]>([]);

    // Lista de edifícios gerenciados pela FrontStay
    const edificiosDisponiveis = [
        'FrontStay Esopo Vale do Sereno - Vale do Sereno, Nova Lima',
        'FrontStay City Santo Agostinho - Santo Agostinho, Belo Horizonte',
        'FrontStay Ágora Expominas - Nova Suíça, Belo Horizonte',
        'FrontStay Lourdes - Lourdes, Belo Horizonte, MG',
        'FrontStay Centro - Centro, Belo Horizonte, MG',
        'FrontStay Savassi - Savassi, Belo Horizonte, MG',
        'FrontStay Shopping Cidade - Centro, Belo Horizonte, MG'


    ];

    const toggleEdificio = (edificio: string) => {
        setEdificiosSelecionados(prev =>
            prev.includes(edificio)
                ? prev.filter(e => e !== edificio)
                : [...prev, edificio]
        );
    };

    const limparFormulario = () => {
        setNomeServico('');
        setCategoriaServico('');
        setDescricaoServico('');
        setPrecoServico('');
        setDescontoServico('');
        setEdificiosSelecionados([]);
    };

    const handleLogout = () => {
        router.push('/login');
    };

    // Mock de dados
    const parceiro = {
        nome: 'Marcela Personal Trainer',
        email: 'contato@parceiro.com',
        telefone: '(31) 98765-4321',
        categoria: 'Restaurante', // Pode ser: Restaurante, Manutenção, Personal, Academia, Maquiadora, etc
        avaliacao: 4.8,
        totalAvaliacoes: 127,
    };

    const servicos: ServicoType[] = [
        {
            id: 1,
            nome: 'Personal Trainer',
            categoria: 'Personal',
            descricao: 'Aulas de personal trainer para todas as idades',
            preco: 'R$ 35,00',
            desconto: '10%',
            ativo: true
        },
        {
            id: 2,
            nome: 'Luta de Artes Marciais',
            categoria: 'personal',
            descricao: 'Aulas de artes marciais para todas as idades',
            preco: 'R$ 150,00',
            desconto: '15%',
            ativo: true
        },
        {
            id: 3,
            nome: 'Natação',
            categoria: 'Personal',
            descricao: 'Aula de natação para todas as idades',
            preco: 'R$ 120,00',
            desconto: '20%',
            ativo: true
        },
        {
            id: 4,
            nome: 'Aula de Yoga',
            categoria: 'personal',
            descricao: 'Aula de yoga para relaxamento e bem-estar',
            preco: 'R$ 180,00',
            desconto: '15%',
            ativo: true
        },
    ];


    const solicitacoes: SolicitacaoType[] = [
        {
            id: 1,
            servico: 'Personal Trainer',
            solicitante: 'Maria Santos',
            tipoSolicitante: 'Proprietário',
            imovel: 'FrontStay Lourdes - Belo Horizonte, MG',
            data: '2025-11-18',
            horario: '10:00',
            status: 'Pendente',
            observacoes: 'fazer um treino personalizado'
        },
        {
            id: 2,
            servico: 'Luta de Artes Marciais',
            solicitante: 'Pedro Oliveira',
            tipoSolicitante: 'Hóspede',
            imovel: 'FrontStay Centro - Belo Horizonte, MG',
            data: '2025-11-17',
            horario: '15:00',
            status: 'Pendente',
            observacoes: 'Levar a Luva e protetor bucal'
        },
        {
            id: 3,
            servico: 'Natação',
            solicitante: 'Carlos Mendes',
            tipoSolicitante: 'Proprietário',
            imovel: 'Casa Jardim - Belo Horizonte, MG',
            data: '2025-11-16',
            horario: '14:00',
            status: 'Aceito',
            observacoes: 'Aula particular para 1 pessoas'
        },
        {
            id: 4,
            servico: 'Aula de Yoga',
            solicitante: 'Ana Paula',
            tipoSolicitante: 'Hóspede',
            imovel: 'FrontStay Lourdes - Belo Horizonte, MG',
            data: '2025-11-12',
            horario: '09:00',
            status: 'Concluído',
            observacoes: 'chege com 10 minutos de antecedência'
        },
    ];

    const stats = {
        servicosAtivos: servicos.filter(s => s.ativo).length,
        solicitacoesPendentes: solicitacoes.filter(s => s.status === 'Pendente').length,
        receitaMes: 'R$ 5.500',
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
                            <h1 className="text-ml font-questa-bold text-gray-900">Parceiro</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                                    <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white font-questa-bold text-sm">
                                        {parceiro.nome.charAt(0)}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600 font-questa-regular">Bem vindo, {parceiro.nome.split(' ')[0]}</span>
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
                            {activeTab === 'servicos' && 'Meus Serviços'}
                            {activeTab === 'solicitacoes' && 'Solicitações'}
                        </span>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <nav className="lg:hidden pb-4 space-y-1">
                            <button
                                onClick={() => {
                                    setActiveTab('visao-geral');
                                    setIsMobileMenuOpen(false);
                                }}
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
                                onClick={() => {
                                    setActiveTab('servicos');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'servicos'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Meus Serviços
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('solicitacoes');
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'solicitacoes'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Solicitações
                                {stats.solicitacoesPendentes > 0 && (
                                    <span className="ml-auto px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                                        {stats.solicitacoesPendentes}
                                    </span>
                                )}
                            </button>
                        </nav>
                    )}

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <nav className="hidden lg:flex gap-8">
                        <button
                            onClick={() => setActiveTab('visao-geral')}
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
                            onClick={() => setActiveTab('servicos')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'servicos'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Meus Serviços
                        </button>
                        <button
                            onClick={() => setActiveTab('solicitacoes')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'solicitacoes'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Solicitações
                            {stats.solicitacoesPendentes > 0 && (
                                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full font-questa-bold">
                                    {stats.solicitacoesPendentes}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-6 sm:py-8">
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Serviços em Destaque - 2/3 da largura */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-questa-bold text-gray-900">Serviços Disponibilizados</h3>
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

                            {/* Calendário de Compromissos - 1/3 da largura */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-questa-bold text-gray-900">Hoje</h2>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">15 de Novembro</p>
                                </div>
                                <div className="p-4">
                                    {/* Timeline de Compromissos */}
                                    <div className="space-y-3">
                                        {/* Compromisso 1 */}
                                        <div className="relative pl-6 pb-4 border-l-2 border-blue-200">
                                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-900 border-2 border-white"></div>
                                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-questa-bold text-blue-900">09:00</span>
                                                </div>
                                                <p className="text-sm font-questa-medium text-gray-900">Personal Trainer</p>
                                                <p className="text-xs text-gray-600">Frontstay Esopo</p>
                                            </div>
                                        </div>

                                        {/* Compromisso 2 */}
                                        <div className="relative pl-6 pb-4 border-l-2 border-blue-200">
                                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-questa-bold text-orange-500">14:00</span>
                                                </div>
                                                <p className="text-sm font-questa-medium text-gray-900">Aula de Yoga</p>
                                                <p className="text-xs text-gray-600">Frontstay Lourdes</p>
                                            </div>
                                        </div>

                                        {/* Compromisso 3 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-600 border-2 border-white"></div>
                                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-questa-bold text-green-600">16:00</span>
                                                </div>
                                                <p className="text-sm font-questa-medium text-gray-900">Personal Trainer</p>
                                                <p className="text-xs text-gray-600">FrontStay Savassi</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão Ver Mais */}
                                    <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-questa-medium hover:bg-gray-50 transition-colors">
                                        Ver Calendário Completo
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Solicitações Recentes */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <h3 className="text-lg font-questa-bold text-gray-900">Solicitações Recentes</h3>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {solicitacoes.slice(0, 4).map((solicitacao) => (
                                        <div key={solicitacao.id} className={`border-l-4 pl-4 py-3 border border-gray-200 rounded-lg ${solicitacao.status === 'Pendente' ? 'border-l-orange-500' :
                                            solicitacao.status === 'Aceito' ? 'border-l-blue-500' :
                                                solicitacao.status === 'Concluído' ? 'border-l-green-500' : 'border-l-gray-300'
                                            }`}>
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-questa-bold text-gray-900 text-sm">{solicitacao.servico}</h4>
                                                    <p className="text-xs text-gray-600 font-questa-regular mt-1">
                                                        {solicitacao.solicitante} • {solicitacao.tipoSolicitante}
                                                    </p>
                                                    <p className="text-xs text-gray-500 font-questa-regular mt-1">
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
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-questa-medium text-gray-700 mb-2">
                                        Edifícios Disponíveis para o Serviço
                                        <span className="text-xs text-gray-500 font-questa-regular ml-2">
                                            (Selecione um ou mais edifícios onde você pode prestar o serviço)
                                        </span>
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto bg-gray-50">
                                        <div className="space-y-2">
                                            {edificiosDisponiveis.map((edificio) => (
                                                <label
                                                    key={edificio}
                                                    className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={edificiosSelecionados.includes(edificio)}
                                                        onChange={() => toggleEdificio(edificio)}
                                                        className="mt-1 w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-2 focus:ring-blue-900"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            <span className="text-sm font-questa-medium text-gray-900">{edificio}</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {edificiosSelecionados.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-xs font-questa-bold text-blue-900 mb-2">
                                                    {edificiosSelecionados.length} edifício{edificiosSelecionados.length > 1 ? 's' : ''} selecionado{edificiosSelecionados.length > 1 ? 's' : ''}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {edificiosSelecionados.map((edificio) => (
                                                        <span
                                                            key={edificio}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-900 text-xs rounded-full font-questa-medium"
                                                        >
                                                            {edificio.split(' - ')[0]}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleEdificio(edificio);
                                                                }}
                                                                className="hover:bg-blue-200 rounded-full p-0.5"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button className="px-6 py-3 bg-blue-900 text-white rounded-lg font-questa-bold hover:bg-blue-950 transition-colors">
                                    Cadastrar Serviço
                                </button>
                                <button
                                    onClick={limparFormulario}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-questa-medium hover:bg-gray-300 transition-colors"
                                >
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
                        {/* Header com Filtros */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-xl font-questa-bold text-gray-900">Agenda de Solicitações</h2>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">Visualize todos os seus compromissos agendados</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                        Hoje
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                        Esta Semana
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                        Este Mês
                                    </button>
                                </div>
                            </div>
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

                        {/* Grid: Calendário e Timeline */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Calendário Mensal - 1/3 */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-questa-bold text-gray-900">Novembro 2025</h3>
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {/* Dias da Semana */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia, i) => (
                                            <div key={i} className="text-center text-xs font-questa-bold text-gray-500 py-2">
                                                {dia}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Dias do Mês */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Dias vazios do início */}
                                        {[...Array(4)].map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square"></div>
                                        ))}
                                        {/* Dias do mês */}
                                        {[...Array(30)].map((_, i) => {
                                            const dia = i + 1;
                                            const isToday = dia === 15;
                                            const hasEvent = [12, 15, 18, 22, 25].includes(dia);
                                            return (
                                                <button
                                                    key={dia}
                                                    className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors relative
                                                        ${isToday ? 'bg-blue-900 text-white font-questa-bold' :
                                                            hasEvent ? 'bg-blue-50 text-blue-900 font-questa-medium hover:bg-blue-100' :
                                                                'text-gray-700 hover:bg-gray-100 font-questa-regular'}`}
                                                >
                                                    {dia}
                                                    {hasEvent && !isToday && (
                                                        <span className="absolute bottom-1 w-1 h-1 bg-blue-900 rounded-full"></span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Legenda */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="w-3 h-3 bg-blue-900 rounded"></div>
                                            <span className="text-gray-600 font-questa-regular">Dia Atual</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                                            <span className="text-gray-600 font-questa-regular">Com Agendamentos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline de Hoje - 2/3 */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-4 sm:p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-questa-bold text-gray-900">Hoje - 15 de Novembro</h3>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">Seus compromissos agendados para hoje</p>
                                </div>
                                <div className="p-4 sm:p-6">
                                    <div className="space-y-4">
                                        {/* Timeline por horário */}
                                        {solicitacoes
                                            .filter(s => s.data === '2025-11-15')
                                            .sort((a, b) => a.horario.localeCompare(b.horario))
                                            .map((solicitacao, index, arr) => (
                                                <div key={solicitacao.id} className="relative">
                                                    <div className="flex gap-4">
                                                        {/* Horário */}
                                                        <div className="w-20 flex-shrink-0 pt-1">
                                                            <span className="text-sm font-questa-bold text-gray-900">{solicitacao.horario}</span>
                                                        </div>

                                                        {/* Timeline vertical */}
                                                        <div className="relative flex flex-col items-center">
                                                            <div className={`w-4 h-4 rounded-full border-2 border-white z-10 ${solicitacao.status === 'Pendente' ? 'bg-orange-500' :
                                                                solicitacao.status === 'Aceito' ? 'bg-blue-900' :
                                                                    solicitacao.status === 'Concluído' ? 'bg-green-600' : 'bg-gray-400'
                                                                }`}></div>
                                                            {index < arr.length - 1 && (
                                                                <div className="w-0.5 h-full bg-gray-200 absolute top-4"></div>
                                                            )}
                                                        </div>

                                                        {/* Card de Solicitação */}
                                                        <div className={`flex-1 pb-6 border rounded-lg p-4 ${solicitacao.status === 'Pendente' ? 'border-orange-200 bg-orange-50' :
                                                            solicitacao.status === 'Aceito' ? 'border-blue-200 bg-blue-50' :
                                                                solicitacao.status === 'Concluído' ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                                                            }`}>
                                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                                <div className="flex-1">
                                                                    <h4 className="font-questa-bold text-gray-900 text-base mb-1">{solicitacao.servico}</h4>
                                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                                                        <span className="flex items-center gap-1">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                            </svg>
                                                                            <span className="font-questa-medium">{solicitacao.solicitante}</span>
                                                                        </span>
                                                                        <span>•</span>
                                                                        <span className="font-questa-regular">{solicitacao.tipoSolicitante}</span>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-3 py-1 text-xs font-questa-bold rounded-full whitespace-nowrap ${solicitacao.status === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                                                                    solicitacao.status === 'Aceito' ? 'bg-blue-100 text-blue-700' :
                                                                        solicitacao.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {solicitacao.status}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="font-questa-regular">{solicitacao.imovel}</span>
                                                            </div>

                                                            {solicitacao.observacoes && (
                                                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                                                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                                    </svg>
                                                                    <span className="font-questa-regular italic">{solicitacao.observacoes}</span>
                                                                </div>
                                                            )}

                                                            {solicitacao.status === 'Pendente' && (
                                                                <div className="flex flex-wrap gap-2 mt-4">
                                                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-questa-medium hover:bg-green-700 transition-colors">
                                                                        Aceitar
                                                                    </button>
                                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-700 transition-colors">
                                                                        Reagendar
                                                                    </button>
                                                                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-questa-medium hover:bg-red-50 transition-colors">
                                                                        Recusar
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {solicitacao.status === 'Aceito' && (
                                                                <div className="flex flex-wrap gap-2 mt-4">
                                                                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-questa-medium hover:bg-green-700 transition-colors">
                                                                        Marcar como Concluído
                                                                    </button>
                                                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                                                        Ver Detalhes
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        {solicitacoes.filter(s => s.data === '2025-11-15').length === 0 && (
                                            <div className="text-center py-12">
                                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-500 font-questa-regular">Nenhum compromisso agendado para hoje</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Próximos Compromissos */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <h3 className="text-lg font-questa-bold text-gray-900">Próximos Compromissos</h3>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Solicitações agendadas para os próximos dias</p>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {solicitacoes
                                    .filter(s => s.data > '2025-11-15')
                                    .slice(0, 5)
                                    .map((solicitacao) => (
                                        <div key={solicitacao.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-questa-bold text-gray-900">{solicitacao.servico}</h4>
                                                        <span className={`px-2 py-1 text-xs font-questa-medium rounded-full ${solicitacao.status === 'Pendente' ? 'bg-orange-100 text-orange-700' :
                                                            solicitacao.status === 'Aceito' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                            {solicitacao.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="font-questa-medium">{solicitacao.data}</span>
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="font-questa-medium">{solicitacao.horario}</span>
                                                        </span>
                                                        <span className="font-questa-regular">{solicitacao.solicitante} • {solicitacao.tipoSolicitante}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">{solicitacao.imovel}</p>
                                                </div>
                                                <button className="px-4 py-2 border border-blue-900 text-blue-900 rounded-lg text-sm font-questa-medium hover:bg-blue-50 transition-colors whitespace-nowrap">
                                                    Ver Detalhes
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

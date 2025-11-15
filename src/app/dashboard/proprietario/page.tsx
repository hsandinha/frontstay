'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

type TabType = 'visao-geral' | 'financeiro' | 'reservas' | 'documentos' | 'parceiros' | 'gerenciar';

// Mock de dados dos imóveis
const mockImoveis = [
    { id: 1, nome: 'Apartamento Vista Mar', localizacao: 'Copacabana, Rio de Janeiro', parceriaAtiva: true, receita: 15000, ocupacao: 85, reservas: 8 },
    { id: 2, nome: 'Casa na Praia', localizacao: 'Búzios, Rio de Janeiro', parceriaAtiva: true, receita: 22000, ocupacao: 92, reservas: 12 },
    { id: 3, nome: 'Loft Centro', localizacao: 'São Paulo, SP', parceriaAtiva: false, receita: 0, ocupacao: 0, reservas: 0 },
];

export default function ProprietarioDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [selectedImovel, setSelectedImovel] = useState(mockImoveis[0]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedMes, setSelectedMes] = useState('2025-11'); // Mês atual (novembro 2025)
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1)); // Novembro 2025
    const [diasProprietarioSelecionados, setDiasProprietarioSelecionados] = useState<string[]>([]);
    const LIMITE_DIAS_PROPRIETARIO = 5;

    // Mock de documentos
    const [documentos, setDocumentos] = useState([
        { id: 1, categoria: 'Convenção de Condomínio', nome: 'Convenção Edifício Vista Mar.pdf', data: '10/01/2024', tamanho: '2.4 MB', uploadPor: 'Proprietário' },
        { id: 2, categoria: 'Notas de Manutenção', nome: 'Troca de fechadura - Maio 2024.pdf', data: '15/05/2024', tamanho: '856 KB', uploadPor: 'Administrador' },
        { id: 3, categoria: 'Ata de Reunião', nome: 'Ata AGO Condomínio 2024.pdf', data: '20/03/2024', tamanho: '1.2 MB', uploadPor: 'Administrador' },
        { id: 4, categoria: 'Matrícula do Imóvel', nome: 'Matricula_Apto_302.pdf', data: '05/02/2024', tamanho: '1.8 MB', uploadPor: 'Proprietário' },
    ]);

    // Mock de documentos pessoais do proprietário
    const [documentosPessoais, setDocumentosPessoais] = useState([
        { id: 1, tipo: 'RG', nome: 'RG_Frente.pdf', data: '10/01/2024', tamanho: '1.2 MB' },
        { id: 2, tipo: 'CPF', nome: 'CPF.pdf', data: '10/01/2024', tamanho: '856 KB' },
    ]);

    // Mock de parceiros disponíveis para o imóvel
    const parceirosDisponiveis = [
        {
            id: 1,
            categoria: 'Personal Trainer',
            nome: 'Bruno Fitness',
            descricao: 'Personal trainer especializado em treinos domiciliares e ao ar livre',
            imagem: '👨‍💼',
            avaliacao: 4.8,
            totalAvaliacoes: 127,
            preco: 'R$ 150/hora',
            ativo: true,
            beneficio: '10% de desconto para hóspedes FrontStay'
        },
        {
            id: 2,
            categoria: 'Personal Trainer',
            nome: 'Ana Wellness',
            descricao: 'Yoga, pilates e meditação para bem-estar completo',
            imagem: '👩‍💼',
            avaliacao: 4.9,
            totalAvaliacoes: 203,
            preco: 'R$ 120/hora',
            ativo: true,
            beneficio: '15% de desconto na primeira sessão'
        },
        {
            id: 3,
            categoria: 'Locadora de Veículos',
            nome: 'RentCar Premium',
            descricao: 'Frota completa de veículos de luxo e econômicos com entrega no local',
            imagem: '🚗',
            avaliacao: 4.7,
            totalAvaliacoes: 892,
            preco: 'A partir de R$ 89/dia',
            ativo: true,
            beneficio: '20% de desconto + upgrade gratuito'
        },
        {
            id: 4,
            categoria: 'Locadora de Veículos',
            nome: 'Eco Mobility',
            descricao: 'Carros elétricos e híbridos para mobilidade sustentável',
            imagem: '⚡',
            avaliacao: 4.6,
            totalAvaliacoes: 456,
            preco: 'A partir de R$ 120/dia',
            ativo: false,
            beneficio: '15% de desconto + carregador portátil grátis'
        },
        {
            id: 5,
            categoria: 'Chef Particular',
            nome: 'Chef Rodrigo Gourmet',
            descricao: 'Experiências gastronômicas exclusivas no conforto do seu lar',
            imagem: '👨‍🍳',
            avaliacao: 5.0,
            totalAvaliacoes: 89,
            preco: 'R$ 400/evento',
            ativo: true,
            beneficio: 'Entrada cortesia + sobremesa especial'
        },
        {
            id: 6,
            categoria: 'Spa & Massagem',
            nome: 'Zen Spa Mobile',
            descricao: 'Massagens relaxantes e tratamentos estéticos em domicílio',
            imagem: '💆',
            avaliacao: 4.8,
            totalAvaliacoes: 312,
            preco: 'R$ 180/sessão',
            ativo: true,
            beneficio: '2ª sessão com 50% de desconto'
        },
        {
            id: 7,
            categoria: 'Turismo & Passeios',
            nome: 'City Tours VIP',
            descricao: 'Passeios personalizados pelos melhores pontos turísticos',
            imagem: '🗺️',
            avaliacao: 4.7,
            totalAvaliacoes: 567,
            preco: 'R$ 250/tour',
            ativo: true,
            beneficio: 'Guia bilíngue + transfer incluído'
        },
        {
            id: 8,
            categoria: 'Limpeza & Manutenção',
            nome: 'Clean Express',
            descricao: 'Limpeza profunda e manutenção preventiva entre estadias',
            imagem: '🧹',
            avaliacao: 4.9,
            totalAvaliacoes: 1243,
            preco: 'R$ 120/limpeza',
            ativo: true,
            beneficio: 'Prioridade no agendamento + kit de amenities'
        },
        {
            id: 9,
            categoria: 'Fotografia',
            nome: 'Studio Click',
            descricao: 'Fotografia profissional do imóvel para anúncios',
            imagem: '📸',
            avaliacao: 4.8,
            totalAvaliacoes: 178,
            preco: 'R$ 350/ensaio',
            ativo: false,
            beneficio: 'Edição profissional + tour virtual 360°'
        },
        {
            id: 10,
            categoria: 'Delivery & Mercado',
            nome: 'Fresh Market',
            descricao: 'Compras de supermercado com entrega antes do check-in',
            imagem: '🛒',
            avaliacao: 4.6,
            totalAvaliacoes: 2341,
            preco: 'Taxa de R$ 15',
            ativo: true,
            beneficio: 'Frete grátis em compras acima de R$ 200'
        }
    ];

    // Estados e dados para gerenciamento do imóvel
    const [imovelPausado, setImovelPausado] = useState(false);
    const [dataInicioPausa, setDataInicioPausa] = useState('');
    const [dataFimPausa, setDataFimPausa] = useState('');
    const [motivoPausa, setMotivoPausa] = useState('');

    // Mock de manutenções em andamento
    const [manutencoes, setManutencoes] = useState([
        {
            id: 1,
            tipo: 'Preventiva',
            descricao: 'Revisão de ar-condicionado',
            status: 'Concluída',
            dataInicio: '01/11/2025',
            dataFim: '03/11/2025',
            responsavel: 'TechCool Manutenções',
            custo: 'R$ 450,00',
            observacoes: 'Limpeza completa e recarga de gás realizada com sucesso'
        },
        {
            id: 2,
            tipo: 'Corretiva',
            descricao: 'Vazamento no banheiro',
            status: 'Em Andamento',
            dataInicio: '10/11/2025',
            dataFim: '15/11/2025',
            responsavel: 'HidroFix Encanamentos',
            custo: 'R$ 800,00',
            observacoes: 'Substituição de tubulação danificada. Previsão de conclusão: 15/11'
        },
        {
            id: 3,
            tipo: 'Preventiva',
            descricao: 'Pintura das paredes',
            status: 'Agendada',
            dataInicio: '20/11/2025',
            dataFim: '25/11/2025',
            responsavel: 'ColorPro Pinturas',
            custo: 'R$ 1.200,00',
            observacoes: 'Pintura completa de todas as paredes internas'
        }
    ]);

    // Dias reservados por hóspedes (mock)
    const diasReservados = [
        '2025-11-05', '2025-11-06', '2025-11-07',
        '2025-11-12', '2025-11-13', '2025-11-14', '2025-11-15',
        '2025-11-20', '2025-11-21', '2025-11-22', '2025-11-23', '2025-11-24', '2025-11-25',
    ];

    const handleLogout = () => {
        router.push('/login');
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    const handleDayClick = (dateStr: string) => {
        if (diasReservados.includes(dateStr)) return; // Não permite selecionar dias já reservados

        if (diasProprietarioSelecionados.includes(dateStr)) {
            // Remove o dia se já estava selecionado
            setDiasProprietarioSelecionados(diasProprietarioSelecionados.filter(d => d !== dateStr));
        } else if (diasProprietarioSelecionados.length < LIMITE_DIAS_PROPRIETARIO) {
            // Adiciona o dia se ainda não atingiu o limite
            setDiasProprietarioSelecionados([...diasProprietarioSelecionados, dateStr]);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const changeMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            if (direction === 'prev') {
                newMonth.setMonth(newMonth.getMonth() - 1);
            } else {
                newMonth.setMonth(newMonth.getMonth() + 1);
            }
            return newMonth;
        });
    };

    const handleFileUpload = (categoria: string) => {
        // Simula upload de arquivo - apenas para categorias permitidas ao proprietário
        const novoDoc = {
            id: documentos.length + 1,
            categoria,
            nome: `Documento_${Date.now()}.pdf`,
            data: new Date().toLocaleDateString('pt-BR'),
            tamanho: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
            uploadPor: 'Proprietário'
        };
        setDocumentos([...documentos, novoDoc]);
    };

    const handleDeleteDoc = (id: number) => {
        // Proprietário só pode deletar seus próprios documentos
        const doc = documentos.find(d => d.id === id);
        if (doc && doc.uploadPor === 'Proprietário') {
            setDocumentos(documentos.filter(d => d.id !== id));
        }
    };

    const handlePersonalDocUpload = () => {
        // Simula upload de documento pessoal
        const novoDoc = {
            id: documentosPessoais.length + 1,
            tipo: 'Outro',
            nome: `Documento_${Date.now()}.pdf`,
            data: new Date().toLocaleDateString('pt-BR'),
            tamanho: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`
        };
        setDocumentosPessoais([...documentosPessoais, novoDoc]);
    };

    const handleDeletePersonalDoc = (id: number) => {
        setDocumentosPessoais(documentosPessoais.filter(d => d.id !== id));
    };

    // Dados mensais de evolução financeira (últimos 6 meses)
    const evolucaoMensal = [
        { mes: 'Jun/25', receitas: 12000, custos: 4500, lucro: 7500 },
        { mes: 'Jul/25', receitas: 13500, custos: 5200, lucro: 8300 },
        { mes: 'Ago/25', receitas: 14200, custos: 5800, lucro: 8400 },
        { mes: 'Set/25', receitas: 13800, custos: 5500, lucro: 8300 },
        { mes: 'Out/25', receitas: 15500, custos: 6200, lucro: 9300 },
        { mes: 'Nov/25', receitas: 15000, custos: 6050, lucro: 8950 },
    ];

    const maxValue = Math.max(...evolucaoMensal.flatMap(m => [m.receitas, m.custos, m.lucro]));

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
                            <h1 className="text-ml font-questa-bold text-gray-900">Proprietário</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-questa-bold text-sm">P</div>
                                    </div>
                                    <span className="text-sm text-gray-600 font-questa-regular">João</span>
                                    <svg className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-questa-bold text-2xl">
                                                    P
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-questa-bold text-gray-900">Bem vindo, João</h3>
                                                    <p className="text-sm text-gray-600">proprietario@frontstay.com</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Options */}
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    setIsProfileModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Meu Perfil
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                Meus Imóveis
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    // Aqui pode abrir um modal de chat ou redirecionar para WhatsApp/chat
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                Conversar com Administração
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Configurações
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
                        </div>
                    </div>
                </div>
            </header>

            {/* Modal Perfil Completo */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setIsProfileModalOpen(false)}>
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header do Modal */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-questa-bold text-gray-900">Meu Perfil</h2>
                            <button onClick={() => setIsProfileModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Conteúdo do Modal */}
                        <div className="p-6 space-y-6">
                            {/* Dados Pessoais */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Dados Pessoais
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Nome Completo</label>
                                        <input type="text" defaultValue="João Proprietário da Silva" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">CPF</label>
                                        <input type="text" defaultValue="123.456.789-00" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Email</label>
                                        <input type="email" defaultValue="proprietario@frontstay.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Telefone</label>
                                        <input type="tel" defaultValue="(11) 98765-4321" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Endereço
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">CEP</label>
                                        <input type="text" defaultValue="01310-100" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Rua</label>
                                        <input type="text" defaultValue="Av. Paulista" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Número</label>
                                        <input type="text" defaultValue="1000" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Complemento</label>
                                        <input type="text" defaultValue="Apto 501" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Bairro</label>
                                        <input type="text" defaultValue="Bela Vista" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Cidade</label>
                                        <input type="text" defaultValue="São Paulo" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Estado</label>
                                        <input type="text" defaultValue="SP" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Empresas */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-questa-bold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Empresas Vinculadas
                                    </h3>
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                        + Nova Empresa
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-questa-bold text-gray-900">Imóveis Premium Ltda</h4>
                                                <p className="text-sm text-gray-600">CNPJ: 12.345.678/0001-90</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">Ativa</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Meus Imóveis */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-questa-bold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Meus Imóveis ({mockImoveis.length})
                                    </h3>
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                        + Adicionar Imóvel
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {mockImoveis.map(imovel => (
                                        <div key={imovel.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900">{imovel.nome}</h4>
                                                    <p className="text-sm text-gray-600">{imovel.localizacao}</p>
                                                </div>
                                                {imovel.parceriaAtiva ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">
                                                        Parceria Ativa
                                                    </span>
                                                ) : (
                                                    <button className="px-3 py-1.5 bg-blue-900 text-white rounded text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                        Ativar Parceria
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>📊 Ocupação: {imovel.ocupacao}%</span>
                                                <span>💰 Receita: R$ {(imovel.receita / 1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Documentos Pessoais */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-questa-bold text-gray-900 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Meus Documentos
                                    </h3>
                                    <button
                                        onClick={handlePersonalDocUpload}
                                        className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Upload Documento
                                    </button>
                                </div>
                                {documentosPessoais.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-sm font-questa-medium">Nenhum documento pessoal carregado</p>
                                        <p className="text-xs mt-1">Faça upload de RG, CPF, CNH ou outros documentos</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {documentosPessoais.map(doc => (
                                            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-questa-bold text-gray-900 text-sm">{doc.tipo}</h4>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                            <span>{doc.nome}</span>
                                                            <span>•</span>
                                                            <span>{doc.data}</span>
                                                            <span>•</span>
                                                            <span>{doc.tamanho}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePersonalDoc(doc.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer do Modal */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
                            <button onClick={() => setIsProfileModalOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-100 transition-colors">
                                Cancelar
                            </button>
                            <button className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Seletor de Imóvel */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-questa-medium">Visualizar:</span>
                        <select
                            value={selectedImovel.id}
                            onChange={(e) => {
                                const imovel = mockImoveis.find(i => i.id === parseInt(e.target.value));
                                if (imovel) setSelectedImovel(imovel);
                            }}
                            className="px-10 py-2 border border-gray-300 rounded-lg text-sm font-questa-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {mockImoveis.map(imovel => (
                                <option key={imovel.id} value={imovel.id}>
                                    {imovel.nome}
                                </option>
                            ))}
                        </select>
                        {!selectedImovel.parceriaAtiva && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-questa-medium rounded-full">
                                Sem parceria FrontStay
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-28 z-30">
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
                            {activeTab === 'financeiro' && 'Financeiro'}
                            {activeTab === 'reservas' && 'Reservas'}
                            {activeTab === 'documentos' && 'Documentos'}
                            {activeTab === 'parceiros' && 'Parceiros'}
                            {activeTab === 'gerenciar' && 'Gerenciar Imóvel'}
                        </span>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {isMobileMenuOpen && (
                        <nav className="lg:hidden pb-4 space-y-1">
                            <button onClick={() => handleTabChange('visao-geral')} className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'visao-geral' ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                Visão Geral
                            </button>
                            <button onClick={() => handleTabChange('financeiro')} className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'financeiro' ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Financeiro
                            </button>
                            <button onClick={() => handleTabChange('reservas')} className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'reservas' ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Reservas
                            </button>
                            <button onClick={() => handleTabChange('documentos')} className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'documentos' ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Documentos
                            </button>
                            <button onClick={() => handleTabChange('parceiros')} className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'parceiros' ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                Parceiros
                            </button>
                            <button onClick={() => handleTabChange('gerenciar')} className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'gerenciar' ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Gerenciar Imóvel
                            </button>
                        </nav>
                    )}

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex gap-8">
                        <button onClick={() => handleTabChange('visao-geral')} className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'visao-geral' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            Visão Geral
                        </button>
                        <button onClick={() => handleTabChange('financeiro')} className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'financeiro' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Financeiro
                        </button>
                        <button onClick={() => handleTabChange('reservas')} className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reservas' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Reservas
                        </button>
                        <button onClick={() => handleTabChange('documentos')} className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'documentos' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Documentos
                        </button>
                        <button onClick={() => handleTabChange('parceiros')} className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'parceiros' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Parceiros
                        </button>
                        <button onClick={() => handleTabChange('gerenciar')} className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'gerenciar' ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Gerenciar Imóvel
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Visão Geral */}
                {activeTab === 'visao-geral' && (
                    <div className="space-y-6">
                        {/* Sem Parceria - Call to Action */}
                        {!selectedImovel.parceriaAtiva && (
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-8">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-questa-bold text-gray-900 mb-3">
                                            🚀 Maximize o Potencial do seu Imóvel
                                        </h2>
                                        <p className="text-base text-gray-700 font-questa-regular mb-4">
                                            Este imóvel ainda não possui parceria ativa com a FrontStay. Ao ativar a parceria, você terá acesso a:
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Gestão profissional de reservas e hóspedes
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Sistema de cashback exclusivo
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Relatórios financeiros detalhados
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Cupons e serviços exclusivos para hóspedes
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                Suporte 24/7 especializado
                                            </li>
                                        </ul>
                                        <button className="px-6 py-3 bg-blue-900 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-950 transition-colors">
                                            Ativar Parceria FrontStay
                                        </button>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="w-48 h-48 rounded-lg bg-blue-200 flex items-center justify-center">
                                            <svg className="w-24 h-24 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Reservas Mês</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">{selectedImovel.reservas}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Taxa Ocupação</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">{selectedImovel.ocupacao}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Receita Mês</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">
                                            {selectedImovel.receita > 0 ? `R$ ${(selectedImovel.receita / 1000).toFixed(0)}k` : 'R$ 0'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Próximas Reservas */}
                        {selectedImovel.parceriaAtiva && (
                            <>
                                {/* Gráfico de Evolução Mensal */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-4 sm:p-6 border-b border-gray-200">
                                        <h2 className="text-base sm:text-lg font-questa-bold text-gray-900">Evolução Financeira</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 font-questa-regular mt-1">Últimos 6 meses - {selectedImovel.nome}</p>
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        {/* Legenda */}
                                        <div className="flex flex-wrap gap-3 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
                                                <span className="text-gray-700 font-questa-medium">Receitas</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full"></div>
                                                <span className="text-gray-700 font-questa-medium">Custos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                                                <span className="text-gray-700 font-questa-medium">Lucro</span>
                                            </div>
                                        </div>

                                        {/* Gráfico */}
                                        <div className="relative h-48 sm:h-64 md:h-80">
                                            {/* Grid horizontal */}
                                            <div className="absolute inset-0 flex flex-col justify-between">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="border-t border-gray-200"></div>
                                                ))}
                                            </div>

                                            {/* SVG com as linhas do gráfico */}
                                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                {/* Linha de Receitas (verde) */}
                                                <polyline
                                                    fill="none"
                                                    stroke="#10b981"
                                                    strokeWidth="0.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    vectorEffect="non-scaling-stroke"
                                                    points={evolucaoMensal.map((m, i) =>
                                                        `${(i / (evolucaoMensal.length - 1)) * 100},${100 - (m.receitas / maxValue) * 90}`
                                                    ).join(' ')}
                                                />

                                                {/* Linha de Custos (laranja) */}
                                                <polyline
                                                    fill="none"
                                                    stroke="#f59e0b"
                                                    strokeWidth="0.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    vectorEffect="non-scaling-stroke"
                                                    points={evolucaoMensal.map((m, i) =>
                                                        `${(i / (evolucaoMensal.length - 1)) * 100},${100 - (m.custos / maxValue) * 90}`
                                                    ).join(' ')}
                                                />

                                                {/* Linha de Lucro (azul) */}
                                                <polyline
                                                    fill="none"
                                                    stroke="#3b82f6"
                                                    strokeWidth="0.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    vectorEffect="non-scaling-stroke"
                                                    points={evolucaoMensal.map((m, i) =>
                                                        `${(i / (evolucaoMensal.length - 1)) * 100},${100 - (m.lucro / maxValue) * 90}`
                                                    ).join(' ')}
                                                />

                                                {/* Bolinhas de Receitas */}
                                                {evolucaoMensal.map((m, i) => (
                                                    <circle
                                                        key={`r-${i}`}
                                                        cx={(i / (evolucaoMensal.length - 1)) * 100}
                                                        cy={100 - (m.receitas / maxValue) * 90}
                                                        r="1.2"
                                                        fill="#10b981"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                ))}

                                                {/* Bolinhas de Custos */}
                                                {evolucaoMensal.map((m, i) => (
                                                    <circle
                                                        key={`c-${i}`}
                                                        cx={(i / (evolucaoMensal.length - 1)) * 100}
                                                        cy={100 - (m.custos / maxValue) * 90}
                                                        r="1.2"
                                                        fill="#f59e0b"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                ))}

                                                {/* Bolinhas de Lucro */}
                                                {evolucaoMensal.map((m, i) => (
                                                    <circle
                                                        key={`l-${i}`}
                                                        cx={(i / (evolucaoMensal.length - 1)) * 100}
                                                        cy={100 - (m.lucro / maxValue) * 90}
                                                        r="1.2"
                                                        fill="#3b82f6"
                                                        vectorEffect="non-scaling-stroke"
                                                    />
                                                ))}
                                            </svg>

                                            {/* Tooltips com valores (posicionados absolutamente) - Ocultos em mobile */}
                                            <div className="hidden sm:block">
                                                {evolucaoMensal.map((m, i) => {
                                                    const xPos = (i / (evolucaoMensal.length - 1)) * 100;
                                                    const receitaY = 100 - (m.receitas / maxValue) * 90;
                                                    const custoY = 100 - (m.custos / maxValue) * 90;
                                                    const lucroY = 100 - (m.lucro / maxValue) * 90;

                                                    return (
                                                        <div
                                                            key={`tooltip-${i}`}
                                                            className="absolute"
                                                            style={{
                                                                left: `${xPos}%`,
                                                                top: 0,
                                                                bottom: 0,
                                                                transform: 'translateX(-50%)',
                                                                pointerEvents: 'none'
                                                            }}
                                                        >
                                                            {/* Valor Receitas */}
                                                            <div
                                                                className="absolute bg-emerald-500 text-white text-xs px-2 py-0.5 rounded shadow-lg font-questa-medium whitespace-nowrap"
                                                                style={{
                                                                    top: `${receitaY}%`,
                                                                    transform: 'translate(8px, -50%)'
                                                                }}
                                                            >
                                                                {(m.receitas / 1000).toFixed(1)}k
                                                            </div>

                                                            {/* Valor Custos */}
                                                            <div
                                                                className="absolute bg-amber-500 text-white text-xs px-2 py-0.5 rounded shadow-lg font-questa-medium whitespace-nowrap"
                                                                style={{
                                                                    top: `${custoY}%`,
                                                                    transform: 'translate(8px, -50%)'
                                                                }}
                                                            >
                                                                {(m.custos / 1000).toFixed(1)}k
                                                            </div>

                                                            {/* Valor Lucro */}
                                                            <div
                                                                className="absolute bg-blue-500 text-white text-xs px-2 py-0.5 rounded shadow-lg font-questa-medium whitespace-nowrap"
                                                                style={{
                                                                    top: `${lucroY}%`,
                                                                    transform: 'translate(8px, -50%)'
                                                                }}
                                                            >
                                                                {(m.lucro / 1000).toFixed(1)}k
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Labels dos meses */}
                                            <div className="absolute -bottom-6 sm:-bottom-8 left-0 right-0 flex justify-between px-1 sm:px-2">
                                                {evolucaoMensal.map((m, i) => (
                                                    <span key={i} className="text-[10px] sm:text-xs text-gray-600 font-questa-regular">{m.mes}</span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Valores atuais */}
                                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-200">
                                            <div className="text-center">
                                                <p className="text-[10px] sm:text-xs text-gray-500 font-questa-regular mb-1">Receitas Nov/25</p>
                                                <p className="text-sm sm:text-xl font-questa-bold text-emerald-500">
                                                    R$ {(evolucaoMensal[evolucaoMensal.length - 1].receitas / 1000).toFixed(1)}k
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] sm:text-xs text-gray-500 font-questa-regular mb-1">Custos Nov/25</p>
                                                <p className="text-sm sm:text-xl font-questa-bold text-amber-500">
                                                    R$ {(evolucaoMensal[evolucaoMensal.length - 1].custos / 1000).toFixed(1)}k
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] sm:text-xs text-gray-500 font-questa-regular mb-1">Lucro Nov/25</p>
                                                <p className="text-sm sm:text-xl font-questa-bold text-blue-500">
                                                    R$ {(evolucaoMensal[evolucaoMensal.length - 1].lucro / 1000).toFixed(1)}k
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-questa-bold text-gray-900">Próximas Reservas</h2>
                                        <p className="text-sm text-gray-500 font-questa-regular mt-1">Reservas confirmadas para {selectedImovel.nome}</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-questa-bold text-gray-900 mb-1">João Silva</h3>
                                                    <p className="text-sm text-gray-600">Check-in: 20/11/2025 | Check-out: 25/11/2025</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">Confirmada</span>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>👥 4 hóspedes</span>
                                                <span>💰 R$ 2.250,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Financeiro */}
                {activeTab === 'financeiro' && (
                    <div className="space-y-6">
                        {!selectedImovel.parceriaAtiva ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                <p className="text-orange-800 font-questa-medium">
                                    ⚠️ Ative a parceria FrontStay para acessar relatórios financeiros detalhados
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Seletor de Mês */}
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-questa-medium text-gray-700">Período:</label>
                                    <select
                                        value={selectedMes}
                                        onChange={(e) => setSelectedMes(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                                    >
                                        <option value="2025-11">Novembro 2025</option>
                                        <option value="2025-10">Outubro 2025</option>
                                        <option value="2025-09">Setembro 2025</option>
                                        <option value="2025-08">Agosto 2025</option>
                                        <option value="2025-07">Julho 2025</option>
                                        <option value="2025-06">Junho 2025</option>
                                    </select>
                                </div>

                                {/* Header com Resumo do Delta */}
                                <div className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-questa-bold text-gray-900 mb-1">Resumo Financeiro - {selectedImovel.nome}</h2>
                                            <p className="text-sm text-gray-600">Período: Novembro 2025</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Lucro Líquido do Mês</p>
                                            <p className="text-3xl font-questa-bold text-green-600">+ R$ 8.950,00</p>
                                            <p className="text-xs text-gray-500 mt-1">Margem de 59.67%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Grid 2 Colunas: Custos e Receitas */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* COLUNA 1: CUSTOS */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="p-6 border-b border-gray-200 bg-red-50">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                                <h3 className="text-lg font-questa-bold text-gray-900">Custos</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">Total de custos do mês</p>
                                            <p className="text-2xl font-questa-bold text-red-600 mt-1">R$ 6.050,00</p>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            {/* Mão de Obra */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-lg">👷</span>
                                                        Mão de Obra
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-red-600">R$ 2.500,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Limpeza - 05/11</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 800,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Manutenção - 10/11</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 1.200,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Jardinagem - 15/11</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 500,00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4"></div>

                                            {/* Contas */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-lg">💡</span>
                                                        Contas de Consumo
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-red-600">R$ 850,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Energia Elétrica</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 420,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Água</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 230,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Internet</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 200,00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4"></div>

                                            {/* Condomínio */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">🏢</span>
                                                        Condomínio
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-red-600">R$ 1.200,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Taxa Mensal</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 1.000,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Fundo de Reserva</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 200,00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4"></div>

                                            {/* Outros Gastos */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-lg">📋</span>
                                                        Outros Gastos
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-red-600">R$ 1.500,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">IPTU</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 600,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Seguro</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 500,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Taxa FrontStay (10%)</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 400,00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Total de Custos */}
                                        <div className="p-6 border-t-2 border-red-200 bg-red-50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-questa-bold text-gray-900">Total de Custos</span>
                                                <span className="text-2xl font-questa-bold text-red-600">- R$ 6.050,00</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COLUNA 2: RECEITAS */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="p-6 border-b border-gray-200 bg-green-50">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                <h3 className="text-lg font-questa-bold text-gray-900">Receitas</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">Total de receitas do mês</p>
                                            <p className="text-2xl font-questa-bold text-green-600 mt-1">R$ 15.000,00</p>
                                        </div>

                                        <div className="p-6 space-y-4">
                                            {/* Locações */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">🏠</span>
                                                        Locações
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-green-600">R$ 12.000,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Reserva #1234 - João Silva</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 4.500,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Reserva #1235 - Maria Santos</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 3.800,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Reserva #1236 - Pedro Costa</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 3.700,00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4"></div>

                                            {/* Cashback dos Hóspedes */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-lg">💰</span>
                                                        Cashback Hóspedes
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-green-600">R$ 1.200,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Serviços Utilizados</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 800,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Cupons Resgatados</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 400,00</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4"></div>

                                            {/* Cashback Parceiros */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-questa-bold text-gray-900 flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-lg">🤝</span>
                                                        Cashback Parceiros
                                                    </h4>
                                                    <span className="text-sm font-questa-bold text-green-600">R$ 1.800,00</span>
                                                </div>
                                                <div className="space-y-2 ml-10">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">🛒 Mercadinho Local</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 650,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">🚗 Estacionamento</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 480,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">🍽️ Restaurantes</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 420,00</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">🏋️ Academia</span>
                                                        <span className="text-gray-900 font-questa-medium">R$ 250,00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Total de Receitas */}
                                        <div className="p-6 border-t-2 border-green-200 bg-green-50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-questa-bold text-gray-900">Total de Receitas</span>
                                                <span className="text-2xl font-questa-bold text-green-600">+ R$ 15.000,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card de Delta Final */}
                                <div className="bg-gradient-to-r from-green-50 to-white border-2 border-green-300 rounded-lg p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-2">Total Receitas</p>
                                            <p className="text-2xl font-questa-bold text-green-600">+ R$ 15.000,00</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-2">Total Custos</p>
                                            <p className="text-2xl font-questa-bold text-red-600">- R$ 6.050,00</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-2">💎 Lucro Líquido</p>
                                            <p className="text-3xl font-questa-bold text-green-700">R$ 8.950,00</p>
                                            <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-questa-bold rounded-full">
                                                ↗️ Margem: 59.67%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex justify-end gap-3">
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                        📊 Exportar Relatório
                                    </button>
                                    <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                        📧 Enviar por Email
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Reservas */}
                {activeTab === 'reservas' && (
                    <div className="space-y-6">
                        {!selectedImovel.parceriaAtiva ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                <p className="text-orange-800 font-questa-medium">
                                    ⚠️ Ative a parceria FrontStay para gerenciar reservas
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Informações de uso do proprietário */}
                                <div className="bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-lg p-6">
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div>
                                            <h3 className="text-lg font-questa-bold text-gray-900 mb-1">Seus Dias de Uso</h3>
                                            <p className="text-sm text-gray-600 font-questa-regular">
                                                Você pode usar o imóvel por até {LIMITE_DIAS_PROPRIETARIO} dias por mês nos períodos não reservados
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-questa-bold text-blue-900">
                                                {diasProprietarioSelecionados.length}/{LIMITE_DIAS_PROPRIETARIO}
                                            </div>
                                            <p className="text-xs text-gray-500 font-questa-regular mt-1">dias selecionados</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Calendário */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-lg font-questa-bold text-gray-900">
                                                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                                            </h2>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => changeMonth('prev')}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => changeMonth('next')}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Legenda */}
                                        <div className="flex flex-wrap gap-6 mb-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                                                <span className="text-gray-700 font-questa-regular">Reservado (Hóspedes)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-900 rounded"></div>
                                                <span className="text-gray-700 font-questa-regular">Seus Dias Selecionados</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                                                <span className="text-gray-700 font-questa-regular">Disponível</span>
                                            </div>
                                        </div>

                                        {/* Calendário Grid */}
                                        <div className="grid grid-cols-7 gap-2">
                                            {/* Cabeçalho dias da semana */}
                                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                                                <div key={dia} className="text-center text-xs font-questa-bold text-gray-500 py-2">
                                                    {dia}
                                                </div>
                                            ))}

                                            {/* Dias do mês */}
                                            {(() => {
                                                const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
                                                const days = [];

                                                // Adiciona espaços vazios antes do primeiro dia
                                                for (let i = 0; i < startingDayOfWeek; i++) {
                                                    days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                                                }

                                                // Adiciona os dias do mês
                                                for (let day = 1; day <= daysInMonth; day++) {
                                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    const isReservado = diasReservados.includes(dateStr);
                                                    const isSelecionado = diasProprietarioSelecionados.includes(dateStr);
                                                    const hoje = new Date();
                                                    const isPassado = new Date(year, month, day) < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

                                                    let className = "aspect-square flex items-center justify-center rounded-lg text-sm font-questa-medium transition-all cursor-pointer ";

                                                    if (isPassado) {
                                                        className += "bg-gray-100 text-gray-400 cursor-not-allowed";
                                                    } else if (isReservado) {
                                                        className += "bg-red-100 border-2 border-red-500 text-red-700 cursor-not-allowed";
                                                    } else if (isSelecionado) {
                                                        className += "bg-blue-100 border-2 border-blue-900 text-blue-900 hover:bg-blue-200";
                                                    } else {
                                                        className += "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50";
                                                    }

                                                    days.push(
                                                        <button
                                                            key={day}
                                                            onClick={() => !isReservado && !isPassado && handleDayClick(dateStr)}
                                                            disabled={isReservado || isPassado}
                                                            className={className}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                }

                                                return days;
                                            })()}
                                        </div>

                                        {/* Botão de confirmação */}
                                        {diasProprietarioSelecionados.length > 0 && (
                                            <div className="mt-6 pt-6 border-t border-gray-200">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-sm font-questa-bold text-gray-900">
                                                            {diasProprietarioSelecionados.length} {diasProprietarioSelecionados.length === 1 ? 'dia selecionado' : 'dias selecionados'}
                                                        </p>
                                                        <p className="text-xs text-gray-600 font-questa-regular mt-1">
                                                            {diasProprietarioSelecionados.sort().map(d => {
                                                                const date = new Date(d + 'T00:00:00');
                                                                return date.getDate();
                                                            }).join(', ')}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => setDiasProprietarioSelecionados([])}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors"
                                                        >
                                                            Limpar
                                                        </button>
                                                        <button
                                                            className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-950 transition-colors"
                                                        >
                                                            Confirmar Reserva
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Lista de reservas de hóspedes */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-questa-bold text-gray-900">Reservas de Hóspedes</h2>
                                        <p className="text-sm text-gray-500 font-questa-regular mt-1">Reservas confirmadas em {selectedImovel.nome}</p>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-questa-bold text-gray-900 mb-1">João Silva</h3>
                                                    <p className="text-sm text-gray-600">05/11/2025 - 07/11/2025 (3 dias)</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">Confirmada</span>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>👥 2 hóspedes</span>
                                                <span>💰 R$ 1.800,00</span>
                                            </div>
                                        </div>
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-questa-bold text-gray-900 mb-1">Maria Santos</h3>
                                                    <p className="text-sm text-gray-600">12/11/2025 - 15/11/2025 (4 dias)</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">Confirmada</span>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>👥 3 hóspedes</span>
                                                <span>💰 R$ 2.400,00</span>
                                            </div>
                                        </div>
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-questa-bold text-gray-900 mb-1">Carlos Oliveira</h3>
                                                    <p className="text-sm text-gray-600">20/11/2025 - 25/11/2025 (6 dias)</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">Confirmada</span>
                                            </div>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span>👥 4 hóspedes</span>
                                                <span>💰 R$ 3.600,00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Documentos */}
                {activeTab === 'documentos' && (
                    <div className="space-y-6">
                        {!selectedImovel.parceriaAtiva ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                <p className="text-orange-800 font-questa-medium">
                                    ⚠️ Ative a parceria FrontStay para gerenciar documentos
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Upload de Documentos */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Convenção de Condomínio */}
                                    <div className="bg-white rounded-lg shadow-sm border-2 border-blue-200 p-4 sm:p-6 hover:border-blue-400 transition-colors">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900 mb-1 text-sm sm:text-base">Convenção de Condomínio</h3>
                                            <p className="text-xs text-gray-600 font-questa-regular mb-3">
                                                Regras e regulamentos
                                            </p>
                                            <label className="w-full cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={() => handleFileUpload('Convenção de Condomínio')}
                                                />
                                                <div className="px-3 py-2 sm:px-4 bg-blue-900 text-white rounded-lg text-xs sm:text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                                    + Adicionar
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Matrícula do Imóvel */}
                                    <div className="bg-white rounded-lg shadow-sm border-2 border-orange-200 p-4 sm:p-6 hover:border-orange-400 transition-colors">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900 mb-1 text-sm sm:text-base">Matrícula do Imóvel</h3>
                                            <p className="text-xs text-gray-600 font-questa-regular mb-3">
                                                Registro oficial
                                            </p>
                                            <label className="w-full cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={() => handleFileUpload('Matrícula do Imóvel')}
                                                />
                                                <div className="px-3 py-2 sm:px-4 bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-questa-medium hover:bg-orange-700 transition-colors">
                                                    + Adicionar
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Documentos */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-lg font-questa-bold text-gray-900">Documentos Armazenados</h2>
                                        <p className="text-sm text-gray-500 font-questa-regular mt-1">
                                            Total: {documentos.length} {documentos.length === 1 ? 'documento' : 'documentos'}
                                        </p>
                                    </div>

                                    <div className="divide-y divide-gray-200">
                                        {documentos.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-500 font-questa-regular">Nenhum documento carregado ainda</p>
                                                <p className="text-sm text-gray-400 font-questa-regular mt-1">Use os botões acima para adicionar documentos</p>
                                            </div>
                                        ) : (
                                            documentos.map((doc) => (
                                                <div key={doc.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                                        {/* Ícone e Info Principal */}
                                                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                                            {/* Ícone do documento */}
                                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.categoria === 'Convenção de Condomínio' ? 'bg-blue-100' :
                                                                doc.categoria === 'Notas de Manutenção' ? 'bg-green-100' :
                                                                    'bg-purple-100'
                                                                }`}>
                                                                <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${doc.categoria === 'Convenção de Condomínio' ? 'text-blue-900' :
                                                                    doc.categoria === 'Notas de Manutenção' ? 'text-green-600' :
                                                                        'text-purple-600'
                                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>

                                                            {/* Informações do documento */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-questa-bold text-gray-900 mb-1 text-sm sm:text-base truncate">{doc.nome}</h3>
                                                                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                                                    <span className={`px-2 py-0.5 rounded text-xs font-questa-medium whitespace-nowrap ${doc.categoria === 'Convenção de Condomínio' ? 'bg-blue-100 text-blue-900' :
                                                                        doc.categoria === 'Matrícula do Imóvel' ? 'bg-orange-100 text-orange-700' :
                                                                            doc.categoria === 'Notas de Manutenção' ? 'bg-green-100 text-green-700' :
                                                                                'bg-purple-100 text-purple-700'
                                                                        }`}>
                                                                        {doc.categoria}
                                                                    </span>
                                                                    <span className="text-gray-600 font-questa-regular whitespace-nowrap">📅 {doc.data}</span>
                                                                    <span className="text-gray-600 font-questa-regular whitespace-nowrap">📦 {doc.tamanho}</span>
                                                                    {doc.uploadPor === 'Administrador' && (
                                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-questa-medium whitespace-nowrap">
                                                                            👤 Adm
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Ações */}
                                                        <div className="flex items-center gap-1 sm:gap-2 justify-end sm:justify-start">
                                                            <button className="p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </button>
                                                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Visualizar">
                                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </button>
                                                            {doc.uploadPor === 'Proprietário' ? (
                                                                <button
                                                                    onClick={() => handleDeleteDoc(doc.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Excluir"
                                                                >
                                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    disabled
                                                                    className="p-2 text-gray-300 cursor-not-allowed rounded-lg"
                                                                    title="Apenas administrador pode excluir"
                                                                >
                                                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Parceiros */}
                {activeTab === 'parceiros' && (
                    <div className="space-y-6">
                        {!selectedImovel.parceriaAtiva ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                                <p className="text-orange-800 font-questa-medium">
                                    ⚠️ Ative a parceria FrontStay para acessar os serviços parceiros
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-questa-bold text-gray-900">Parceiros Disponíveis</h2>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">
                                        Serviços exclusivos para oferecer aos seus hóspedes
                                    </p>
                                </div>

                                {/* Filtros por Categoria */}
                                <div className="p-6 border-b border-gray-200 bg-gray-50">
                                    <div className="flex flex-wrap gap-2">
                                        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium transition-colors">
                                            Todos ({parceirosDisponiveis.length})
                                        </button>
                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Personal Trainer ({parceirosDisponiveis.filter(p => p.categoria === 'Personal Trainer').length})
                                        </button>
                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Locadora ({parceirosDisponiveis.filter(p => p.categoria === 'Locadora de Veículos').length})
                                        </button>
                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Chef ({parceirosDisponiveis.filter(p => p.categoria === 'Chef Particular').length})
                                        </button>
                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Spa ({parceirosDisponiveis.filter(p => p.categoria === 'Spa & Massagem').length})
                                        </button>
                                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Outros
                                        </button>
                                    </div>
                                </div>

                                {/* Grid de Parceiros */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {parceirosDisponiveis.map((parceiro) => (
                                            <div
                                                key={parceiro.id}
                                                className={`border-2 rounded-lg overflow-hidden transition-all hover:shadow-lg ${parceiro.ativo
                                                    ? 'border-green-200 bg-gradient-to-br from-white to-green-50'
                                                    : 'border-gray-200 bg-white hover:border-blue-200'
                                                    }`}
                                            >
                                                {/* Header do Card */}
                                                <div className="p-4 border-b border-gray-200 bg-white">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-4xl">{parceiro.imagem}</div>
                                                            <div>
                                                                <h3 className="font-questa-bold text-gray-900">{parceiro.nome}</h3>
                                                                <span className="text-xs text-gray-500 font-questa-regular">{parceiro.categoria}</span>
                                                            </div>
                                                        </div>
                                                        {parceiro.ativo && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-bold rounded flex items-center gap-1">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                                Ativo
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Conteúdo do Card */}
                                                <div className="p-4">
                                                    <p className="text-sm text-gray-600 font-questa-regular mb-4">
                                                        {parceiro.descricao}
                                                    </p>

                                                    {/* Avaliação */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="font-questa-bold text-gray-900">{parceiro.avaliacao}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            ({parceiro.totalAvaliacoes} avaliações)
                                                        </span>
                                                    </div>

                                                    {/* Preço */}
                                                    <div className="mb-4">
                                                        <span className="text-lg font-questa-bold text-blue-900">{parceiro.preco}</span>
                                                    </div>

                                                    {/* Benefício */}
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                                        <div className="flex items-start gap-2">
                                                            <svg className="w-4 h-4 text-blue-900 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                                            </svg>
                                                            <p className="text-xs text-blue-900 font-questa-medium">
                                                                {parceiro.beneficio}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Disponibilidade */}
                                                    {!parceiro.ativo && (
                                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-4">
                                                            <p className="text-xs text-orange-700 font-questa-medium text-center">
                                                                ⚠️ Parceiro não ativo neste imóvel
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Botões de Ação */}
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors flex items-center justify-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                            </svg>
                                                            Solicitar Serviço
                                                        </button>
                                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Gerenciar Imóvel */}
                {activeTab === 'gerenciar' && (
                    <div className="space-y-6">
                        {!selectedImovel.parceriaAtiva ? (
                            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg border-2 border-blue-200 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 sm:p-8 text-white">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-questa-bold mb-2">Parceria FrontStay</h2>
                                            <p className="text-blue-100 font-questa-regular text-sm sm:text-base">
                                                Maximize seus lucros com gestão completa do seu imóvel
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Conteúdo */}
                                <div className="p-6 sm:p-8">
                                    {/* Benefícios */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            O que está incluso
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Gestão de Reservas</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Check-in, check-out e atendimento 24/7</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Manutenção Preventiva</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Inspeções e reparos regulares</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Precificação Dinâmica</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Maximize receitas com IA</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Seguro Total</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Proteção contra danos e inadimplência</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Pagamento Garantido</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Receba até o 5º dia útil</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-blue-100">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Serviços Premium</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Acesso a parceiros exclusivos</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Condições Comerciais */}
                                    <div className="mb-8 bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 border border-blue-200">
                                        <h3 className="text-xl font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Condições Comerciais
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-questa-bold text-gray-900">Taxa de Gestão: 20% sobre receita bruta</p>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Inclui todos os serviços de gestão e manutenção</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-questa-bold text-gray-900">Contrato de 12 meses (renovável)</p>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Flexibilidade para cancelamento com aviso prévio de 30 dias</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-questa-bold text-gray-900">Sem custos de adesão</p>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Zero taxa de entrada ou setup inicial</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <p className="font-questa-bold text-gray-900">Ocupação mínima garantida de 70%</p>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Ou você não paga a taxa de gestão no mês</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call to Action */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 px-6 py-4 bg-blue-900 text-white rounded-lg font-questa-bold hover:bg-blue-950 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                            Quero Conversar com um Especialista
                                        </button>
                                        <button className="px-6 py-4 bg-white border-2 border-blue-900 text-blue-900 rounded-lg font-questa-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Ver Contrato
                                        </button>
                                    </div>

                                    {/* Informação adicional */}
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-900 font-questa-medium text-center">
                                            💡 <strong>Dica:</strong> Propriedades gerenciadas pela FrontStay têm, em média, 35% mais receita que autogestão
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Status e Controle de Locação */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Status Atual */}
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                        <div className="p-6 border-b border-gray-200">
                                            <h2 className="text-lg font-questa-bold text-gray-900">Status do Imóvel</h2>
                                            <p className="text-sm text-gray-500 font-questa-regular mt-1">
                                                Situação atual da locação
                                            </p>
                                        </div>

                                        <div className="p-6">
                                            <div className={`rounded-lg p-6 border-2 ${imovelPausado ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-200'}`}>
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${imovelPausado ? 'bg-gray-200' : 'bg-blue-100'}`}>
                                                        {imovelPausado ? (
                                                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-xl font-questa-bold ${imovelPausado ? 'text-gray-900' : 'text-blue-900'}`}>
                                                            {imovelPausado ? 'Imóvel Pausado' : 'Imóvel Ativo'}
                                                        </h3>
                                                        <p className={`text-sm font-questa-regular mt-1 ${imovelPausado ? 'text-gray-600' : 'text-blue-700'}`}>
                                                            {imovelPausado
                                                                ? 'Locação temporariamente pausada'
                                                                : 'Disponível para reservas'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {imovelPausado && (
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="font-questa-medium text-gray-700">Período:</span>
                                                            <span className="font-questa-regular text-gray-600">
                                                                {dataInicioPausa} até {dataFimPausa}
                                                            </span>
                                                        </div>
                                                        {motivoPausa && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <span className="font-questa-medium text-gray-700">Motivo:</span>
                                                                <span className="font-questa-regular text-gray-600">{motivoPausa}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {imovelPausado && (
                                                    <button
                                                        onClick={() => {
                                                            setImovelPausado(false);
                                                            setDataInicioPausa('');
                                                            setDataFimPausa('');
                                                            setMotivoPausa('');
                                                        }}
                                                        className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-950 transition-colors"
                                                    >
                                                        Reativar Imóvel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Formulário de Pausa */}
                                    {!imovelPausado && (
                                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                            <div className="p-6 border-b border-gray-200">
                                                <h2 className="text-lg font-questa-bold text-gray-900">Pausar Locação</h2>
                                                <p className="text-sm text-gray-500 font-questa-regular mt-1">
                                                    Retire temporariamente o imóvel
                                                </p>
                                            </div>

                                            <div className="p-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Data Início</label>
                                                        <input
                                                            type="date"
                                                            value={dataInicioPausa}
                                                            onChange={(e) => setDataInicioPausa(e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Data Fim</label>
                                                        <input
                                                            type="date"
                                                            value={dataFimPausa}
                                                            onChange={(e) => setDataFimPausa(e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-questa-medium text-gray-700 mb-2">Motivo</label>
                                                        <select
                                                            value={motivoPausa}
                                                            onChange={(e) => setMotivoPausa(e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                                                        >
                                                            <option value="">Selecione um motivo</option>
                                                            <option value="Manutenção">Manutenção</option>
                                                            <option value="Reforma">Reforma</option>
                                                            <option value="Uso Pessoal">Uso Pessoal</option>
                                                            <option value="Férias">Férias</option>
                                                            <option value="Outro">Outro</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (dataInicioPausa && dataFimPausa && motivoPausa) {
                                                                setImovelPausado(true);
                                                            } else {
                                                                alert('Por favor, preencha todos os campos');
                                                            }
                                                        }}
                                                        className="w-full px-6 py-3 bg-blue-900 text-white rounded-lg text-sm font-questa-bold hover:bg-blue-950 transition-colors"
                                                    >
                                                        Confirmar Pausa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Manutenções */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-lg font-questa-bold text-gray-900">Manutenções</h2>
                                                <p className="text-sm text-gray-500 font-questa-regular mt-1">
                                                    Acompanhe as manutenções do seu imóvel
                                                </p>
                                            </div>
                                            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Solicitar Manutenção
                                            </button>
                                        </div>
                                    </div>

                                    {/* Resumo de Manutenções */}
                                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-questa-bold text-gray-900">
                                                            {manutencoes.filter(m => m.status === 'Concluída').length}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-questa-regular">Concluídas</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-questa-bold text-gray-900">
                                                            {manutencoes.filter(m => m.status === 'Em Andamento').length}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-questa-regular">Em Andamento</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-2xl font-questa-bold text-gray-900">
                                                            {manutencoes.filter(m => m.status === 'Agendada').length}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-questa-regular">Agendadas</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista de Manutenções */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {manutencoes.map((manutencao) => (
                                                <div key={manutencao.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="font-questa-bold text-gray-900">{manutencao.descricao}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-questa-bold ${manutencao.status === 'Concluída'
                                                                    ? 'bg-gray-200 text-gray-700'
                                                                    : manutencao.status === 'Em Andamento'
                                                                        ? 'bg-blue-100 text-blue-900'
                                                                        : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                    {manutencao.status}
                                                                </span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-questa-medium ${manutencao.tipo === 'Preventiva'
                                                                    ? 'bg-blue-50 text-blue-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                                    }`}>
                                                                    {manutencao.tipo}
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">📅 Período</p>
                                                                    <p className="text-sm text-gray-900 font-questa-regular">
                                                                        {manutencao.dataInicio} → {manutencao.dataFim}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">👷 Responsável</p>
                                                                    <p className="text-sm text-gray-900 font-questa-regular">{manutencao.responsavel}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">💰 Custo</p>
                                                                    <p className="text-sm text-blue-900 font-questa-bold">{manutencao.custo}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 font-questa-medium mb-1">📝 Observações</p>
                                                                    <p className="text-sm text-gray-600 font-questa-regular">{manutencao.observacoes}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main >
        </div >
    );
}

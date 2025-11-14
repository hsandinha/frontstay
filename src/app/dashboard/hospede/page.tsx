'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type TabType = 'visao-geral' | 'reservas' | 'gestao-sessoes' | 'servicos' | 'cupons' | 'conectividade';

export default function HospedeDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white font-questa-bold text-lg">F</span>
                            </div>
                            <h1 className="text-xl font-questa-bold text-gray-900">Dashboard do Hóspede</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 font-questa-regular">Olá, Hebert</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-purple-600 hover:text-purple-700 font-questa-medium"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('visao-geral')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'visao-geral'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Visão Geral
                        </button>
                        <button
                            onClick={() => setActiveTab('reservas')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reservas'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Minhas Reservas
                        </button>
                        <button
                            onClick={() => setActiveTab('gestao-sessoes')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'gestao-sessoes'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Gestão de Estadia
                        </button>
                        <button
                            onClick={() => setActiveTab('servicos')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'servicos'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Serviços
                        </button>
                        <button
                            onClick={() => setActiveTab('cupons')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'cupons'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Cupons de Desconto
                        </button>
                        <button
                            onClick={() => setActiveTab('conectividade')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'conectividade'
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            Conectividade
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Visão Geral */}
                {activeTab === 'visao-geral' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Card 1 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Reservas Ativas</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">1</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Check-ins</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">5</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Cupons</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">8</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Serviços</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">3</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-questa-regular">Cashback</p>
                                        <p className="text-xl font-questa-bold text-gray-900">R$ 450</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Próximas Reservas */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Próximas Reservas</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Visualização das suas próximas estadias</p>
                            </div>
                            <div className="p-6">
                                {/* Reserva Card */}
                                <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:border-purple-300 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-questa-bold text-gray-900 mb-1">FrontStay Esopo</h3>
                                            <p className="text-sm text-gray-600 font-questa-regular">Alameda Flamboiant, 285 - Vale do Sereno, Nova Lima</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded-full">
                                            Confirmada
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-600 font-questa-regular mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>15/11/2025 - 20/11/2025</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>R$ 2.100</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                            Fazer Check-in
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Ver Detalhes
                                        </button>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4 opacity-60">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-questa-bold text-gray-900 mb-1">FrontStay City Design</h3>
                                            <p className="text-sm text-gray-600 font-questa-regular">Rua Tenente Brito Melo - Barro Preto, BH</p>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-questa-medium rounded-full">
                                            Pendente
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-gray-600 font-questa-regular">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>10/12/2025 - 15/12/2025</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>R$ 1.800</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Minhas Reservas */}
                {activeTab === 'reservas' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-questa-bold text-gray-900">Minhas Reservas</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Gerencie todas as suas reservas</p>
                            </div>
                            <button
                                onClick={() => router.push('/')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors"
                            >
                                + Nova Reserva
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Reserva Ativa */}
                                <div className="border border-gray-200 rounded-lg p-5 bg-green-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-questa-bold text-gray-900 text-lg">FrontStay Esopo</h3>
                                                <span className="px-2 py-1 bg-green-600 text-white text-xs font-questa-medium rounded">ATIVA</span>
                                            </div>
                                            <p className="text-sm text-gray-600 font-questa-regular mb-3">Alameda Flamboiant, 285 - Vale do Sereno, Nova Lima - MG</p>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Check-in</p>
                                                    <p className="text-gray-900 font-questa-medium">15/11/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Check-out</p>
                                                    <p className="text-gray-900 font-questa-medium">20/11/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Valor Total</p>
                                                    <p className="text-gray-900 font-questa-medium">R$ 2.100</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                            Check-in Online
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Ver Detalhes
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Gerenciar
                                        </button>
                                    </div>
                                </div>

                                {/* Reserva Futura */}
                                <div className="border border-gray-200 rounded-lg p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-questa-bold text-gray-900 text-lg">FrontStay City Design</h3>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-questa-medium rounded">FUTURA</span>
                                            </div>
                                            <p className="text-sm text-gray-600 font-questa-regular mb-3">Rua Tenente Brito Melo - Barro Preto, Belo Horizonte - MG</p>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Check-in</p>
                                                    <p className="text-gray-900 font-questa-medium">10/12/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Check-out</p>
                                                    <p className="text-gray-900 font-questa-medium">15/12/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Valor Total</p>
                                                    <p className="text-gray-900 font-questa-medium">R$ 1.800</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Histórico */}
                                <div className="border border-gray-200 rounded-lg p-5 opacity-60">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-questa-bold text-gray-900 text-lg">FrontStay Ágora</h3>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-questa-medium rounded">CONCLUÍDA</span>
                                            </div>
                                            <p className="text-sm text-gray-600 font-questa-regular mb-3">Rua dos Timbiras, 815, Funcionários, BH</p>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Check-in</p>
                                                    <p className="text-gray-900 font-questa-medium">01/10/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Check-out</p>
                                                    <p className="text-gray-900 font-questa-medium">05/10/2025</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-questa-regular mb-1">Valor Total</p>
                                                    <p className="text-gray-900 font-questa-medium">R$ 1.500</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gestão de Estadia */}
                {activeTab === 'gestao-sessoes' && (
                    <div className="space-y-6">
                        {/* Informações da Estadia Atual */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Informações da Estadia</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Detalhes da sua hospedagem atual</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Status da Reserva */}
                                    <div className="border border-gray-200 rounded-lg p-5">
                                        <h3 className="font-questa-bold text-gray-900 mb-4">Status da Reserva</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-questa-regular">Check-in:</span>
                                                <span className="text-sm font-questa-medium text-gray-900">15/03/2024 às 14:00</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-questa-regular">Check-out:</span>
                                                <span className="text-sm font-questa-medium text-gray-900">20/03/2024 às 12:00</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-questa-regular">Duração:</span>
                                                <span className="text-sm font-questa-medium text-gray-900">5 noites</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-questa-regular">Status:</span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-questa-medium bg-green-100 text-green-800">
                                                    Ativo
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detalhes do Imóvel */}
                                    <div className="border border-gray-200 rounded-lg p-5">
                                        <h3 className="font-questa-bold text-gray-900 mb-4">Detalhes do Imóvel</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm text-gray-600 font-questa-regular">Endereço:</span>
                                                <span className="text-sm font-questa-medium text-gray-900 text-right">Av. Paulista, 1000<br />Apt 1202</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-questa-regular">Torre/Bloco:</span>
                                                <span className="text-sm font-questa-medium text-gray-900">Torre A</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 font-questa-regular">Hóspedes:</span>
                                                <span className="text-sm font-questa-medium text-gray-900">2 adultos</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ações Rápidas da Estadia */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Ações da Estadia</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Gerencie sua hospedagem</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Check-in Online */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Check-in</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Realize o check-in online e receba suas credenciais</p>
                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                            Fazer Check-in
                                        </button>
                                    </div>

                                    {/* Solicitar Check-out */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Check-out</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Solicite o check-out digital antecipado ou confirme saída</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Solicitar Check-out
                                        </button>
                                    </div>

                                    {/* Estender Estadia */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Estender Estadia</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Prolongue sua reserva se disponível</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Verificar Disponibilidade
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informações Importantes */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                            <h3 className="font-questa-bold text-gray-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Dicas para sua Estadia
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 font-questa-regular">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Para acessar o imóvel e áreas comuns do edifício, utilize a aba "Conectividade"</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>O check-in pode ser realizado a partir das 14:00 do dia da reserva</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>O check-out deve ser realizado até as 12:00 do último dia</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Em caso de dúvidas ou necessidade de suporte, entre em contato conosco</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Serviços */}
                {activeTab === 'servicos' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Serviços Disponíveis</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Profissionais e serviços exclusivos para o condomínio</p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Serviços de Bem-Estar */}
                                    <div>
                                        <h3 className="font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="text-xl">💆</span>
                                            Bem-Estar & Fitness
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">🏋️</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Personal Trainer</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Treinos personalizados na academia do prédio
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 80/hora
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">🧘</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Aula de Pilates</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Aulas individuais ou em grupo
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 60/hora
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">💆</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Massagem Terapêutica</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Relaxamento e bem-estar
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 120/hora
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Serviços de Beleza */}
                                    <div>
                                        <h3 className="font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="text-xl">💄</span>
                                            Beleza & Estética
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">💄</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Maquiadora</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Maquiagem profissional para eventos
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 100/serviço
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">✂️</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Cabeleireiro</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Corte, escova e tratamentos
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 50/serviço
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">💅</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Manicure & Pedicure</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Cuidados com unhas e pés
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 40/serviço
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Serviços Gastronômicos */}
                                    <div>
                                        <h3 className="font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="text-xl">🍳</span>
                                            Gastronomia
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">🍳</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Chef Particular</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Jantares especiais em sua acomodação
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 200/serviço
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Agendar Sessão
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Serviços de Transporte */}
                                    <div>
                                        <h3 className="font-questa-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="text-xl">🚗</span>
                                            Transporte & Mobilidade
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">🚗</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Aluguel de Carro</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Parceria com locadoras - 15% OFF
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 80/dia
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Solicitar Orçamento
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="text-3xl">🚕</div>
                                                    <div className="flex-1">
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">Transfer Aeroporto</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular mb-2">
                                                            Translado seguro e confortável
                                                        </p>
                                                        <p className="text-sm text-purple-600 font-questa-medium mb-3">
                                                            A partir de R$ 60
                                                        </p>
                                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                                            Solicitar Transfer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meus Agendamentos */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <h3 className="font-questa-bold text-gray-900 mb-4">📅 Meus Agendamentos</h3>
                                        <div className="space-y-3">
                                            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-questa-bold text-gray-900 mb-1">🏋️ Personal Trainer</h4>
                                                        <p className="text-sm text-gray-600 font-questa-regular">
                                                            📅 16/11/2025 às 07:00 - Academia do Prédio
                                                        </p>
                                                        <p className="text-sm text-gray-900 font-questa-medium mt-1">
                                                            💰 R$ 80,00
                                                        </p>
                                                    </div>
                                                    <button className="px-3 py-1 border border-red-300 text-red-600 rounded-lg text-xs font-questa-medium hover:bg-red-50">
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 font-questa-regular text-center py-4">
                                                Nenhum outro agendamento
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cupons de Desconto */}
                {activeTab === 'cupons' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-questa-bold text-gray-900">Cupons de Desconto</h2>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">Aproveite descontos exclusivos em serviços parceiros</p>
                                </div>
                                <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-questa-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                                    <span>+</span>
                                    Novo Cupom
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Cupom 1 */}
                                    <div className="border-2 border-dashed border-purple-300 rounded-lg p-5 bg-purple-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-questa-bold text-gray-900 mb-1">15% OFF em Restaurantes</h3>
                                                <p className="text-sm text-gray-600 font-questa-regular">Válido em todos os parceiros Front Stay</p>
                                            </div>
                                            <span className="text-3xl">🍽️</span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 font-questa-regular mb-1">Código do cupom</p>
                                            <p className="font-mono text-sm font-bold text-purple-600">RESTAURANTE15</p>
                                        </div>
                                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-questa-medium hover:bg-purple-700 transition-colors">
                                            Usar Cupom
                                        </button>
                                    </div>

                                    {/* Cupom 2 */}
                                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-5 bg-orange-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-questa-bold text-gray-900 mb-1">Voucher Gormir</h3>
                                                <p className="text-sm text-gray-600 font-questa-regular">Jantar para 2 pessoas</p>
                                            </div>
                                            <span className="text-3xl">🎁</span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 font-questa-regular mb-1">Código do cupom</p>
                                            <p className="font-mono text-sm font-bold text-orange-600">GORMIR2X</p>
                                        </div>
                                        <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-questa-medium hover:bg-orange-600 transition-colors">
                                            Usar Cupom
                                        </button>
                                    </div>

                                    {/* Cupom 3 */}
                                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-5 bg-blue-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-questa-bold text-gray-900 mb-1">15% OFF Aluguel de Carro</h3>
                                                <p className="text-sm text-gray-600 font-questa-regular">Válido por 7 dias</p>
                                            </div>
                                            <span className="text-3xl">🚗</span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 font-questa-regular mb-1">Código do cupom</p>
                                            <p className="font-mono text-sm font-bold text-blue-600">CARRO15</p>
                                        </div>
                                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-700 transition-colors">
                                            Usar Cupom
                                        </button>
                                    </div>

                                    {/* Cupom 4 */}
                                    <div className="border-2 border-dashed border-green-300 rounded-lg p-5 bg-green-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-questa-bold text-gray-900 mb-1">Academia Grátis</h3>
                                                <p className="text-sm text-gray-600 font-questa-regular">1 dia de cortesia</p>
                                            </div>
                                            <span className="text-3xl">🏋️</span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-xs text-gray-500 font-questa-regular mb-1">Código do cupom</p>
                                            <p className="font-mono text-sm font-bold text-green-600">GYM1DAY</p>
                                        </div>
                                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-questa-medium hover:bg-green-700 transition-colors">
                                            Usar Cupom
                                        </button>
                                    </div>
                                </div>

                                {/* Cashback Section */}
                                <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm opacity-90 mb-1">Seu Cashback Acumulado</p>
                                            <p className="text-4xl font-questa-bold">R$ 450,00</p>
                                            <p className="text-sm opacity-90 mt-2">Ganhe cashback em suas estadias e uso de serviços</p>
                                        </div>
                                        <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-questa-medium hover:bg-gray-100 transition-colors">
                                            Resgatar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conectividade */}
                {activeTab === 'conectividade' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Conectividade Predial</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Gestão completa da sua experiência no edifício</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Controle de Visitantes */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Controle de Visitantes</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Autorize e gerencie acessos de visitantes</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Gerenciar
                                        </button>
                                    </div>

                                    {/* Comunicação com Portaria */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Comunicação com Portaria</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Chat direto com a portaria do edifício</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Abrir Chat
                                        </button>
                                    </div>

                                    {/* Controle de Encomendas */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Controle de Encomendas</h3>
                                        </div>
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                                            <p className="text-sm font-questa-medium text-gray-900">2 encomendas aguardando retirada</p>
                                        </div>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Ver Todas
                                        </button>
                                    </div>

                                    {/* Controle de Fechaduras */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Controle de Fechaduras</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Gestão digital da maçaneta/fechadura</p>
                                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-questa-medium hover:bg-green-700 transition-colors">
                                            🔓 Abrir Porta
                                        </button>
                                        <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Histórico de Acesso
                                        </button>
                                    </div>

                                    {/* Reserva de Áreas Comuns */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Reservas de Áreas Comuns</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Piscina, academia, salão de festas e mais</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Ver Disponibilidade
                                        </button>
                                    </div>

                                    {/* Atas de Condomínio */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Atas de Condomínio</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Acesso às atas e documentos do prédio</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Ver Documentos
                                        </button>
                                    </div>

                                    {/* Calendário de Reservas */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Visualização de Calendário</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Veja datas reservadas e disponíveis</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Abrir Calendário
                                        </button>
                                    </div>

                                    {/* Serviços Integrados do Edifício */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-purple-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Serviços do Edifício</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Mini market, lockers, lavanderia, coworking</p>
                                        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 transition-colors">
                                            Ver Serviços
                                        </button>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
                                    <h3 className="font-questa-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Sobre a Conectividade Predial
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-700 font-questa-regular">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">•</span>
                                            <span>O aplicativo funciona como uma chave mestra digital para todo o edifício</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">•</span>
                                            <span>Todas as funções de gestão predial em um só lugar</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">•</span>
                                            <span>Controle total com segurança e praticidade</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-600 mt-0.5">•</span>
                                            <span>Sistema de checagem estadual de segurança integrado</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

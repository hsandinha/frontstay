'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type TabType = 'visao-geral' | 'reservas' | 'gestao-sessoes' | 'servicos' | 'cupons' | 'conectividade' | 'meu-perfil';

export default function HospedeDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('visao-geral');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.push('/login');
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false); // Fecha o menu ao selecionar uma aba
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center">
                                <span className="text-white font-questa-bold text-lg">F</span>
                            </div>
                            <h1 className="text-xl font-questa-bold text-gray-900">Dashboard do Hóspede</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 font-questa-regular">Olá, Hebert</span>
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
                            {activeTab === 'reservas' && 'Minhas Reservas'}
                            {activeTab === 'gestao-sessoes' && 'Gestão de Estadia'}
                            {activeTab === 'servicos' && 'Serviços'}
                            {activeTab === 'cupons' && 'Cupons de Desconto'}
                            {activeTab === 'conectividade' && 'Conectividade'}
                            {activeTab === 'meu-perfil' && 'Meu Perfil'}
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
                                onClick={() => handleTabChange('reservas')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'reservas'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Minhas Reservas
                            </button>
                            <button
                                onClick={() => handleTabChange('gestao-sessoes')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'gestao-sessoes'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Gestão de Estadia
                            </button>
                            <button
                                onClick={() => handleTabChange('servicos')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'servicos'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Serviços
                            </button>
                            <button
                                onClick={() => handleTabChange('cupons')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'cupons'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Cupons de Desconto
                            </button>
                            <button
                                onClick={() => handleTabChange('conectividade')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'conectividade'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                                </svg>
                                Conectividade
                            </button>
                            <button
                                onClick={() => handleTabChange('meu-perfil')}
                                className={`w-full py-3 px-4 text-sm font-questa-medium rounded-lg transition-colors flex items-center gap-3 ${activeTab === 'meu-perfil'
                                    ? 'bg-blue-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Meu Perfil
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
                            onClick={() => handleTabChange('reservas')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reservas'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Minhas Reservas
                        </button>
                        <button
                            onClick={() => handleTabChange('gestao-sessoes')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'gestao-sessoes'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Gestão de Estadia
                        </button>
                        <button
                            onClick={() => handleTabChange('servicos')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'servicos'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Serviços
                        </button>
                        <button
                            onClick={() => handleTabChange('cupons')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'cupons'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Cupons de Desconto
                        </button>
                        <button
                            onClick={() => handleTabChange('conectividade')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'conectividade'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            Conectividade
                        </button>
                        <button
                            onClick={() => handleTabChange('meu-perfil')}
                            className={`py-4 px-2 text-sm font-questa-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'meu-perfil'
                                ? 'border-blue-900 text-blue-900'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Meu Perfil
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Visão Geral */}
                {activeTab === 'visao-geral' && (
                    <div className="space-y-6">
                        {/* Stats Cards - 3 colunas */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                            {/* Card 2 - Check-ins */}
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
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        <p className="text-xs text-gray-500 font-questa-regular">Serviços Ativos</p>
                                        <p className="text-2xl font-questa-bold text-gray-900">3</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid 2 colunas: Próximas Reservas e Calendário */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Próximas Reservas - 2/3 da largura */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-questa-bold text-gray-900">Próximas Reservas</h2>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">Suas estadias programadas</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Reserva Card 1 - Melhorado */}
                                    <div className="group relative bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                                        {/* Badge de Status */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1.5 bg-green-600 text-white text-xs font-questa-bold rounded-full shadow-md">
                                                Confirmada
                                            </span>
                                        </div>

                                        <div className="mb-4 pr-24">
                                            <h3 className="text-lg font-questa-bold text-gray-900 mb-2">FrontStay Esopo</h3>
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <p className="font-questa-regular">Alameda Flamboiant, 285 - Vale do Sereno, Nova Lima</p>
                                            </div>
                                        </div>

                                        {/* Informações da Reserva */}
                                        <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-white/70 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-questa-regular">Período</p>
                                                    <p className="text-sm font-questa-bold text-gray-900">15/11 - 20/11/2025</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-questa-regular">Valor Total</p>
                                                    <p className="text-sm font-questa-bold text-gray-900">R$ 2.100,00</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botões de Ação */}
                                        <div className="flex gap-3">
                                            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Check-in
                                            </button>
                                            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-questa-medium hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                                                Detalhes
                                            </button>
                                            <button className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl text-sm font-questa-medium hover:bg-red-50 hover:border-red-400 transition-all duration-200">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reserva Card 2 - Pendente */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-5 opacity-75 hover:opacity-100 transition-opacity">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-questa-bold text-gray-900 mb-1">FrontStay City Design</h3>
                                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <p className="font-questa-regular">Rua Tenente Brito Melo - Barro Preto, BH</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-questa-bold rounded-full">
                                                Pendente
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-gray-600 font-questa-regular">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>10/12 - 15/12/2025</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>R$ 1.800,00</span>
                                            </div>
                                        </div>

                                        {/* Botões de Ação */}
                                        <div className="flex gap-3 mt-4">
                                            <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl text-sm font-questa-medium hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                                                Detalhes
                                            </button>
                                            <button className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl text-sm font-questa-medium hover:bg-red-50 hover:border-red-400 transition-all duration-200">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
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
                                                    <span className="text-xs font-questa-bold text-blue-900">14:00</span>
                                                </div>
                                                <p className="text-sm font-questa-medium text-gray-900">Check-in</p>
                                                <p className="text-xs text-gray-600">FrontStay Esopo</p>
                                            </div>
                                        </div>

                                        {/* Compromisso 2 */}
                                        <div className="relative pl-6 pb-4 border-l-2 border-blue-200">
                                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-teal-600 border-2 border-white"></div>
                                            <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-questa-bold text-teal-600">14:30</span>
                                                </div>
                                                <p className="text-sm font-questa-medium text-gray-900">Transfer Aeroporto</p>
                                                <p className="text-xs text-gray-600">Pickup confirmado</p>
                                            </div>
                                        </div>

                                        {/* Compromisso 3 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-600 border-2 border-white"></div>
                                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs font-questa-bold text-purple-600">18:00</span>
                                                </div>
                                                <p className="text-sm font-questa-medium text-gray-900">Academia</p>
                                                <p className="text-xs text-gray-600">Reserva do salão</p>
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

                        {/* Grid de 2 colunas: Serviços Ativos e Cupons Disponíveis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Serviços Ativos */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-questa-bold text-gray-900">Serviços Ativos</h2>
                                            <p className="text-sm text-gray-500 font-questa-regular mt-1">Seus serviços reservados</p>
                                        </div>
                                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-questa-medium rounded-full">
                                            3 ativos
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {/* Serviço 1 */}
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-questa-medium text-gray-900">Transfer Aeroporto</p>
                                                <p className="text-xs text-gray-500">15/11/2025 às 14:00</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">
                                            Confirmado
                                        </span>
                                    </div>

                                    {/* Serviço 2 */}
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-questa-medium text-gray-900">Café da Manhã Premium</p>
                                                <p className="text-xs text-gray-500">Diário - 08:00 às 10:00</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-questa-medium rounded">
                                            Ativo
                                        </span>
                                    </div>

                                    {/* Serviço 3 */}
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-questa-medium text-gray-900">Academia</p>
                                                <p className="text-xs text-gray-500">Reserva Salão: 17/11 às 18:00</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-questa-medium rounded">
                                            Agendado
                                        </span>
                                    </div>

                                    <button className="w-full mt-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                        Ver Todos os Serviços
                                    </button>
                                </div>
                            </div>

                            {/* Cupons Disponíveis */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-questa-bold text-gray-900">Cupons Disponíveis</h2>
                                            <p className="text-sm text-gray-500 font-questa-regular mt-1">Use antes que expirem</p>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-900 text-sm font-questa-medium rounded-full">
                                            8 ativos
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-3">
                                    {/* Cupom 1 - Destaque */}
                                    <div className="border-2 border-blue-300 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-white">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 bg-blue-900 text-white text-xs font-questa-bold rounded">
                                                        15% OFF
                                                    </span>
                                                    <span className="text-xs text-gray-500">Válido até 30/11</span>
                                                </div>
                                                <p className="font-questa-bold text-gray-900">Restaurante Premium</p>
                                                <p className="text-xs text-gray-600 mt-1">Válido para jantares acima de R$ 100</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                                            <code className="px-3 py-1 bg-white border border-blue-300 rounded text-sm font-questa-bold text-blue-900">
                                                RESTAURANTE15
                                            </code>
                                            <button className="text-sm text-blue-900 font-questa-medium hover:underline">
                                                Usar Agora
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cupom 2 */}
                                    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-questa-bold rounded mb-1">
                                                        R$ 50 OFF
                                                    </span>
                                                    <p className="text-sm font-questa-medium text-gray-900">Spa & Massagem</p>
                                                    <p className="text-xs text-gray-500">Até 25/11/2025</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-questa-medium hover:bg-gray-200 transition-colors">
                                                Detalhes
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cupom 3 */}
                                    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-questa-bold rounded mb-1">
                                                        20% OFF
                                                    </span>
                                                    <p className="text-sm font-questa-medium text-gray-900">Lavanderia Express</p>
                                                    <p className="text-xs text-gray-500">Até 20/11/2025</p>
                                                </div>
                                            </div>
                                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-questa-medium hover:bg-gray-200 transition-colors">
                                                Detalhes
                                            </button>
                                        </div>
                                    </div>

                                    <button className="w-full mt-2 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-questa-medium hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                        Ver Todos os Cupons
                                    </button>
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
                                className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors"
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
                                        <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
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
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <h3 className="font-questa-bold text-gray-900">Check-in</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-questa-regular mb-4">Realize o check-in online e receba suas credenciais</p>
                                        <button className="group w-full relative px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-2xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-900/50 overflow-hidden">
                                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                            <span className="relative">Fazer Check-in</span>
                                        </button>
                                    </div>

                                    {/* Solicitar Check-out */}
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
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
                                    <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
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
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-1">
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h2 className="text-lg font-questa-bold text-gray-900">Serviços Disponíveis</h2>
                            </div>
                            <p className="text-sm text-gray-500 font-questa-regular">Aproveite os serviços durante sua estadia</p>
                        </div>

                        {/* Áreas Comuns do Prédio */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-base font-questa-bold text-gray-900">Áreas Comuns do Prédio</h3>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Reserve e aproveite todas as facilidades</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Academia */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🏋️
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Academia</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Equipamentos modernos e climatização</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Diariamente: 6h - 22h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Acessar Agora
                                            </button>
                                        </div>
                                    </div>

                                    {/* Coworking */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                💼
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Coworking</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Espaço de trabalho compartilhado</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Segunda a Sexta: 8h - 20h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Reservar Mesa
                                            </button>
                                        </div>
                                    </div>

                                    {/* Salão de Festas */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🎉
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Salão de Festas</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Capacidade para 50 pessoas</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Reserva antecipada</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Verificar Disponibilidade
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lavanderia */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🧺
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Lavanderia</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Lavadoras e secadoras disponíveis</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Diariamente: 7h - 21h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Reservar Máquina
                                            </button>
                                        </div>
                                    </div>

                                    {/* Piscina */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🏊
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Piscina</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Área aquática com deck e espreguiçadeiras</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Diariamente: 8h - 20h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Acessar Agora
                                            </button>
                                        </div>
                                    </div>

                                    {/* Churrasqueira */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🍖
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Churrasqueira</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Espaço gourmet para confraternizações</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Reserva antecipada</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Reservar Espaço
                                            </button>
                                        </div>
                                    </div>

                                    {/* Playground */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🎠
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Playground</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Área infantil segura e divertida</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Diariamente: 8h - 18h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Ver Horários
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bicicletário */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🚲
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Bicicletário</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Estacionamento seguro para bicicletas</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Acesso 24h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Acessar Agora
                                            </button>
                                        </div>
                                    </div>

                                    {/* Sala de Jogos */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                🎮
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-questa-bold text-gray-900 mb-1">Sala de Jogos</h4>
                                                <p className="text-xs text-gray-600 font-questa-regular">Sinuca, pebolim e jogos de tabuleiro</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs text-gray-500 font-questa-regular">Diariamente: 9h - 22h</p>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Acessar Agora
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bem-Estar & Fitness */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-md">
                                        💆
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-questa-bold text-gray-900">Bem-Estar & Fitness</h3>
                                        <p className="text-sm text-gray-600 font-questa-regular">Cuide do corpo e da mente</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Personal Trainer */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    🏋️
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Personal Trainer</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Treinos personalizados na academia do prédio</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 80</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/hora</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Aula de Pilates */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    🧘
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Aula de Pilates</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Aulas individuais ou em grupo</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 60</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/hora</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Massagem */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    💆
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Massagem Terapêutica</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Relaxamento e bem-estar</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 120</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/hora</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Beleza & Estética */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-6 py-4 border-b border-pink-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xl shadow-md">
                                        💄
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-questa-bold text-gray-900">Beleza & Estética</h3>
                                        <p className="text-sm text-gray-600 font-questa-regular">Realce sua beleza natural</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Maquiadora */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    💄
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Maquiadora</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Maquiagem profissional para eventos</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 100</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/serviço</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cabeleireiro */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    ✂️
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Cabeleireiro</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Corte, escova e tratamentos</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 50</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/serviço</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manicure */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    💅
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Manicure & Pedicure</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Cuidados com unhas e pés</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 40</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/serviço</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gastronomia */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xl shadow-md">
                                        🍳
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-questa-bold text-gray-900">Gastronomia</h3>
                                        <p className="text-sm text-gray-600 font-questa-regular">Experiências culinárias únicas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Chef Particular */}
                                    <div className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                    🍳
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-questa-bold text-gray-900 mb-1">Chef Particular</h4>
                                                    <p className="text-sm text-gray-600 font-questa-regular">Jantares especiais em sua acomodação</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-lg font-questa-bold text-blue-900">R$ 200</span>
                                                    <span className="text-xs text-gray-500 font-questa-regular">/serviço</span>
                                                </div>
                                                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-xl text-sm font-questa-bold hover:from-blue-950 hover:to-slate-950 transition-all shadow-md hover:shadow-lg">
                                                    Agendar Sessão
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meus Agendamentos */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl shadow-md">
                                        📅
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-questa-bold text-gray-900">Meus Agendamentos</h3>
                                        <p className="text-sm text-gray-600 font-questa-regular">Serviços agendados</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-900 bg-blue-50 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                                                    🏋️
                                                </div>
                                                <div>
                                                    <h4 className="font-questa-bold text-gray-900 mb-1">Personal Trainer</h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="font-questa-regular">16/11/2025 às 07:00</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">Academia do Prédio</p>
                                                    <p className="text-sm font-questa-bold text-blue-900 mt-2">R$ 80,00</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg text-sm font-questa-medium hover:bg-red-50 transition-colors">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 font-questa-regular text-center py-8 bg-gray-50 rounded-lg">
                                        Nenhum outro agendamento
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cupons de Desconto */}
                {activeTab === 'cupons' && (
                    <div className="space-y-6">
                        {/* Header Clean */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Cupons Disponíveis</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Descontos exclusivos para sua estadia</p>
                            </div>

                            {/* Grid de Cupons */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Cupom 1 */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <span className="inline-block px-2 py-0.5 bg-blue-900 text-white text-xs font-questa-bold rounded mb-2">
                                                    15% OFF
                                                </span>
                                                <h3 className="text-base font-questa-bold text-gray-900 mb-1">Restaurantes Parceiros</h3>
                                                <p className="text-xs text-gray-600 font-questa-regular">Válido em todos os restaurantes da rede</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl ml-3 flex-shrink-0">
                                                🍽️
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-3 mb-3">
                                            <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
                                                <code className="text-sm font-questa-bold text-gray-900">RESTAURANTE15</code>
                                                <button className="text-gray-500 hover:text-blue-900">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <button className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                            Usar Cupom
                                        </button>
                                        <p className="text-xs text-gray-400 font-questa-regular mt-2 text-center">Válido até 30/11/2025</p>
                                    </div>

                                    {/* Cupom 2 */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <span className="inline-block px-2 py-0.5 bg-gray-900 text-white text-xs font-questa-bold rounded mb-2">
                                                    VOUCHER
                                                </span>
                                                <h3 className="text-base font-questa-bold text-gray-900 mb-1">Jantar Especial</h3>
                                                <p className="text-xs text-gray-600 font-questa-regular">Experiência para 2 pessoas</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl ml-3 flex-shrink-0">
                                                🎁
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-3 mb-3">
                                            <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
                                                <code className="text-sm font-questa-bold text-gray-900">GORMIR2X</code>
                                                <button className="text-gray-500 hover:text-blue-900">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <button className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                            Usar Cupom
                                        </button>
                                        <p className="text-xs text-gray-400 font-questa-regular mt-2 text-center">Válido até 25/11/2025</p>
                                    </div>

                                    {/* Cupom 3 */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <span className="inline-block px-2 py-0.5 bg-blue-900 text-white text-xs font-questa-bold rounded mb-2">
                                                    15% OFF
                                                </span>
                                                <h3 className="text-base font-questa-bold text-gray-900 mb-1">Aluguel de Carro</h3>
                                                <p className="text-xs text-gray-600 font-questa-regular">Desconto com locadoras parceiras</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl ml-3 flex-shrink-0">
                                                🚗
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-3 mb-3">
                                            <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
                                                <code className="text-sm font-questa-bold text-gray-900">CARRO15</code>
                                                <button className="text-gray-500 hover:text-blue-900">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <button className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                            Usar Cupom
                                        </button>
                                        <p className="text-xs text-gray-400 font-questa-regular mt-2 text-center">Válido por 7 dias</p>
                                    </div>

                                    {/* Cupom 4 */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <span className="inline-block px-2 py-0.5 bg-gray-900 text-white text-xs font-questa-bold rounded mb-2">
                                                    GRÁTIS
                                                </span>
                                                <h3 className="text-base font-questa-bold text-gray-900 mb-1">Academia 1 Dia</h3>
                                                <p className="text-xs text-gray-600 font-questa-regular">Acesso cortesia à academia</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl ml-3 flex-shrink-0">
                                                🏋️
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-3 mb-3">
                                            <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-2">
                                                <code className="text-sm font-questa-bold text-gray-900">GYM1DAY</code>
                                                <button className="text-gray-500 hover:text-blue-900">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <button className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors">
                                            Usar Cupom
                                        </button>
                                        <p className="text-xs text-gray-400 font-questa-regular mt-2 text-center">Válido até 20/11/2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conectividade */}
                {
                    activeTab === 'conectividade' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-questa-bold text-gray-900">Conectividade Predial</h2>
                                    <p className="text-sm text-gray-500 font-questa-regular mt-1">Gestão completa da sua experiência no edifício</p>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Controle de Visitantes */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    👥
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-questa-bold text-gray-900 mb-1">Controle de Visitantes</h3>
                                                    <p className="text-xs text-gray-600 font-questa-regular">Autorize e gerencie acessos de visitantes</p>
                                                </div>
                                            </div>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Gerenciar
                                            </button>
                                        </div>

                                        {/* Comunicação com Portaria */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    💬
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-questa-bold text-gray-900 mb-1">Comunicação com Portaria</h3>
                                                    <p className="text-xs text-gray-600 font-questa-regular">Chat direto com a portaria do edifício</p>
                                                </div>
                                            </div>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Abrir Chat
                                            </button>
                                        </div>

                                        {/* Controle de Encomendas */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    📦
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-questa-bold text-gray-900 mb-1">Controle de Encomendas</h3>
                                                    <p className="text-xs text-gray-600 font-questa-regular">2 encomendas aguardando retirada</p>
                                                </div>
                                            </div>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Ver Todas
                                            </button>
                                        </div>

                                        {/* Controle de Fechaduras */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    🔐
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-questa-bold text-gray-900 mb-1">Controle de Fechaduras</h3>
                                                    <p className="text-xs text-gray-600 font-questa-regular">Gestão digital da maçaneta/fechadura</p>
                                                </div>
                                            </div>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors mb-2">
                                                🔓 Abrir Porta
                                            </button>
                                            <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-questa-medium hover:bg-gray-50 transition-colors">
                                                Histórico de Acesso
                                            </button>
                                        </div>

                                        {/* Reserva de Áreas Comuns */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    🏢
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-questa-bold text-gray-900 mb-1">Reservas de Áreas Comuns</h3>
                                                    <p className="text-xs text-gray-600 font-questa-regular">Piscina, academia, salão de festas e mais</p>
                                                </div>
                                            </div>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Ver Disponibilidade
                                            </button>
                                        </div>

                                        {/* Regras do Condomínio */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                                                    📋
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-questa-bold text-gray-900 mb-1">Regras do Condomínio</h3>
                                                    <p className="text-xs text-gray-600 font-questa-regular">Acesso às regras do prédio</p>
                                                </div>
                                            </div>
                                            <button className="w-full px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                Ver Documentos
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Meu Perfil */}
                {activeTab === 'meu-perfil' && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-questa-bold text-gray-900">Meu Perfil</h2>
                                <p className="text-sm text-gray-500 font-questa-regular mt-1">Gerencie suas informações pessoais e documentos</p>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Foto de Perfil */}
                                <div>
                                    <h3 className="text-base font-questa-bold text-gray-900 mb-4">Foto de Perfil</h3>
                                    <p className="text-sm text-gray-600 font-questa-regular mb-4">Necessária para check-in e identificação</p>

                                    <div className="flex items-start gap-6">
                                        <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <div className="text-center">
                                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <p className="text-xs text-gray-500 font-questa-regular">Sem foto</p>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-questa-medium hover:bg-blue-950 transition-colors flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Tirar Foto com Câmera
                                            </button>
                                            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <p className="text-xs text-gray-700 font-questa-regular flex items-start gap-2">
                                                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    <span>Por segurança, a foto deve ser tirada em tempo real pela câmera para garantir sua identidade no check-in.</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dados Pessoais */}
                                <div>
                                    <h3 className="text-base font-questa-bold text-gray-900 mb-4">Dados Pessoais</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Nome Completo *</label>
                                            <input
                                                type="text"
                                                placeholder="Digite seu nome completo"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">CPF *</label>
                                            <input
                                                type="text"
                                                placeholder="000.000.000-00"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Data de Nascimento *</label>
                                            <input
                                                type="date"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Telefone *</label>
                                            <input
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">E-mail *</label>
                                            <input
                                                type="email"
                                                placeholder="seu@email.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Nacionalidade</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Brasileira"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Endereço */}
                                <div>
                                    <h3 className="text-base font-questa-bold text-gray-900 mb-4">Endereço</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">CEP *</label>
                                            <input
                                                type="text"
                                                placeholder="00000-000"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Rua *</label>
                                            <input
                                                type="text"
                                                placeholder="Nome da rua"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Número *</label>
                                            <input
                                                type="text"
                                                placeholder="Nº"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Complemento</label>
                                            <input
                                                type="text"
                                                placeholder="Apto, bloco, etc."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Bairro *</label>
                                            <input
                                                type="text"
                                                placeholder="Nome do bairro"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Cidade *</label>
                                            <input
                                                type="text"
                                                placeholder="Nome da cidade"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Estado *</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent">
                                                <option value="">Selecione</option>
                                                <option value="SP">São Paulo</option>
                                                <option value="RJ">Rio de Janeiro</option>
                                                <option value="MG">Minas Gerais</option>
                                                {/* Adicionar outros estados */}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">País *</label>
                                            <input
                                                type="text"
                                                placeholder="Brasil"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Informações Profissionais */}
                                <div>
                                    <h3 className="text-base font-questa-bold text-gray-900 mb-4">Informações Profissionais</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Empresa</label>
                                            <input
                                                type="text"
                                                placeholder="Nome da empresa"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">Cargo</label>
                                            <input
                                                type="text"
                                                placeholder="Seu cargo"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-questa-medium text-gray-700 mb-2">CNPJ da Empresa</label>
                                            <input
                                                type="text"
                                                placeholder="00.000.000/0000-00"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Forma de Pagamento */}
                                <div>
                                    <h3 className="text-base font-questa-bold text-gray-900 mb-4">Formas de Pagamento</h3>

                                    {/* Cartão de Crédito */}
                                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-questa-bold text-gray-900">Cartão de Crédito</h4>
                                            <button className="text-sm text-blue-900 font-questa-medium hover:text-blue-950">
                                                + Adicionar Cartão
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-questa-medium text-gray-700 mb-2">Número do Cartão</label>
                                                <input
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-questa-medium text-gray-700 mb-2">Nome no Cartão</label>
                                                <input
                                                    type="text"
                                                    placeholder="Como impresso no cartão"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-questa-medium text-gray-700 mb-2">CPF do Titular</label>
                                                <input
                                                    type="text"
                                                    placeholder="000.000.000-00"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-questa-medium text-gray-700 mb-2">Validade</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-questa-medium text-gray-700 mb-2">CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="000"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-questa-regular focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* PIX */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="pix" className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900" />
                                            <label htmlFor="pix" className="text-sm font-questa-medium text-gray-900">
                                                Aceito pagamento via PIX
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload de Documentos */}
                                <div>
                                    <h3 className="text-base font-questa-bold text-gray-900 mb-4">Documentos</h3>
                                    <p className="text-sm text-gray-600 font-questa-regular mb-4">
                                        Faça upload dos documentos necessários para check-in
                                    </p>

                                    <div className="space-y-4">
                                        {/* RG/CNH */}
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-questa-bold text-gray-900">RG ou CNH *</h4>
                                                    <p className="text-xs text-gray-500 font-questa-regular mt-1">Documento de identidade com foto</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-xs text-gray-500 font-questa-regular">Nenhum arquivo selecionado</p>
                                            </div>
                                        </div>

                                        {/* CPF */}
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-questa-bold text-gray-900">CPF *</h4>
                                                    <p className="text-xs text-gray-500 font-questa-regular mt-1">Cadastro de Pessoa Física</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-xs text-gray-500 font-questa-regular">Nenhum arquivo selecionado</p>
                                            </div>
                                        </div>

                                        {/* Comprovante de Residência */}
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h4 className="text-sm font-questa-bold text-gray-900">Comprovante de Residência</h4>
                                                    <p className="text-xs text-gray-500 font-questa-regular mt-1">Conta de luz, água ou telefone (últimos 3 meses)</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-questa-medium hover:bg-blue-950 transition-colors">
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-xs text-gray-500 font-questa-regular">Nenhum arquivo selecionado</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-xs text-gray-700 font-questa-regular flex items-start gap-2">
                                            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Formatos aceitos: PDF, JPG, PNG. Tamanho máximo por arquivo: 10MB. Todos os documentos são armazenados de forma segura e criptografada.</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="flex gap-4 pt-4 border-t border-gray-200">
                                    <button className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg font-questa-bold hover:bg-blue-950 transition-colors">
                                        Salvar Alterações
                                    </button>
                                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-questa-medium hover:bg-gray-50 transition-colors">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main >
        </div >
    );
}

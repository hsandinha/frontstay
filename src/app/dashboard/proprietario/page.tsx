'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ProprietarioDashboard() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-frontstay flex flex-col">
            <Header />

            <main className="flex-1 py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-questa-bold text-neutral-dark mb-2">
                                Painel do Proprietário 🏠
                            </h2>
                            <p className="text-neutral-medium font-questa-regular">
                                Gerencie suas propriedades e reservas
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 rounded-full border border-neutral-light text-neutral-dark hover:bg-white transition-all font-questa-medium"
                        >
                            Sair
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Imóveis Ativos</p>
                                    <p className="text-2xl font-questa-bold text-primary-teal">5</p>
                                </div>
                                <div className="text-4xl">🏘️</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Reservas Mês</p>
                                    <p className="text-2xl font-questa-bold text-primary-teal">12</p>
                                </div>
                                <div className="text-4xl">📊</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Taxa Ocupação</p>
                                    <p className="text-2xl font-questa-bold text-primary-teal">78%</p>
                                </div>
                                <div className="text-4xl">📈</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Receita Mês</p>
                                    <p className="text-2xl font-questa-bold text-primary-teal">R$ 45k</p>
                                </div>
                                <div className="text-4xl">💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Ações Rápidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-support-green hover:bg-support-green/10 transition-all">
                                <div className="text-3xl mb-2">➕</div>
                                <div className="text-sm font-questa-medium">Novo Imóvel</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-support-green hover:bg-support-green/10 transition-all">
                                <div className="text-3xl mb-2">🏠</div>
                                <div className="text-sm font-questa-medium">Meus Imóveis</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-support-green hover:bg-support-green/10 transition-all">
                                <div className="text-3xl mb-2">📅</div>
                                <div className="text-sm font-questa-medium">Calendário</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-support-green hover:bg-support-green/10 transition-all">
                                <div className="text-3xl mb-2">📊</div>
                                <div className="text-sm font-questa-medium">Relatórios</div>
                            </button>
                        </div>
                    </div>

                    {/* Properties List */}
                    <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6">
                        <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Minhas Propriedades</h3>
                        <div className="space-y-4">
                            <div className="border border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-questa-bold text-neutral-dark">Apartamento Vista Mar</h4>
                                        <p className="text-sm text-neutral-medium font-questa-regular mt-1">Copacabana, Rio de Janeiro</p>
                                        <div className="flex space-x-4 mt-2">
                                            <span className="text-xs text-neutral-medium">🛏️ 3 quartos</span>
                                            <span className="text-xs text-neutral-medium">🛁 2 banheiros</span>
                                            <span className="text-xs text-neutral-medium">👥 6 hóspedes</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-questa-bold text-support-green">R$ 450/noite</p>
                                        <span className="text-xs px-2 py-1 bg-support-green/20 text-support-green rounded-full font-questa-medium">
                                            Ativo
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-questa-bold text-neutral-dark">Casa na Praia</h4>
                                        <p className="text-sm text-neutral-medium font-questa-regular mt-1">Búzios, Rio de Janeiro</p>
                                        <div className="flex space-x-4 mt-2">
                                            <span className="text-xs text-neutral-medium">🛏️ 4 quartos</span>
                                            <span className="text-xs text-neutral-medium">🛁 3 banheiros</span>
                                            <span className="text-xs text-neutral-medium">👥 8 hóspedes</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-questa-bold text-support-green">R$ 800/noite</p>
                                        <span className="text-xs px-2 py-1 bg-support-green/20 text-support-green rounded-full font-questa-medium">
                                            Ativo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

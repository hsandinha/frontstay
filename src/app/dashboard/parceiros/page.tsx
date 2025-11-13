'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ParceirosDashboard() {
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
                                Portal de Parceiros 🤝
                            </h2>
                            <p className="text-neutral-medium font-questa-regular">
                                Gerencie seus serviços e oportunidades
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
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Serviços Ativos</p>
                                    <p className="text-2xl font-questa-bold text-accent-orange">8</p>
                                </div>
                                <div className="text-4xl">🛠️</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Solicitações</p>
                                    <p className="text-2xl font-questa-bold text-accent-orange">24</p>
                                </div>
                                <div className="text-4xl">📋</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Avaliação</p>
                                    <p className="text-2xl font-questa-bold text-accent-orange">4.8 ⭐</p>
                                </div>
                                <div className="text-4xl">🌟</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Receita Mês</p>
                                    <p className="text-2xl font-questa-bold text-accent-orange">R$ 18k</p>
                                </div>
                                <div className="text-4xl">💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Ações Rápidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-accent-orange hover:bg-accent-orange/10 transition-all">
                                <div className="text-3xl mb-2">➕</div>
                                <div className="text-sm font-questa-medium">Novo Serviço</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-accent-orange hover:bg-accent-orange/10 transition-all">
                                <div className="text-3xl mb-2">📋</div>
                                <div className="text-sm font-questa-medium">Solicitações</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-accent-orange hover:bg-accent-orange/10 transition-all">
                                <div className="text-3xl mb-2">📊</div>
                                <div className="text-sm font-questa-medium">Relatórios</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-accent-orange hover:bg-accent-orange/10 transition-all">
                                <div className="text-3xl mb-2">💬</div>
                                <div className="text-sm font-questa-medium">Mensagens</div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Services */}
                        <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6">
                            <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Meus Serviços</h3>
                            <div className="space-y-4">
                                <div className="border border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-questa-bold text-neutral-dark">Limpeza Profissional</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular mt-1">Limpeza completa de imóveis</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-questa-bold text-accent-orange">R$ 200</p>
                                            <span className="text-xs px-2 py-1 bg-support-green/20 text-support-green rounded-full font-questa-medium">
                                                Ativo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-questa-bold text-neutral-dark">Manutenção Elétrica</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular mt-1">Serviços elétricos em geral</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-questa-bold text-accent-orange">R$ 150</p>
                                            <span className="text-xs px-2 py-1 bg-support-green/20 text-support-green rounded-full font-questa-medium">
                                                Ativo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-questa-bold text-neutral-dark">Check-in/Check-out</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular mt-1">Recepção de hóspedes</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-questa-bold text-accent-orange">R$ 80</p>
                                            <span className="text-xs px-2 py-1 bg-support-green/20 text-support-green rounded-full font-questa-medium">
                                                Ativo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Requests */}
                        <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6">
                            <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Solicitações Recentes</h3>
                            <div className="space-y-4">
                                <div className="border-l-4 border-support-green pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-questa-bold text-neutral-dark">Limpeza - Apt 301</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular">15 Nov 2025 • 10:00</p>
                                        </div>
                                        <span className="px-3 py-1 bg-support-green/20 text-support-green text-xs rounded-full font-questa-medium">
                                            Aceito
                                        </span>
                                    </div>
                                </div>
                                <div className="border-l-4 border-accent-orange pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-questa-bold text-neutral-dark">Manutenção - Casa 5</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular">16 Nov 2025 • 14:00</p>
                                        </div>
                                        <span className="px-3 py-1 bg-accent-orange/20 text-accent-orange text-xs rounded-full font-questa-medium">
                                            Pendente
                                        </span>
                                    </div>
                                </div>
                                <div className="border-l-4 border-accent-orange pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-questa-bold text-neutral-dark">Check-in - Apt 102</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular">17 Nov 2025 • 15:00</p>
                                        </div>
                                        <span className="px-3 py-1 bg-accent-orange/20 text-accent-orange text-xs rounded-full font-questa-medium">
                                            Pendente
                                        </span>
                                    </div>
                                </div>
                                <div className="border-l-4 border-support-blue pl-4 py-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-questa-bold text-neutral-dark">Limpeza - Apt 205</h4>
                                            <p className="text-sm text-neutral-medium font-questa-regular">12 Nov 2025 • 09:00</p>
                                        </div>
                                        <span className="px-3 py-1 bg-support-blue/20 text-support-blue text-xs rounded-full font-questa-medium">
                                            Concluído
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

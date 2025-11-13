'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AdministradorDashboard() {
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
                                Painel Administrativo ⚙️
                            </h2>
                            <p className="text-neutral-medium font-questa-regular">
                                Visão geral e gestão completa da plataforma
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
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Total Usuários</p>
                                    <p className="text-2xl font-questa-bold text-secondary-purple">1.248</p>
                                </div>
                                <div className="text-4xl">👥</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Total Imóveis</p>
                                    <p className="text-2xl font-questa-bold text-secondary-purple">342</p>
                                </div>
                                <div className="text-4xl">🏘️</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Reservas Ativas</p>
                                    <p className="text-2xl font-questa-bold text-secondary-purple">89</p>
                                </div>
                                <div className="text-4xl">📅</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-neutral-medium font-questa-regular mb-1">Receita Total</p>
                                    <p className="text-2xl font-questa-bold text-secondary-purple">R$ 890k</p>
                                </div>
                                <div className="text-4xl">💰</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6 mb-8">
                        <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Gestão do Sistema</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-secondary-purple hover:bg-secondary-purple/10 transition-all">
                                <div className="text-3xl mb-2">👥</div>
                                <div className="text-sm font-questa-medium">Usuários</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-secondary-purple hover:bg-secondary-purple/10 transition-all">
                                <div className="text-3xl mb-2">🏠</div>
                                <div className="text-sm font-questa-medium">Imóveis</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-secondary-purple hover:bg-secondary-purple/10 transition-all">
                                <div className="text-3xl mb-2">📊</div>
                                <div className="text-sm font-questa-medium">Relatórios</div>
                            </button>
                            <button className="p-4 border-2 border-neutral-light rounded-tl-lg rounded-tr-lg rounded-br-3xl rounded-bl-lg hover:border-secondary-purple hover:bg-secondary-purple/10 transition-all">
                                <div className="text-3xl mb-2">⚙️</div>
                                <div className="text-sm font-questa-medium">Configurações</div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6">
                            <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Atividades Recentes</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">✅</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-questa-medium text-neutral-dark">Nova propriedade aprovada</p>
                                        <p className="text-xs text-neutral-medium font-questa-regular">há 5 minutos</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">👤</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-questa-medium text-neutral-dark">Novo usuário cadastrado</p>
                                        <p className="text-xs text-neutral-medium font-questa-regular">há 15 minutos</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">💳</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-questa-medium text-neutral-dark">Pagamento processado</p>
                                        <p className="text-xs text-neutral-medium font-questa-regular">há 30 minutos</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">⚠️</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-questa-medium text-neutral-dark">Suporte solicitado</p>
                                        <p className="text-xs text-neutral-medium font-questa-regular">há 1 hora</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-white rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl shadow-sm p-6">
                            <h3 className="text-xl font-questa-bold text-neutral-dark mb-4">Pendências</h3>
                            <div className="space-y-4">
                                <div className="border-l-4 border-accent-orange pl-4 py-2">
                                    <p className="text-sm font-questa-medium text-neutral-dark">3 imóveis aguardando aprovação</p>
                                    <button className="text-xs text-primary-teal hover:text-primary-teal-dark mt-1 font-questa-medium">
                                        Revisar →
                                    </button>
                                </div>
                                <div className="border-l-4 border-support-pink pl-4 py-2">
                                    <p className="text-sm font-questa-medium text-neutral-dark">2 denúncias para avaliar</p>
                                    <button className="text-xs text-primary-teal hover:text-primary-teal-dark mt-1 font-questa-medium">
                                        Ver detalhes →
                                    </button>
                                </div>
                                <div className="border-l-4 border-support-blue pl-4 py-2">
                                    <p className="text-sm font-questa-medium text-neutral-dark">5 solicitações de suporte</p>
                                    <button className="text-xs text-primary-teal hover:text-primary-teal-dark mt-1 font-questa-medium">
                                        Atender →
                                    </button>
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserRole } from '@/types/user';

export default function LoginPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole>('hospede');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const roles = [
        { value: 'hospede' as UserRole, label: 'Hóspede', icon: '🏨' },
        { value: 'proprietario' as UserRole, label: 'Proprietário', icon: '🏠' },
        { value: 'administrador' as UserRole, label: 'Administrador', icon: '⚙️' },
        { value: 'parceiros' as UserRole, label: 'Parceiros', icon: '🤝' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulação de login - substituir por autenticação real
        setTimeout(() => {
            // Redirecionar para o dashboard específico do perfil
            router.push(`/dashboard/${selectedRole}`);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex">
            {/* Lado Esquerdo - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#2a3648] text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Padrão geométrico de fundo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-60 h-60 border-4 border-[#E67E22] transform rotate-45"></div>
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-teal rounded-full"></div>
                </div>

                <div className="relative z-10 text-center">
                    {/* Logo */}
                    <div className="mb-12 flex justify-center">
                        <Image
                            src="/logo.png"
                            alt="FrontStay Logo"
                            width={180}
                            height={180}
                            className="object-contain"
                        />
                    </div>

                    {/* Título estilo "gestão by Front Stay" */}
                    <h1 className="flex flex-col leading-tight mb-8">
                        <span className="great-vibes-regular text-[#E67E22] text-7xl">gestão</span>
                        <span className="text-5xl font-light -mt-4">by Front Stay</span>
                    </h1>

                    {/* Linha decorativa */}
                    <div className="border-t-2 border-gray-300 w-3/4 mx-auto my-8"></div>

                    {/* Subtítulo */}
                    <p className="text-xl font-questa-light max-w-md mx-auto">
                        Mais do que gestão: assinamos o estilo.
                    </p>

                    <p className="text-base font-questa-regular text-gray-300 mt-6 max-w-lg mx-auto">
                        Acesse sua área exclusiva e gerencie suas reservas, propriedades e serviços com a qualidade FrontStay.
                    </p>
                </div>
            </div>

            {/* Lado Direito - Formulário de Login */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                    {/* Logo mobile */}
                    <div className="lg:hidden text-center mb-8">
                        <Image
                            src="/logo.png"
                            alt="FrontStay Logo"
                            width={120}
                            height={120}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-questa-bold text-neutral-dark">Área do Cliente</h2>
                    </div>

                    {/* Título */}
                    <h2 className="text-3xl font-questa-bold text-neutral-dark mb-2">
                        Fazer Login
                    </h2>
                    <p className="text-neutral-medium font-questa-regular mb-8">
                        Acesse sua conta FrontStay
                    </p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Seleção de Perfil */}
                        <div>
                            <label className="block text-sm font-questa-medium text-neutral-dark mb-3">
                                Selecione seu perfil
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setSelectedRole(role.value)}
                                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${selectedRole === role.value
                                            ? 'border-primary-teal bg-primary-teal/10 shadow-md'
                                            : 'border-neutral-light hover:border-primary-teal/50 hover:bg-neutral-lighter'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{role.icon}</div>
                                        <div className="text-sm font-questa-medium text-neutral-dark">
                                            {role.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-questa-medium text-neutral-dark mb-2"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary-teal focus:border-transparent outline-none transition-all font-questa-regular"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {/* Senha */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-questa-medium text-neutral-dark mb-2"
                            >
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-neutral-light focus:ring-2 focus:ring-primary-teal focus:border-transparent outline-none transition-all font-questa-regular"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Lembrar-me e Esqueci a senha */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-neutral-light text-primary-teal focus:ring-primary-teal"
                                />
                                <span className="ml-2 text-neutral-dark font-questa-regular">Lembrar-me</span>
                            </label>
                            <a
                                href="#"
                                className="text-primary-teal hover:text-primary-teal-dark font-questa-medium"
                            >
                                Esqueci a senha
                            </a>
                        </div>

                        {/* Botão de Login */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-support-green hover:bg-support-green/90 text-white font-questa-bold py-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Link de Cadastro */}
                    <div className="mt-8 text-center text-sm text-neutral-medium font-questa-regular">
                        Não tem uma conta?{' '}
                        <a
                            href="#"
                            className="text-primary-teal hover:text-primary-teal-dark font-questa-medium"
                        >
                            Cadastre-se
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

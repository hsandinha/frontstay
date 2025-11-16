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
    const [showPassword, setShowPassword] = useState(false);

    const roles = [
        { value: 'hospede' as UserRole, label: 'Hóspede' },
        { value: 'proprietario' as UserRole, label: 'Proprietário' },
        { value: 'administrador' as UserRole, label: 'Administrador' },
        { value: 'parceiros' as UserRole, label: 'Parceiros' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            router.push(`/dashboard/${selectedRole}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex overflow-hidden relative">
            {/* Background Image - Full Screen */}
            <div className="absolute inset-0">
                <Image
                    src="/esopo.png"
                    alt="Background"
                    fill
                    className="object-contain object-right"
                    priority
                />
                {/* Gradient Overlay - Smooth transition from black to transparent */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 via-slate-950/90 via-slate-950/70 via-slate-900/50 via-slate-900/30 to-transparent"></div>
            </div>

            {/* Login Form - Positioned on the left */}
            <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/logo2.png"
                            alt="FrontStay Logo"
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                    </div>

                    <div className="mb-8">
                        <h1 className="text-white text-3xl font-bold mb-2 text-center">Faça seu login.</h1>
                        <p className="text-slate-400 text-center text-sm">Acesse sua conta FrontStay</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-slate-200 text-sm mb-2 font-medium">Perfil</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value} className="bg-slate-900">
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-200 text-sm mb-2 font-medium">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Digite seu e-mail"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-200 text-sm mb-2 font-medium">Senha</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Digite sua senha"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-slate-800"
                                />
                                <span className="ml-2 text-slate-300 text-sm">Lembrar-me</span>
                            </label>
                            <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors">
                                Esqueci a senha
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                'ENTRAR'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Ainda não possui uma conta?{' '}
                            <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                                Cadastre-se
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserRole } from '@/types/user';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole>('hospede');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Register form states
    const [registerData, setRegisterData] = useState({
        role: 'hospede' as UserRole,
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [authFeedback, setAuthFeedback] = useState('');
    const [authFeedbackTone, setAuthFeedbackTone] = useState<'neutral' | 'success' | 'error'>('neutral');

    const roles = [
        { value: 'hospede' as UserRole, label: 'Hóspede' },
        { value: 'proprietario' as UserRole, label: 'Proprietário' },
        { value: 'administrador' as UserRole, label: 'Administrador' },
        { value: 'parceiros' as UserRole, label: 'Parceiros' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthFeedback('');
        setAuthFeedbackTone('neutral');

        if (selectedRole !== 'hospede') {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    setIsLoading(false);
                    setAuthFeedback(error.message === 'Invalid login credentials'
                        ? 'Email ou senha incorretos.'
                        : error.message);
                    setAuthFeedbackTone('error');
                    return;
                }

                setAuthFeedback('Login realizado com sucesso!');
                setAuthFeedbackTone('success');

                setTimeout(() => {
                    router.push(`/dashboard/${selectedRole}`);
                }, 500);
            } catch (err: any) {
                setIsLoading(false);
                setAuthFeedback(err.message || 'Erro ao fazer login.');
                setAuthFeedbackTone('error');
            }
            return;
        }

        try {
            const response = await fetch('/api/guest-portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email,
                }),
            });

            const payload = await response.json();

            if (!response.ok || !payload?.success) {
                throw new Error(payload?.error || 'Não foi possível acessar o painel do hóspede.');
            }

            if (typeof window !== 'undefined') {
                window.localStorage.setItem('frontstay-guest-session', JSON.stringify({
                    email,
                    name: payload?.guest?.name || '',
                }));
            }

            setAuthFeedback('Acesso liberado. Carregando seu painel...');
            setAuthFeedbackTone('success');

            setTimeout(() => {
                router.push(`/dashboard/hospede?email=${encodeURIComponent(email)}`);
            }, 700);
        } catch (error: any) {
            setIsLoading(false);
            setAuthFeedback(error?.message || 'Não foi possível acessar o painel do hóspede.');
            setAuthFeedbackTone('error');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            setAuthFeedback('As senhas não coincidem.');
            setAuthFeedbackTone('error');
            return;
        }

        setIsLoading(true);
        setAuthFeedback('');
        setAuthFeedbackTone('neutral');

        try {
            if (registerData.role === 'hospede') {
                const fullName = registerData.name.trim();
                const [firstName = '', ...rest] = fullName.split(/\s+/);
                const lastName = rest.join(' ');

                const response = await fetch('/api/guest-portal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'register',
                        name: fullName,
                        firstName,
                        lastName,
                        email: registerData.email,
                        phone: registerData.phone,
                    }),
                });

                const payload = await response.json();

                if (!response.ok || !payload?.success) {
                    throw new Error(payload?.error || 'Não foi possível concluir o cadastro.');
                }

                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('frontstay-guest-session', JSON.stringify({
                        email: registerData.email,
                        name: payload?.guest?.name || fullName,
                    }));
                }

                setEmail(registerData.email);
                setSelectedRole('hospede');
                setPassword('');
                setShowRegisterModal(false);
                setAuthFeedback('Cadastro compartilhado criado com sucesso. Redirecionando para o seu painel...');
                setAuthFeedbackTone('success');
                setIsLoading(false);

                setTimeout(() => {
                    router.push(`/dashboard/hospede?email=${encodeURIComponent(registerData.email)}`);
                }, 900);
                return;
            }

            setShowRegisterModal(false);
            setAuthFeedback('Cadastro realizado com sucesso!');
            setAuthFeedbackTone('success');
        } catch (error: any) {
            setAuthFeedback(error?.message || 'Não foi possível concluir o cadastro.');
            setAuthFeedbackTone('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-frontstay relative overflow-hidden px-4 py-8">
            {/* Subtle Geometric Background Pattern */}
            <div className="absolute inset-0 bg-geometric-pattern opacity-40 pointer-events-none"></div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-questa-medium transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Voltar ao Site
                </button>
            </div>

            {/* Main Login Card */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-glass border border-gray-100 p-8 md:p-10 transform transition-all duration-500 hover:shadow-card-hover">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/logo.png"
                        alt="FrontStay Logo"
                        width={180}
                        height={72}
                        className="object-contain h-14 w-auto"
                        priority
                    />
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-gray-900 text-3xl font-questa-bold mb-2">Acesse sua conta</h1>
                    <p className="text-gray-500 text-sm font-questa-regular">Faça login para gerenciar suas estadias ou imóveis.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Perfil de Acesso</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-2 font-questa-medium">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                            placeholder="Digite seu e-mail"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                                placeholder="Digite sua senha"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
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
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-primary-teal focus:ring-primary-teal bg-white transition-colors cursor-pointer"
                            />
                            <span className="ml-2 text-gray-500 font-questa-regular text-sm group-hover:text-gray-700 transition-colors">Lembrar-me</span>
                        </label>
                        <a href="#" className="text-primary-teal hover:text-primary-teal-dark font-questa-medium text-sm transition-colors decoration-2 hover:underline underline-offset-4">
                            Esqueci a senha
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-primary hover:bg-gradient-to-r hover:from-primary-teal-dark hover:to-secondary-purple-dark text-white font-questa-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Autenticando...
                            </span>
                        ) : (
                            'ENTRAR'
                        )}
                    </button>

                    {authFeedback ? (
                        <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-questa-medium animate-fade-in-up ${authFeedbackTone === 'success' ? 'border-support-green/20 bg-support-green/10 text-support-green' : authFeedbackTone === 'error' ? 'border-accent-orange/20 bg-accent-orange/10 text-accent-orange-dark' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                            {authFeedback}
                        </div>
                    ) : null}
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-gray-500 text-sm font-questa-regular">
                        Ainda não possui uma conta?{' '}
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            className="text-primary-teal hover:text-primary-teal-dark font-questa-bold transition-colors decoration-2 hover:underline underline-offset-4"
                        >
                            Cadastre-se
                        </button>
                    </p>
                </div>
            </div>

            {/* Register Modal - Light Theme */}
            {showRegisterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-6 md:p-8 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-questa-bold text-gray-900">Criar Nova Conta</h2>
                                <p className="text-gray-500 text-sm mt-1 font-questa-regular">Preencha os dados abaixo e junte-se à FrontStay.</p>
                            </div>
                            <button
                                onClick={() => setShowRegisterModal(false)}
                                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleRegister} className="p-6 md:p-8 space-y-6">
                            {/* Role Selection */}
                            <div>
                                <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Tipo de Usuário</label>
                                <select
                                    value={registerData.role}
                                    onChange={(e) => setRegisterData({ ...registerData, role: e.target.value as UserRole })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                                        placeholder="Ex: João da Silva"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Telefone/WhatsApp</label>
                                    <input
                                        type="tel"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 text-sm mb-2 font-questa-medium">E-mail</label>
                                <input
                                    type="email"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password */}
                                <div>
                                    <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showRegisterPassword ? 'text' : 'password'}
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                                            placeholder="Mín. 6 caracteres"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showRegisterPassword ? (
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

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-gray-700 text-sm mb-2 font-questa-medium">Confirmar Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={registerData.confirmPassword}
                                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 font-questa-regular focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-primary-teal transition-all shadow-sm"
                                            placeholder="Repita a senha"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
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
                            </div>

                            {/* Terms */}
                            <div className="flex items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <input
                                    type="checkbox"
                                    required
                                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary-teal focus:ring-primary-teal bg-white cursor-pointer"
                                />
                                <label className="ml-3 text-gray-600 text-sm font-questa-regular">
                                    Concordo com os <a href="#" className="text-primary-teal font-questa-medium hover:underline">termos de uso</a> e a <a href="#" className="text-primary-teal font-questa-medium hover:underline">política de privacidade</a> da FrontStay.
                                </label>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterModal(false)}
                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-questa-bold py-3.5 rounded-xl transition-all duration-300 pointer"
                                >
                                    Voltar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] bg-gradient-primary hover:bg-gradient-to-r hover:from-primary-teal-dark hover:to-secondary-purple-dark text-white font-questa-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processando...
                                        </span>
                                    ) : (
                                        'CELEBRAR CADASTRO'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

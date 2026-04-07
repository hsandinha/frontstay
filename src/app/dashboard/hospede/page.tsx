import { Suspense } from 'react';
import HospedeDashboardClient from '@/app/components/HospedeDashboardClient';

export default function HospedeDashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 px-6 py-10 text-sm text-slate-500">Carregando painel do hóspede...</div>}>
            <HospedeDashboardClient />
        </Suspense>
    );
}

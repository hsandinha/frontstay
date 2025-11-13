'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-frontstay flex flex-col">
            <Header />
            <main className="flex-1 py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}

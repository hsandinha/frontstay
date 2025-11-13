'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchComponent from './components/SearchComponent';
import HeroBanner from './components/HeroBanner';
import PropertyCard from './components/PropertyCard';

const HomePage = () => {
    const router = useRouter();

    const propriedades = [
        {
            id: 1,
            nome: 'Iconye FrontStay Savassi',
            endereco: 'Rua Pernambuco, 1500, Savassi, Belo Horizonte',
            preco: 3470,
            precoTotal: 4470,
            imagem: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940',
            tipo: ''
        },
        {
            id: 2,
            nome: 'FrontStay Lourdes Premium',
            endereco: 'Av. Brasil, 2000, Lourdes, Belo Horizonte',
            preco: 4403,
            precoTotal: 5403,
            imagem: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940',
            tipo: ''
        },
        {
            id: 3,
            nome: 'FrontStay For You Funcionários',
            endereco: 'Rua dos Timbiras, 815, Funcionários, BH',
            preco: 2372,
            precoTotal: 3542,
            imagem: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940',
            tipo: ''
        },
        {
            id: 4,
            nome: 'Iconye FrontStay Belvedere',
            endereco: 'Rua Platina, 522, Belvedere, Belo Horizonte',
            preco: 5672,
            precoTotal: 8987,
            imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
            tipo: ''
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Banner com Carousel */}
            <HeroBanner />

            {/* Componente de Busca */}
            <section className="relative -mt-12 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <SearchComponent />
                </div>
            </section>

            {/* Grid de Propriedades */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {propriedades.map((prop) => (
                            <PropertyCard key={prop.id} property={prop} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;

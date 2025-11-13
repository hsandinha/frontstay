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
            nome: 'FrontStay Esopo',
            endereco: 'Alameda Flamboiant, 285 - Vale do Sereno, Nova Lima - MG',
            preco: 420,
            imagem: 'esopo.png',

        },
        {
            id: 2,
            nome: 'FrontStay City Design',
            endereco: 'Rua Tenente Brito Melo - Barro Preto, Belo Horizonte - MG',
            preco: 360,
            imagem: 'citydesign.png',

        },
        {
            id: 3,
            nome: 'FrontStay Ágora',
            endereco: 'Rua dos Timbiras, 815, Funcionários, BH',
            preco: 2372,
            imagem: 'agora.jpg',

        },
        {
            id: 4,
            nome: 'FrontStay Icon',
            endereco: 'Rua Platina, 522, Belvedere, Belo Horizonte',
            preco: 5672,
            imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
        },
        {
            id: 5,
            nome: 'FrontStay Prodomo',
            endereco: 'Rua Platina, 522, Belvedere, Belo Horizonte',
            preco: 5672,
            imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
        },
        {
            id: 6,
            nome: 'FrontStay Funcionarios',
            endereco: 'Rua Platina, 522, Belvedere, Belo Horizonte',
            preco: 5672,
            imagem: 'funcionarios.jpeg',
        },
        {
            id: 7,
            nome: 'FrontStay Centro',
            endereco: 'Rua Platina, 522, Belvedere, Belo Horizonte',
            preco: 5672,
            imagem: 'centro.jpeg',
        }

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

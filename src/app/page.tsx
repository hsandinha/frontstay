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
            nome: 'FrontStay Esopo Vale do Sereno',
            endereco: 'Alameda Flamboiant, 285 - Vale do Sereno, Nova Lima - MG',
            preco: 400,
            imagem: 'esopo.png',

        },
        {
            id: 2,
            nome: 'FrontStay City Santo Agostinho',
            endereco: 'Rua Tenente Brito Melo, 1383 - Santo Agostinho, Belo Horizonte - MG',
            preco: 400,
            imagem: 'citydesign.png',

        },
        {
            id: 3,
            nome: 'FrontStay Ágora Expominas',
            endereco: 'Rua Herculano pena, 806 - Nova Suíça, Belo Horizonte - MG',
            preco: 400,
            imagem: 'agora.jpg',

        },
        {
            id: 4,
            nome: 'FrontStay Icon Centro',
            endereco: 'Rua Goitacazes - Centro, Belo Horizonte - MG',
            preco: 400,
            imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
        },
        {
            id: 5,
            nome: 'FrontStay Prodomo Barro Preto',
            endereco: 'Av. Barbacena, 70 - Barro Preto, Belo Horizonte - MG',
            preco: 400,
            imagem: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940',
        },
        {
            id: 6,
            nome: 'FrontStay Savassi',
            endereco: 'Rua Pernambuco 284 - Savassi, Belo Horizonte - MG',
            preco: 400,
            imagem: 'funcionarios.jpeg',
        },
        {
            id: 7,
            nome: 'FrontStay Shopping Cidade',
            endereco: 'Rua São Paulo, 957 - Centro, Belo Horizonte - MG',
            preco: 400,
            imagem: 'centro.jpeg',
        },
        {
            id: 8,
            nome: 'FrontStay Lourdes',
            endereco: 'Rua professor Antonio Aleixo, 465 - Lourdes, Belo Horizonte - MG',
            preco: 400,
            imagem: 'lourdes.jpeg',
        }

    ];

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Banner com Carousel */}
            <HeroBanner />

            {/* Componente de Busca */}
            <section className="relative -mt-12 pb-4">
                <div className="max-w-7xl mx-auto px-6">
                    <SearchComponent />
                </div>
            </section>

            {/* Grid de Propriedades */}
            <section className="pt-8 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

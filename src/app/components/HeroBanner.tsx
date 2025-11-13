'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: '/foto1.jpg',
            fallback: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2940',
            title: 'Front Stay: moradia inteligente com',
            subtitle: 'acolhimento e confiabilidade mineira',
            description: 'Studios e apartamentos em BH e Nova Lima com gestão profissional e a design by Front Stay.'
        },
        {
            image: '/foto2.jpg',
            fallback: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2940',
            title: 'Front Stay: moradia inteligente com',
            subtitle: 'acolhimento e confiabilidade mineira',
            description: 'Studios e apartamentos em BH e Nova Lima com gestão profissional e a design by Front Stay.'
        },
        {
            image: '/foto3.jpg',
            fallback: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2940',
            title: 'Front Stay: moradia inteligente com',
            subtitle: 'acolhimento e confiabilidade mineira',
            description: 'Studios e apartamentos em BH e Nova Lima com gestão profissional e a design by Front Stay.'
        },
        {
            image: '/foto4.jpg',
            fallback: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2940',
            title: 'Front Stay: moradia inteligente com',
            subtitle: 'acolhimento e confiabilidade mineira',
            description: 'Studios e apartamentos em BH e Nova Lima com gestão profissional e a design by Front Stay.'
        }
    ];

    // Auto-play carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section className="relative pt-20 h-[150px] overflow-hidden">
            {/* OPÇÃO 1: Fundo Cinza (Teste) */}
            <div className="absolute inset-0 bg-gray-300"></div>

            {/* OPÇÃO 2: Background Images (Comentado para teste)
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-60' : 'opacity-0'
                        }`}
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slide.fallback})` }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            ))} 
            */}

            {/* Content - Apenas Logo */}
            <div className="relative z-10 h-full flex items-center justify-center -mt-14">
                <div className="text-center">
                    <Image
                        src="/logo.png"
                        alt="FrontStay"
                        width={280}
                        height={90}
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
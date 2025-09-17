"use client";
import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940&auto=format&fit=crop",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-frontstay py-10 px-6">
      <div
        className="
          relative max-w-6xl mx-auto h-[380px] md:h-[380px] 
          overflow-hidden shadow-lg flex
          rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl
        "
      >
        {/* Imagem */}
        <img
          src={images[current]}
          alt="Front Stay Hero"
          className="w-full h-full object-cover transition-opacity duration-700"
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Conteúdo */}
        <div className="absolute inset-0 flex flex-col justify-center text-white px-8 md:px-16 lg:px-20">
          <h1 className="text-xl md:text-4xl font-light leading-snug max-w-3xl">
            Front Stay: moradia inteligente com
            <br />
            <span className="font-bold">
              acolhimento e confiabilidade mineira
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg max-w-md text-gray-200">
            Studios e apartamentos em BH e Nova Lima com gestão profissional e a design by Front Stay.
          </p>

          <button className="mt-8 rounded-full px-8 py-4 text-base font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-transform duration-300 hover:scale-105 w-fit">
            Quero investir
          </button>
        </div>

        {/* Dots centralizados */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full ${index === current ? "bg-emerald-600" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
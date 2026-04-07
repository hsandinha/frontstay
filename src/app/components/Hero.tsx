"use client";
import Image from 'next/image';
import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2940&auto=format&fit=crop",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-frontstay px-6 py-10">
      <div
        className="relative mx-auto flex h-[380px] max-w-6xl overflow-hidden rounded-bl-xl rounded-br-5xl rounded-tl-xl rounded-tr-xl shadow-lg"
      >
        <Image
          src={images[current]}
          alt="Front Stay Hero"
          fill
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="object-cover transition-opacity duration-700"
          priority={current === 0}
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-8 text-white md:px-16 lg:px-20">
          <h1 className="max-w-3xl text-xl font-light leading-snug md:text-4xl">
            Front Stay: moradia inteligente com
            <br />
            <span className="font-bold">
              acolhimento e confiabilidade mineira
            </span>
          </h1>

          <p className="mt-4 max-w-md text-base text-gray-200 md:text-lg">
            Studios e apartamentos em BH e Nova Lima com gestão profissional e a design by Front Stay.
          </p>

          <button className="mt-8 w-fit rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-emerald-700">
            Quero investir
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${index === current ? "bg-emerald-600" : "bg-gray-300"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
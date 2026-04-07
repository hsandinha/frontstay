"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const DesignByFront = () => {
  const images = [
    "/design1.jpeg",
    "/design2.jpeg",
    "/design3.jpeg",
    "/design4.jpeg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="bg-[#eae8e5] text-white">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#2a3648] px-8 py-16 md:px-12">
          <h3 className="flex flex-col leading-tight">
            <span className="great-vibes-regular text-6xl text-[#E67E22]">design</span>
            <span className="-mt-4 text-4xl font-light">by Front Stay</span>
          </h3>

          <div className="mt-6 w-3/4 self-start border-t-2 bg-gray-300"></div>

          <h1 className="mt-4 max-w-3xl text-xl leading-snug md:text-xl">
            Mais do que gestão: assinamos o estilo.
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-gray-200 md:text-base">
            Além de decorar e equipar as unidades sob gestão Front Stay, você também pode contratar&nbsp;
            <span className="font-medium text-[#E67E22]">
              o padrão de decoração Front para empreendimentos parceiros e investidores independentes.
            </span>
          </p>

          <p className="mt-4 text-sm leading-relaxed text-gray-200 md:text-base">
            Transformamos espaços em experiências únicas, sempre com a mesma identidade que une design, conforto e praticidade.
          </p>
        </div>

        <div className="relative min-h-[420px] w-full overflow-hidden rounded-br-5xl rounded-tr-xl">
          <Image
            src={images[current]}
            alt={`Design Front Stay ${current + 1}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-all duration-700 ease-in-out"
            priority={current === 0}
          />

          <div className="absolute bottom-6 flex w-full justify-center space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${current === index
                  ? "scale-110 bg-white"
                  : "bg-white/50 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignByFront;
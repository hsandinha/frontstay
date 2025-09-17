"use client";
import React, { useState, useEffect } from 'react';

const DesignByFront = () => {
  const images = [
    "/design1.jpeg",
    "/design2.jpeg",
    "/design3.jpeg",
    "/design4.jpeg",
  ];

  const [current, setCurrent] = useState(0);

  // Auto-play: troca de imagem a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); // 5000ms = 5 segundos

    return () => clearInterval(interval); // Limpa o interval quando o componente desmonta
  }, [images.length]);

  return (
    <section className="bg-[#eae8e5] text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">

        {/* Coluna Esquerda (quadrado azul) */}
        <div className="bg-[#2a3648] py-16 px-8 md:px-12 flex flex-col justify-center">
          {/* Título principal */}
          <h3 className="flex flex-col leading-tight">
            <span className="great-vibes-regular text-[#E67E22] text-6xl">design</span>
            <span className="text-4xl font-light -mt-4">by Front Stay</span>
          </h3>

          {/* Linha */}
          <div className="mt-6 border-t-2 bg-gray-300 w-3/4 self-start"></div>

          {/* Subtítulo */}
          <h1 className="text-xl md:text-xl leading-snug max-w-3xl mt-4">
            Mais do que gestão: assinamos o estilo.
          </h1>

          {/* Parágrafos */}
          <p className="mt-6 text-sm md:text-base leading-relaxed text-gray-200">
            Além de decorar e equipar as unidades sob gestão Front Stay, você também pode contratar&nbsp;
            <span className="text-[#E67E22] font-medium">
              o padrão de decoração Front para empreendimentos parceiros e investidores independentes.
            </span>
          </p>

          <p className="mt-4 text-sm md:text-base leading-relaxed text-gray-200">
            Transformamos espaços em experiências únicas, sempre com a mesma identidade que une design, conforto e praticidade.
          </p>
        </div>

        {/* Coluna Direita (Carrossel de Imagens) */}
        <div className="relative w-full h-full overflow-hidden rounded-tr-xl rounded-br-5xl">
          <img
            src={images[current]}
            alt={`Design Front Stay ${current + 1}`}
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
          />

          {/* Indicadores (4 bolinhas) */}
          <div className="absolute bottom-6 flex justify-center w-full space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${current === index
                  ? "bg-white scale-110"
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
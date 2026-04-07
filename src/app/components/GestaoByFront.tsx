import React from 'react';
import Image from 'next/image';

const DesignByFront = () => {
  return (
    <section className="bg-[#eae8e5] text-white">
      <div className="mx-auto grid max-w-7xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#2a3648] px-8 py-16 md:px-12">
          <h3 className="flex flex-col leading-tight">
            <span className="great-vibes-regular text-6xl text-[#E67E22]">gestão</span>
            <span className="-mt-4 text-4xl font-light">by Front Stay</span>
          </h3>

          <div className="mt-6 w-3/4 self-start border-t-2 bg-gray-300"></div>

          <h1 className="mt-4 max-w-3xl text-xl leading-snug md:text-xl">
            Mais do que gestão: assinamos o estilo.
          </h1>

          <p className="mt-6 text-sm leading-relaxed text-gray-200 md:text-base">
            Da precificação dinâmica à checagem de hóspedes, do enxoval padrão hotel ao aplicativo para investidores:
            a Front Stay cuida de cada detalhe.
          </p>

          <p className="mt-4 text-sm leading-relaxed md:text-base">
            <span className="font-medium text-[#E67E22]">
              Com nossa gestão profissional, o investidor tem rentabilidade e transparência, enquanto o hóspede
              desfruta de conforto e segurança.
            </span>
          </p>

          <p className="mt-4 text-sm leading-relaxed text-gray-200 md:text-base">
            Transformamos imóveis em negócios sólidos, da construção do projeto ao acolhimento mineiro.
          </p>
        </div>

        <div className="relative min-h-[420px]">
          <Image
            src="/gestao.webp"
            alt="Gestão by Front Stay"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-br-5xl rounded-tr-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default DesignByFront;
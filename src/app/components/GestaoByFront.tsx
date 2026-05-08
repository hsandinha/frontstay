import React from 'react';

const DesignByFront = () => {
  return (
    <section className="bg-[#eae8e5] text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2">

        {/* Coluna Esquerda (quadrado azul) */}
        <div className="bg-[#2a3648] py-16 px-8 md:px-12 flex flex-col justify-center">
          {/* Título principal */}
          <h3 className="flex flex-col leading-tight">
            <span className="great-vibes-regular text-[#E67E22] text-6xl">gestão</span>
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
            Da precificação dinâmica à checagem de hóspedes, do enxoval padrão hotel ao aplicativo para investidores:
            a Front Stay cuida de cada detalhe.
          </p>

          <p className="mt-4 text-sm md:text-base leading-relaxed">
            <span className="text-[#E67E22] font-medium">
              Com nossa gestão profissional, o investidor tem rentabilidade e transparência, enquanto o hóspede
              desfruta de conforto e segurança.
            </span>
          </p>

          <p className="mt-4 text-sm md:text-base leading-relaxed text-gray-200">
            Transformamos imóveis em negócios sólidos, da construção do projeto ao acolhimento mineiro.
          </p>
        </div>

        {/* Coluna Direita (Imagem) */}
        <div className="relative">
          <img
            src="/gestao.webp" // coloque sua imagem certa aqui
            alt="Gestão by Front Stay"
            className="w-full h-full object-cover rounded-tr-xl rounded-br-5xl"
          />
        </div>
      </div>
    </section>
  );
};

export default DesignByFront;
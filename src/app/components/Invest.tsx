import React from "react";

const Invest = () => {
  return (
    <>
      {/* Seção 1 - Invista */}
      <section style={{ backgroundColor: "#433d4c" }} className="relative text-white py-12 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[35%_65%] items-start gap-8 relative">

          {/* Coluna Esquerda */}
          <div>
            <h3 className="flex flex-col leading-tight">
              <span className="great-vibes-regular text-[#E67E22] text-6xl">invista</span>
              <span className="text-3xl font-light -mt-3">com a Front</span>
            </h3>

            <div className="mt-4 border-t border-gray-400/60 pt-4">
              <p className="text-base md:text-lg leading-relaxed">
                Do projeto à administração: <br />
                investimento seguro, retorno consistente.
              </p>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="relative flex items-start">
            {/* Lista */}
            <ul className="text-base leading-relaxed space-y-2 z-10 relative">
              <li><span className="font-bold">• Rentabilidade</span> acima da média do mercado</li>
              <li><span className="font-bold">• Gestão</span> completa e transparente</li>
              <li>• Imóveis entregues <span className="font-bold">decorados</span>, prontos para rentabilizar</li>
              <li><span className="font-bold">• Relatórios</span> mensais de desempenho</li>
              <li>• Décadas de <span className="font-bold">experiência</span> no setor imobiliário e hoteleiro</li>
              <li>• Empresa <span className="italic font-semibold">mineira</span>, especialista no mercado local de BH</li>
            </ul>

            {/* Bola apenas cortando na lateral direita */}
            <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 overflow-hidden rounded-full w-64 h-64 shadow-lg opacity-40">
              <img
                src="/foto2.jpg"
                alt="Investir com a Front"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>





      <section className="bg-white py-20 px-6 text-center">

        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {/* Linha fininha */}
          <div className="w-12 h-px bg-gray-300 mb-6"></div>

          {/* Texto */}
          <h2 className="text-lg md:text-xl font-light text-gray-800 leading-relaxed">
            Investir em um Front Stay é unir <br className="hidden md:block" />
            valorização imobiliária e{" "}
            <span className="text-[#E67E22] font-normal">renda recorrente.</span>
          </h2>

          {/* Botão */}
          <button className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white text-sm md:text-base px-6 py-2 rounded-full shadow-md transition">
            Quero investir <span className="ml-1">{">"}</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default Invest;
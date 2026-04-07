import React from "react";
import Image from 'next/image';

const Invest = () => {
  return (
    <>
      <section style={{ backgroundColor: "#433d4c" }} className="relative overflow-hidden px-8 py-12 text-white">
        <div className="relative mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-[35%_65%]">
          <div>
            <h3 className="flex flex-col leading-tight">
              <span className="great-vibes-regular text-6xl text-[#E67E22]">invista</span>
              <span className="-mt-3 text-3xl font-light">com a Front</span>
            </h3>

            <div className="mt-4 border-t border-gray-400/60 pt-4">
              <p className="text-base leading-relaxed md:text-lg">
                Do projeto à administração: <br />
                investimento seguro, retorno consistente.
              </p>
            </div>
          </div>

          <div className="relative flex items-start">
            <ul className="relative z-10 space-y-2 text-base leading-relaxed">
              <li><span className="font-bold">• Rentabilidade</span> acima da média do mercado</li>
              <li><span className="font-bold">• Gestão</span> completa e transparente</li>
              <li>• Imóveis entregues <span className="font-bold">decorados</span>, prontos para rentabilizar</li>
              <li><span className="font-bold">• Relatórios</span> mensais de desempenho</li>
              <li>• Décadas de <span className="font-bold">experiência</span> no setor imobiliário e hoteleiro</li>
              <li>• Empresa <span className="italic font-semibold">mineira</span>, especialista no mercado local de BH</li>
            </ul>

            <div className="absolute right-[-80px] top-1/2 h-64 w-64 -translate-y-1/2 overflow-hidden rounded-full opacity-40 shadow-lg">
              <Image
                src="/foto2.jpg"
                alt="Investir com a Front"
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <div className="mb-6 h-px w-12 bg-gray-300"></div>

          <h2 className="text-lg font-light leading-relaxed text-gray-800 md:text-xl">
            Investir em um Front Stay é unir <br className="hidden md:block" />
            valorização imobiliária e{" "}
            <span className="font-normal text-[#E67E22]">renda recorrente.</span>
          </h2>

          <button className="mt-8 rounded-full bg-emerald-600 px-6 py-2 text-sm text-white shadow-md transition hover:bg-emerald-700 md:text-base">
            Quero investir <span className="ml-1">{">"}</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default Invest;
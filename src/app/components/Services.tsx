import React from 'react';

const Services = () => {
  return (
    <section className="bg-[#f2f0ed] py-20 px-4 text-center">
      {/* Título */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-10">
        Cuidamos de tudo por você:
      </h2>

      {/* Container branco arredondado com itens */}
      <div className="bg-white rounded-2xl shadow-sm py-4 px-6 inline-flex flex-wrap items-center justify-center gap-4 max-w-5xl mx-auto">
        <span className="text-sm md:text-base text-gray-800">Projeto</span>
        <span className="text-gray-400">{'>'}</span>

        <span className="text-sm md:text-base text-gray-800">Decoração</span>
        <span className="text-gray-400">{'>'}</span>

        <span className="text-sm md:text-base text-gray-800">Marketing</span>
        <span className="text-gray-400">{'>'}</span>

        <span className="text-sm md:text-base text-gray-800">Comercialização</span>
        <span className="text-gray-400">{'>'}</span>

        <span className="text-sm md:text-base text-gray-800">Gestão operacional</span>
        <span className="text-gray-400">{'>'}</span>

        <span className="text-sm md:text-base text-gray-800">Relacionamento <br />com hóspedes</span>
        <span className="text-gray-400">{'>'}</span>

        <span className="text-sm md:text-base text-gray-800">Gestão do <br />patrimônio</span>
      </div>
    </section>
  );
};

export default Services;
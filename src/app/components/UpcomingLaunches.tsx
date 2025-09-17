import React from 'react';

const UpcomingLaunches = () => {
  return (
    <section className="py-20 bg-white px-4">
      <div className="text-center max-w-3xl mx-auto">
        {/* Título */}
        <h2 className="text-3xl text-black font-bold mb-4">
          Próximos <span className="text-emerald-600">lançamentos</span>
        </h2>
        {/* Subtítulo */}
        <p className="text-gray-600 mb-12 text-sm md:text-base">
          Conheça os empreendimentos que receberão a gestão Front Stay e estão disponíveis para investimento.
        </p>
      </div>

      {/* Grid de cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

        {/* Card 1 */}
        <div className="text-justify">
          <img
            src="/esopo.png"
            alt="Esopo"
            className="w-full h-72 object-cover shadow 
                 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl"
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 font-questa">Esopo</h3>
          <p className="text-gray-600 text-sm font-questa">Vale do Sereno | Nova Lima</p>
          <a href="#" className="text-gray-500 text-xs mt-1 inline-block hover:underline font-questa">[Ver mais]</a>
        </div>

        {/* Card 2 */}
        <div className="text-justify">
          <img
            src="citydesign.png"
            alt="City Design"
            className="w-full h-72 object-cover shadow 
                 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl"
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 font-questa">City Design</h3>
          <p className="text-gray-600 text-sm font-questa">Santo Agostinho | Belo Horizonte</p>
          <a href="#" className="text-gray-500 text-xs mt-1 inline-block hover:underline font-questa">[Ver mais]</a>
        </div>

        {/* Card 3 */}
        <div className="text-justify">
          <img
            src="/agoramall.jpg"
            alt="Ágora Mall Residence"
            className="w-full h-72 object-cover shadow 
                 rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl"
          />
          <h3 className="mt-4 text-lg font-semibold text-gray-800 font-questa">Ágora Mall Residence</h3>
          <p className="text-gray-600 text-sm font-questa">Nova Suíça | Belo Horizonte</p>
          <a href="#" className="text-gray-500 text-xs mt-1 inline-block hover:underline font-questa">[Ver mais]</a>
        </div>

      </div>
    </section>
  );
};

export default UpcomingLaunches;
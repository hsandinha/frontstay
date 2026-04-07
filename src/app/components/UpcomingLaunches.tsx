import React from 'react';
import Image from 'next/image';

const launches = [
  {
    title: 'Esopo',
    location: 'Vale do Sereno | Nova Lima',
    image: '/esopo.png',
  },
  {
    title: 'City Design',
    location: 'Santo Agostinho | Belo Horizonte',
    image: '/citydesign.png',
  },
  {
    title: 'Ágora Mall Residence',
    location: 'Nova Suíça | Belo Horizonte',
    image: '/agoramall.jpg',
  },
];

const UpcomingLaunches = () => {
  return (
    <section className="bg-white px-4 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-black">
          Próximos <span className="text-emerald-600">lançamentos</span>
        </h2>
        <p className="mb-12 text-sm text-gray-600 md:text-base">
          Conheça os empreendimentos que receberão a gestão Front Stay e estão disponíveis para investimento.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-3">
        {launches.map((launch) => (
          <div key={launch.title} className="text-justify">
            <div className="relative h-72 overflow-hidden rounded-bl-xl rounded-br-5xl rounded-tl-xl rounded-tr-xl shadow">
              <Image
                src={launch.image}
                alt={launch.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800 font-questa">{launch.title}</h3>
            <p className="text-sm text-gray-600 font-questa">{launch.location}</p>
            <a href="#" className="mt-1 inline-block text-xs text-gray-500 hover:underline font-questa">[Ver mais]</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UpcomingLaunches;
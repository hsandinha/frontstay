import React from "react";
import { Building, BedDouble, Users } from "lucide-react";

const StatCard = ({ icon, number, label, isCenter }: { 
  icon: React.ReactNode; 
  number: string; 
  label: string; 
  isCenter?: boolean; 
}) => {
  const size = isCenter ? "w-56 h-56 md:w-64 md:h-64" : "w-44 h-44 md:w-52 md:h-52";
  const iconSize = isCenter ? "w-12 h-12" : "w-10 h-10";

  return (
    <div
      className={`relative ${size} bg-white rounded-full flex flex-col items-center justify-center text-center p-6 shadow-md`}
    >
      <div className={`${iconSize} text-gray-500 mb-2`}>{icon}</div>
      <p className="text-3xl md:text-4xl font-bold text-gray-800">{number}</p>
      <p className="text-sm md:text-base text-gray-500">{label}</p>
    </div>
  );
};

const About = () => {
  return (
    <section className="py-20 px-6 bg-[#eae8e5]">
      {/* Texto */}
      <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-gray-800 leading-snug">
          Um pouco sobre o jeito <span className="font-bold">Front Stay</span>{" "}
          de moradia inteligente
        </h2>
        <p className="text-gray-700 text-base md:text-md leading-relaxed">
A Front Stay carrega 2 décadas de história no mercado imobiliário, de
  hotelaria e coworking, com diversos empreendimentos em Minas Gerais.
  <br />
  <br />
  Unindo{" "}
  <span className="bg-orange-300 px-1">
    gestão profissional e design diferenciado
  </span>
  , transformamos apartamentos em{" "}
  <span className="font-semibold text-gray-900">
    negócios rentáveis e estadias memoráveis.
  </span>
</p>
      </div>

      {/* Estatísticas */}
      <div className="flex justify-center items-center flex-wrap gap-8 mt-16">
        <StatCard
          icon={<Building className="w-full h-full" />}
          number="240"
          label="quartos de hotelaria em gestão"
        />
        <StatCard
          icon={<BedDouble className="w-full h-full" />}
          number="900"
          label="studios em administração até 2027"
          isCenter
        />
        <StatCard
          icon={<Users className="w-full h-full" />}
          number="250"
          label="estações de coworking"
        />
      </div>
    </section>
  );
};

export default About;
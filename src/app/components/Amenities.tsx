import React, { ReactNode } from "react";

const Amenities = () => {
  return (
    <section className="py-20 px-4 text-center bg-[#eae8e5]">
      {/* Título */}
      <h2 className="text-2xl text-black md:text-3xl font-bold mb-12">
        Prático para quem investe,<br />
        <span className="text-emerald-600">perfeito para quem mora.</span>
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 max-w-6xl mx-auto">

        {/* 1 - Wi-fi */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20h.01M2.458 12C6.94 7.478 17.06 7.478 21.542 12M5.636 15.364C8.879 12.121 15.121 12.121 18.364 15.364" />
        } title="Ultra Wi-fi" subtitle="em todo prédio" />

        {/* 2 - Suporte */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 10c0-3.314-2.686-6-6-6S6 6.686 6 10m12 0a6.003 6.003 0 01-5 5.917V18h2a2 2 0 102 2H9a2 2 0 100-4h2v-2.083A6.003 6.003 0 016 10" />
        } title="Suporte" subtitle="24/7 aos clientes" />

        {/* 3 - Limpeza */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2h6v2m-7 4h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
        } title="Limpeza" subtitle="profissional" />

        {/* 4 - Energia */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        } title="Energia" subtitle="otimizada" />

        {/* 5 - Self Check-in */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-7 8h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
        } title="Self Checkin" subtitle="pelo app ou presencial" />

        {/* 6 - Segurança */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0V9c0-2.21-1.79-4-4-4H6m6 6h2c2.21 0 4 1.79 4 4v2m-6 0h-2c-2.21 0-4-1.79-4-4v-2" />
        } title="Segurança" subtitle="c/ sistema integrado" />

        {/* 7 - Precificação */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3-1.343-3-3S10.343 2 12 2s3 1.343 3 3-1.343 3-3 3zm0 4v10m0-10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
        } title="Precificação" subtitle="dinâmica" />

        {/* 8 - Checagem */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        } title="Checagem" subtitle="de visitantes e hóspedes" />

        {/* 9 - Divulgação */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14V10zM4 6h4v12H4V6z" />
        } title="Divulgação" subtitle="nas agências online" />

        {/* 10 - Aplicativo */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 2h4a2 2 0 012 2v16a2 2 0 01-2 2h-4a2 2 0 01-2-2V4a2 2 0 012-2z" />
        } title="Aplicativo" subtitle="para investidor" />

        {/* 11 - Gestão */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M4 17h16M7 3h10M7 21h10" />
        } title="Gestão" subtitle="de condomínio" />

        {/* 12 - Enxoval */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354L20.485 12.84a1.5 1.5 0 01-2.121 2.121L12 9.121l-6.364 5.84a1.5 1.5 0 01-2.121-2.121L12 4.354z" />
        } title="Enxoval" subtitle="de hotel" />

        {/* 13 - Cama */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16M4 18h16M5 6h14v6H5V6z" />
        } title="Cama" subtitle="de nível superior" />

        {/* 14 - Mini market */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 6h14v12H5z" />
        } title="Mini Market" subtitle="para moradores" />

        {/* 15 - Fitness */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h12M6 18h12M12 6v12" />
        } title="Fitness" subtitle="moderno" />

        {/* 16 - Lounge */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6h8v12H8z" />
        } title="Lounge" subtitle="& gourmet" />

        {/* 17 - Piscina */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" />
        } title="Piscina" subtitle="sauna & spa" />

        {/* 18 - Estação */}
        <Amenity icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12h12M12 6v12" />
        } title="Estação" subtitle="de carregamento" />

      </div>
    </section>
  );
};
type AmenityProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};
/* 🔹 Componente auxiliar para evitar repetição */
const Amenity: React.FC<AmenityProps> = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 flex items-center justify-center border border-orange-800 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-orange-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icon}
      </svg>
    </div>
    <p className="mt-2 font-semibold text-gray-900">{title}</p>
    <p className="text-xs text-gray-600">{subtitle}</p>
  </div>
);

export default Amenities;
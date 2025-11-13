'use client';

import React, { useState } from 'react';

const SearchComponent = () => {
    const [cidade, setCidade] = useState('São Paulo');
    const [bairro, setBairro] = useState('Todos');
    const [hospedes, setHospedes] = useState(1);

    return (
        <div className="w-full bg-white rounded-xl shadow-md p-3 mb-6" >
            {/* Card de Busca Principal */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_80px] gap-2 items-end mb-3">
                {/* Cidade */}
                <div>
                    <label className="block text-xs font-questa-regular text-gray-600 mb-1">Cidade</label>
                    <div className="relative">
                        <select
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-questa-regular focus:ring-1 focus:ring-primary-teal focus:border-primary-teal appearance-none bg-white"
                        >
                            <option>São Paulo</option>
                            <option>Belo Horizonte</option>
                            <option>Rio de Janeiro</option>
                            <option>Nova Lima</option>
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Bairro */}
                <div>
                    <label className="block text-xs font-questa-regular text-gray-600 mb-1">Bairro</label>
                    <div className="relative">
                        <select
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-questa-regular focus:ring-1 focus:ring-primary-teal focus:border-primary-teal appearance-none bg-white"
                        >
                            <option>Todos</option>
                            <option>Vila Madalena</option>
                            <option>Itaim Bibi</option>
                            <option>Pinheiros</option>
                            <option>Jardins</option>
                        </select>
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Período de estadia */}
                <div>
                    <label className="block text-xs font-questa-regular text-gray-600 mb-1">Período de estadia</label>
                    <div className="relative">
                        <input
                            type="text"
                            value="13/11/2025 - 14/11/2025"
                            readOnly
                            className="w-full px-2 py-1.5 border border-gray-200 rounded-md text-xs font-questa-regular focus:ring-1 focus:ring-primary-teal focus:border-primary-teal cursor-pointer bg-white"
                        />
                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>

                {/* Hóspedes */}
                <div>
                    <label className="block text-xs font-questa-regular text-gray-600 mb-1">Hóspedes</label>
                    <div className="flex items-center justify-center gap-1 border border-gray-200 rounded-md px-1 py-1.5 bg-white  w-16">
                        <button
                            onClick={() => setHospedes(Math.max(1, hospedes - 1))}
                            className="w-3 h-3 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
                        >
                            <span className="text-[10px] font-bold">−</span>
                        </button>
                        <span className="text-center font-questa-regular text-xs min-w-[12px]">{hospedes}</span>
                        <button
                            onClick={() => setHospedes(hospedes + 1)}
                            className="w-3 h-3 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
                        >
                            <span className="text-[10px] font-bold">+</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros em duas linhas */}
            <div className="space-y-10 flex items-center justify-center flex-col">

                {/* Segunda linha de filtros */}
                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-questa-regular bg-white">
                        <span className="text-sm">🏃‍♂️</span>
                        Academia
                        <input type="checkbox" className="w-3 h-3 ml-1" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-0.5 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-questa-regular bg-white">
                        <span className="text-sm">💼</span>
                        Co-working
                        <input type="checkbox" className="w-2.5 h-2.5 ml-1" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-0.5 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-questa-regular bg-white">
                        <span className="text-sm">🚗</span>
                        Estacionamento
                        <input type="checkbox" className="w-2.5 h-2.5 ml-1" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-0.5 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-questa-regular bg-white">
                        <span className="text-sm">🧺</span>
                        Lavanderia
                        <input type="checkbox" className="w-2.5 h-2.5 ml-1" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-0.5 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-questa-regular bg-white">
                        <span className="text-sm">🏨</span>
                        Recepção 24h
                        <input type="checkbox" className="w-2.5 h-2.5 ml-1" />
                    </button>
                    <button className="flex items-center gap-1 px-2 py-0.5 border border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all text-xs font-questa-regular bg-white">
                        <span className="text-sm">🏊</span>
                        Piscina
                        <input type="checkbox" className="w-2.5 h-2.5 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchComponent;
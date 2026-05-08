'use client';

import React from 'react';

interface Property {
    id: number;
    nome: string;
    endereco: string;
    preco: number;
    imagem: string;
}

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    return (
        <div className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl">
            {/* Imagem */}
            <div className="relative h-56 overflow-hidden rounded-tl-xl rounded-tr-xl">
                <img
                    src={property.imagem}
                    alt={property.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badge do Tipo */}
                <div className="absolute top-3 left-3">
                </div>

                {/* Ícone Favorito */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
                {/* Nome da Propriedade */}
                <h3 className="font-questa-bold text-lg text-gray-900 mb-2 leading-tight">
                    {property.nome}
                </h3>

                {/* Endereço */}
                <div className="flex items-start gap-1 mb-3">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {property.endereco}
                    </p>
                </div>

                {/* Preço */}
                <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-500 font-questa-regular">a partir de</span>
                        <span className="text-xl font-questa-black text-gray-900">
                            R$ {property.preco.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-sm text-gray-600 font-questa-regular">diária</span>
                    </div>
                    <p className="text-xs text-gray-400 font-questa-regular">
                        Total R$ {property.preco.toLocaleString('pt-BR')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
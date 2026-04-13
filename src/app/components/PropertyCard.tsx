'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Property {
    id: number;
    nome: string;
    endereco: string;
    preco: number;
    imagem: string;
    slug?: string;
    underConstruction?: boolean;
    disponiveis?: number;
    origem?: 'cloudbeds' | 'catalogo';
    descricao?: string;
}

interface PropertyCardProps {
    property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
    const hasRate = property.preco > 0;
    const imageSrc = property.imagem.startsWith('http')
        ? property.imagem
        : property.imagem.startsWith('/')
            ? property.imagem
            : `/${property.imagem}`;

    const CardWrapper = property.slug
        ? ({ children }: { children: React.ReactNode }) => <Link href={`/${property.slug}`} className="block">{children}</Link>
        : ({ children }: { children: React.ReactNode }) => <>{children}</>;

    return (
        <CardWrapper>
        <div className="group cursor-pointer overflow-hidden rounded-bl-xl rounded-br-5xl rounded-tl-xl rounded-tr-xl bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="relative h-56 overflow-hidden rounded-tl-xl rounded-tr-xl">
                <Image
                    src={imageSrc}
                    alt={property.nome}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute left-3 top-3 flex gap-2">
                    {property.underConstruction && (
                        <span className="rounded-full bg-amber-500/95 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                            🚧 Em Construção
                        </span>
                    )}
                    {property.origem === 'cloudbeds' && !property.underConstruction && (
                        <span className="rounded-full bg-emerald-600/95 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                            Cloudbeds
                        </span>
                    )}
                </div>

                <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
                    <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="p-4">
                <h3 className="mb-2 text-lg leading-tight text-gray-900 font-questa-bold">
                    {property.nome}
                </h3>

                <div className="mb-2 flex items-start gap-1">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-sm leading-relaxed text-gray-600">
                        {property.endereco}
                    </p>
                </div>

                {property.descricao && (
                    <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                        {property.descricao}
                    </p>
                )}

                <div className="space-y-1">
                    {property.underConstruction ? (
                        <>
                            <p className="text-sm font-semibold text-amber-600">🚧 Em breve</p>
                            <p className="pt-1 text-xs text-gray-500">Lançamento em construção — saiba mais</p>
                        </>
                    ) : hasRate ? (
                        <>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xs text-gray-500 font-questa-regular">a partir de</span>
                                <span className="text-xl text-gray-900 font-questa-black">
                                    R$ {property.preco.toLocaleString('pt-BR')}
                                </span>
                                <span className="text-sm text-gray-600 font-questa-regular">diária</span>
                            </div>
                            <p className="text-xs text-gray-400 font-questa-regular">
                                Total estimado R$ {property.preco.toLocaleString('pt-BR')}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm font-medium text-slate-700">Valor sob consulta</p>
                    )}

                    {!property.underConstruction && (
                        <p className="pt-1 text-xs font-medium text-emerald-700">
                            {typeof property.disponiveis === 'number'
                                ? `${property.disponiveis} unidade(s) disponível(is)`
                                : 'Disponibilidade sujeita à atualização do PMS'}
                        </p>
                    )}
                </div>
            </div>
        </div>
        </CardWrapper>
    );
};

export default PropertyCard;
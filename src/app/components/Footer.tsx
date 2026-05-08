"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#c2c4b5] text-black py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-6 md:gap-10">

        {/* Logo */}
        <div className="flex-shrink-0 flex justify-center">
          <img
            src="/logo1.png"
            alt="FrontStay Logo"
            className="h-24 w-auto" // 🚀 logo maior
          />
        </div>

        {/* Menus - 3 colunas compactas com divisores */}
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8 lg:space-x-12 divide-y md:divide-y-0 md:divide-x divide-white/50">

          {/* Coluna 1 */}
          <div className="px-4 md:px-6">
            <h4 className="font-bold mb-1">Front Stay</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Sobre nós</a></li>
              <li><a href="#" className="hover:underline">Números</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          {/* Coluna 2 */}
          <div className="px-4 md:px-6">
            <h4 className="font-bold mb-1">Para você</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Investir</a></li>
              <li><a href="#" className="hover:underline">Comodidades</a></li>
              <li><a href="#" className="hover:underline">Design by Front</a></li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div className="px-4 md:px-6">
            <h4 className="font-bold mb-1">Clientes Front</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Área do Cliente</a></li>
              <li><a href="#" className="hover:underline">Suporte</a></li>
              <li><a href="#" className="hover:underline">Contato</a></li>
            </ul>
          </div>
        </div>

        {/* App Badges */}
        <div className="flex-shrink-0">
          <div className="bg-white rounded-lg p-3 flex flex-col items-center space-y-2 shadow-sm rounded-tl-xl rounded-tr-xl rounded-br-5xl rounded-bl-xl">
            <h4 className="font-bold mb-1 text-sm">Baixe nosso app:</h4>
            <a href="#">
              <img src="/app-store-badge.svg" alt="App Store" className="h-9" />
            </a>
            <a href="#">
              <img src="/google-play-badge.png" alt="Google Play" className="h-7" />
              {/* 🚀 Google Play menor que App Store */}
            </a>
          </div>
        </div>
      </div>

      {/* Linha final */}
      <div className="mt-6 text-center text-xs border-t border-black/20 pt-3">
        Front Stay - Copyright 2025 | Todos direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
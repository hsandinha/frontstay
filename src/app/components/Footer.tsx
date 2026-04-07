"use client";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#c2c4b5] px-4 py-8 text-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-6 text-center md:flex-row md:gap-10 md:text-left">
        <div className="flex flex-shrink-0 justify-center">
          <Image
            src="/logo1.png"
            alt="FrontStay Logo"
            width={180}
            height={96}
            className="h-24 w-auto"
          />
        </div>

        <div className="divide-y divide-white/50 md:flex md:items-start md:space-x-8 md:divide-x md:divide-y-0 lg:space-x-12">
          <div className="px-4 md:px-6">
            <h4 className="mb-1 font-bold">Front Stay</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Sobre nós</a></li>
              <li><a href="#" className="hover:underline">Números</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div className="px-4 md:px-6">
            <h4 className="mb-1 font-bold">Para você</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Investir</a></li>
              <li><a href="#" className="hover:underline">Comodidades</a></li>
              <li><a href="#" className="hover:underline">Design by Front</a></li>
            </ul>
          </div>

          <div className="px-4 md:px-6">
            <h4 className="mb-1 font-bold">Clientes Front</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:underline">Área do Cliente</a></li>
              <li><a href="#" className="hover:underline">Suporte</a></li>
              <li><a href="#" className="hover:underline">Contato</a></li>
            </ul>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="flex flex-col items-center space-y-2 rounded-lg rounded-bl-xl rounded-br-5xl rounded-tl-xl rounded-tr-xl bg-white p-3 shadow-sm">
            <h4 className="mb-1 text-sm font-bold">Baixe nosso app:</h4>
            <a href="#">
              <Image src="/app-store-badge.svg" alt="App Store" width={140} height={36} className="h-9 w-auto" />
            </a>
            <a href="#">
              <Image src="/google-play-badge.png" alt="Google Play" width={140} height={28} className="h-7 w-auto" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-black/20 pt-3 text-center text-xs">
        Front Stay - Copyright 2025 | Todos direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
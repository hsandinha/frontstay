import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="FrontStay Logo"
            width={160}
            height={64}
            className="h-16 w-auto"
            priority
          />
        </div>

        <nav className="hidden items-center space-x-0 text-sm text-gray-800 md:flex">
          <a href="#" className="px-4 transition-colors hover:text-black">
            Hospedes
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="px-4 transition-colors hover:text-black">
            Investidores
          </a>
          <span className="text-gray-300">|</span>
          <a href="/sobre" className="px-4 transition-colors hover:text-black">
            Sobre A Front
          </a>
          <span className="text-gray-300">|</span>
          <a href="/login" className="px-4 transition-colors hover:text-black">
            Área do Cliente
          </a>
        </nav>

        <div className="md:hidden">
          <button aria-label="Abrir menu" className="text-gray-800 hover:text-black">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
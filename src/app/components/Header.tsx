import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="FrontStay Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Menu de Navegação Desktop */}
        <nav className="hidden md:flex items-center space-x-0 text-sm text-gray-800">
          <a href="#" className="px-4 hover:text-black transition-colors">
            Hospedes
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="px-4 hover:text-black transition-colors">
            Investidores
          </a>
          <span className="text-gray-300">|</span>
          <a href="/sobre" className="px-4 hover:text-black transition-colors">
            Sobre A Front
          </a>
          <span className="text-gray-300">|</span>
          <a href="/login" className="px-4 hover:text-black transition-colors">
            Área do Cliente
          </a>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-gray-800 hover:text-black">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  const navLinks = [
    { id: 'inicio', label: 'Início', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'hospedes', label: 'Hóspedes', href: '#', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'investidores', label: 'Investidores', href: '#', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { id: 'sobre', label: 'Sobre', href: '/sobre', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'cliente', label: 'Login', href: '/login', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="FrontStay Logo"
                width={160}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center space-x-0 text-sm text-gray-800 md:flex">
            <Link href="#" className="px-4 transition-colors hover:text-black">
              Hospedes
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="px-4 transition-colors hover:text-black">
              Investidores
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/sobre" className="px-4 transition-colors hover:text-black">
              Sobre A Front
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/login" className="px-4 transition-colors hover:text-black font-semibold">
              Área do Cliente
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <Link href="/login" className="text-sm font-semibold text-blue-900 border border-blue-900 px-3 py-1 rounded-full mr-4">
              Login
            </Link>
            <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Abrir menu" className="text-gray-800 hover:text-black p-2">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0B0F19] border border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] rounded-2xl flex justify-around items-center h-16 px-1">
        {navLinks.slice(0, 4).map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 transition-all ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              <svg className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={tab.icon} />
              </svg>
              <span className={`text-[9px] uppercase tracking-wider font-semibold truncate w-full px-1 text-center ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
        
        {/* Hamburger Menu Toggle inside Bottom Nav */}
        <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 gap-1 text-gray-500 transition-all font-semibold"
        >
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 truncate w-full px-1 text-center">Menu</span>
        </button>
      </nav>

      {/* Drawer / Hamburger Slide-over Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 transition-opacity animate-fade-in-right" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Drawer Panel */}
          <div className="relative ml-auto w-64 max-w-sm bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-0 animate-fade-in-right">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Menu Principal</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-black">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 flex flex-col gap-2 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} FrontStay</p>
            </div>
          </div>
        </div>
      )}
    </>
};

export default Header;
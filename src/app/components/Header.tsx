"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Início", href: "#home" },
    { name: "Apartamentos", href: "#apartments" },
    { name: "Comodidades", href: "#amenities" },
    { name: "Sobre", href: "#about" },
    { name: "Contato", href: "#contact" },
  ];

  return (
    <>
      {/* Top Bar - mais clean */}
      <div className="bg-gradient-primary text-white py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3 h-3" />
              <span>(31) 99999-9999</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Mail className="w-3 h-3" />
              <span>contato@frontstay.com.br</span>
            </div>
            <div className="hidden md:flex items-center space-x-1.5">
              <MapPin className="w-3 h-3" />
              <span>Belo Horizonte, MG</span>
            </div>
          </div>
          <div className="text-xs opacity-90">Bem-vindo ao Front Stay</div>
        </div>
      </div>

      {/* Main Header - mais clean */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className={`fixed top-6 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-sm shadow-clean"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo - mais simples */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-clean">
                <span className="text-white font-questa-bold text-sm">FS</span>
              </div>
              <div>
                <h1 className="text-xl font-questa-bold gradient-text">
                  Front Stay
                </h1>
                <p className="text-xs text-neutral-medium font-questa-light -mt-0.5">
                  Experiência Única
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation - mais clean */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative text-neutral-dark hover:text-primary-teal font-questa-medium text-sm transition-colors duration-200 group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-200 group-hover:w-full"></span>
                </motion.a>
              ))}
            </nav>

            {/* CTA Button - mais compacto */}
            <div className="hidden lg:flex items-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-sm px-4 py-2"
              >
                Reservar
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors shadow-clean"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-neutral-dark" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - mais clean */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/90 backdrop-blur-sm border-t border-neutral-light/20"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-neutral-dark hover:text-primary-teal font-questa-medium transition-colors duration-200 py-2 text-sm"
                  >
                    {item.name}
                  </motion.a>
                ))}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full btn-primary mt-3 text-sm"
                >
                  Reservar
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
}

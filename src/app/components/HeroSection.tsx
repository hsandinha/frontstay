"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import HeroBackground from "./HeroBackground";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-white px-6 text-center overflow-hidden">
      {/* Background com imagens */}
      <HeroBackground />

      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Conteúdo principal */}
      <div className="relative z-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Badge de destaque */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-primary-teal" />
            <span>Hospedagem Premium em BH</span>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-questa-bold leading-tight"
          >
            Bem-vindo a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-teal to-primary-teal-light">
              Front Stay
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white/90"
          >
            Experiência única de hospedagem em Belo Horizonte. Apartamentos
            equipados com estilo mineiro, localização privilegiada e todas as
            comodidades para sua estadia perfeita.
          </motion.p>

          {/* Botões de ação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="btn-primary group">
              <span>Reserve Agora</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="btn-secondary group">
              <span>Ver Apartamentos</span>
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            </button>
          </motion.div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/20"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-questa-bold text-primary-teal">
                50+
              </div>
              <div className="text-sm text-white/70">Apartamentos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-questa-bold text-primary-teal">
                4.9
              </div>
              <div className="text-sm text-white/70">Avaliação</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-questa-bold text-primary-teal">
                24/7
              </div>
              <div className="text-sm text-white/70">Suporte</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

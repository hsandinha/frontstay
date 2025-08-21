"use client";

import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import {
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Users,
  Monitor,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Heart,
} from "lucide-react";

export default function AmenitiesSection() {
  const amenities = [
    {
      icon: Wifi,
      title: "Wi-Fi de Alta Velocidade",
      description: "Internet em todos os apartamentos",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Car,
      title: "Estacionamento Seguro",
      description: "Vagas cobertas e monitoradas 24h",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Coffee,
      title: "Café da Manhã",
      description: "Café mineiro tradicional incluído",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Dumbbell,
      title: "Academia Completa",
      description: "Equipamentos modernos",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Coworking Space",
      description: "Espaço de trabalho e salas de reunião",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: Monitor,
      title: "Smart TV 4K",
      description: "Netflix, YouTube e streaming incluídos",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Segurança 24h",
      description: "Portaria, câmeras e controle de acesso",
      color: "from-gray-500 to-slate-500",
    },
    {
      icon: Sparkles,
      title: "Limpeza Diária",
      description: "Serviço de limpeza profissional",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  const highlights = [
    {
      icon: MapPin,
      title: "Localização Privilegiada",
      description: "Centro de BH, próximo a tudo",
    },
    {
      icon: Clock,
      title: "Check-in 24h",
      description: "Chegue a qualquer hora",
    },
    {
      icon: Star,
      title: "Avaliação 4.9/5",
      description: "Mais de 2.800 hóspedes satisfeitos",
    },
    {
      icon: Heart,
      title: "Experiência Mineira",
      description: "Hospitalidade autêntica de BH",
    },
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Parallax speed={-5}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">Amenidades Exclusivas</span>
            </h2>
          </Parallax>
          <p className="text-xl text-neutral-gray-medium max-w-3xl mx-auto">
            Tudo que você precisa para uma estadia perfeita em Belo Horizonte.
            Conforto, praticidade e estilo em um só lugar.
          </p>
        </motion.div>

        {/* Grid de Amenidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-gray-medium/10">
                {/* Ícone com gradiente */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${amenity.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <amenity.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-neutral-gray-dark mb-2">
                  {amenity.title}
                </h3>
                <p className="text-neutral-gray-medium text-sm leading-relaxed">
                  {amenity.description}
                </p>

                {/* Efeito de hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-teal/5 to-secondary-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Destaques */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-teal/10 via-secondary-purple/10 to-accent-orange/10 rounded-3xl p-8 lg:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-gray-dark mb-4">
              Por que escolher o Front Stay?
            </h3>
            <p className="text-lg text-neutral-gray-medium">
              Descubra o que torna nossa experiência única em Belo Horizonte
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <highlight.icon className="w-8 h-8 text-primary-teal" />
                </div>
                <h4 className="text-lg font-semibold text-neutral-gray-dark mb-2">
                  {highlight.title}
                </h4>
                <p className="text-neutral-gray-medium text-sm">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-primary rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Pronto para sua experiência única?
            </h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Reserve agora e descubra o conforto e estilo do Front Stay em Belo
              Horizonte
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-teal px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300"
            >
              Reservar Agora
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

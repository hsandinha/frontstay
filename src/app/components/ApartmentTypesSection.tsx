"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import {
  Users,
  Bed,
  Bath,
  Coffee,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Calendar,
  Award,
} from "lucide-react";
import Apartment3DViewer from "./Apartment3DViewer";

export default function ApartmentTypesSection() {
  const [selectedType, setSelectedType] = useState("studio");

  const apartmentTypes = [
    {
      id: "studio",
      name: "Studio Contemporâneo",
      description:
        "Perfeito para viajantes individuais ou casais que buscam conforto e estilo",
      price: "R$ 120",
      originalPrice: "R$ 150",
      guests: "2 hóspedes",
      beds: "1 cama queen",
      baths: "1 banheiro",
      area: "35m²",
      amenities: [
        "Wi-Fi Premium",
        "Cozinha Completa",
        'Smart TV 55"',
        "Ar Condicionado",
      ],
      features: [
        "Design contemporâneo mineiro",
        "Localização central privilegiada",
        "Check-in digital 24h",
        "Produtos de higiene premium",
      ],
      highlights: ["Mais Reservado", "Melhor Custo-Benefício"],
      color: "#00A3A3",
    },
    {
      id: "one-bedroom",
      name: "1 Quarto Elegante",
      description:
        "Ideal para famílias pequenas ou estadias longas com mais privacidade",
      price: "R$ 180",
      originalPrice: "R$ 220",
      guests: "4 hóspedes",
      beds: "2 camas",
      baths: "1 banheiro",
      area: "55m²",
      amenities: [
        "Wi-Fi Premium",
        "Cozinha Gourmet",
        'Smart TV 65"',
        "Varanda Privativa",
      ],
      features: [
        "Espaço amplo e funcional",
        "Cozinha gourmet equipada",
        "Vista panorâmica da cidade",
        "Área de trabalho dedicada",
      ],
      highlights: ["Recomendado", "Vista Premium"],
      color: "#2D1B69",
    },
    {
      id: "two-bedroom",
      name: "2 Quartos Premium",
      description:
        "Perfeito para famílias ou grupos de amigos que valorizam espaço e conforto",
      price: "R$ 250",
      originalPrice: "R$ 300",
      guests: "6 hóspedes",
      beds: "3 camas",
      baths: "2 banheiros",
      area: "75m²",
      amenities: [
        "Wi-Fi Premium",
        "Cozinha Gourmet",
        "2 Smart TVs",
        "Estacionamento Privativo",
      ],
      features: [
        "Ideal para grupos e famílias",
        "2 banheiros completos",
        "Área de lazer privativa",
        "Estacionamento incluso",
      ],
      highlights: ["Luxo Premium", "Estacionamento Incluso"],
      color: "#E67E22",
    },
  ];

  const selectedApartment = apartmentTypes.find(
    (apt) => apt.id === selectedType
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="apartments"
      className="section-clean bg-gradient-to-br from-white via-neutral-lighter/30 to-primary-teal/5 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-geometric-pattern opacity-20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-secondary-purple/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-accent-orange/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Parallax speed={-5}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-clean mb-4"
            >
              <Award className="w-4 h-4 text-accent-orange" />
              <span className="text-neutral-dark font-questa-medium text-sm">
                Apartamentos Premiados
              </span>
            </motion.div>

            <h2 className="text-3xl lg:text-5xl font-questa-black mb-4">
              <span className="gradient-text">Tipos de Apartamentos</span>
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto font-questa-regular leading-relaxed">
              Escolha o apartamento perfeito para sua estadia em Belo Horizonte
            </p>
          </motion.div>
        </Parallax>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          {/* Visualizador 3D */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Apartment3DViewer type={selectedType} />

            {/* Floating Info Cards - mais sutis */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 bg-white/70 backdrop-blur-sm p-2 rounded-lg shadow-clean"
            >
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-accent-orange" />
                <span className="font-questa-medium text-neutral-dark text-xs">
                  4.9/5
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-2 -left-2 bg-white/70 backdrop-blur-sm p-2 rounded-lg shadow-clean"
            >
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-primary-teal" />
                <span className="font-questa-medium text-neutral-dark text-xs">
                  Centro BH
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Seletor e Detalhes */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Tabs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              {apartmentTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-4 py-2 rounded-xl font-questa-medium transition-all duration-200 text-sm ${
                    selectedType === type.id
                      ? "bg-white/80 backdrop-blur-sm shadow-clean text-neutral-dark"
                      : "bg-white/40 text-neutral-medium hover:bg-white/60 border border-neutral-light/30"
                  }`}
                >
                  {type.name}
                  {selectedType === type.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-primary opacity-5 rounded-xl"
                    />
                  )}
                  {type.highlights.length > 0 && (
                    <div className="absolute -top-1 -right-1 flex space-x-1">
                      {type.highlights.slice(0, 1).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-accent-orange text-white text-xs rounded font-questa-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Detalhes do Apartamento Selecionado */}
            {selectedApartment && (
              <motion.div
                key={selectedType}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-clean border border-white/40"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-questa-bold text-neutral-dark mb-2">
                      {selectedApartment.name}
                    </h3>
                    <p className="text-neutral-medium font-questa-regular text-sm leading-relaxed">
                      {selectedApartment.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-neutral-medium line-through">
                        {selectedApartment.originalPrice}
                      </span>
                      <span className="text-2xl font-questa-bold gradient-text">
                        {selectedApartment.price}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-medium">por noite</div>
                  </div>
                </div>

                {/* Informações Básicas */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { icon: Users, label: selectedApartment.guests },
                    { icon: Bed, label: selectedApartment.beds },
                    { icon: Bath, label: selectedApartment.baths },
                    { icon: MapPin, label: selectedApartment.area },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg"
                    >
                      <item.icon className="w-4 h-4 text-primary-teal" />
                      <span className="text-neutral-dark font-questa-regular text-sm">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Comodidades */}
                <div className="mb-4">
                  <h4 className="font-questa-medium text-neutral-dark mb-3 flex items-center text-sm">
                    <Coffee className="w-4 h-4 text-accent-orange mr-2" />
                    Comodidades Incluídas
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedApartment.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-support-green" />
                        <span className="text-neutral-dark font-questa-regular text-sm">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Características */}
                <div className="mb-6">
                  <h4 className="font-questa-medium text-neutral-dark mb-3 flex items-center text-sm">
                    <Star className="w-4 h-4 text-accent-orange mr-2" />
                    Diferenciais Únicos
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {selectedApartment.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gradient-primary rounded-full"></div>
                        <span className="text-neutral-dark font-questa-regular text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-primary text-white py-3 px-6 rounded-xl font-questa-medium hover:shadow-glow transition-all duration-200 flex items-center justify-center space-x-2 group text-sm"
                  >
                    <Calendar className="w-4 h-4 group-hover:rotate-6 transition-transform" />
                    <span>Reservar Agora</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary flex items-center justify-center space-x-2 text-sm"
                  >
                    <span>Ver Detalhes</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Galeria de Fotos - mais compacta */}
        <Parallax speed={3}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-questa-bold text-center mb-8">
              <span className="gradient-text">Galeria de Experiências</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  title: "Sala",
                  color: "from-primary-teal to-primary-teal-light",
                },
                {
                  title: "Cozinha",
                  color: "from-secondary-purple to-secondary-purple-light",
                },
                {
                  title: "Quarto",
                  color: "from-accent-orange to-accent-orange-light",
                },
                {
                  title: "Banheiro",
                  color: "from-support-green to-support-blue",
                },
                {
                  title: "Varanda",
                  color: "from-support-pink to-accent-orange",
                },
                {
                  title: "Trabalho",
                  color: "from-support-brown to-neutral-dark",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-xl shadow-clean group cursor-pointer"
                >
                  <div
                    className={`aspect-square bg-gradient-to-br ${item.color} relative`}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Coffee className="w-6 h-6 mx-auto mb-2 opacity-80" />
                        <h4 className="text-sm font-questa-medium">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Parallax>
      </div>
    </section>
  );
}

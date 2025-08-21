"use client";

import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import {
  Heart,
  Home,
  Users,
  Award,
  MapPin,
  Clock,
  Shield,
  Sparkles,
  Coffee,
  Wifi,
  Car,
  Utensils,
} from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Heart,
      title: "Receptividade Calorosa",
      description:
        "A autêntica hospitalidade mineira em cada detalhe, fazendo você se sentir em casa desde o primeiro momento.",
      color: "from-accent-orange to-accent-orange-light",
      delay: 0.1,
    },
    {
      icon: Home,
      title: "Conforto de Casa",
      description:
        "Apartamentos equipados com tudo que você precisa para uma estadia perfeita e memorável.",
      color: "from-primary-teal to-primary-teal-light",
      delay: 0.2,
    },
    {
      icon: MapPin,
      title: "Localização Privilegiada",
      description:
        "No coração de Belo Horizonte, próximo aos principais pontos turísticos e centros comerciais.",
      color: "from-secondary-purple to-secondary-purple-light",
      delay: 0.3,
    },
    {
      icon: Award,
      title: "Qualidade Premium",
      description:
        "Padrão de excelência reconhecido pelos hóspedes, com avaliação média de 4.9 estrelas.",
      color: "from-support-green to-support-blue",
      delay: 0.4,
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "Check-in 24h",
      description: "Flexibilidade total para sua chegada",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Ambiente seguro e monitorado",
    },
    {
      icon: Wifi,
      title: "Wi-Fi Premium",
      description: "Internet de alta velocidade",
    },
    {
      icon: Car,
      title: "Estacionamento",
      description: "Vagas disponíveis no local",
    },
    {
      icon: Utensils,
      title: "Cozinha Completa",
      description: "Equipada com tudo que precisa",
    },
    {
      icon: Coffee,
      title: "Café da Manhã",
      description: "Opção de café mineiro tradicional",
    },
  ];

  const stats = [
    { number: "500+", label: "Hóspedes Satisfeitos", icon: Users },
    { number: "4.9", label: "Avaliação Média", icon: Award },
    { number: "98%", label: "Taxa de Satisfação", icon: Heart },
    { number: "24/7", label: "Suporte Disponível", icon: Clock },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-white via-primary-teal/5 to-secondary-purple/5 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-lines-pattern bg-lines opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-primary-teal/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-accent-orange/10 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <Parallax speed={-5}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full shadow-glass mb-6"
            >
              <Sparkles className="w-5 h-5 text-accent-orange" />
              <span className="text-neutral-dark font-questa-medium">
                Quem Somos
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-questa-black mb-6">
              <span className="gradient-text">Experiência Única</span>
              <br />
              <span className="text-neutral-dark">em Belo Horizonte</span>
            </h2>
            <p className="text-xl text-neutral-medium max-w-4xl mx-auto font-questa-regular leading-relaxed">
              Somos mais que uma hospedagem. Somos uma ponte entre você e a
              autêntica experiência mineira, combinando{" "}
              <span className="gradient-text-accent font-questa-medium">
                contemporaneidade urbana
              </span>{" "}
              com a tradicional hospitalidade de Minas Gerais.
            </p>
          </motion.div>
        </Parallax>

        {/* Main Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: benefit.delay }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass backdrop-blur-lg rounded-4xl p-8 shadow-glass border border-white/20 group cursor-pointer"
            >
              <div className="flex items-start space-x-6">
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-br ${benefit.color} shadow-glow group-hover:shadow-glow-lg transition-all duration-300`}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-questa-black text-neutral-dark mb-3 group-hover:gradient-text transition-all duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-neutral-medium font-questa-regular leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <Parallax speed={3}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass backdrop-blur-lg rounded-4xl p-8 lg:p-12 shadow-glass border border-white/20 mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-questa-black gradient-text mb-4">
                Números que Falam por Si
              </h3>
              <p className="text-neutral-medium font-questa-regular">
                A confiança dos nossos hóspedes é nosso maior patrimônio
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300 mb-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-questa-black gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-neutral-medium font-questa-regular">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Parallax>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-questa-black gradient-text mb-4">
              Comodidades Incluídas
            </h3>
            <p className="text-neutral-medium font-questa-regular">
              Tudo pensado para sua comodidade e bem-estar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-white/50 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-glow group-hover:shadow-glow-lg transition-all duration-300 mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-questa-medium text-neutral-dark mb-2 group-hover:gradient-text transition-all duration-300">
                  {feature.title}
                </h4>
                <p className="text-sm text-neutral-medium font-questa-regular">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <Parallax speed={-3}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center glass backdrop-blur-lg rounded-4xl p-12 shadow-glass border border-white/20"
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl lg:text-4xl font-questa-black gradient-text mb-6">
                Pronto para Viver a Experiência Front Stay?
              </h3>
              <p className="text-xl text-neutral-medium font-questa-regular mb-8 leading-relaxed">
                Descubra por que somos a escolha preferida de quem busca
                <span className="gradient-text-accent font-questa-medium">
                  {" "}
                  conforto, estilo e autenticidade{" "}
                </span>
                em Belo Horizonte.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <span>Fazer Reserva</span>
                  <Heart className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-outline text-lg px-8 py-4"
                >
                  <span>Falar Conosco</span>
                  <Users className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Parallax>
      </div>
    </section>
  );
}

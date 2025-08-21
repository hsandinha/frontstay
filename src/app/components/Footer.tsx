"use client";

import FloatingButtons from "./FloatingButtons";
import NewsletterSubscription from "./NewsletterSubscription";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    apartamentos: [
      { name: "Studio", href: "#apartments" },
      { name: "1 Quarto", href: "#apartments" },
      { name: "2 Quartos", href: "#apartments" },
      { name: "Longa Estadia", href: "#apartments" },
    ],
    amenidades: [
      { name: "Wi-Fi Grátis", href: "#amenities" },
      { name: "Estacionamento", href: "#amenities" },
      { name: "Academia", href: "#amenities" },
      { name: "Coworking", href: "#amenities" },
    ],
    suporte: [
      { name: "Central de Ajuda", href: "#contact" },
      { name: "Política de Cancelamento", href: "#contact" },
      { name: "FAQ", href: "#contact" },
      { name: "Contato 24h", href: "#contact" },
    ],
    empresa: [
      { name: "Sobre Nós", href: "#about" },
      { name: "Carreiras", href: "#careers" },
      { name: "Imprensa", href: "#press" },
      { name: "Sustentabilidade", href: "#sustainability" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <>
      <footer className="bg-neutral-dark text-neutral-light">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Logo e descrição */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  F
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Front Stay
                  </h3>
                  <p className="text-sm text-neutral-light">Belo Horizonte</p>
                </div>
              </div>
              <p className="leading-relaxed max-w-md">
                Experiência única de hospedagem em Belo Horizonte. Apartamentos
                equipados com estilo mineiro, localização privilegiada e todas
                as comodidades para sua estadia perfeita.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-4 gap-8 md:col-span-3">
              <div>
                <h4 className="font-semibold mb-4 text-white">Apartamentos</h4>
                <ul className="space-y-2">
                  {footerLinks.apartamentos.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="hover:text-primary-teal transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Amenidades</h4>
                <ul className="space-y-2">
                  {footerLinks.amenidades.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="hover:text-primary-teal transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Suporte</h4>
                <ul className="space-y-2">
                  {footerLinks.suporte.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="hover:text-primary-teal transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Empresa</h4>
                <ul className="space-y-2">
                  {footerLinks.empresa.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="hover:text-primary-teal transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Rodapé inferior */}
          <div className="mt-12 flex flex-col items-center space-y-2 text-sm text-neutral-light md:flex-row md:justify-between md:space-y-0">
            <div className="flex items-center space-x-6">
              <span>Siga-nos:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:text-primary-teal transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="text-xs">
              <div className="mt-8">
                <NewsletterSubscription />
              </div>
            </div>
          </div>

          {/* Newspaper, desenvolvido e políticas */}
          <div className="mt-6 border-t border-neutral-light pt-4 text-xs text-neutral-light flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
            <div>© 2025 Front Stay. Todos os direitos reservados.</div>
            <div>Desenvolvido por Hebert Sandinha</div>
            <div>
              <a
                href="#"
                className="hover:text-primary-teal transition-colors duration-200 mr-4"
              >
                Política de Privacidade
              </a>
              <a
                href="#"
                className="hover:text-primary-teal transition-colors duration-200"
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingButtons />
    </>
  );
}

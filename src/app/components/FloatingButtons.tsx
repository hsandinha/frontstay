// src/app/components/FloatingButtons.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  const phoneNumber = "5511999999999"; // Substitua pelo número real
  const message = "Olá! Gostaria de saber mais sobre a Front Stay.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-2">
      <button
        onClick={handleWhatsAppClick}
        aria-label="Chame no Whatsapp"
        className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 cursor-pointer hover:bg-gray-100 transition"
      >
        <MessageCircle className="w-6 h-6 text-green-600" />
      </button>

      <button
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        className="bg-gradient-primary rounded-lg p-3 flex items-center justify-center shadow-lg hover:shadow-xl transition"
      >
        <ArrowUp className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

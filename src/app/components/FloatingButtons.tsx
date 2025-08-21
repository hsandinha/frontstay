// src/app/components/FloatingButtons.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-2">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu flutuante"
        className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2 cursor-pointer hover:bg-gray-100 transition"
      >
        <MessageCircle className="w-6 h-6 text-green-600" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mt-2 bg-white rounded-lg shadow-lg p-4 w-40 flex flex-col space-y-3"
          >
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-700 hover:text-green-600 cursor-pointer"
            >
              <span className="w-3 h-3 rounded-full bg-yellow-300" />
              <span>Accueil</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-500 hover:text-green-600 cursor-pointer"
            >
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span>À propos</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-500 hover:text-green-600 cursor-pointer"
            >
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span>Services</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 text-gray-500 hover:text-green-600 cursor-pointer"
            >
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span>Contact</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

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

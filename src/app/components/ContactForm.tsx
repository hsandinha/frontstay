"use client";
import React from "react";

const ContactForm = () => {
  return (
    <section className="py-20 bg-[#eae8e5] px-4 text-center">
      {/* Título */}
      <h2 className="text-2xl text-black md:text-3xl font-bold mb-2">
        Saiba em primeira mão <br />
        <span className="text-emerald-600">dos lançamentos da Front:</span>
      </h2>

      {/* Subtítulo */}
      <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
        Conte com a Front, da gestão, decoração à escolha do próximo investimento.
      </p>

      {/* Formulário */}
      <form className="max-w-md mx-auto">
        <h3 className="font-medium mb-4 text-gray-800">Preencha abaixo:</h3>

        {/* Nome */}
        <input
          type="text"
          placeholder="Seu nome"
          className="w-full mb-3 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Seu melhor e-mail"
          className="w-full mb-3 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* WhatsApp */}
        <input
          type="tel"
          placeholder="Seu whatsapp com DDD"
          className="w-full mb-6 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Botão */}
        <button
          type="submit"
          className="mt-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold w-full hover:bg-emerald-700 transition-colors"
        >
          Quero investir &gt;
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
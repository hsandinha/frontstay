// src/app/components/NewsletterSubscription.tsx
"use client";

import { useState } from "react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Inscrito com o e-mail: ${email}`);
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <label htmlFor="email" className="text-neutral-light">
        Receba ofertas especiais:
      </label>
      <input
        id="email"
        type="email"
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-3 py-2 rounded-md border border-neutral-light bg-neutral-dark text-white placeholder-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-teal"
      />
      <button
        type="submit"
        className="bg-primary-teal px-4 py-2 rounded-md text-white font-semibold hover:bg-primary-teal-dark transition"
      >
        Inscrever
      </button>
    </form>
  );
}

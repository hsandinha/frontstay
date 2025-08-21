"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = ["/foto1.jpg", "/foto2.jpg", "/foto3.jpg", "/foto4.jpg"];

export default function HeroBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // troca a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 -z-20">
      {/* Overlay gradiente para melhor contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50 z-10"></div>

      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentIndex ? "opacity-60" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Background ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0}
            quality={90}
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

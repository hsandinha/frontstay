// app/page.tsx
"use client";

import { ParallaxProvider } from "react-scroll-parallax";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ApartmentTypesSection from "./components/ApartmentTypesSection";
import AmenitiesSection from "./components/AmenitiesSection";
import BenefitsSection from "./components/BenefitsSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <ParallaxProvider>
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <ApartmentTypesSection />
        <AmenitiesSection />
        <BenefitsSection />
        <Footer />
      </main>
    </ParallaxProvider>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Eye, Layers, Palette } from "lucide-react";

interface Apartment3DViewerProps {
  type?: string;
}

export default function Apartment3DViewer({
  type = "studio",
}: Apartment3DViewerProps) {
  const [currentView, setCurrentView] = useState("exterior");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [8, -8]));
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered, mouseX, mouseY]);

  const apartmentTypes = {
    studio: {
      name: "Studio",
      color: "#00A3A3",
      rooms: ["Sala/Quarto", "Cozinha", "Banheiro"],
      area: "35m²",
    },
    "one-bedroom": {
      name: "1 Quarto",
      color: "#2D1B69",
      rooms: ["Sala", "Quarto", "Cozinha", "Banheiro"],
      area: "55m²",
    },
    "two-bedroom": {
      name: "2 Quartos",
      color: "#E67E22",
      rooms: ["Sala", "2 Quartos", "Cozinha", "2 Banheiros"],
      area: "75m²",
    },
  };

  const currentApartment =
    apartmentTypes[type as keyof typeof apartmentTypes] ||
    apartmentTypes.studio;

  const views = [
    { id: "exterior", name: "Exterior", icon: Eye },
    { id: "interior", name: "Interior", icon: Layers },
    { id: "layout", name: "Planta", icon: Palette },
  ];

  // Componente 3D mais clean
  const Building3D = () => (
    <motion.div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: zoom,
      }}
    >
      {/* Apartamento Principal - mais simples */}
      <motion.div
        className="relative preserve-3d"
        animate={{
          rotateY: rotation.y,
          rotateX: rotation.x,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      >
        {/* Estrutura Principal */}
        <div
          className="w-48 h-32 relative preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(0)",
          }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 rounded-xl shadow-clean border border-white/30"
            style={{
              background: `linear-gradient(135deg, ${currentApartment.color}15, ${currentApartment.color}25)`,
              transform: "translateZ(40px)",
              backdropFilter: "blur(4px)",
            }}
          >
            {/* Janelas - mais simples */}
            <div className="absolute top-4 left-4 w-10 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded opacity-70 shadow-sm"></div>
            <div className="absolute top-4 right-4 w-10 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded opacity-70 shadow-sm"></div>

            {/* Porta */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-14 bg-gradient-to-b from-amber-200 to-amber-300 rounded-t shadow-sm"></div>
          </div>

          {/* Lado Direito */}
          <div
            className="absolute inset-0 rounded-xl shadow-clean border border-white/20"
            style={{
              background: `linear-gradient(135deg, ${currentApartment.color}08, ${currentApartment.color}18)`,
              transform: "rotateY(90deg) translateZ(40px)",
              transformOrigin: "right center",
            }}
          >
            <div className="absolute top-6 left-4 w-8 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded opacity-60 shadow-sm"></div>
          </div>

          {/* Topo */}
          <div
            className="absolute inset-0 rounded-xl shadow-clean"
            style={{
              background: `linear-gradient(135deg, ${currentApartment.color}20, ${currentApartment.color}30)`,
              transform: "rotateX(90deg) translateZ(40px)",
              transformOrigin: "top center",
            }}
          ></div>
        </div>

        {/* Elementos flutuantes minimalistas */}
        <motion.div
          className="absolute -top-4 -right-4 w-2 h-2 bg-accent-orange rounded-full opacity-60"
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-secondary-purple rounded-full opacity-50"
          animate={{
            y: [0, 4, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-white to-neutral-lighter/30">
      {/* Header - mais clean */}
      <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-center">
        <div className="bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-clean">
          <h3 className="font-questa-medium text-neutral-dark text-sm">
            {currentApartment.name}
          </h3>
          <p className="text-xs text-neutral-medium">{currentApartment.area}</p>
        </div>

        <div className="flex items-center space-x-1">
          {/* View Selector - mais compacto */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-0.5 flex shadow-clean">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`p-1.5 rounded transition-all text-xs ${
                  currentView === view.id
                    ? "bg-primary-teal text-white shadow-sm"
                    : "text-neutral-medium hover:text-primary-teal"
                }`}
              >
                <view.icon className="w-3 h-3" />
              </button>
            ))}
          </div>

          {/* Controls - mais compacto */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-0.5 flex shadow-clean">
            <button
              onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}
              className="p-1.5 rounded text-neutral-medium hover:text-primary-teal transition-colors"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
              className="p-1.5 rounded text-neutral-medium hover:text-primary-teal transition-colors"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setRotation({ x: 0, y: rotation.y + 45 })}
              className="p-1.5 rounded text-neutral-medium hover:text-primary-teal transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="w-full h-full relative overflow-hidden">
        {/* Background Pattern - mais sutil */}
        <div className="absolute inset-0 bg-dots-pattern bg-dots opacity-3"></div>

        {/* 3D Building */}
        <Building3D />

        {/* Ambient Lighting Effects - mais sutis */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-radial from-primary-teal/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-radial from-accent-orange/8 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Info Panel - mais compacto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-3 left-3 right-3 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-clean"
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-questa-medium text-neutral-dark text-sm mb-1">
              Ambientes
            </h4>
            <div className="flex flex-wrap gap-1">
              {currentApartment.rooms.map((room, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-primary-teal/10 text-primary-teal rounded text-xs font-questa-regular"
                >
                  {room}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-questa-bold gradient-text">
              {currentApartment.area}
            </div>
            <div className="text-xs text-neutral-medium">Área total</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

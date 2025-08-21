import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Front Stay - Experiência Única em Belo Horizonte",
  description:
    "Apartamentos equipados com estilo mineiro, localização privilegiada e todas as comodidades para sua estadia perfeita em Belo Horizonte.",
  keywords:
    "hospedagem, apartamentos, Belo Horizonte, BH, Front Stay, estadia, turismo, negócios",
  authors: [{ name: "Front Stay" }],
  creator: "Front Stay",
  publisher: "Front Stay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://frontstay.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Front Stay - Experiência Única em Belo Horizonte",
    description:
      "Apartamentos equipados com estilo mineiro, localização privilegiada e todas as comodidades para sua estadia perfeita em Belo Horizonte.",
    url: "https://frontstay.com.br",
    siteName: "Front Stay",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Front Stay - Apartamentos em Belo Horizonte",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Front Stay - Experiência Única em Belo Horizonte",
    description:
      "Apartamentos equipados com estilo mineiro, localização privilegiada e todas as comodidades para sua estadia perfeita em Belo Horizonte.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth" data-kantu="1">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

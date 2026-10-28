import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Préfixe Pages (ex. /pos-simulation/caisse-sim) — vide en local. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Kudizy POS — Simulation caisse",
  description: "Simulation PWA React/Next.js — écrans B1 à B3 (PIN, shift, vente). Sans backend.",
  // Pas de metadata.manifest ici : Next omettait le basePath à l’export.
  // Le <link rel="manifest"> ci-dessous pointe vers le bon chemin.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kudizy Caisse",
  },
  icons: {
    icon: `${basePath}/icons/kudizy-pos-app-icon.svg`,
    apple: `${basePath}/icons/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: "#078942",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href={`${basePath}/manifest.webmanifest`} />
      </head>
      <body className={sora.className}>{children}</body>
    </html>
  );
}

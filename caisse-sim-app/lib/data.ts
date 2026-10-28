import type { Cashier, Product } from "./types";

/** Caissiers démo — PIN seul (appareil déjà rattaché à la caisse). */
export const CAISSIERS: Record<string, Cashier> = {
  "1234": { nom: "Awa Dossou" },
  "4821": { nom: "Marie Koffi" },
};

export const CAISSE = {
  nom: "Caisse 1",
  lieu: "Supérette Les Cocotiers · Haie Vive, Cotonou",
};

export const PRODUITS: Product[] = [
  { id: "riz", nom: "Riz parfumé 5 kg", prix: 5500, taxe: "A", cat: "Alimentation" },
  { id: "huile", nom: "Huile végétale 1 L", prix: 2000, taxe: "B", cat: "Alimentation" },
  { id: "eau", nom: "Eau 1,5 L", prix: 400, taxe: "B", cat: "Boissons" },
  { id: "pain", nom: "Pain", prix: 150, taxe: "A", cat: "Alimentation" },
  { id: "savon", nom: "Savon", prix: 350, taxe: "A", cat: "Hygiène" },
  { id: "sucre", nom: "Sucre 1 kg", prix: 900, taxe: "B", cat: "Alimentation" },
  { id: "lait", nom: "Lait en poudre", prix: 2500, taxe: "B", cat: "Alimentation" },
  { id: "jus", nom: "Jus local 1 L", prix: 800, taxe: "B", cat: "Boissons" },
  { id: "livraison", nom: "Livraison", prix: 1000, taxe: "B", cat: "Services" },
];

export const CATEGORIES = ["Tous", ...Array.from(new Set(PRODUITS.map((p) => p.cat)))];

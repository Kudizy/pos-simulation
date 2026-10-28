export type Screen = "b1" | "b2" | "b3";

export type Cashier = {
  nom: string;
};

export type Product = {
  id: string;
  nom: string;
  prix: number;
  taxe: "A" | "B";
  cat: string;
};

export type CartLine = Product & { qty: number };

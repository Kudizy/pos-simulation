"use client";

import { useState } from "react";
import { CAISSE } from "@/lib/data";
import type { Cashier } from "@/lib/types";

type Props = {
  active: boolean;
  cashier: Cashier | null;
  onOpen: (fond: string) => void;
  onLogout: () => void;
};

export function B2Shift({ active, cashier, onOpen, onLogout }: Props) {
  const [fond, setFond] = useState("5 000");
  const first = cashier?.nom.split(" ")[0] ?? "";

  return (
    <section
      className={`screen b2${active ? " active" : ""}`}
      aria-label="Ouvrir le shift"
      aria-hidden={!active}
      hidden={!active}
    >
      <div className="b2-card">
        <p className="eyebrow">
          {CAISSE.nom} · {cashier?.nom ?? ""}
        </p>
        <h1>Bonjour{first ? `, ${first}` : ""}</h1>
        <p className="sub">Indiquez le fond de caisse si besoin, puis commencez à vendre.</p>
        <div className="field">
          <label htmlFor="fond">Fond de caisse (facultatif)</label>
          <input
            id="fond"
            type="text"
            inputMode="numeric"
            placeholder="Ex. 5 000"
            value={fond}
            onChange={(e) => setFond(e.target.value)}
          />
          <p className="hint">Montant d’espèces présent dans le tiroir au démarrage.</p>
        </div>
        <div className="b2-actions">
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => onOpen(fond.trim() || "0")}
          >
            Ouvrir et vendre
          </button>
          <button type="button" className="btn btn-ghost btn-block" onClick={onLogout}>
            Changer de caissier
          </button>
        </div>
      </div>
    </section>
  );
}

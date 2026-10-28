"use client";

import { useMemo, useState } from "react";
import { CAISSE, CATEGORIES, PRODUITS } from "@/lib/data";
import { formatMoney } from "@/lib/money";
import type { CartLine, Cashier } from "@/lib/types";

type Props = {
  active: boolean;
  cashier: Cashier | null;
  cart: CartLine[];
  onCartChange: (cart: CartLine[]) => void;
  onToast: (msg: string) => void;
  onCloseShift: () => void;
};

export function B3Sale({ active, cashier, cart, onCartChange, onToast, onCloseShift }: Props) {
  const [cat, setCat] = useState("Tous");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUITS.filter((p) => {
      const catOk = cat === "Tous" || p.cat === cat;
      const qOk = !q || p.nom.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [cat, query]);

  const total = cart.reduce((s, l) => s + l.prix * l.qty, 0);

  function addProduct(id: string) {
    const p = PRODUITS.find((x) => x.id === id);
    if (!p) return;
    const existing = cart.find((l) => l.id === id);
    if (existing) {
      onCartChange(cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
    } else {
      onCartChange([...cart, { ...p, qty: 1 }]);
    }
  }

  function changeQty(index: number, delta: number) {
    const next = cart
      .map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l))
      .filter((l) => l.qty > 0);
    onCartChange(next);
  }

  function encaisser() {
    onToast(`Simulation : vente de ${formatMoney(total)} — les écrans B4+ ne sont pas encore inclus.`);
    onCartChange([]);
  }

  return (
    <section
      className={`screen b3${active ? " active" : ""}`}
      aria-label="Vente"
      aria-hidden={!active}
      hidden={!active}
    >
      <header className="b3-top">
        <div className="who">
          <strong>{cashier?.nom ?? "—"}</strong>
          <span> · Shift ouvert</span>
        </div>
        <div className="meta">
          <span className="chip ok">Imprimante · simulation</span>
          <span className="chip">{CAISSE.nom}</span>
        </div>
      </header>
      <div className="b3-body">
        <div className="catalog">
          <div className="search">
            <input
              type="search"
              placeholder="Rechercher un produit…"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="cats">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`cat${c === cat ? " on" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="prods">
            {filtered.length === 0 ? (
              <p className="empty-cart">Aucun produit ne correspond.</p>
            ) : (
              filtered.map((p) => (
                <button key={p.id} type="button" className="prod" onClick={() => addProduct(p.id)}>
                  <strong>{p.nom}</strong>
                  <em>{formatMoney(p.prix)}</em>
                  <span className="tg">[{p.taxe}]</span>
                </button>
              ))
            )}
          </div>
        </div>
        <aside className="cart">
          <h3>Panier</h3>
          <div className="client-row">
            <span>
              Client · <strong>Client de passage</strong>
            </span>
          </div>
          <div className="lines">
            {cart.length === 0 ? (
              <p className="empty-cart">Touchez un produit pour l’ajouter.</p>
            ) : (
              cart.map((l, i) => (
                <div className="line" key={`${l.id}-${i}`}>
                  <div>
                    <strong>{l.nom}</strong>
                    <span className="tg">
                      [{l.taxe}] · {formatMoney(l.prix)}
                    </span>
                  </div>
                  <div className="qty">
                    <button type="button" aria-label="Moins" onClick={() => changeQty(i, -1)}>
                      −
                    </button>
                    <span>{l.qty}</span>
                    <button type="button" aria-label="Plus" onClick={() => changeQty(i, 1)}>
                      +
                    </button>
                  </div>
                  <div className="price">{formatMoney(l.prix * l.qty)}</div>
                </div>
              ))
            )}
          </div>
          <div className="cart-foot">
            <div className="total-row">
              <span>TOTAL</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            <button
              type="button"
              className="btn-encaisser"
              disabled={cart.length === 0}
              onClick={encaisser}
            >
              Encaisser
            </button>
            <div className="cart-links">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => onToast("Simulation : historique du jour (B9) non inclus dans B1–B3.")}
              >
                Historique
              </button>
              <button type="button" className="btn btn-ghost" onClick={onCloseShift}>
                Clôturer
              </button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

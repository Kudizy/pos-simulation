"use client";

import { useCallback, useEffect, useState } from "react";
import { CAISSE, CAISSIERS } from "@/lib/data";
import { formatClock } from "@/lib/clock";
import type { Cashier } from "@/lib/types";

type Props = {
  active: boolean;
  onSuccess: (cashier: Cashier) => void;
  onToast: (msg: string) => void;
};

export function B1Pin({ active, onSuccess, onToast }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (pin.length !== 4) return;
    const cashier = CAISSIERS[pin];
    if (cashier) {
      setPin("");
      setError(false);
      onSuccess(cashier);
      return;
    }
    setError(true);
    setPin("");
    const t = window.setTimeout(() => setError(false), 900);
    return () => window.clearTimeout(t);
  }, [pin, onSuccess]);

  const pushDigit = useCallback(
    (d: string) => {
      if (!active || error) return;
      setPin((prev) => (prev.length >= 4 ? prev : prev + d));
    },
    [active, error]
  );

  const backspace = useCallback(() => {
    if (!active) return;
    setError(false);
    setPin((p) => p.slice(0, -1));
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (/\d/.test(e.key)) pushDigit(e.key);
      if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, pushDigit, backspace]);

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "blank", "0", "back"] as const;

  return (
    <section
      className={`screen b1${active ? " active" : ""}`}
      aria-label="Écran PIN"
      aria-hidden={!active}
      hidden={!active}
    >
      <aside className="b1-brand">
        <div className="b1-brand-top">
          <div className="b1-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icons/kudizy-pos-app-icon.svg`} alt="" />
            <span>kudizy</span>
          </div>
          <div className="b1-timeblock">
            <div className="b1-clock">{clock.time}</div>
            <div className="b1-date">{clock.date}</div>
          </div>
        </div>
        <div className="b1-caisse">
          <div className="b1-caisse-ico" aria-hidden="true">
            🏪
          </div>
          <div>
            <strong>{CAISSE.nom}</strong>
            <span>{CAISSE.lieu}</span>
          </div>
        </div>
      </aside>
      <div className="b1-panel">
        <div className="b1-panel-main">
          <div className={`pin-status${error ? " error" : ""}`}>
            <h2>{error ? "Code incorrect" : "Entrez votre code"}</h2>
            <p>
              {error
                ? "Réessayez ou demandez votre code au gérant."
                : "Votre code personnel à 4 chiffres"}
            </p>
          </div>
          <div className={`pin-dots${error ? " error" : ""}`} aria-live="polite">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className={i < pin.length ? "on" : undefined} />
            ))}
          </div>
          <div className="pad" role="group" aria-label="Pavé numérique">
            {keys.map((k) => {
              if (k === "blank") {
                return <button key={k} type="button" className="key blank" tabIndex={-1} aria-hidden />;
              }
              if (k === "back") {
                return (
                  <button
                    key={k}
                    type="button"
                    className="key ghost"
                    aria-label="Effacer"
                    onClick={backspace}
                  >
                    ⌫
                  </button>
                );
              }
              return (
                <button key={k} type="button" className="key" onClick={() => pushDigit(k)}>
                  {k}
                </button>
              );
            })}
          </div>
          <p className="b1-hint">⌨️ Vous pouvez aussi taper votre code au clavier</p>
        </div>
        <button
          type="button"
          className="b1-gerant"
          onClick={() =>
            onToast("Simulation : les Paramètres gérant (C1–C11) ne sont pas inclus dans B1–B3.")
          }
        >
          🔒 Accès gérant
        </button>
      </div>
    </section>
  );
}

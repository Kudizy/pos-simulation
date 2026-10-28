"use client";

import { useCallback, useEffect, useState } from "react";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Toast } from "@/components/Toast";
import { B1Pin } from "@/components/screens/B1Pin";
import { B2Shift } from "@/components/screens/B2Shift";
import { B3Sale } from "@/components/screens/B3Sale";
import type { CartLine, Cashier, Screen } from "@/lib/types";

export function CaisseApp() {
  const [screen, setScreen] = useState<Screen>("b1");
  const [cashier, setCashier] = useState<Cashier | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onPinSuccess = useCallback((c: Cashier) => {
    setCashier(c);
    setScreen("b2");
  }, []);

  const logout = useCallback(() => {
    setCashier(null);
    setCart([]);
    setScreen("b1");
  }, []);

  const openShift = useCallback((fond: string) => {
    // Fond de caisse conservé pour une future clôture (B10) — simulation B1–B3.
    void fond;
    setScreen("b3");
  }, []);

  const closeShift = useCallback(() => {
    setCart([]);
    setCashier(null);
    setScreen("b1");
    showToast("Shift clôturé (simulation) · retour à l’écran PIN.");
  }, [showToast]);

  return (
    <>
      <ServiceWorkerRegister />
      <div className="sim-badge">Simulation · B1–B3 · Next.js · sans backend</div>
      <div className="app">
        <B1Pin active={screen === "b1"} onSuccess={onPinSuccess} onToast={showToast} />
        <B2Shift
          active={screen === "b2"}
          cashier={cashier}
          onOpen={openShift}
          onLogout={logout}
        />
        <B3Sale
          active={screen === "b3"}
          cashier={cashier}
          cart={cart}
          onCartChange={setCart}
          onToast={showToast}
          onCloseShift={closeShift}
        />
      </div>
      <Toast message={toast} />
    </>
  );
}

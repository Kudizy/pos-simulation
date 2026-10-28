# Kudizy POS — simulation caisse B1–B3

PWA **React / Next.js 14 + TypeScript**, export statique (sans backend).

Parcours : **B1** PIN → **B2** ouverture de shift → **B3** vente.

## Principes CDC

- Stack caisse = React / Next.js + TypeScript (PWA)
- Appareil rattaché à une caisse ; caissier = PIN seul
- Simulation locale : pas d’API

## Dev local

```bash
cd Pos/caisse-sim-app
npm install
npm run dev
```

Ouvrir http://localhost:3000 — PIN démo `1234` ou `4821`.

## Build GitHub Pages

```bash
npm run export:pages
```

Produit le site dans `Pos/caisse-sim/` avec `basePath` `/pos-simulation/caisse-sim`.

URL : https://kudizy.github.io/pos-simulation/caisse-sim/

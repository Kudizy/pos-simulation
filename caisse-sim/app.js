/* Kudizy POS — simulation statique B1 → B2 → B3 (sans backend) */
(() => {
  "use strict";

  const CAISSIERS = {
    "1234": { nom: "Awa Dossou" },
    "4821": { nom: "Marie Koffi" },
  };

  const PRODUITS = [
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

  const state = {
    pin: "",
    cashier: null,
    fond: "5 000",
    cart: [],
    cat: "Tous",
    query: "",
  };

  const $ = (id) => document.getElementById(id);
  const screens = {
    b1: $("screen-b1"),
    b2: $("screen-b2"),
    b3: $("screen-b3"),
  };

  function show(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function toast(msg) {
    const el = $("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function formatMoney(n) {
    return n.toLocaleString("fr-FR").replace(/\u202f/g, " ") + " F";
  }

  function updateClock() {
    const now = new Date();
    $("clock").textContent = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    $("date-label").textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  }

  /* —— B1 PIN —— */
  function renderPin() {
    const dots = $("pin-dots").querySelectorAll("i");
    const status = $("pin-status");
    dots.forEach((d, i) => d.classList.toggle("on", i < state.pin.length));
    if (!status.classList.contains("error")) {
      status.querySelector("h2").textContent = "Entrez votre code";
      status.querySelector("p").textContent = "Votre code personnel à 4 chiffres";
    }
  }

  function pinError() {
    const status = $("pin-status");
    const dots = $("pin-dots");
    status.classList.add("error");
    dots.classList.add("error");
    status.querySelector("h2").textContent = "Code incorrect";
    status.querySelector("p").textContent = "Réessayez ou demandez votre code au gérant.";
    state.pin = "";
    setTimeout(() => {
      status.classList.remove("error");
      dots.classList.remove("error");
      renderPin();
    }, 900);
  }

  function pinSuccess(cashier) {
    state.cashier = cashier;
    state.pin = "";
    renderPin();
    $("b2-eyebrow").textContent = `Caisse 1 · ${cashier.nom}`;
    $("b2-hello").textContent = `Bonjour, ${cashier.nom.split(" ")[0]}`;
    show("b2");
  }

  function pushDigit(d) {
    if (state.pin.length >= 4) return;
    state.pin += d;
    renderPin();
    if (state.pin.length === 4) {
      const cashier = CAISSIERS[state.pin];
      if (cashier) pinSuccess(cashier);
      else pinError();
    }
  }

  function backspace() {
    state.pin = state.pin.slice(0, -1);
    $("pin-status").classList.remove("error");
    $("pin-dots").classList.remove("error");
    renderPin();
  }

  $("pad").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-k]");
    if (!btn) return;
    const k = btn.dataset.k;
    if (k === "back") backspace();
    else if (/\d/.test(k)) pushDigit(k);
  });

  window.addEventListener("keydown", (e) => {
    if (!screens.b1.classList.contains("active")) return;
    if (/\d/.test(e.key)) pushDigit(e.key);
    if (e.key === "Backspace") { e.preventDefault(); backspace(); }
  });

  $("btn-gerant").addEventListener("click", () => {
    toast("Simulation : les Paramètres gérant (C1–C11) ne sont pas inclus dans B1–B3.");
  });

  /* —— B2 Shift —— */
  $("btn-open-shift").addEventListener("click", () => {
    state.fond = $("fond").value.trim() || "0";
    $("b3-cashier").textContent = state.cashier.nom;
    renderCatalog();
    renderCart();
    show("b3");
  });

  $("btn-logout").addEventListener("click", () => {
    state.cashier = null;
    state.cart = [];
    state.pin = "";
    renderPin();
    show("b1");
  });

  /* —— B3 Vente —— */
  function filteredProducts() {
    const q = state.query.trim().toLowerCase();
    return PRODUITS.filter((p) => {
      const catOk = state.cat === "Tous" || p.cat === state.cat;
      const qOk = !q || p.nom.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }

  function renderCatalog() {
    const cats = ["Tous", ...new Set(PRODUITS.map((p) => p.cat))];
    $("cats").innerHTML = cats
      .map((c) => `<button type="button" class="cat${c === state.cat ? " on" : ""}" data-cat="${c}">${c}</button>`)
      .join("");

    const list = filteredProducts();
    $("prod-grid").innerHTML = list.length
      ? list
          .map(
            (p) =>
              `<button type="button" class="prod" data-id="${p.id}">
                <strong>${p.nom}</strong>
                <em>${formatMoney(p.prix)}</em>
                <span class="tg">[${p.taxe}]</span>
              </button>`
          )
          .join("")
      : `<p class="empty-cart">Aucun produit ne correspond.</p>`;
  }

  function cartTotal() {
    return state.cart.reduce((s, l) => s + l.prix * l.qty, 0);
  }

  function renderCart() {
    const box = $("cart-lines");
    if (!state.cart.length) {
      box.innerHTML = `<p class="empty-cart">Touchez un produit pour l’ajouter.</p>`;
    } else {
      box.innerHTML = state.cart
        .map(
          (l, i) => `
        <div class="line" data-i="${i}">
          <div>
            <strong>${l.nom}</strong>
            <span class="tg">[${l.taxe}] · ${formatMoney(l.prix)}</span>
          </div>
          <div class="qty">
            <button type="button" data-act="dec" aria-label="Moins">−</button>
            <span>${l.qty}</span>
            <button type="button" data-act="inc" aria-label="Plus">+</button>
          </div>
          <div class="price">${formatMoney(l.prix * l.qty)}</div>
        </div>`
        )
        .join("");
    }
    $("cart-total").textContent = formatMoney(cartTotal());
    $("btn-encaisser").disabled = state.cart.length === 0;
  }

  function addProduct(id) {
    const p = PRODUITS.find((x) => x.id === id);
    if (!p) return;
    const existing = state.cart.find((l) => l.id === id);
    if (existing) existing.qty += 1;
    else state.cart.push({ ...p, qty: 1 });
    renderCart();
  }

  $("cats").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.cat = btn.dataset.cat;
    renderCatalog();
  });

  $("prod-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    addProduct(btn.dataset.id);
  });

  $("prod-search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderCatalog();
  });

  $("cart-lines").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const line = btn.closest(".line");
    const i = Number(line.dataset.i);
    if (btn.dataset.act === "inc") state.cart[i].qty += 1;
    if (btn.dataset.act === "dec") {
      state.cart[i].qty -= 1;
      if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
    }
    renderCart();
  });

  $("btn-encaisser").addEventListener("click", () => {
    const total = cartTotal();
    toast(`Simulation : vente de ${formatMoney(total)} — les écrans B4+ ne sont pas encore inclus.`);
    state.cart = [];
    renderCart();
  });

  $("btn-history").addEventListener("click", () => {
    toast("Simulation : historique du jour (B9) non inclus dans B1–B3.");
  });

  $("btn-close-shift").addEventListener("click", () => {
    state.cart = [];
    state.cashier = null;
    state.pin = "";
    renderPin();
    show("b1");
    toast("Shift clôturé (simulation) · retour à l’écran PIN.");
  });

  /* —— PWA —— */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  updateClock();
  setInterval(updateClock, 30000);
  renderPin();
  renderCatalog();
  renderCart();
})();

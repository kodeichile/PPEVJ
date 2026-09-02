const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#main-menu");
const heroSlide = document.querySelector(".hero-slide");
const cartCount = document.querySelector("#cart-count");
const cartButton = document.querySelector(".cart-button");
const addCartButtons = document.querySelectorAll(".add-cart");
const favoriteButtons = document.querySelectorAll(".favorite");
const animatedElements = document.querySelectorAll(".search-section, .services-section, .advice-band, .footer, .service-card, .category-card, .info-panel, .contact-form");

const heroImages = [
  "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=1800&q=80"
];

const whatsappNumber = "56965051137";
const cart = JSON.parse(localStorage.getItem("entreVinosCart") || "[]");

function parsePrice(value) {
  return Number(String(value).replace(/[^\d]/g, "")) || 0;
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value);
}

function saveCart() {
  localStorage.setItem("entreVinosCart", JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateCartCount() {
  if (!cartCount) return;
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function buildCartDrawer() {
  if (document.querySelector(".cart-overlay")) return;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="cart-overlay" data-cart-close></div>
    <aside class="cart-drawer" aria-label="Carrito de cotizacion" aria-hidden="true">
      <div class="cart-drawer-header">
        <div>
          <p class="eyebrow">Cotizacion</p>
          <h2>Tu carrito</h2>
        </div>
        <button class="cart-close" type="button" data-cart-close aria-label="Cerrar carrito">×</button>
      </div>
      <div class="cart-items" id="cart-items"></div>
      <div class="cart-summary">
        <div class="cart-total-row"><span>Total estimado</span><strong id="cart-total">$0</strong></div>
        <div class="cart-customer">
          <label>Nombre<input id="cart-name" type="text" placeholder="Tu nombre"></label>
          <label>Direccion<input id="cart-address" type="text" placeholder="Direccion o comuna"></label>
          <label>Observaciones<textarea id="cart-notes" rows="3" placeholder="Detalles de entrega o consulta"></textarea></label>
        </div>
        <button class="button primary send-cart" type="button">Enviar cotizacion por WhatsApp</button>
        <button class="button clear-cart" type="button">Vaciar carrito</button>
      </div>
    </aside>
  `);

  document.querySelectorAll("[data-cart-close]").forEach((item) => {
    item.addEventListener("click", closeCart);
  });
  document.querySelector(".send-cart").addEventListener("click", sendCartQuote);
  document.querySelector(".clear-cart").addEventListener("click", () => {
    cart.splice(0, cart.length);
    saveCart();
    renderCart();
  });
}

function openCart() {
  buildCartDrawer();
  renderCart();
  document.body.classList.add("cart-open");
  document.querySelector(".cart-drawer").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  document.querySelector(".cart-drawer")?.setAttribute("aria-hidden", "true");
}

function renderCart() {
  buildCartDrawer();
  updateCartCount();

  const cartItems = document.querySelector("#cart-items");
  const cartTotal = document.querySelector("#cart-total");
  if (!cartItems || !cartTotal) return;

  if (!cart.length) {
    cartItems.innerHTML = `<p class="empty-cart">Todavia no hay productos agregados.</p>`;
  } else {
    cartItems.innerHTML = cart.map((item) => `
      <article class="cart-line">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${formatPrice(item.price)} x ${item.quantity}</p>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
        <div class="quantity-controls">
          <button type="button" data-cart-minus="${item.id}" aria-label="Restar ${item.name}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-plus="${item.id}" aria-label="Sumar ${item.name}">+</button>
        </div>
      </article>
    `).join("");
  }

  cartTotal.textContent = formatPrice(getCartTotal());

  document.querySelectorAll("[data-cart-minus]").forEach((button) => {
    button.addEventListener("click", () => changeCartQuantity(button.dataset.cartMinus, -1));
  });
  document.querySelectorAll("[data-cart-plus]").forEach((button) => {
    button.addEventListener("click", () => changeCartQuantity(button.dataset.cartPlus, 1));
  });
}

function changeCartQuantity(id, amount) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) {
    cart.splice(cart.indexOf(item), 1);
  }
  saveCart();
  renderCart();
}

function addProductToCart(button) {
  const card = button.closest(".product-card");
  if (!card) return;

  const name = card.querySelector("h3")?.textContent.trim() || "Producto";
  const price = parsePrice(card.querySelector(".product-info strong")?.textContent || "");
  const image = card.querySelector("img")?.getAttribute("src") || "";
  const id = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function sendCartQuote() {
  if (!cart.length) {
    alert("Agrega al menos un producto al carrito.");
    return;
  }

  const name = document.querySelector("#cart-name")?.value.trim();
  const address = document.querySelector("#cart-address")?.value.trim();
  const notes = document.querySelector("#cart-notes")?.value.trim();
  const lines = [
    "Hola Entre Vinos y Jardines, quiero cotizar estos productos:",
    "",
    ...cart.map((item) => `- ${item.name} x ${item.quantity}: ${formatPrice(item.price * item.quantity)}`),
    "",
    `Total estimado: ${formatPrice(getCartTotal())}`
  ];

  if (name) lines.push(`Nombre: ${name}`);
  if (address) lines.push(`Direccion/comuna: ${address}`);
  if (notes) lines.push(`Observaciones: ${notes}`);

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

let heroIndex = 0;

function showNextHeroImage() {
  if (!heroSlide || heroImages.length < 2) return;
  heroIndex = (heroIndex + 1) % heroImages.length;
  heroSlide.style.opacity = "0.72";

  window.setTimeout(() => {
    heroSlide.style.setProperty("--bg", `url('${heroImages[heroIndex]}')`);
    heroSlide.style.opacity = "1";
  }, 180);
}

if (heroSlide) {
  window.setInterval(showNextHeroImage, 4600);
}

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addProductToCart(button);
    if (cartCount) {
      cartCount.parentElement.classList.remove("bump");
      void cartCount.parentElement.offsetWidth;
      cartCount.parentElement.classList.add("bump");
    }
    button.textContent = "Agregado";
    button.classList.add("added");

    window.setTimeout(() => {
      button.textContent = button.dataset.originalText || "Agregar al carrito";
      button.classList.remove("added");
    }, 1200);
  });
});

if (cartButton) {
  cartButton.addEventListener("click", openCart);
}

favoriteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-active");
    button.textContent = button.classList.contains("is-active") ? "♥" : "♡";
  });
});

const filterButtons = document.querySelectorAll(".filter-button");
const catalogItems = document.querySelectorAll(".catalog-item");
const productSearch = document.querySelector("#product-search");

function updateCatalog() {
  const activeFilter = document.querySelector(".filter-button.active")?.dataset.filter || "todos";
  const searchTerm = productSearch?.value.trim().toLowerCase() || "";

  catalogItems.forEach((item) => {
    const matchesFilter = activeFilter === "todos" || item.dataset.category === activeFilter;
    const matchesSearch = item.dataset.name.includes(searchTerm);
    item.classList.toggle("is-hidden", !matchesFilter || !matchesSearch);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateCatalog();
  });
});

if (productSearch) {
  productSearch.addEventListener("input", updateCatalog);
}

addCartButtons.forEach((button) => {
  button.dataset.originalText = button.textContent;
});

function sendWhatsappFromForm(form, intro) {
  const formData = new FormData(form);
  const lines = [intro];

  for (const [key, value] of formData.entries()) {
    if (String(value).trim()) {
      lines.push(`${key}: ${value}`);
    }
  }

  const message = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

const adviceForm = document.querySelector("#advice-form");
const contactForm = document.querySelector("#contact-form");

if (adviceForm) {
  adviceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendWhatsappFromForm(adviceForm, "Hola Entre Vinos y Jardines, quiero solicitar una asesoria.");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendWhatsappFromForm(contactForm, "Hola Entre Vinos y Jardines, quiero hacer una consulta.");
  });
}

animatedElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.transitionDelay = `${Math.min(index % 8, 6) * 55}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  animatedElements.forEach((element) => revealObserver.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
}

updateCartCount();

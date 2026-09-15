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
        <button class="cart-close" type="button" data-cart-close aria-label="Cerrar carrito">&times;</button>
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
          <button type="button" data-cart-minus="${item.id}" aria-label="Restar ${item.name}">&minus;</button>
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
    button.textContent = button.classList.contains("is-active") ? "\u2665" : "\u2661";
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
const loginForm = document.querySelector("#login-form");
const googleLoginButton = document.querySelector("#google-login-button");
const loginError = document.querySelector("#login-error");
const logoutButton = document.querySelector("#logout-button");
const openPreviewButton = document.querySelector("#open-preview");
const closePreviewButton = document.querySelector("#close-preview");
const previewPanel = document.querySelector("#preview-panel");
const previewGrid = document.querySelector("#preview-grid");
const addCategoryForm = document.querySelector("#add-category-form");
const addCategoryName = document.querySelector("#add-category-name");
const addProductForm = document.querySelector("#add-product-form");
const addProductName = document.querySelector("#add-product-name");
const addProductPrice = document.querySelector("#add-product-price");
const addProductCategory = document.querySelector("#add-product-category");
const addProductDescription = document.querySelector("#add-product-description");
const addProductImage = document.querySelector("#add-product-image");
const addProductPreview = document.querySelector("#add-product-preview");
const addProductToggle = document.querySelector("#add-product-form .form-toggle");
const categoryList = document.querySelector("#category-list");
const editProductView = document.querySelector("#edit-product-view");
const editProductForm = document.querySelector("#edit-product-form");
const editProductTitle = document.querySelector("#edit-product-title");
const editProductPreview = document.querySelector("#edit-product-preview");
const editProductImage = document.querySelector("#edit-product-image");
const editProductName = document.querySelector("#edit-product-name");
const editProductPrice = document.querySelector("#edit-product-price");
const editProductCategory = document.querySelector("#edit-product-category");
const editProductDescription = document.querySelector("#edit-product-description");
const editProductClose = document.querySelector("#edit-product-close");
const editProductCancel = document.querySelector("#edit-product-cancel");
let activeProductRow = null;
let draggedProductRow = null;
let draggedProductBody = null;
let pointerDragStartY = 0;
let isPointerSorting = false;
const firebaseConfig = window.entreVinosFirebaseConfig || {};
const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);
let firebaseAuth = null;
if (hasFirebaseConfig && window.firebase?.initializeApp) {
  const firebaseApp = window.firebase.apps?.length ? window.firebase.app() : window.firebase.initializeApp(firebaseConfig);
  firebaseAuth = window.firebase.auth(firebaseApp);
}
const categoryLabels = new Map();
const editIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.8L19.2 9.6a2.1 2.1 0 0 0 0-3L17.4 4.8a2.1 2.1 0 0 0-3 0L4 15.2V20Z"></path><path d="m13.5 5.7 4.8 4.8"></path></svg>';
const trashIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M8 7l1 13h6l1-13"></path><path d="M9 7V5h6v2"></path></svg>';
const chevronIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"></path></svg>';
const dragIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h.01"></path><path d="M8 12h.01"></path><path d="M8 18h.01"></path><path d="M16 6h.01"></path><path d="M16 12h.01"></path><path d="M16 18h.01"></path></svg>';

if (document.body.dataset.requiresLogin === "true" && localStorage.getItem("entreVinosAdminSession") !== "active") {
  window.location.href = "login.html";
}

if (googleLoginButton) {
  googleLoginButton.addEventListener("click", async () => {
    if (loginError) loginError.textContent = "";

    if (!hasFirebaseConfig || !firebaseAuth || !window.firebase?.auth?.GoogleAuthProvider) {
      if (loginError) loginError.textContent = "Agrega la configuración de Firebase para activar Google.";
      return;
    }

    googleLoginButton.disabled = true;
    googleLoginButton.classList.add("is-loading");

    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      await firebaseAuth.signInWithPopup(provider);
      localStorage.setItem("entreVinosAdminSession", "active");
      window.location.href = "panel.html";
    } catch (error) {
      if (loginError) loginError.textContent = "No se pudo iniciar sesión con Google.";
      googleLoginButton.disabled = false;
      googleLoginButton.classList.remove("is-loading");
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("entreVinosAdminSession");
    window.location.href = "login.html";
  });
}

if (addProductToggle && addProductForm) {
  addProductToggle.addEventListener("click", () => {
    const isCollapsed = addProductForm.classList.toggle("is-collapsed");
    addProductToggle.setAttribute("aria-expanded", String(!isCollapsed));
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[char]));
}

function slugifyLabel(label) {
  return String(label).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "categoria";
}

function registerCategory(label, preferredSlug) {
  const cleanLabel = String(label || "Sin categoria").trim();
  let slug = preferredSlug || slugifyLabel(cleanLabel);
  let counter = 2;

  while (categoryLabels.has(slug) && categoryLabels.get(slug) !== cleanLabel) {
    slug = `${preferredSlug || slugifyLabel(cleanLabel)}-${counter}`;
    counter += 1;
  }

  categoryLabels.set(slug, cleanLabel);
  ensureCategorySection(slug);
  syncCategorySelects();
  return slug;
}

function syncCategorySelects() {
  [addProductCategory, editProductCategory].forEach((select) => {
    if (!select) return;
    const selected = select.value;
    select.innerHTML = [...categoryLabels].map(([slug, label]) => `<option value="${escapeHTML(slug)}">${escapeHTML(label)}</option>`).join("");
    if (categoryLabels.has(selected)) select.value = selected;
  });
}

function refreshCategoryLabels(slug) {
  const label = categoryLabels.get(slug) || "Sin categoria";
  const section = categoryList?.querySelector(`.admin-category[data-category="${slug}"]`);
  section?.querySelector(".category-name") && (section.querySelector(".category-name").textContent = label);
  section?.querySelectorAll(".category-pill").forEach((pill) => {
    pill.textContent = label;
  });
}

function getCategoryBody(slug) {
  return categoryList?.querySelector(`.admin-category[data-category="${slug}"] .category-products`) || null;
}

function updateCategoryCounts() {
  document.querySelectorAll(".admin-category").forEach((section) => {
    const count = section.querySelectorAll(".admin-product-row").length;
    section.querySelector(".category-count").textContent = count === 1 ? "1 producto" : `${count} productos`;
  });
}

function getDragAfterElement(container, y) {
  const rows = [...container.querySelectorAll(".admin-product-row:not(.is-dragging)")];
  return rows.reduce((closest, row) => {
    const box = row.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset, element: row };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

function startProductSort(row, event) {
  const body = row.closest(".category-products");
  if (!body) return;

  event.preventDefault();
  draggedProductRow = row;
  draggedProductBody = body;
  pointerDragStartY = event.clientY;
  isPointerSorting = false;
  row.classList.add("is-dragging");
  document.body.classList.add("is-sorting-products");
}

function updateProductSort(event) {
  if (!draggedProductRow || !draggedProductBody) return;
  if (Math.abs(event.clientY - pointerDragStartY) < 4 && !isPointerSorting) return;

  isPointerSorting = true;
  event.preventDefault();
  const afterElement = getDragAfterElement(draggedProductBody, event.clientY);
  const nextElement = draggedProductRow.nextElementSibling;

  if (afterElement) {
    if (afterElement === nextElement) return;
    draggedProductBody.insertBefore(draggedProductRow, afterElement);
  } else {
    if (draggedProductBody.lastElementChild === draggedProductRow) return;
    draggedProductBody.appendChild(draggedProductRow);
  }
}

function finishProductSort() {
  if (!draggedProductRow) return;

  draggedProductRow.classList.remove("is-dragging");
  draggedProductRow = null;
  draggedProductBody = null;
  isPointerSorting = false;
  document.body.classList.remove("is-sorting-products");
  updateCategoryCounts();
}

document.addEventListener("pointermove", updateProductSort, { passive: false });
document.addEventListener("pointerup", finishProductSort);
document.addEventListener("pointercancel", finishProductSort);

function bindCategoryBodyDrag(body) {
  if (!body || body.dataset.dragReady === "true") return;
  body.dataset.dragReady = "true";
  body.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (!draggedProductRow || draggedProductRow.closest(".category-products") !== body) return;
    const afterElement = getDragAfterElement(body, event.clientY);
    if (afterElement) body.insertBefore(draggedProductRow, afterElement);
    else body.appendChild(draggedProductRow);
  });
}

function ensureCategorySection(slug) {
  if (!categoryList) return null;
  const existing = getCategoryBody(slug);
  if (existing) return existing;
  const label = categoryLabels.get(slug) || slug;
  const section = document.createElement("section");
  section.className = "admin-category is-collapsed";
  section.dataset.category = slug;
  section.innerHTML = `<div class="category-header"><button class="category-toggle" type="button" aria-expanded="false"><span><strong class="category-name">${escapeHTML(label)}</strong><small class="category-count">0 productos</small></span></button><div class="category-actions" aria-label="Acciones de categoria"><button class="icon-button category-edit-button" type="button" aria-label="Editar categoria">${editIcon}</button><button class="icon-button category-delete-button" type="button" aria-label="Eliminar categoria">${trashIcon}</button><button class="category-chevron" type="button" aria-label="Expandir categoria">${chevronIcon}</button></div></div><div class="category-products" data-category="${escapeHTML(slug)}"></div>`;
  section.querySelector(".category-toggle").addEventListener("click", () => {
    const isCollapsed = section.classList.toggle("is-collapsed");
    section.querySelector(".category-toggle").setAttribute("aria-expanded", String(!isCollapsed));
  });
  section.querySelector(".category-chevron").addEventListener("click", () => {
    const isCollapsed = section.classList.toggle("is-collapsed");
    section.querySelector(".category-toggle").setAttribute("aria-expanded", String(!isCollapsed));
  });
  section.querySelector(".category-edit-button").addEventListener("click", () => {
    const nextLabel = prompt("Nuevo nombre de la categoria", categoryLabels.get(slug) || label);
    if (!nextLabel || !nextLabel.trim()) return;
    categoryLabels.set(slug, nextLabel.trim());
    refreshCategoryLabels(slug);
    syncCategorySelects();
  });
  section.querySelector(".category-delete-button").addEventListener("click", () => {
    const count = section.querySelectorAll(".admin-product-row").length;
    const message = count ? `Eliminar esta categoria tambien quitara ${count} productos. ¿Continuar?` : "¿Eliminar esta categoria?";
    if (!confirm(message)) return;
    categoryLabels.delete(slug);
    section.remove();
    syncCategorySelects();
  });
  bindCategoryBodyDrag(section.querySelector(".category-products"));
  categoryList.appendChild(section);
  return section.querySelector(".category-products");
}

function createProductRow(product) {
  const category = product.category || registerCategory("Sin categoria");
  const row = document.createElement("article");
  row.className = "admin-product-row";
  row.draggable = true;
  row.dataset.category = category;
  row.dataset.description = product.description || "";
  row.innerHTML = `<img src="${escapeHTML(product.image || "catalogo-img/romero-30-cm-29.gif")}" alt="${escapeHTML(product.name || "Producto")}"><div><h3>${escapeHTML(product.name || "Producto")}</h3><p>Activo &middot; ${escapeHTML(product.priceText || formatPrice(product.price || 0))}</p><span class="category-pill">${escapeHTML(categoryLabels.get(category) || "Sin categoria")}</span><div class="product-actions" aria-label="Acciones del producto"><button class="icon-button drag-button" type="button" aria-label="Arrastrar producto">${dragIcon}</button><button class="icon-button edit-button" type="button" aria-label="Editar producto">${editIcon}</button><button class="icon-button delete-button" type="button" aria-label="Eliminar producto">${trashIcon}</button></div></div><label class="switch-label"><input type="checkbox" checked><span></span></label>`;
  bindAdminProductActions(row);
  return row;
}

function moveRowToCategory(row, category) {
  const body = ensureCategorySection(category);
  if (!body) return;
  row.dataset.category = category;
  row.querySelector(".category-pill").textContent = categoryLabels.get(category) || "Sin categoria";
  body.appendChild(row);
  updateCategoryCounts();
}

function renderProductsByCategory(products) {
  if (!categoryList) return;
  categoryList.innerHTML = "";
  products.forEach((product) => registerCategory(product.categoryLabel, product.category));
  [...categoryLabels.keys()].forEach(ensureCategorySection);
  products.forEach((product) => ensureCategorySection(product.category)?.appendChild(createProductRow(product)));
  updateCategoryCounts();
}

function seedInitialCategories() {
  [addProductCategory, editProductCategory].forEach((select) => {
    if (!select) return;
    [...select.options].forEach((option) => registerCategory(option.textContent.trim(), option.value));
  });
}

function cleanActivePrice(text) {
  return String(text || "").replace(/^Activo\s*\S*\s*/, "").trim();
}

function getPanelFallbackProducts() {
  return [...document.querySelectorAll("#category-list > .admin-product-row")].map((row) => {
    const label = row.querySelector(".category-pill")?.textContent.trim() || "Sin categoria";
    const category = registerCategory(label, row.dataset.category || slugifyLabel(label));
    return { category, categoryLabel: label, name: row.querySelector("h3")?.textContent.trim() || "Producto", priceText: cleanActivePrice(row.querySelector("p")?.textContent) || "$0", description: row.dataset.description || "", image: row.querySelector("img")?.getAttribute("src") || "" };
  });
}

async function loadCatalogProducts() {
  if (!categoryList) return;
  const fallback = getPanelFallbackProducts();
  try {
    const response = await fetch("productos.html", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar productos.html");
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const products = [...doc.querySelectorAll(".catalog-item")].map((card) => {
      const categoryLabel = card.dataset.category || card.querySelector(".product-category")?.textContent.trim() || "Sin categoria";
      const category = registerCategory(categoryLabel, slugifyLabel(categoryLabel));
      return { category, categoryLabel, name: card.querySelector("h3")?.textContent.trim() || "Producto", priceText: card.querySelector("strong")?.textContent.trim() || "$0", description: card.querySelector(".product-info p")?.textContent.trim() || "", image: card.querySelector("img")?.getAttribute("src") || "" };
    });
    renderProductsByCategory(products.length ? products : fallback);
  } catch (error) {
    renderProductsByCategory(fallback);
  }
}

function renderCatalogPreview() {
  if (!previewGrid) return;
  const rows = [...document.querySelectorAll(".category-products .admin-product-row")];
  previewGrid.innerHTML = rows.map((row) => {
    const name = row.querySelector("h3")?.textContent.trim() || "Producto";
    const price = cleanActivePrice(row.querySelector("p")?.textContent) || "$0";
    const description = row.dataset.description || "Producto disponible para cotizacion.";
    const category = categoryLabels.get(row.dataset.category) || "Sin categoria";
    const image = row.querySelector("img")?.getAttribute("src") || "";
    return `<article class="preview-card"><img src="${escapeHTML(image)}" alt="${escapeHTML(name)}"><div class="preview-card-body"><span>${escapeHTML(category)}</span><h4>${escapeHTML(name)}</h4><p>${escapeHTML(description)}</p><strong>${escapeHTML(price)}</strong></div></article>`;
  }).join("");
}

function openCatalogPreview() {
  if (!previewPanel) return;
  renderCatalogPreview();
  previewPanel.classList.add("is-open");
  previewPanel.setAttribute("aria-hidden", "false");
}

function closeCatalogPreview() {
  if (!previewPanel) return;
  previewPanel.classList.remove("is-open");
  previewPanel.setAttribute("aria-hidden", "true");
  if (window.location.hash === "#preview-panel") history.replaceState(null, "", window.location.pathname + window.location.search);
}

if (openPreviewButton) openPreviewButton.addEventListener("click", (event) => { event.preventDefault(); openCatalogPreview(); });
if (closePreviewButton) closePreviewButton.addEventListener("click", (event) => { event.preventDefault(); closeCatalogPreview(); });
if (previewPanel) previewPanel.addEventListener("click", (event) => { if (event.target === previewPanel) closeCatalogPreview(); });
if (window.location.hash === "#preview-panel") openCatalogPreview();
window.addEventListener("hashchange", () => { if (window.location.hash === "#preview-panel") openCatalogPreview(); });

function getAdminProductPrice(row) {
  return parsePrice(row.querySelector("p")?.textContent || "");
}

function openProductEditor(row) {
  if (!editProductView || !editProductForm) return;
  activeProductRow = row;
  const name = row.querySelector("h3")?.textContent.trim() || "";
  const image = row.querySelector("img")?.getAttribute("src") || "";
  editProductTitle.textContent = name ? `Modificar ${name}` : "Modificar producto";
  editProductName.value = name;
  editProductPrice.value = String(getAdminProductPrice(row));
  editProductCategory.value = row.dataset.category || addProductCategory?.value || "";
  editProductDescription.value = row.dataset.description || "";
  editProductPreview.src = image;
  editProductPreview.alt = name ? `Vista previa de ${name}` : "Vista previa del producto";
  editProductImage.value = "";
  editProductView.classList.add("is-open");
  editProductView.setAttribute("aria-hidden", "false");
  editProductName.focus();
}

function closeProductEditor() {
  if (!editProductView || !editProductForm) return;
  editProductView.classList.remove("is-open");
  editProductView.setAttribute("aria-hidden", "true");
  activeProductRow = null;
}

function bindAdminProductActions(row) {
  if (row.dataset.bound === "true") return;
  row.dataset.bound = "true";
  row.setAttribute("draggable", "false");
  row.querySelector(".drag-button")?.addEventListener("pointerdown", (event) => startProductSort(row, event));
  row.querySelector(".edit-button")?.addEventListener("click", () => openProductEditor(row));
  row.querySelector(".delete-button")?.addEventListener("click", () => { row.remove(); updateCategoryCounts(); });
}

if (addCategoryForm) {
  addCategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = addCategoryName.value.trim();
    if (!label) return;
    const slug = registerCategory(label);
    addProductCategory.value = slug;
    addCategoryForm.reset();
    updateCategoryCounts();
  });
}

if (addProductImage) {
  addProductImage.addEventListener("change", () => {
    const file = addProductImage.files?.[0];
    if (!file || !addProductPreview) return;
    addProductPreview.src = URL.createObjectURL(file);
    addProductPreview.classList.add("has-image");
  });
}

if (addProductForm) {
  addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!categoryList) return;
    const category = addProductCategory?.value || registerCategory("Sin categoria");
    const row = createProductRow({ name: addProductName.value.trim() || "Producto nuevo", price: parsePrice(addProductPrice.value), category, description: addProductDescription.value.trim(), image: addProductPreview?.src || "catalogo-img/romero-30-cm-29.gif" });
    ensureCategorySection(category)?.appendChild(row);
    updateCategoryCounts();
    addProductForm.reset();
    if (addProductPreview) {
      addProductPreview.removeAttribute("src");
      addProductPreview.classList.remove("has-image");
    }
  });
}

if (editProductImage) {
  editProductImage.addEventListener("change", () => {
    const file = editProductImage.files?.[0];
    if (!file || !editProductPreview) return;
    editProductPreview.src = URL.createObjectURL(file);
  });
}

if (editProductForm) {
  editProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!activeProductRow) return;
    const name = editProductName.value.trim() || "Producto";
    const price = parsePrice(editProductPrice.value);
    const category = editProductCategory?.value || activeProductRow.dataset.category;
    const rowImage = activeProductRow.querySelector("img");
    activeProductRow.querySelector("h3").textContent = name;
    activeProductRow.querySelector("p").textContent = `Activo · ${formatPrice(price)}`;
    activeProductRow.dataset.description = editProductDescription.value.trim();
    if (rowImage && editProductPreview.src) {
      rowImage.src = editProductPreview.src;
      rowImage.alt = name;
    }
    moveRowToCategory(activeProductRow, category);
    closeProductEditor();
  });
}

[editProductClose, editProductCancel].forEach((button) => { if (button) button.addEventListener("click", closeProductEditor); });
if (editProductView) editProductView.addEventListener("click", (event) => { if (event.target === editProductView) closeProductEditor(); });
seedInitialCategories();
loadCatalogProducts();
if (adviceForm) {
  adviceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendWhatsappFromForm(adviceForm, "Hola Entre Vinos y Jardines, quiero hacer una consulta.");
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

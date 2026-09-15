"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/fallback-products";
import { moneyFormatter, productCategories, productCategory } from "@/lib/catalog";

type CartLine = Product & { quantity: number };

function whatsappText(items: CartLine[], customer: { name: string; message: string }) {
  const lines = items.map((item) => `- ${item.nombre} x${item.quantity}: ${moneyFormatter.format(item.precio * item.quantity)}`);
  return [
    "Hola Entre Vinos y Jardines, quiero cotizar:",
    ...lines,
    customer.name ? `Nombre: ${customer.name}` : "",
    customer.message ? `Mensaje: ${customer.message}` : ""
  ].filter(Boolean).join("\n");
}

export default function ProductCatalog({ products, featured = false }: { products: Product[]; featured?: boolean }) {
  const visibleProducts = featured ? products.slice(0, 4) : products;
  const [filter, setFilter] = useState("Todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customer, setCustomer] = useState({ name: "", message: "" });
  const filteredProducts = filter === "Todos" ? visibleProducts : visibleProducts.filter((product) => productCategory(product) === filter);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  useEffect(() => {
    const node = document.getElementById("cart-count");
    if (node) node.textContent = String(count);
  }, [count]);

  useEffect(() => {
    const open = () => setCartOpen(true);
    document.addEventListener("open-cart", open);
    return () => document.removeEventListener("open-cart", open);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("cart-open", cartOpen);
    return () => document.body.classList.remove("cart-open");
  }, [cartOpen]);

  function addProduct(product: Product) {
    setCart((items) => {
      const current = items.find((item) => item.id === product.id);
      if (current) return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(id: string, delta: number) {
    setCart((items) => items.flatMap((item) => {
      if (item.id !== id) return item;
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  }

  const quoteUrl = useMemo(() => {
    return `https://wa.me/56965051137?text=${encodeURIComponent(whatsappText(cart, customer))}`;
  }, [cart, customer]);

  return (
    <>
      {!featured && (
        <aside className="filters" aria-label="Filtros de productos">
          <h2>Filtrar</h2>
          {productCategories.map((category) => (
            <button key={category} className={`filter-button ${filter === category ? "active" : ""}`} type="button" onClick={() => setFilter(category)}>
              {category}
            </button>
          ))}
        </aside>
      )}

      <section className={featured ? "" : "catalog-content"} aria-label="Listado de productos">
        {!featured && <div className="catalog-toolbar"><h2>{filteredProducts.length} productos disponibles</h2></div>}
        <div className={`product-grid ${featured ? "featured-grid" : "catalog-grid"}`}>
          {filteredProducts.map((product) => (
            <article className="product-card catalog-item" key={product.id}>
              <button className="favorite" type="button" aria-label="Agregar a favoritos">&#9825;</button>
              <img src={product.imagen_url} alt={product.nombre} />
              <div className="product-info">
                <span className="product-category">{productCategory(product)}</span>
                <h3>{product.nombre}</h3>
                <p>{product.descripcion}</p>
                <strong>{moneyFormatter.format(product.precio)}</strong>
                <button className="add-cart" type="button" onClick={() => addProduct(product)}>Agregar</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <aside className="cart-drawer" aria-label="Carrito de cotizacion">
        <div className="cart-drawer-header">
          <div>
            <p className="eyebrow">Cotizacion</p>
            <h2>Tu carrito</h2>
          </div>
          <button className="cart-close" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? <p className="empty-cart">Agrega productos para cotizar por WhatsApp.</p> : cart.map((item) => (
            <article className="cart-line" key={item.id}>
              <img src={item.imagen_url} alt={item.nombre} />
              <div>
                <h3>{item.nombre}</h3>
                <p>{moneyFormatter.format(item.precio)} x {item.quantity}</p>
                <strong>{moneyFormatter.format(item.precio * item.quantity)}</strong>
              </div>
              <div className="quantity-controls">
                <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
              </div>
            </article>
          ))}
        </div>
        <div className="cart-summary">
          <div className="cart-total-row"><span>Total</span><strong>{moneyFormatter.format(total)}</strong></div>
          <div className="cart-customer">
            <label>Nombre<input value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Tu nombre" /></label>
            <label>Mensaje<textarea value={customer.message} onChange={(event) => setCustomer({ ...customer, message: event.target.value })} placeholder="Cuéntanos detalles de tu pedido" /></label>
          </div>
          <a className="button primary send-cart" href={quoteUrl}>Enviar por WhatsApp</a>
          <button className="button clear-cart" type="button" onClick={() => setCart([])}>Vaciar carrito</button>
        </div>
      </aside>
    </>
  );
}

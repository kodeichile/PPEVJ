"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" }
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const openCart = () => document.dispatchEvent(new CustomEvent("open-cart"));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="topbar">
        <span>Envios a todo Chile</span>
        <span>Orientacion especializada</span>
        <span>Calidad garantizada</span>
        <span className="social">Siguenos</span>
      </div>
      <nav className="navbar" aria-label="Principal">
        <Link className="brand" href="/">
          <img className="brand-logo" src="/catalogo-img/logo-entre-vinos-jardines-recortado.png" alt="Entre Vinos y Jardines" />
        </Link>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span />
          <span />
          <span />
        </button>
        <div className={`menu ${menuOpen ? "open" : ""}`} id="main-menu">
          {navItems.map((item) => (
            <Link key={item.href} className={pathname === item.href ? "active" : ""} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <Link className="icon-button account-button" href="/ingresar" aria-label="Iniciar sesion" />
          <button className="cart-button" type="button" aria-label="Carrito de compras" onClick={openCart}>
            <span id="cart-count">0</span>
          </button>
          <a className="whatsapp" href="https://wa.me/56965051137">WhatsApp</a>
        </div>
      </nav>
    </header>
  );
}

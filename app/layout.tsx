import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entre Vinos y Jardines",
  description: "Catalogo de vivero con cotizacion por WhatsApp y panel auto-administrable."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <div className="topbar">
            <span>Envios a todo Chile</span>
            <span>Asesoria especializada</span>
            <span>Calidad garantizada</span>
            <span>Siguenos</span>
          </div>
          <nav className="navbar" aria-label="Principal">
            <Link className="brand" href="/">
              <span className="brand-mark">EV</span>
              <span>
                <strong>Entre Vinos y Jardines</strong>
                <small>Catalogo verde</small>
              </span>
            </Link>
            <div className="menu">
              <Link href="/">Catalogo</Link>
              <Link href="/ingresar">Ingresar</Link>
              <Link href="/panel">Panel</Link>
            </div>
            <a className="whatsapp" href="https://wa.me/56965051137">WhatsApp</a>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <p>Entre Vinos y Jardines · WhatsApp +56 9 6505 1137</p>
        </footer>
      </body>
    </html>
  );
}

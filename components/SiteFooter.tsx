import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-grid">
        <div className="footer-intro">
          <h2>Soluciones integrales para espacios verdes hermosos y sostenibles</h2>
        </div>
        <div className="footer-nav-group footer-featured-group">
          <h3>Productos</h3>
          <Link href="/productos">Plantas</Link>
          <Link href="/productos">Arboles</Link>
          <Link href="/productos">Jardineria</Link>
          <Link href="/productos">Herramientas</Link>
        </div>
        <div className="footer-nav-group footer-featured-group">
          <h3>Servicios</h3>
          <Link href="/servicios/diseno-jardines">Diseno de jardines</Link>
          <Link href="/servicios/preparacion">Preparacion</Link>
          <Link href="/servicios/mantencion">Mantencion</Link>
          <Link href="/servicios/riego-automatico">Riego</Link>
        </div>
        <div className="footer-nav-group footer-featured-group" id="nosotros">
          <h3>Contacto</h3>
          <p>WhatsApp: +56 9 6505 1137</p>
          <p>Cotizaciones directas por WhatsApp</p>
          <p>Ubicacion exacta protegida en mapa</p>
          <a href="https://www.google.com/maps/search/?api=1&query=-37.367876,-72.294121" target="_blank" rel="noopener">Ver ubicacion exacta</a>
        </div>
      </div>
      <p className="copyright">&copy; 2026 Entre Vinos y Jardines Catalogo verde. Todos los derechos reservados.</p>
    </footer>
  );
}

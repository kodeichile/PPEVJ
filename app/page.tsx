import Link from "next/link";
import type { CSSProperties } from "react";
import ProductCatalog from "@/components/ProductCatalog";
import { publicImageUrl } from "@/lib/catalog";
import { listProducts, listServices } from "@/lib/appscript";
import { fallbackProducts } from "@/lib/fallback-products";

export const revalidate = 60;

export default async function Home() {
  const products = await listProducts();
  const services = await listServices();
  const displayProducts = products.length ? products : fallbackProducts.filter((product) => product.activo);
  const featuredProducts = displayProducts
    .filter((product) => product.activo && product.destacado)
    .sort((a, b) => (Number(a.destacado_orden) || 0) - (Number(b.destacado_orden) || 0));

  return (
    <main>
      <section className="hero" aria-label="Bienvenida">
        <div className="hero-slide active" style={{ "--bg": "url('https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=80')" } as CSSProperties}>
          <div className="hero-content">
            <p className="eyebrow">Vivero, diseño y mantención</p>
            <h1>Todo para crear y disfrutar tus espacios verdes</h1>
            <p>Plantas, productos, riego y jardinería para transformar patios, terrazas y jardines.</p>
            <div className="hero-buttons">
              <Link className="button primary" href="/productos">Comprar productos</Link>
              <Link className="button secondary" href="/servicios">Ver servicios</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section search-section">
        <div className="section-title"><h2>¿Qué estás buscando?</h2></div>
        <div className="category-grid">
          {[
            ["/productos", "/catalogo-img/icons/icon-plantas.svg", "Plantas"],
            ["/productos", "/catalogo-img/icons/icon-arboles.svg", "Árboles"],
            ["/productos", "/catalogo-img/icons/icon-jardineria.svg", "Jardinería"],
            ["/servicios", "/catalogo-img/icons/icon-riego.svg", "Riego"],
            ["/servicios", "/catalogo-img/icons/icon-diseno-jardines.svg", "Diseño de jardines"],
            ["/servicios", "/catalogo-img/icons/icon-mantencion.svg", "Mantención"]
          ].map(([href, icon, label]) => (
            <Link className="category-card" href={href} key={label}>
              <span className="category-icon"><img src={icon} alt="" /></span>
              <strong>{label}</strong>
              <small>Ver mas</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" id="productos">
        <div className="section-heading-row">
          <div className="section-title"><h2>Productos destacados</h2></div>
          <Link className="view-all" href="/productos">Ver todos los productos</Link>
        </div>
        <ProductCatalog products={featuredProducts.length ? featuredProducts : displayProducts} featured />
      </section>

      <section className="section services-section" id="servicios">
        <div className="section-title"><h2>Nuestros servicios</h2></div>
        <div className="service-grid">
          {services.filter((service) => service.activo !== false).map((service) => (
            <article className="service-card" key={service.slug}>
              <img src={publicImageUrl(service.image)} alt={service.title} />
              <div>
                <span className="service-icon"><img src={service.icon} alt="" /></span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={`/servicios/${service.slug}`}>Ver servicio</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="advice-band" id="contacto-rapido">
        <div>
          <span className="big-whatsapp">☎</span>
          <div>
            <h2>Cuéntanos sobre tu jardín</h2>
            <p>Te orientamos con productos, riego o mantención según tu espacio.</p>
          </div>
        </div>
        <a className="button primary" href="https://wa.me/56965051137">Consultar por WhatsApp</a>
      </section>
    </main>
  );
}

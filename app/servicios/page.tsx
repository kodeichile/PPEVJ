import Link from "next/link";
import { publicImageUrl } from "@/lib/catalog";
import { listServices } from "@/lib/appscript";

export const revalidate = 60;

export default async function ServiciosPage() {
  const services = await listServices();

  return (
    <main>
      <section className="page-hero services-hero">
        <div>
          <p className="eyebrow">Servicios profesionales</p>
          <h1>Jardines diseñados para durar</h1>
          <p>Nos encargamos de planificar, preparar y mantener espacios verdes residenciales y comerciales.</p>
        </div>
      </section>
      <section className="section services-section">
        <div className="service-grid wide-services">
          {services.filter((service) => service.activo !== false).map((service) => (
            <article className="service-card" key={service.slug}>
              <img src={publicImageUrl(service.image)} alt={service.title} />
              <div>
                <span className="service-icon"><img src={service.icon} alt="" /></span>
                <h3>{service.title}</h3>
                <p>{service.details}</p>
                <Link href={`/servicios/${service.slug}`}>Ver servicio</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

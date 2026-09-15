import { notFound } from "next/navigation";
import { services } from "@/lib/catalog";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <main>
      <section className="page-hero services-hero">
        <div>
          <p className="eyebrow">Servicio</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>
      </section>
      <section className="split-section">
        <div className="info-panel">
          <span className="service-icon"><img src={service.icon} alt="" /></span>
          <h2>{service.shortTitle}</h2>
          <p>{service.details}</p>
          <p>Coordinamos la evaluación por WhatsApp para revisar medidas, condiciones de luz, riego y el tipo de mantención que necesitas.</p>
          <a className="button primary" href={`https://wa.me/56965051137?text=${encodeURIComponent(`Hola Entre Vinos y Jardines, quiero cotizar ${service.title}.`)}`}>Solicitar evaluación</a>
        </div>
        <img className="service-detail-image" src={service.image} alt={service.title} />
      </section>
    </main>
  );
}

import ContactForm from "@/components/ContactForm";

export default function ContactoPage() {
  return (
    <main>
      <section className="page-hero contact-hero">
        <div>
          <p className="eyebrow">Conversemos</p>
          <h1>Contacto</h1>
          <p>Escríbenos para cotizar productos, servicios de jardín o una visita a terreno.</p>
        </div>
      </section>
      <section className="split-section">
        <div className="info-panel contact-details">
          <h2>Datos de contacto</h2>
          <a className="button primary" href="https://www.google.com/maps/dir/?api=1&destination=-37.367876,-72.294121" target="_blank" rel="noopener">Como llegar</a>
        </div>
        <ContactForm />
      </section>
      <section className="map-section" aria-label="Mapa de Entre Vinos y Jardines">
        <div className="map-frame">
          <div className="map-pin-label"><span className="map-pin-dot" /> Punto exacto</div>
          <iframe title="Mapa de Entre Vinos y Jardines" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=-37.367876,-72.294121&z=16&output=embed" />
        </div>
      </section>
    </main>
  );
}

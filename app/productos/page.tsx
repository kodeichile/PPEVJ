import ProductCatalog from "@/components/ProductCatalog";
import { listProducts } from "@/lib/appscript";

export const revalidate = 60;

export default async function ProductosPage() {
  const products = await listProducts();

  return (
    <main>
      <section className="page-hero compact-hero">
        <div>
          <p className="eyebrow">Catálogo público</p>
          <h1>Vivero Entre Vinos y Jardines</h1>
          <p>Catálogo completo actualizado. Selecciona plantas, arma tu pedido y cotiza gratis por WhatsApp.</p>
        </div>
      </section>
      <section className="catalog-layout">
        <ProductCatalog products={products} />
      </section>
    </main>
  );
}

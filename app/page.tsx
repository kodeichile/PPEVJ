import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/appscript";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts();
  const categories = ["Todos", "Frutales", "Arbustos", "Arboles ornamentales"];

  return (
    <main>
      <section className="hero">
        <h1>Catalogo verde de Entre Vinos y Jardines</h1>
        <p>Plantas de vivero actualizadas para cotizar directo por WhatsApp.</p>
      </section>
      <section className="catalog-shell">
        <aside className="filters">
          <h2>Filtrar</h2>
          <div className="filter-list">
            {categories.map((category) => <a key={category} href="#catalogo">{category}</a>)}
          </div>
        </aside>
        <div id="catalogo">
          <div className="product-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

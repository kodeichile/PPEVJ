import type { Product } from "@/lib/fallback-products";
import { publicImageUrl } from "@/lib/catalog";

const moneyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <img src={publicImageUrl(product.imagen_url)} alt={product.nombre} />
      <div className="product-info">
        <span className="badge">Vivero</span>
        <h2>{product.nombre}</h2>
        <p>{product.descripcion}</p>
        <strong className="price">{moneyFormatter.format(product.precio)}</strong>
        <a
          className="button"
          href={`https://wa.me/56965051137?text=${encodeURIComponent(`Hola Entre Vinos y Jardines, quiero cotizar ${product.nombre}.`)}`}
        >
          Cotizar
        </a>
      </div>
    </article>
  );
}

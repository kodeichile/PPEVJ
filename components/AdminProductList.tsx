"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import type { Product } from "@/lib/fallback-products";

const moneyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

export default function AdminProductList({ products }: { products: Product[] }) {
  const router = useRouter();

  async function updatePrice(id: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch(`/api/productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ precio: Number(formData.get("precio")) })
    });
    router.refresh();
  }

  async function toggleProduct(product: Product) {
    await fetch(`/api/productos/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !product.activo })
    });
    router.refresh();
  }

  return (
    <div className="admin-list">
      {products.map((product) => (
        <article className="admin-card" key={product.id}>
          <img src={product.imagen_url} alt={product.nombre} />
          <div>
            <h2>{product.nombre}</h2>
            <p className="muted">{product.descripcion}</p>
            <p><strong>{moneyFormatter.format(product.precio)}</strong> · {product.activo ? "Activo" : "Oculto"}</p>
            <form className="admin-actions" onSubmit={(event) => updatePrice(product.id, event)}>
              <input name="precio" type="number" min="0" defaultValue={product.precio} aria-label={`Precio de ${product.nombre}`} />
              <button type="submit">Guardar precio</button>
              <button type="button" onClick={() => toggleProduct(product)}>{product.activo ? "Ocultar" : "Activar"}</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

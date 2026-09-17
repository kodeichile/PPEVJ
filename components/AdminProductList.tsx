"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { moneyFormatter, productCategory, publicImageUrl } from "@/lib/catalog";
import type { Product } from "@/lib/fallback-products";

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

  async function deleteProduct(id: string) {
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="admin-list">
      {products.map((product) => (
        <article className="admin-product-row" key={product.id}>
          <img src={publicImageUrl(product.imagen_url)} alt={product.nombre} />
          <div>
            <h3>{product.nombre}</h3>
            <p className="muted">{product.descripcion}</p>
            <p><strong>{moneyFormatter.format(product.precio)}</strong> · {product.activo ? "Activo" : "Oculto"}</p>
            <span className="category-pill">{productCategory(product)}</span>
            <form className="admin-actions" onSubmit={(event) => updatePrice(product.id, event)}>
              <input name="precio" type="number" min="0" defaultValue={product.precio} aria-label={`Precio de ${product.nombre}`} />
              <button className="icon-button edit-button" type="submit" aria-label="Guardar precio">✎</button>
              <button className="icon-button delete-button" type="button" onClick={() => deleteProduct(product.id)} aria-label="Eliminar producto">🗑</button>
              <button className="button" type="button" onClick={() => toggleProduct(product)}>{product.activo ? "Ocultar" : "Activar"}</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}

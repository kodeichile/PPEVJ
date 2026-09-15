"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProductForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const file = form.get("imagen") as File;
    let imagen_url = String(form.get("imagen_url") || "");

    if (file?.size) {
      const upload = new FormData();
      upload.set("imagen", file);
      const response = await fetch("/api/upload", { method: "POST", body: upload });
      const data = await response.json();
      imagen_url = data.url;
    }

    await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.get("nombre"),
        precio: Number(form.get("precio")),
        descripcion: form.get("descripcion"),
        imagen_url,
        activo: true
      })
    });

    setSaving(false);
    router.refresh();
    event.currentTarget.reset();
  }

  return (
    <form className="product-form panel" onSubmit={submit}>
      <h2>Agregar producto nuevo</h2>
      <label>Nombre<input name="nombre" required /></label>
      <label>Precio<input name="precio" type="number" min="0" required /></label>
      <label>Descripcion<textarea name="descripcion" rows={4} required /></label>
      <label>Imagen<input name="imagen" type="file" accept="image/*" /></label>
      <label>URL de imagen<input name="imagen_url" placeholder="Opcional si subes archivo" /></label>
      <button className="button" type="submit" disabled={saving}>{saving ? "Guardando..." : "Agregar"}</button>
    </form>
  );
}

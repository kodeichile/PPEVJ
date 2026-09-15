"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ProductForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const file = form.get("imagen") as File;
      let imagen_url = String(form.get("imagen_url") || "");

      if (file?.size) {
        const upload = new FormData();
        upload.set("imagen", file);
        const response = await fetch("/api/upload", { method: "POST", body: upload });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo subir la imagen.");
        imagen_url = data.url;
      }

      const response = await fetch("/api/productos", {
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
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo crear el producto.");

      router.refresh();
      event.currentTarget.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form product-form" onSubmit={submit}>
      <h2>Agregar producto</h2>
      <label>Nombre<input name="nombre" required /></label>
      <label>Precio<input name="precio" type="number" min="0" required /></label>
      <label>Descripcion<textarea name="descripcion" rows={4} required /></label>
      <label className="admin-upload-field">Imagen<input name="imagen" type="file" accept="image/*" /></label>
      <label>URL de imagen<input name="imagen_url" placeholder="Opcional si subes archivo" /></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="button" type="submit" disabled={saving}>{saving ? "Guardando..." : "Agregar"}</button>
    </form>
  );
}

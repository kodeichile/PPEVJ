"use client";

import { FormEvent } from "react";

export default function ContactForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = [
      "Hola Entre Vinos y Jardines, quiero hacer una consulta.",
      `Nombre: ${form.get("nombre") || ""}`,
      `Email: ${form.get("email") || ""}`,
      `Telefono: ${form.get("telefono") || ""}`,
      `Mensaje: ${form.get("mensaje") || ""}`
    ].join("\n");
    window.location.href = `https://wa.me/56965051137?text=${encodeURIComponent(text)}`;
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <h2>Enviar consulta</h2>
      <label>Nombre<input name="nombre" required /></label>
      <label>Email<input type="email" name="email" required /></label>
      <label>Teléfono<input name="telefono" /></label>
      <label>Mensaje<textarea name="mensaje" rows={5} required /></label>
      <button className="button primary" type="submit">Enviar por WhatsApp</button>
    </form>
  );
}

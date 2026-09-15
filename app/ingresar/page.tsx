import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export default function IngresarPage() {
  return (
    <main className="login-page">
      <section className="login-card">
        <a className="brand login-brand" href="/">
          <img className="brand-logo" src="/catalogo-img/logo-entre-vinos-jardines-recortado.png" alt="Entre Vinos y Jardines" />
        </a>
        <div className="login-copy">
          <p className="eyebrow">Acceso privado</p>
          <h1>Ingreso al panel</h1>
          <p>Entra con Google para revisar la administracion del catalogo.</p>
        </div>
        <Suspense fallback={<button className="google-login-button" type="button" disabled>Cargando...</button>}>
          <LoginForm />
        </Suspense>
        <a className="login-back" href="/">Volver al sitio</a>
      </section>
    </main>
  );
}

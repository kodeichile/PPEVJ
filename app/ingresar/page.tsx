import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export default function IngresarPage() {
  return (
    <main className="auth-page">
      <section className="panel form-card">
        <p className="badge">Administracion</p>
        <h1>Ingresar al panel</h1>
        <p className="muted">Acceso solo para correos autorizados de Entre Vinos y Jardines.</p>
        <Suspense fallback={<button className="button" type="button" disabled>Cargando...</button>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}

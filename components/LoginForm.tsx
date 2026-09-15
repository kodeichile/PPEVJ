"use client";

import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getFirebaseAuth, googleProvider } from "@/lib/firebaseClient";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");

    try {
      const auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "No pudimos iniciar sesion. Revisa que tu correo tenga acceso al panel.");
      }

      router.push(params.get("next") || "/panel");
    } catch (caught) {
      if (caught instanceof FirebaseError) {
        const messages: Record<string, string> = {
          "auth/popup-blocked": "El navegador bloqueo la ventana de Google. Permite ventanas emergentes e intenta nuevamente.",
          "auth/popup-closed-by-user": "La ventana de Google se cerro antes de completar el ingreso.",
          "auth/unauthorized-domain": "Este dominio no esta autorizado en Firebase Authentication.",
          "auth/invalid-api-key": "Falta o es incorrecta la configuracion publica de Firebase."
        };
        setError(messages[caught.code] || caught.message);
      } else {
        setError(caught instanceof Error ? caught.message : "No pudimos iniciar sesion.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-form">
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="google-login-button" type="button" onClick={login} disabled={loading}>
        <span className="google-mark" aria-hidden="true">G</span>
        {loading ? "Ingresando..." : "Continuar con Google"}
      </button>
    </div>
  );
}

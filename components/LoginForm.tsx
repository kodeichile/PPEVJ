"use client";

import { signInWithPopup } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { getFirebaseAuth, googleProvider } from "@/lib/firebaseClient";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  async function login() {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken })
    });

    if (!response.ok) {
      alert("Tu correo no tiene acceso al panel.");
      return;
    }

    router.push(params.get("next") || "/panel");
  }

  return <button className="button" type="button" onClick={login}>Continuar con Google</button>;
}

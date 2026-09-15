"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    try {
      await signOut(getFirebaseAuth());
    } catch {
      // Firebase may be unconfigured during local setup.
    }
    router.push("/");
  }

  return <button className="button" type="button" onClick={logout}>Cerrar sesion</button>;
}

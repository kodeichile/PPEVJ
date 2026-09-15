import AdminProductList from "@/components/AdminProductList";
import LogoutButton from "@/components/LogoutButton";
import ProductForm from "@/components/ProductForm";
import { getSessionUser } from "@/lib/auth";
import { listProducts } from "@/lib/appscript";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const user = await getSessionUser();
  if (!user) redirect("/ingresar");
  const products = await listProducts({ includeInactive: true });

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Administración</p>
          <h1>Panel del catálogo</h1>
          <p>Gestiona productos del vivero desde una ventana separada del sitio público.</p>
        </div>
        <LogoutButton />
      </section>
      <div className="admin-layout">
        <div className="admin-products">
          <div className="admin-toolbar">
            <h2>Productos actuales</h2>
            <span>Conectado a Apps Script</span>
          </div>
          <AdminProductList products={products} />
        </div>
        <div className="admin-side">
          <ProductForm />
        </div>
      </div>
    </main>
  );
}

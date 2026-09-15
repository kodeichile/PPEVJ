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
    <main className="panel-page">
      <h1>Panel de catalogo</h1>
      <p className="muted">Edita precios, activa u oculta productos y agrega nuevos items al catalogo.</p>
      <LogoutButton />
      <div className="admin-layout">
        <AdminProductList products={products} />
        <ProductForm />
      </div>
    </main>
  );
}

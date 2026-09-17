import AdminCatalogPanel from "@/components/AdminCatalogPanel";
import { getSessionUser } from "@/lib/auth";
import { listCategories, listProducts } from "@/lib/appscript";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const user = await getSessionUser();
  if (!user) redirect("/ingresar");
  const products = await listProducts({ includeInactive: true });
  const categories = await listCategories(products);

  return <AdminCatalogPanel initialProducts={products} initialCategories={categories} />;
}

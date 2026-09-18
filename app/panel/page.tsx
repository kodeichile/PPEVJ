import AdminCatalogPanel from "@/components/AdminCatalogPanel";
import { getSessionUser } from "@/lib/auth";
import { listCategories, listProducts, listServices } from "@/lib/appscript";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const user = await getSessionUser();
  if (!user) redirect("/ingresar");
  const products = await listProducts({ includeInactive: true, fresh: true });
  const categories = await listCategories(products, { fresh: true });
  const services = await listServices({ fresh: true });

  return <AdminCatalogPanel initialProducts={products} initialCategories={categories} initialServices={services} />;
}

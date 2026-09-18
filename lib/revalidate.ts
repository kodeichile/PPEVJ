import { revalidatePath } from "next/cache";

export function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/servicios");
  revalidatePath("/servicios/[slug]", "page");
}

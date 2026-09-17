"use client";

import { ChangeEvent, DragEvent, FormEvent, useMemo, useRef, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { moneyFormatter, productCategory, publicImageUrl } from "@/lib/catalog";
import type { Product } from "@/lib/fallback-products";

type EditableProduct = Product & {
  categoria?: string;
  orden?: number;
};

const defaultCategories = ["Frutales", "Árboles Ornamentales", "Arbustos", "Flores", "Árboles", "Aromáticas"];
const fallbackImage = "/catalogo-img/romero-30-cm-29.gif";

const editIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20h4.8L19.2 9.6a2.1 2.1 0 0 0 0-3L17.4 4.8a2.1 2.1 0 0 0-3 0L4 15.2V20Z" />
    <path d="m13.5 5.7 4.8 4.8" />
  </svg>
);

const trashIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 7h14" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M8 7l1 13h6l1-13" />
    <path d="M9 7V5h6v2" />
  </svg>
);

const chevronIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const upIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 15 6-6 6 6" />
  </svg>
);

const downIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const dragIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 6h.01" />
    <path d="M8 12h.01" />
    <path d="M8 18h.01" />
    <path d="M16 6h.01" />
    <path d="M16 12h.01" />
    <path d="M16 18h.01" />
  </svg>
);

function uniqueCategories(products: EditableProduct[], extraCategories: string[] = []) {
  const labels = new Set(extraCategories.length ? extraCategories : defaultCategories);
  extraCategories.forEach((category) => labels.add(category));
  products.forEach((product) => labels.add(product.categoria || productCategory(product)));
  return [...labels];
}

function normalizeProducts(products: Product[]) {
  const counters = new Map<string, number>();
  return products.map((product) => {
    const categoria = product.categoria || productCategory(product);
    const nextOrder = (counters.get(categoria) || 0) + 1;
    counters.set(categoria, nextOrder);
    return {
      ...product,
      categoria,
      orden: Number(product.orden) || nextOrder
    };
  });
}

function sortProducts(products: EditableProduct[]) {
  return [...products].sort((a, b) => (Number(a.orden) || 0) - (Number(b.orden) || 0));
}

async function uploadImage(file: File) {
  const body = new FormData();
  body.set("imagen", file);
  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo subir la imagen.");
  return String(data.url || "");
}

async function saveProduct(id: string, updates: Partial<EditableProduct>) {
  const response = await fetch(`/api/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo actualizar el producto.");
}

async function saveCategory(nombre: string) {
  const response = await fetch("/api/categorias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo guardar la categoría.");
}

async function updateCategoryName(nombre: string, nuevoNombre: string) {
  const response = await fetch(`/api/categorias/${encodeURIComponent(nombre)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre: nuevoNombre })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo actualizar la categoría.");
}

async function removeCategory(nombre: string) {
  const response = await fetch(`/api/categorias/${encodeURIComponent(nombre)}`, { method: "DELETE" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo eliminar la categoría.");
}

export default function AdminCatalogPanel({ initialProducts, initialCategories }: { initialProducts: Product[]; initialCategories: string[] }) {
  const normalizedInitialProducts = useMemo(() => normalizeProducts(initialProducts), [initialProducts]);
  const [products, setProducts] = useState<EditableProduct[]>(() => normalizedInitialProducts);
  const initialCategoryList = useMemo(() => uniqueCategories(normalizedInitialProducts, initialCategories), [normalizedInitialProducts, initialCategories]);
  const [categories, setCategories] = useState(() => initialCategoryList);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(initialCategoryList));
  const [productFormCollapsed, setProductFormCollapsed] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [addPreview, setAddPreview] = useState("");
  const [editing, setEditing] = useState<EditableProduct | null>(null);
  const [editPreview, setEditPreview] = useState("");
  const [editUploadSelected, setEditUploadSelected] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [draggedId, setDraggedId] = useState("");
  const [dropTargetId, setDropTargetId] = useState("");
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const groupedProducts = useMemo(() => {
    return categories.map((category) => ({
      category,
      products: sortProducts(products.filter((product) => (product.categoria || productCategory(product)) === category))
    }));
  }, [categories, products]);

  const activeProducts = useMemo(() => {
    return categories.flatMap((category) => sortProducts(products.filter((product) => product.activo && (product.categoria || productCategory(product)) === category)));
  }, [categories, products]);

  function toggleCategory(category: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = categoryName.trim();
    if (!label) return;
    if (categories.some((item) => item.toLowerCase() === label.toLowerCase())) {
      setCategoryName("");
      return;
    }
    const previousCategories = categories;
    setError("");
    setCategories((current) => current.some((item) => item.toLowerCase() === label.toLowerCase()) ? current : [...current, label]);
    setCollapsed((current) => new Set(current).add(label));
    setCategoryName("");
    try {
      await saveCategory(label);
    } catch (caught) {
      setCategories(previousCategories);
      setError(caught instanceof Error ? caught.message : "No se pudo guardar la categoría.");
    }
  }

  async function renameCategory(category: string) {
    const label = window.prompt("Nuevo nombre de la categoría", category)?.trim();
    if (!label || label === category) return;
    const previousCategories = categories;
    const previousProducts = products;
    setError("");
    setCategories((current) => current.map((item) => (item === category ? label : item)));
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.delete(category)) next.add(label);
      return next;
    });
    const affected = products.filter((product) => (product.categoria || productCategory(product)) === category);
    setProducts((current) => current.map((product) => (
      (product.categoria || productCategory(product)) === category ? { ...product, categoria: label } : product
    )));
    try {
      await updateCategoryName(category, label);
    } catch (caught) {
      setCategories(previousCategories);
      setProducts(previousProducts);
      setError(caught instanceof Error ? caught.message : "No se pudo renombrar la categoría.");
      return;
    }
    affected.forEach((product) => saveProduct(product.id, { categoria: label }).catch(() => undefined));
  }

  async function deleteCategory(category: string) {
    const count = products.filter((product) => (product.categoria || productCategory(product)) === category).length;
    if (count > 0) {
      window.alert("Solo puedes eliminar categorías vacías. Mueve o elimina sus productos primero.");
      return;
    }
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    const previousCategories = categories;
    setError("");
    setCategories((current) => current.filter((item) => item !== category));
    try {
      await removeCategory(category);
    } catch (caught) {
      setCategories(previousCategories);
      setError(caught instanceof Error ? caught.message : "No se pudo eliminar la categoría.");
    }
  }

  function updateAddPreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setAddPreview(URL.createObjectURL(file));
  }

  function clearAddImage() {
    setAddPreview("");
    if (addFileInputRef.current) addFileInputRef.current.value = "";
  }

  function updateEditPreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setEditPreview(URL.createObjectURL(file));
      setEditUploadSelected(true);
    }
  }

  function clearEditImage() {
    setEditPreview(publicImageUrl(editing?.imagen_url, fallbackImage));
    setEditUploadSelected(false);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving("create");
    setError("");
    const form = new FormData(formElement);
    try {
      const file = form.get("imagen") as File;
      let imagen_url = String(form.get("imagen_url") || "");
      if (file?.size) imagen_url = await uploadImage(file);
      if (!imagen_url) imagen_url = fallbackImage;
      const categoria = String(form.get("categoria") || categories[0] || "Arbustos");
      const nextOrder = products.filter((product) => (product.categoria || productCategory(product)) === categoria).length + 1;
      const payload = {
        nombre: String(form.get("nombre") || ""),
        precio: Number(form.get("precio")) || 0,
        descripcion: String(form.get("descripcion") || ""),
        imagen_url,
        categoria,
        orden: nextOrder,
        activo: true
      };
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo crear el producto.");
      const created = (data.product || { ...payload, id: crypto.randomUUID() }) as EditableProduct;
      setProducts((current) => sortProducts([...current, created]));
      if (!categories.includes(categoria)) setCategories((current) => [...current, categoria]);
      formElement.reset();
      clearAddImage();
      setProductFormCollapsed(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar el producto.");
    } finally {
      setSaving("");
    }
  }

  function openEditor(product: EditableProduct) {
    setEditing(product);
    setEditPreview(publicImageUrl(product.imagen_url, fallbackImage));
    setEditUploadSelected(false);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  }

  async function submitEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setSaving("edit");
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const file = form.get("imagen") as File;
      let imagen_url = editing.imagen_url || fallbackImage;
      if (file?.size) imagen_url = await uploadImage(file);
      const updates: Partial<EditableProduct> = {
        nombre: String(form.get("nombre") || ""),
        precio: Number(form.get("precio")) || 0,
        categoria: String(form.get("categoria") || ""),
        descripcion: String(form.get("descripcion") || ""),
        imagen_url
      };
      if (updates.categoria && updates.categoria !== (editing.categoria || productCategory(editing))) {
        updates.orden = products.filter((product) => (product.categoria || productCategory(product)) === updates.categoria).length + 1;
      }
      await saveProduct(editing.id, updates);
      setProducts((current) => current.map((product) => (product.id === editing.id ? { ...product, ...updates } : product)));
      setEditing(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudieron guardar los cambios.");
    } finally {
      setSaving("");
    }
  }

  async function toggleActive(product: EditableProduct) {
    const activo = !product.activo;
    setProducts((current) => current.map((item) => (item.id === product.id ? { ...item, activo } : item)));
    try {
      await saveProduct(product.id, { activo });
    } catch (caught) {
      setProducts((current) => current.map((item) => (item.id === product.id ? { ...item, activo: product.activo } : item)));
      setError(caught instanceof Error ? caught.message : "No se pudo cambiar el estado.");
    }
  }

  async function deleteProduct(product: EditableProduct) {
    if (!window.confirm(`¿Eliminar ${product.nombre}?`)) return;
    setProducts((current) => current.filter((item) => item.id !== product.id));
    try {
      const response = await fetch(`/api/productos/${product.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "No se pudo eliminar el producto.");
    } catch (caught) {
      setProducts((current) => sortProducts([...current, product]));
      setError(caught instanceof Error ? caught.message : "No se pudo eliminar el producto.");
    }
  }

  async function persistOrder(category: string, orderedIds: string[]) {
    await Promise.all(orderedIds.map((id, index) => saveProduct(id, { orden: index + 1, categoria: category })));
  }

  function reorderCategory(category: string, orderedIds: string[]) {
    setProducts((current) => current.map((product) => {
      const order = orderedIds.indexOf(product.id);
      return order >= 0 ? { ...product, categoria: category, orden: order + 1 } : product;
    }));
    persistOrder(category, orderedIds).catch(() => setError("El orden cambió en pantalla, pero no se pudo guardar en la hoja."));
  }

  function moveProduct(product: EditableProduct, direction: -1 | 1) {
    const category = product.categoria || productCategory(product);
    const categoryProducts = sortProducts(products.filter((item) => (item.categoria || productCategory(item)) === category));
    const currentIndex = categoryProducts.findIndex((item) => item.id === product.id);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= categoryProducts.length) return;
    const nextCategoryProducts = [...categoryProducts];
    const [selected] = nextCategoryProducts.splice(currentIndex, 1);
    nextCategoryProducts.splice(nextIndex, 0, selected);
    reorderCategory(category, nextCategoryProducts.map((item) => item.id));
  }

  function dropProduct(category: string, targetId?: string) {
    if (!draggedId) return;
    const dragged = products.find((product) => product.id === draggedId);
    if (!dragged || (dragged.categoria || productCategory(dragged)) !== category) {
      setDraggedId("");
      setDropTargetId("");
      return;
    }
    const categoryProducts = sortProducts(products.filter((product) => (product.categoria || productCategory(product)) === category));
    const withoutDragged = categoryProducts.filter((product) => product.id !== draggedId);
    const targetIndex = targetId ? withoutDragged.findIndex((product) => product.id === targetId) : withoutDragged.length;
    const nextCategoryProducts = [...withoutDragged];
    nextCategoryProducts.splice(targetIndex < 0 ? nextCategoryProducts.length : targetIndex, 0, dragged);
    const orderedIds = nextCategoryProducts.map((product) => product.id);
    reorderCategory(category, orderedIds);
    setDraggedId("");
    setDropTargetId("");
  }

  function allowDrop(event: DragEvent) {
    event.preventDefault();
  }

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

      <section className="admin-dashboard">
        <div className="admin-side">
          <form className="admin-form category-form" onSubmit={createCategory}>
            <h2>Agregar categoría</h2>
            <label>Nombre de categoría<input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} type="text" placeholder="Ej: Flores" required /></label>
            <button className="button primary" type="submit">Crear categoría</button>
          </form>

          <form className={`admin-form admin-category collapsible-form ${productFormCollapsed ? "is-collapsed" : ""}`} onSubmit={createProduct}>
            <button className="category-header form-toggle" type="button" aria-expanded={!productFormCollapsed} onClick={() => setProductFormCollapsed((value) => !value)}>
              <span className="category-toggle form-title"><span><strong>Agregar producto</strong><small>Nuevo producto</small></span></span>
              <span className="category-actions"><span className="category-chevron form-chevron" aria-hidden="true">{chevronIcon}</span></span>
            </button>
            <div className="form-body">
              <label>Nombre<input name="nombre" type="text" placeholder="Ej: Lavanda 40 cm" required /></label>
              <label>Precio<input name="precio" type="number" min="0" step="100" placeholder="3000" required /></label>
              <label>Categoría
                <select name="categoria" required>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <label>Descripción<textarea name="descripcion" rows={4} placeholder="Altura, cuidados o disponibilidad" /></label>
              <label className="admin-upload-field">
                Imagen
                {addPreview && (
                  <span className="upload-preview-wrap">
                    <img className="admin-upload-preview has-image" src={addPreview} alt="Vista previa del producto" />
                    <button className="upload-clear-button" type="button" aria-label="Quitar foto seleccionada" onClick={clearAddImage}>×</button>
                  </span>
                )}
                <span className="file-drop admin-file-drop">Seleccionar foto<input ref={addFileInputRef} name="imagen" type="file" accept="image/*" onChange={updateAddPreview} /></span>
              </label>
              <label>URL de imagen<input name="imagen_url" placeholder="Opcional si subes archivo" /></label>
              <button className="button primary" type="submit" disabled={saving === "create"}>{saving === "create" ? "Guardando..." : "Guardar producto"}</button>
            </div>
          </form>
        </div>

        <div className="admin-products">
          <div className="admin-toolbar">
            <h2>Productos actuales</h2>
            <button className="button primary admin-preview-button" type="button" onClick={() => setPreviewOpen(true)}>Previsualización</button>
            <span>Arrastra para ordenar</span>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <div className="category-list">
            {groupedProducts.map(({ category, products: categoryProducts }) => {
              const isCollapsed = collapsed.has(category);
              return (
                <section className={`admin-category ${isCollapsed ? "is-collapsed" : ""}`} key={category}>
                  <div className="category-header">
                    <button className="category-toggle" type="button" aria-expanded={!isCollapsed} onClick={() => toggleCategory(category)}>
                      <span><strong className="category-name">{category}</strong><small className="category-count">{categoryProducts.length === 1 ? "1 producto" : `${categoryProducts.length} productos`}</small></span>
                    </button>
                    <div className="category-actions" aria-label="Acciones de categoría">
                      <button className="icon-button category-edit-button" type="button" aria-label="Editar categoría" onClick={() => renameCategory(category)}>{editIcon}</button>
                      <button className="icon-button category-delete-button" type="button" aria-label="Eliminar categoría" onClick={() => deleteCategory(category)}>{trashIcon}</button>
                      <button className="category-chevron" type="button" aria-label="Expandir categoría" onClick={() => toggleCategory(category)}>{chevronIcon}</button>
                    </div>
                  </div>
                  <div className="category-products" data-category={category} onDragOver={allowDrop} onDrop={() => dropProduct(category)}>
                    {categoryProducts.map((product) => (
                      <article
                        className={`admin-product-row ${draggedId === product.id ? "is-dragging" : ""} ${dropTargetId === product.id ? "is-drop-target" : ""}`}
                        key={product.id}
                        draggable
                        onDragStart={() => setDraggedId(product.id)}
                        onDragEnd={() => { setDraggedId(""); setDropTargetId(""); }}
                        onDragOver={(event) => { allowDrop(event); setDropTargetId(product.id); }}
                        onDrop={(event) => { event.stopPropagation(); dropProduct(category, product.id); }}
                      >
                        <img src={publicImageUrl(product.imagen_url, fallbackImage)} alt={product.nombre} />
                        <div>
                          <h3>{product.nombre}</h3>
                          <p>{product.activo ? "Activo" : "Oculto"} · {moneyFormatter.format(product.precio)}</p>
                          <span className="category-pill">{category}</span>
                          <div className="product-actions" aria-label="Acciones del producto">
                            <button className="icon-button drag-button" type="button" aria-label="Arrastrar producto">{dragIcon}</button>
                            <button className="icon-button order-button" type="button" aria-label="Subir producto" onClick={() => moveProduct(product, -1)}>{upIcon}</button>
                            <button className="icon-button order-button" type="button" aria-label="Bajar producto" onClick={() => moveProduct(product, 1)}>{downIcon}</button>
                            <button className="icon-button edit-button" type="button" aria-label="Editar producto" onClick={() => openEditor(product)}>{editIcon}</button>
                            <button className="icon-button delete-button" type="button" aria-label="Eliminar producto" onClick={() => deleteProduct(product)}>{trashIcon}</button>
                          </div>
                        </div>
                        <label className="switch-label">
                          <input type="checkbox" checked={product.activo} onChange={() => toggleActive(product)} />
                          <span />
                        </label>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {editing && (
        <section className="edit-product-view is-open" aria-hidden="false" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form className="edit-product-form" onSubmit={submitEditor}>
            <div className="edit-product-header">
              <div>
                <p className="eyebrow">Editar producto</p>
                <h2>Modificar {editing.nombre}</h2>
              </div>
              <button className="edit-close" type="button" aria-label="Cerrar editor" onClick={() => setEditing(null)}>×</button>
            </div>
            <div className="edit-product-grid">
              <div className="edit-image-panel">
                <div className="edit-image-preview-wrap">
                  <img src={editPreview || publicImageUrl(editing.imagen_url, fallbackImage)} alt={`Vista previa de ${editing.nombre}`} />
                  {editUploadSelected && <button className="upload-clear-button" type="button" aria-label="Quitar foto seleccionada" onClick={clearEditImage}>×</button>}
                </div>
                <label className="file-drop">Cambiar foto<input ref={editFileInputRef} name="imagen" type="file" accept="image/*" onChange={updateEditPreview} /></label>
              </div>
              <div className="edit-fields">
                <label>Nombre<input name="nombre" type="text" required defaultValue={editing.nombre} /></label>
                <label>Precio<input name="precio" type="number" min="0" step="100" required defaultValue={editing.precio} /></label>
                <label>Categoría
                  <select name="categoria" required defaultValue={editing.categoria || productCategory(editing)}>
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label>Descripción<textarea name="descripcion" rows={5} defaultValue={editing.descripcion} /></label>
                <div className="edit-form-actions">
                  <button className="button primary" type="submit" disabled={saving === "edit"}>{saving === "edit" ? "Guardando..." : "Guardar cambios"}</button>
                  <button className="button" type="button" onClick={() => setEditing(null)}>Cancelar</button>
                </div>
              </div>
            </div>
          </form>
        </section>
      )}

      <section className={`preview-panel ${previewOpen ? "is-open" : ""}`} aria-hidden={!previewOpen} onMouseDown={(event) => { if (event.target === event.currentTarget) setPreviewOpen(false); }}>
        <div className="preview-shell">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Previsualización</p>
              <h2>Catálogo público</h2>
            </div>
            <button className="edit-close" type="button" aria-label="Cerrar previsualización" onClick={() => setPreviewOpen(false)}>×</button>
          </div>
          <div className="preview-content">
            <div className="preview-catalog-head">
              <p className="eyebrow">Vista cliente</p>
              <h3>Productos disponibles</h3>
            </div>
            <div className="preview-grid" aria-live="polite">
              {activeProducts.map((product) => (
                <article className="preview-card" key={product.id}>
                  <img src={publicImageUrl(product.imagen_url, fallbackImage)} alt={product.nombre} />
                  <div className="preview-card-body">
                    <span>{product.categoria || productCategory(product)}</span>
                    <h4>{product.nombre}</h4>
                    <p>{product.descripcion || "Producto disponible para cotización."}</p>
                    <strong>{moneyFormatter.format(product.precio)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

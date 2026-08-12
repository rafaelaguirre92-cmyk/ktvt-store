"use client";

import { FormEvent, useMemo, useState } from "react";
import Papa from "papaparse";
import type { Product } from "@/lib/catalog";
import { formatCurrency } from "@/lib/catalog";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  total_cents: number;
  status: string;
  payment_status: string;
  created_at: string;
};

type LeadRow = {
  id: string;
  kind: string;
  name: string | null;
  email: string | null;
  organization: string | null;
  created_at: string;
};

type ShippingRow = {
  id: string;
  code: string;
  name: string;
  price_cents: number;
  is_active: boolean;
};

type ContentRow = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
};

type CsvRow = {
  sku: string;
  slug: string;
  title: string;
  price: string;
  stock: string;
  age: string;
  category: string;
  recommended?: string;
  published?: string;
  short_description?: string;
  description?: string;
  recommendation?: string;
};

async function adminRequest(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { "content-type": "application/json", ...init.headers },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "La operación no pudo completarse");
  return body;
}

export function AdminDashboard({
  initialProducts,
  orders,
  leads,
  shipping,
  events,
  articles,
  demo,
}: {
  initialProducts: Product[];
  orders: OrderRow[];
  leads: LeadRow[];
  shipping: ShippingRow[];
  events: ContentRow[];
  articles: ContentRow[];
  demo: boolean;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [eventRows, setEventRows] = useState(events);
  const [articleRows, setArticleRows] = useState(articles);
  const [orderRows, setOrderRows] = useState(orders);
  const [shippingRows, setShippingRows] = useState(shipping);
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const inventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.price * product.stock, 0),
    [products],
  );

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const body = await adminRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          sku: data.get("sku"),
          slug: data.get("slug"),
          title: data.get("title"),
          priceCents: Math.round(Number(data.get("price")) * 100),
          stock: Number(data.get("stock")),
          age: data.get("age"),
          category: data.get("category"),
          shortDescription: data.get("shortDescription"),
          description: data.get("description"),
          recommendation: data.get("recommendation"),
          recommended: data.get("recommended") === "on",
          published: data.get("published") === "on",
        }),
      });
      setProducts((current) => [body.product, ...current]);
      event.currentTarget.reset();
      setMessage("Producto creado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear");
    } finally {
      setBusy(false);
    }
  }

  async function updateProduct(product: Product, changes: Partial<Product>) {
    setBusy(true);
    try {
      const body = await adminRequest("/api/admin/products", {
        method: "PATCH",
        body: JSON.stringify({ id: product.id, ...changes }),
      });
      setProducts((current) => current.map((item) => (item.id === product.id ? body.product : item)));
      setMessage("Producto actualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`¿Eliminar ${product.title}?`)) return;
    setBusy(true);
    try {
      await adminRequest(`/api/admin/products?id=${product.id}`, { method: "DELETE" });
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setMessage("Producto eliminado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  function readCsv(file?: File) {
    if (!file) return;
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete(result) {
        const errors = result.errors.map(
          (error) => `Fila ${(error.row ?? 0) + 2}: ${error.message}`,
        );
        result.data.forEach((row, index) => {
          for (const field of ["sku", "slug", "title", "price", "stock", "age", "category"] as const) {
            if (!row[field]) errors.push(`Fila ${index + 2}: falta ${field}`);
          }
          if (Number.isNaN(Number(row.price))) errors.push(`Fila ${index + 2}: precio inválido`);
          if (!Number.isInteger(Number(row.stock))) errors.push(`Fila ${index + 2}: inventario inválido`);
        });
        setCsvRows(result.data);
        setCsvErrors(errors);
      },
    });
  }

  async function importCsv() {
    if (!csvRows.length || csvErrors.length) return;
    setBusy(true);
    try {
      const body = await adminRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          products: csvRows.map((row) => ({
            sku: row.sku,
            slug: row.slug,
            title: row.title,
            priceCents: Math.round(Number(row.price) * 100),
            stock: Number(row.stock),
            age: row.age,
            category: row.category,
            shortDescription: row.short_description || "",
            description: row.description || "",
            recommendation: row.recommendation || "",
            recommended: ["true", "1", "sí", "si"].includes((row.recommended || "").toLowerCase()),
            published: !["false", "0", "no"].includes((row.published || "true").toLowerCase()),
          })),
        }),
      });
      setProducts(body.products);
      setMessage(`${body.imported} productos importados o actualizados.`);
      setCsvRows([]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo importar");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setBusy(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      await navigator.clipboard.writeText(body.url);
      setMessage("Imagen cargada. La URL quedó copiada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo cargar");
    } finally {
      setBusy(false);
    }
  }

  async function createContent(type: "events" | "articles", event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const common = {
      title: data.get("title"),
      slug: data.get("slug"),
      published: data.get("published") === "on",
    };
    const payload =
      type === "events"
        ? {
            ...common,
            audience: data.get("audience"),
            modality: data.get("modality"),
            duration: data.get("duration"),
            description: data.get("description"),
            startsAt: data.get("startsAt") || undefined,
            priceCents: data.get("price") ? Math.round(Number(data.get("price")) * 100) : undefined,
            capacity: data.get("capacity") ? Number(data.get("capacity")) : undefined,
          }
        : {
            ...common,
            excerpt: data.get("excerpt"),
            category: data.get("category"),
            content: String(data.get("content"))
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.trim())
              .filter(Boolean),
            readingMinutes: Number(data.get("readingMinutes")),
          };
    try {
      const body = await adminRequest(`/api/admin/content/${type}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (type === "events") setEventRows((current) => [body.item, ...current]);
      else setArticleRows((current) => [body.item, ...current]);
      event.currentTarget.reset();
      setMessage(type === "events" ? "Evento creado." : "Artículo creado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  }

  async function toggleContent(type: "events" | "articles", item: ContentRow) {
    setBusy(true);
    try {
      const body = await adminRequest(`/api/admin/content/${type}`, {
        method: "PATCH",
        body: JSON.stringify({ id: item.id, published: !item.is_published }),
      });
      const setter = type === "events" ? setEventRows : setArticleRows;
      setter((current) => current.map((row) => (row.id === item.id ? body.item : row)));
      setMessage("Contenido actualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function deleteContent(type: "events" | "articles", item: ContentRow) {
    if (!window.confirm(`¿Eliminar ${item.title}?`)) return;
    setBusy(true);
    try {
      await adminRequest(`/api/admin/content/${type}?id=${item.id}`, { method: "DELETE" });
      if (type === "events") setEventRows((current) => current.filter((row) => row.id !== item.id));
      else setArticleRows((current) => current.filter((row) => row.id !== item.id));
      setMessage("Contenido eliminado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  async function updateOrder(order: OrderRow, status: string) {
    setBusy(true);
    try {
      const body = await adminRequest("/api/admin/orders", {
        method: "PATCH",
        body: JSON.stringify({ id: order.id, status }),
      });
      setOrderRows((current) =>
        current.map((row) => (row.id === order.id ? { ...row, ...body.order } : row)),
      );
      setMessage("Estado del pedido actualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function updateShipping(method: ShippingRow, form: HTMLFormElement) {
    setBusy(true);
    const data = new FormData(form);
    try {
      const body = await adminRequest("/api/admin/shipping", {
        method: "PATCH",
        body: JSON.stringify({
          id: method.id,
          priceCents: Math.round(Number(data.get("price")) * 100),
          active: data.get("active") === "on",
        }),
      });
      setShippingRows((current) =>
        current.map((row) => (row.id === method.id ? body.method : row)),
      );
      setMessage("Método de entrega actualizado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack lg">
      {demo && (
        <div className="config-banner">
          <strong>Modo demo:</strong> configura Supabase para habilitar escrituras, autenticación,
          pedidos y archivos reales.
        </div>
      )}
      {message && <div className="notice" role="status">{message}</div>}
      <nav className="admin-nav" aria-label="Secciones del panel">
        {["resumen", "productos", "csv", "contenido", "pedidos", "leads", "envios"].map((item) => (
          <a className="button secondary" href={`#${item}`} key={item}>{item}</a>
        ))}
      </nav>

      <section id="resumen" className="grid-3">
        <div className="feature-card"><p className="eyebrow">Productos</p><h2>{products.length}</h2></div>
        <div className="feature-card"><p className="eyebrow">Pedidos</p><h2>{orderRows.length}</h2></div>
        <div className="feature-card"><p className="eyebrow">Valor inventario</p><h2>{formatCurrency(inventoryValue)}</h2></div>
      </section>

      <section id="productos" className="stack">
        <div><p className="eyebrow">Catálogo</p><h2>Productos e inventario</h2></div>
        <details className="card">
          <summary><strong>Agregar producto manualmente</strong></summary>
          <form className="form-grid mt-2" onSubmit={createProduct}>
            <label>SKU<input name="sku" required /></label>
            <label>Slug<input name="slug" required pattern="[a-z0-9-]+" /></label>
            <label className="full">Título<input name="title" required /></label>
            <label>Precio MXN<input name="price" type="number" min="0" step="0.01" required /></label>
            <label>Inventario<input name="stock" type="number" min="0" required /></label>
            <label>Edad<input name="age" required placeholder="3–5 años" /></label>
            <label>Categoría<input name="category" required /></label>
            <label className="full">Descripción corta<input name="shortDescription" required /></label>
            <label className="full">Descripción<textarea name="description" rows={3} /></label>
            <label className="full">Por qué lo recomendamos<textarea name="recommendation" rows={3} /></label>
            <label className="cluster"><input className="w-auto" type="checkbox" name="recommended" /> Recomendado KTVT</label>
            <label className="cluster"><input className="w-auto" type="checkbox" name="published" /> Publicado</label>
            <button className="button primary" disabled={busy}>Guardar producto</button>
          </form>
        </details>
        <div className="table-wrap card">
          <table>
            <thead><tr><th>SKU</th><th>Producto</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td><td>{product.title}</td><td>{formatCurrency(product.price)}</td>
                  <td>
                    <input
                      aria-label={`Inventario de ${product.title}`}
                      className="w-20"
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      onBlur={(event) => {
                        const stock = Number(event.target.value);
                        if (stock !== product.stock) updateProduct(product, { stock });
                      }}
                    />
                  </td>
                  <td>{product.published ? "Publicado" : "Borrador"}</td>
                  <td><div className="cluster">
                    <button className="button secondary" disabled={busy} onClick={() => updateProduct(product, { published: !product.published })}>
                      {product.published ? "Ocultar" : "Publicar"}
                    </button>
                    <button className="button secondary" disabled={busy} onClick={() => deleteProduct(product)}>Eliminar</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="csv" className="stack">
        <div><p className="eyebrow">Carga masiva</p><h2>Importar productos por CSV</h2></div>
        <div className="card stack">
          <p className="muted small">Columnas obligatorias: sku, slug, title, price, stock, age, category.</p>
          <a className="text-link" href="/templates/productos-ktvt.csv" download>Descargar plantilla CSV</a>
          <input type="file" accept=".csv,text/csv" onChange={(event) => readCsv(event.target.files?.[0])} />
          {csvErrors.length > 0 && <div className="notice">{csvErrors.map((error) => <span key={error}>{error}</span>)}</div>}
          {csvRows.length > 0 && <p>{csvRows.length} filas listas para vista previa.</p>}
          <button className="button primary" disabled={busy || !csvRows.length || !!csvErrors.length} onClick={importCsv}>Importar y actualizar por SKU</button>
        </div>
        <div className="card stack">
          <h3>Banco de imágenes</h3>
          <p className="muted small">JPG, PNG, WebP o AVIF, máximo 10 MB.</p>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => uploadImage(event.target.files?.[0])} />
        </div>
      </section>

      <section id="contenido" className="stack">
        <div><p className="eyebrow">Contenido</p><h2>Eventos y artículos</h2></div>
        <div className="grid-2">
          <div className="card stack">
            <h3>Eventos ({eventRows.length})</h3>
            <details>
              <summary><strong>Nuevo evento</strong></summary>
              <form className="stack mt-2" onSubmit={(event) => createContent("events", event)}>
                <label>Título<input name="title" required /></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+" /></label>
                <label>Público<input name="audience" required /></label><label>Modalidad<input name="modality" required /></label>
                <label>Duración<input name="duration" required /></label><label>Fecha<input name="startsAt" type="datetime-local" /></label>
                <label>Precio MXN<input name="price" type="number" min="0" step="0.01" /></label><label>Cupo<input name="capacity" type="number" min="1" /></label>
                <label>Descripción<textarea name="description" required rows={3} /></label>
                <label className="cluster"><input className="w-auto" type="checkbox" name="published" /> Publicado</label>
                <button className="button primary" disabled={busy}>Guardar evento</button>
              </form>
            </details>
            {eventRows.map((item) => <div className="cluster spread" key={item.id}><span>{item.title}</span><div className="cluster"><span className="badge">{item.is_published ? "Publicado" : "Borrador"}</span><button className="button secondary" onClick={() => toggleContent("events", item)}>{item.is_published ? "Ocultar" : "Publicar"}</button><button className="button secondary" onClick={() => deleteContent("events", item)}>Eliminar</button></div></div>)}
          </div>
          <div className="card stack">
            <h3>Artículos ({articleRows.length})</h3>
            <details>
              <summary><strong>Nuevo artículo</strong></summary>
              <form className="stack mt-2" onSubmit={(event) => createContent("articles", event)}>
                <label>Título<input name="title" required /></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+" /></label>
                <label>Categoría<input name="category" required /></label><label>Minutos de lectura<input name="readingMinutes" type="number" min="1" defaultValue="5" required /></label>
                <label>Extracto<textarea name="excerpt" required rows={3} /></label><label>Contenido (separa párrafos con una línea vacía)<textarea name="content" required rows={8} /></label>
                <label className="cluster"><input className="w-auto" type="checkbox" name="published" /> Publicado</label>
                <button className="button primary" disabled={busy}>Guardar artículo</button>
              </form>
            </details>
            {articleRows.map((item) => <div className="cluster spread" key={item.id}><span>{item.title}</span><div className="cluster"><span className="badge">{item.is_published ? "Publicado" : "Borrador"}</span><button className="button secondary" onClick={() => toggleContent("articles", item)}>{item.is_published ? "Ocultar" : "Publicar"}</button><button className="button secondary" onClick={() => deleteContent("articles", item)}>Eliminar</button></div></div>)}
          </div>
        </div>
      </section>

      <section id="pedidos" className="stack">
        <div><p className="eyebrow">Operación</p><h2>Pedidos</h2></div>
        <div className="table-wrap card"><table><thead><tr><th>Folio</th><th>Cliente</th><th>Total</th><th>Pago</th><th>Estado</th></tr></thead><tbody>
          {orderRows.map((order) => <tr key={order.id}><td>{order.order_number}</td><td>{order.customer_name}</td><td>{formatCurrency(order.total_cents)}</td><td>{order.payment_status}</td><td><select aria-label={`Estado de ${order.order_number}`} value={order.status} disabled={busy} onChange={(event) => updateOrder(order, event.target.value)}><option value="pending">Pendiente</option><option value="confirmed">Confirmado</option><option value="preparing">Preparando</option><option value="shipped">Enviado</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select></td></tr>)}
        </tbody></table>{!orderRows.length && <p className="muted">Aún no hay pedidos.</p>}</div>
      </section>

      <section id="leads" className="stack">
        <div><p className="eyebrow">Contactos</p><h2>Leads y formularios</h2></div>
        <div className="table-wrap card"><table><thead><tr><th>Tipo</th><th>Nombre</th><th>Correo</th><th>Organización</th></tr></thead><tbody>
          {leads.map((lead) => <tr key={lead.id}><td>{lead.kind}</td><td>{lead.name || "—"}</td><td>{lead.email || "—"}</td><td>{lead.organization || "—"}</td></tr>)}
        </tbody></table>{!leads.length && <p className="muted">Aún no hay registros.</p>}</div>
      </section>

      <section id="envios" className="stack">
        <div><p className="eyebrow">Configuración</p><h2>Métodos de entrega</h2></div>
        <div className="grid-3">{shippingRows.map((method) => <form className="feature-card stack tight" key={method.id} onSubmit={(event) => { event.preventDefault(); updateShipping(method, event.currentTarget); }}><strong>{method.name}</strong><label>Tarifa MXN<input name="price" type="number" min="0" step="0.01" defaultValue={(method.price_cents / 100).toFixed(2)} /></label><label className="cluster"><input className="w-auto" name="active" type="checkbox" defaultChecked={method.is_active} /> Activo</label><button className="button secondary" disabled={busy}>Guardar</button></form>)}</div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard, PageHero } from "@/components/content";
import { ShopSort } from "@/components/shop-sort";
import { ages, categories } from "@/lib/catalog";
import { getProducts } from "@/lib/repository";
import { sortProducts } from "@/lib/shop-sort";

export const metadata: Metadata = {
  title: "Tienda de Libros Infantiles",
  description:
    "Compra libros infantiles por edad, categoría e intereses. Selección curada para mamás, con recomendaciones por WhatsApp.",
};

type Search = {
  edad?: string;
  categoria?: string;
  disponibilidad?: string;
  recomendados?: string;
  precio?: string;
  orden?: string;
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const search = await searchParams;
  const filtered = (await getProducts()).filter((product) => {
    if (search.edad && search.edad !== "Para toda la familia" && product.age !== search.edad) return false;
    if (search.categoria && product.category !== search.categoria) return false;
    if (search.disponibilidad === "disponible" && product.stock < 1) return false;
    if (search.disponibilidad === "agotado" && product.stock > 0) return false;
    if (search.recomendados === "true" && !product.recommended) return false;
    if (search.precio === "menos-300" && product.price >= 30000) return false;
    if (search.precio === "300-350" && (product.price < 30000 || product.price > 35000)) return false;
    if (search.precio === "mas-350" && product.price <= 35000) return false;
    return true;
  });
  const products = sortProducts(filtered, search.orden);

  return (
    <>
      <PageHero
        eyebrow="Tienda"
        title="Encuentra un libro para tus hijos"
        description="Filtra por edad o tema. Si dudas entre dos, escríbenos por WhatsApp y te orientamos con gusto."
      />
      <section className="section">
        <div className="container shop-layout">
          <aside className="shop-sidebar">
            <form className="filter-sidebar stack" method="get">
              <div className="stack tight">
                <strong>Filtros</strong>
                <p className="small muted">Refina el catálogo y aplica cuando quieras.</p>
              </div>
              {search.orden && <input name="orden" type="hidden" value={search.orden} />}
              <label>
                Edad
                <select name="edad" defaultValue={search.edad || ""}>
                  <option value="">Todas las edades</option>
                  {ages.map((age) => (
                    <option key={age}>{age}</option>
                  ))}
                </select>
              </label>
              <label>
                Categoría
                <select name="categoria" defaultValue={search.categoria || ""}>
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Precio
                <select name="precio" defaultValue={search.precio || ""}>
                  <option value="">Cualquier precio</option>
                  <option value="menos-300">Menos de $300</option>
                  <option value="300-350">$300 a $350</option>
                  <option value="mas-350">Más de $350</option>
                </select>
              </label>
              <label>
                Disponibilidad
                <select name="disponibilidad" defaultValue={search.disponibilidad || ""}>
                  <option value="">Todos</option>
                  <option value="disponible">Disponibles</option>
                  <option value="agotado">Lista de espera</option>
                </select>
              </label>
              <label>
                Selección
                <select name="recomendados" defaultValue={search.recomendados || ""}>
                  <option value="">Todo el catálogo</option>
                  <option value="true">Recomendados</option>
                </select>
              </label>
              <div className="stack tight">
                <button className="button primary" type="submit">
                  Aplicar filtros
                </button>
                <Link className="button secondary" href="/tienda">
                  Limpiar
                </Link>
              </div>
            </form>
          </aside>

          <div className="shop-main stack">
            <Suspense fallback={<p className="muted">Cargando catálogo…</p>}>
              <ShopSort total={products.length} />
            </Suspense>

            {products.length ? (
              <div className="product-grid shop-grid">
                {products.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h2>No encontramos libros con esos filtros</h2>
                <p className="muted">Prueba otra combinación o pídenos una recomendación.</p>
                <Link className="button secondary" href="/tienda">
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

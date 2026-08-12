"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ShopSortOption } from "@/lib/shop-sort";

const options: { value: ShopSortOption; label: string }[] = [
  { value: "destacados", label: "Destacados" },
  { value: "nuevos", label: "Más nuevos" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor calificados" },
  { value: "nombre", label: "Nombre A–Z" },
];

export function ShopSort({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = (params.get("orden") as ShopSortOption) || "destacados";

  function updateSort(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "destacados") next.delete("orden");
    else next.set("orden", value);
    router.push(next.size ? `/tienda?${next.toString()}` : "/tienda");
  }

  return (
    <div className="shop-toolbar">
      <div className="cluster spread baseline">
        <p className="muted">{total} libros encontrados</p>
        <label className="shop-sort">
          Ordenar por
          <select value={current} onChange={(event) => updateSort(event.target.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="small muted">Catálogo demo; productos reales pendientes de carga.</p>
    </div>
  );
}

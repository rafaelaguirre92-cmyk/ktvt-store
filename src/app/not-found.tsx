import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty-state">
        <p className="eyebrow">Página no encontrada</p>
        <h1>Esta historia no está aquí</h1>
        <p className="muted">El enlace pudo cambiar o el contenido todavía no está publicado.</p>
        <div className="cluster">
          <Link className="button primary" href="/tienda">
            Ver la tienda
          </Link>
          <Link className="button secondary" href="/">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

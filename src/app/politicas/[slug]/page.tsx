import type { Metadata } from "next";
import { notFound } from "next/navigation";

const policies = {
  compras: {
    title: "Políticas de compra",
    description: "Condiciones aplicables a pedidos realizados en KTVT.",
    sections: [
      [
        "Pedidos",
        "Los pedidos se consideran recibidos al generarse un folio. La preparación comienza cuando el pago aparece como confirmado, salvo transferencia, que permanece pendiente hasta su validación.",
      ],
      [
        "Precios e inventario",
        "Los precios se muestran en pesos mexicanos. El inventario se valida nuevamente al crear el pedido; si existe una discrepancia, te contactaremos para ofrecer una alternativa o cancelar.",
      ],
      [
        "Pagos",
        "Las pasarelas procesan la información financiera en sus propios entornos. KTVT no almacena números completos de tarjeta.",
      ],
    ],
  },
  "cambios-devoluciones": {
    title: "Cambios y devoluciones",
    description: "Criterios provisionales para solicitar ayuda después de recibir un pedido.",
    sections: [
      [
        "Producto dañado o incorrecto",
        "Escríbenos dentro de los cinco días naturales posteriores a la entrega e incluye el folio y fotografías del empaque y producto. Revisaremos el caso antes de indicar recolección o reposición.",
      ],
      [
        "Cambio de opinión",
        "Los libros deben conservarse sin uso y en las mismas condiciones en que fueron recibidos. El costo de regreso podrá corresponder al cliente.",
      ],
      [
        "Reembolsos",
        "Cuando proceda, se realizará al método original. Los tiempos de acreditación dependen de cada proveedor de pago.",
      ],
    ],
  },
  privacidad: {
    title: "Aviso de privacidad",
    description: "Cómo se utilizarán los datos proporcionados a KTVT.",
    sections: [
      [
        "Datos recopilados",
        "Recopilamos datos de contacto, entrega, pedido y formularios. Las pasarelas de pago procesan directamente los datos financieros.",
      ],
      [
        "Finalidades",
        "Usamos la información para procesar pedidos, responder mensajes, gestionar registros y, cuando exista consentimiento, enviar contenidos y novedades.",
      ],
      [
        "Derechos y contacto",
        "Podrás solicitar acceso, corrección, cancelación u oposición escribiendo al correo de contacto que se confirme antes del lanzamiento.",
      ],
    ],
  },
  terminos: {
    title: "Términos de uso",
    description: "Reglas generales para utilizar este sitio.",
    sections: [
      [
        "Uso del sitio",
        "El contenido se ofrece con fines informativos y comerciales. No se permite utilizar el sitio para actividades ilícitas o que afecten su funcionamiento.",
      ],
      [
        "Contenido",
        "Los textos, selecciones y materiales de KTVT no pueden reproducirse comercialmente sin autorización. Las portadas y marcas de editoriales pertenecen a sus titulares.",
      ],
      [
        "Cambios",
        "Estos términos podrán actualizarse cuando cambien los servicios, proveedores o requisitos legales. Se mostrará la fecha de la versión vigente.",
      ],
    ],
  },
} as const;

type Slug = keyof typeof policies;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies[slug as Slug];
  return policy ? { title: policy.title, description: policy.description } : {};
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const policy = policies[slug as Slug];
  if (!policy) notFound();

  return (
    <article>
      <header className="page-hero">
        <div className="container">
          <div className="narrow stack">
            <p className="eyebrow">Información y confianza</p>
            <h1>{policy.title}</h1>
            <p className="lede">{policy.description}</p>
            <p className="small muted">Versión provisional · 17 de julio de 2026</p>
          </div>
        </div>
      </header>
      <div className="container section">
        <div className="narrow prose">
          <div className="config-banner">
            Este texto operativo debe ser revisado y aprobado por asesoría legal antes del lanzamiento.
          </div>
          {policy.sections.map(([title, content]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{content}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

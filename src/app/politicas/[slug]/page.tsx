import type { Metadata } from "next";
import { notFound } from "next/navigation";

const policies = {
  compras: {
    title: "Políticas de compra",
    description:
      "Consulta cómo se reciben los pedidos, cuándo comienza su preparación y cómo se validan precios, inventario y pagos.",
    eyebrow: "Información para tu compra",
    intro: "Aquí puedes consultar las condiciones aplicables a tus pedidos.",
    sections: [
      [
        "Pedidos",
        "Tu pedido se considera recibido cuando se genera un folio. La preparación comienza después de confirmar el pago. Si eliges transferencia, el pedido permanece pendiente hasta validar el comprobante.",
      ],
      [
        "Precios e inventario",
        "Los precios se muestran en pesos mexicanos. La disponibilidad se valida nuevamente al crear el pedido. Si existe una diferencia, recibirás opciones para sustituir el producto o cancelar.",
      ],
      [
        "Pagos",
        "La información financiera se procesa en el entorno de cada proveedor de pago. Este sitio no almacena números completos de tarjeta.",
      ],
    ],
  },
  "cambios-devoluciones": {
    title: "Cambios y devoluciones",
    description:
      "Consulta los requisitos para reportar un producto dañado o incorrecto, solicitar un cambio o recibir un reembolso.",
    eyebrow: "Ayuda después de tu compra",
    intro: "Consulta los criterios para solicitar ayuda después de recibir tu pedido.",
    sections: [
      [
        "Producto dañado o incorrecto",
        "Inicia tu solicitud dentro de los cinco días naturales posteriores a la entrega. Incluye el folio y fotografías del empaque y del producto. Recibirás indicaciones después de revisar el caso.",
      ],
      [
        "Cambio de opinión",
        "El libro debe conservarse sin uso y en las mismas condiciones en que fue recibido. El costo de devolución puede corresponder a la persona que realizó la compra.",
      ],
      [
        "Reembolsos",
        "Cuando el reembolso proceda, se enviará al método de pago original. El tiempo de acreditación depende de cada proveedor.",
      ],
    ],
  },
  privacidad: {
    title: "Aviso de privacidad",
    description:
      "Consulta qué datos se solicitan, para qué se utilizan y cómo ejercer tus derechos de acceso, rectificación, cancelación u oposición.",
    eyebrow: "Tus datos y tus decisiones",
    intro: "Aquí puedes consultar qué datos se solicitan, para qué se utilizan y cómo ejercer tus derechos.",
    sections: [
      [
        "Datos recopilados",
        "Al comprar o enviar un formulario, puedes proporcionar datos de contacto, entrega, pedido y comunicación. Los datos financieros se procesan directamente con el proveedor de pago elegido.",
      ],
      [
        "Finalidades",
        "Tus datos se utilizan para procesar pedidos, responder mensajes, gestionar registros y, solo cuando das tu consentimiento, enviar contenidos y novedades.",
      ],
      [
        "Derechos y contacto",
        "Puedes solicitar acceso, rectificación, cancelación u oposición mediante el correo de privacidad indicado en la versión vigente de este aviso.",
      ],
    ],
  },
  terminos: {
    title: "Términos de uso",
    description:
      "Consulta las reglas para utilizar el sitio, el alcance de sus contenidos y la forma en que pueden actualizarse estos términos.",
    eyebrow: "Uso claro y responsable",
    intro: "Consulta las reglas generales para utilizar este sitio.",
    sections: [
      [
        "Uso del sitio",
        "El contenido tiene fines informativos y comerciales. No puedes utilizar el sitio para actividades ilícitas ni para acciones que afecten su funcionamiento o la experiencia de otras personas.",
      ],
      [
        "Contenido",
        "Los textos, selecciones y materiales propios no pueden reproducirse con fines comerciales sin autorización. Las portadas, marcas y contenidos de editoriales pertenecen a sus titulares.",
      ],
      [
        "Actualizaciones",
        "Estos términos pueden cambiar cuando se actualicen los servicios, los proveedores o los requisitos legales. La fecha de la versión vigente debe aparecer al inicio de la página.",
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
            <p className="eyebrow">{policy.eyebrow}</p>
            <h1>{policy.title}</h1>
            <p className="lede">{policy.intro}</p>
            <p className="small muted">
              Versión provisional · Requiere revisión y aprobación legal antes del lanzamiento.
            </p>
          </div>
        </div>
      </header>
      <div className="container section">
        <div className="narrow prose">
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

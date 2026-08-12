import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { PageHero } from "@/components/content";
import { DataForm } from "@/components/forms";
import { formatCurrency, formatDate } from "@/lib/catalog";
import { getEvents } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Eventos y talleres",
  description:
    "Talleres creativos y de lectura para mamás, papás e hijos. Dibujo, Narnia y más actividades en familia.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHero
        eyebrow="Talleres"
        title="Actividades para compartir con tus hijos"
        description="No todos van de lectura — y está bien. Hay talleres creativos, de libros y de momentos en familia. Presenciales o en línea."
      />
      <section className="section">
        <div className="container stack lg">
          {events.map((event) => (
            <article className="card split-panel" id={event.slug} key={event.id}>
              <div className="stack">
                <div className="cluster">
                  <span className="badge">{event.type}</span>
                  <span className="badge">{event.modality}</span>
                </div>
                <h2>{event.title}</h2>
                <p className="lede muted">{event.description}</p>
                <div className="grid-2 small">
                  <span className="cluster">
                    <Users size={17} /> {event.audience}
                  </span>
                  <span className="cluster">
                    <Clock size={17} /> {event.duration}
                  </span>
                  <span className="cluster">
                    <MapPin size={17} /> {event.modality}
                  </span>
                  <span className="cluster">
                    <CalendarDays size={17} />{" "}
                    {event.date ? formatDate(event.date) : "Fecha por anunciar"}
                  </span>
                </div>
                {event.date && (
                  <div className="cluster">
                    <strong>{event.price ? formatCurrency(event.price) : "Sin costo"}</strong>
                    {event.capacity && <span className="muted small">Cupo: {event.capacity} personas</span>}
                  </div>
                )}
              </div>
              <div className="summary-box stack">
                <div>
                  <p className="eyebrow">
                    {event.date ? "Reserva tu lugar" : "Avísame cuando haya fecha"}
                  </p>
                  <h3>{event.date ? "Registro directo" : "Formulario de interés"}</h3>
                </div>
                <DataForm
                  kind={event.date ? "event_registration" : "event_interest"}
                  metadata={{ event_slug: event.slug }}
                  fields={[
                    { name: "name", label: "Nombre", required: true },
                    { name: "email", label: "Correo", type: "email", required: true },
                    { name: "phone", label: "WhatsApp", type: "tel", required: true },
                  ]}
                  submitLabel={event.date ? "Registrar mi lugar" : "Quiero enterarme"}
                  successMessage={
                    event.date
                      ? "Tu lugar quedó registrado. Te enviaremos las instrucciones de pago y acceso."
                      : "Te avisaremos cuando se publique una fecha."
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

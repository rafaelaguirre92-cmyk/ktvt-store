"use client";

import { useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export function DataForm({
  kind,
  fields,
  submitLabel,
  successMessage,
  compact = false,
  metadata = {},
}: {
  kind: "newsletter" | "contact" | "organization" | "event_interest" | "event_registration";
  fields: Field[];
  submitLabel: string;
  successMessage: string;
  compact?: boolean;
  metadata?: Record<string, string>;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, ...payload }),
      });
      if (!response.ok) throw new Error("No se pudo enviar");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="notice success" role="status">
        <span>{successMessage}</span>
      </div>
    );
  }

  return (
    <form action={submit} className={compact ? "inline-form" : "form-grid"}>
      <input name="_gotcha" tabIndex={-1} autoComplete="off" className="honeypot" />
      {Object.entries(metadata).map(([name, value]) => (
        <input key={name} name={name} value={value} type="hidden" />
      ))}
      {fields.map((field) => (
        <label className={field.type === "textarea" ? "full" : ""} key={field.name}>
          <span>{field.label}</span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              rows={5}
            />
          ) : field.type === "select" ? (
            <select name={field.name} required={field.required} defaultValue="">
              <option value="" disabled>
                Selecciona una opción
              </option>
              {field.options?.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </label>
      ))}
      <button className="button primary" disabled={status === "sending"} type="submit">
        {status === "sending" ? "Enviando…" : submitLabel}
      </button>
      {status === "error" && (
        <p className="form-error" role="alert">
          Algo se atoró. Intenta otra vez o continúa por WhatsApp.
        </p>
      )}
    </form>
  );
}

export function NewsletterForm() {
  return (
    <DataForm
      compact
      kind="newsletter"
      fields={[
        {
          name: "email",
          label: "Tu correo",
          type: "email",
          required: true,
          placeholder: "Tu correo",
        },
      ]}
      submitLabel="Recibir la guía"
      successMessage="Recibirás la guía en el correo que indicaste."
    />
  );
}

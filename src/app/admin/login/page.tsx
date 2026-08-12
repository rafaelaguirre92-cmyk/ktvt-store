"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient, hasSupabase } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      if (error) throw error;
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next || "/admin");
      router.refresh();
    } catch {
      setError("No pudimos iniciar sesión. Revisa tus datos y el acceso administrativo.");
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="narrow">
        <div className="summary-box stack">
          <div>
            <p className="eyebrow">Área protegida</p>
            <h1>Administración KTVT</h1>
          </div>
          {!hasSupabase ? (
            <div className="config-banner stack">
              <strong>Modo de demostración</strong>
              <p>
                Configura las variables de Supabase para activar autenticación y operaciones
                persistentes. Sin ellas, el panel solo muestra datos de muestra.
              </p>
              <Link className="button primary" href="/admin">
                Ver panel demo
              </Link>
            </div>
          ) : (
            <form className="stack" onSubmit={submit}>
              <label>
                Correo administrativo
                <input name="email" type="email" required autoComplete="username" />
              </label>
              <label>
                Contraseña
                <input name="password" type="password" required autoComplete="current-password" />
              </label>
              <button className="button primary" disabled={loading}>
                {loading ? "Ingresando…" : "Ingresar"}
              </button>
              {error && <p className="form-error">{error}</p>}
            </form>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

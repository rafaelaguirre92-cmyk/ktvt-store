"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export function Analytics() {
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(null);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setConsent(window.localStorage.getItem("ktvt-analytics-consent") as typeof consent);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem("ktvt-analytics-consent", value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
      {consent === "accepted" && metaId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(metaId)});fbq('track','PageView');`}
        </Script>
      )}
      {consent === null && (
        <aside className="cookie-banner" aria-label="Preferencias de analítica">
          <div>
            <strong>Analítica: tú eliges</strong>
            <p className="small muted">
              Sirve para saber qué contenidos te resultan útiles. Puedes decir que no; la tienda
              funciona igual.
            </p>
          </div>
          <div className="cluster">
            <button className="button primary" onClick={() => choose("accepted")}>
              Permitir
            </button>
            <button className="button secondary" onClick={() => choose("rejected")}>
              Rechazar
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

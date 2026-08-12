import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { CartProvider } from "@/components/cart";
import { Footer, Header, WhatsAppButton } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.ktvt.mx"),
  title: {
    default: "Libros infantiles por edad | Historias para compartir",
    template: "%s",
  },
  description:
    "Encuentra libros infantiles que vayan con su edad y con lo que hoy les gusta. Elige más fácil y pide una recomendación para leer en familia.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "KTVT",
    title: "Historias para leer, reír y volver a abrir",
    description:
      "Encuentra libros que vayan con su edad, sus intereses y la forma en que disfrutan leer.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body>
        <CartProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { CartProvider } from "@/components/cart";
import { Footer, Header, WhatsAppButton } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Libros Infantiles · KTVT",
    template: "%s · KTVT",
  },
  description:
    "Selección curada para tus hijos, recomendaciones por edad y orientación por WhatsApp. Talleres en familia y propuestas para escuelas.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "KTVT",
    title: "Libros Infantiles · KTVT",
    description:
      "Libros infantiles que tus hijos sí van a querer leer. Selección pensada para mamás, con recomendaciones personalizadas.",
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

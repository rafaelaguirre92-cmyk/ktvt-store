"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { faFacebookF, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, MessageCircle, X } from "lucide-react";
import { CartButton } from "@/components/cart";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/tienda", label: "Tienda" },
  { href: "/eventos", label: "Eventos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label="KTVT, inicio">
          KTVT <span>logo pendiente</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navigation.map((item) => (
            <Link
              className={pathname === item.href ? "active" : ""}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <CartButton />
          <button
            className="menu-button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Navegación móvil">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="stack">
          <div className="wordmark light">KTVT</div>
          <p>Libros, talleres y actividades en familia — sin complicarte la vida.</p>
          <div className="social-links">
            <a
              href="https://instagram.com"
              rel="noreferrer"
              target="_blank"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://facebook.com"
              rel="noreferrer"
              target="_blank"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://linkedin.com"
              rel="noreferrer"
              target="_blank"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>
        </div>
        <div className="stack tight">
          <strong>Explora</strong>
          <Link href="/tienda">Tienda</Link>
          <Link href="/eventos">Eventos</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/organizaciones">Organizaciones</Link>
        </div>
        <div className="stack tight">
          <strong>Ayuda y confianza</strong>
          <Link href="/faq">Preguntas frecuentes</Link>
          <Link href="/politicas/compras">Políticas de compra</Link>
          <Link href="/politicas/cambios-devoluciones">Cambios y devoluciones</Link>
          <Link href="/politicas/privacidad">Privacidad</Link>
          <Link href="/politicas/terminos">Términos</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} KTVT</span>
        <span>Wireframe funcional · Identidad visual pendiente</span>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  const pathname = usePathname();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5210000000000";
  let message = "Hola, necesito ayuda para elegir un libro para mis hijos.";

  if (pathname.startsWith("/producto/")) {
    const name = decodeURIComponent(pathname.split("/").at(-1) || "este libro").replaceAll("-", " ");
    message = `Hola, quiero una recomendación similar a ${name}.`;
  } else if (pathname === "/organizaciones") {
    message = "Hola, quiero información para mi organización.";
  } else if (pathname.startsWith("/eventos")) {
    message = "Hola, quiero información sobre los talleres de KTVT.";
  } else if (pathname === "/checkout") {
    message = "Hola, necesito ayuda con mi pedido.";
  }

  return (
    <a
      aria-label="Conversar por WhatsApp"
      className="whatsapp"
      href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle size={22} />
      <span>¿Te ayudamos?</span>
    </a>
  );
}

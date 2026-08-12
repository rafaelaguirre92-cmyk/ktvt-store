# KTVT ecommerce MVP

Ecommerce mobile first para libros infantiles y talleres. La interfaz actual es un **wireframe
funcional neutral**: la arquitectura, datos, componentes y flujos son productivos; colores,
tipografías, logo y fotografía se aplicarán después mediante los tokens definidos en
`src/app/globals.css`.

## Incluye

- Home comercial, Nosotros, Tienda, producto, Eventos, Blog, Contacto y Organizaciones.
- FAQ, políticas, privacidad, términos y cambios/devoluciones provisionales.
- Catálogo con filtros, carrito persistente y checkout invitado.
- Stripe, Mercado Pago y PayPal en sandbox; transferencia coordinada por WhatsApp.
- Pedidos transaccionales, inventario, webhooks firmados e idempotencia.
- Panel administrativo con productos, CSV, imágenes, contenido, pedidos, leads y envíos.
- Supabase Auth, Storage, Postgres y RLS.
- Tres artículos iniciales, metadata, Open Graph, JSON-LD, sitemap y robots.
- GA4 y Meta Pixel sujetos a consentimiento.

## Desarrollo local

Requiere Node.js 20 o posterior y Docker si se utilizará Supabase local.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sin variables de Supabase, el sitio público y el panel funcionan con datos demo de solo lectura.
El checkout por transferencia puede recorrerse; las pasarelas requieren una base y credenciales.

## Supabase

El esquema está en `supabase/migrations/` y los datos demo en `supabase/seed.sql`.

```bash
npx supabase start
npx supabase db reset
```

Copia la URL y la publishable key que muestra el CLI a `.env.local`. La service role key solo debe
existir en el servidor; nunca debe usar el prefijo `NEXT_PUBLIC_`.

Para dar acceso administrativo:

1. Crea o invita al usuario desde Supabase Auth.
2. Obtén su UUID.
3. Inserta ese UUID en `public.admins` desde el SQL Editor:

```sql
insert into public.admins (user_id) values ('UUID-DEL-USUARIO');
```

El registro público está desactivado. Todas las tablas expuestas tienen RLS; las escrituras
sensibles pasan por rutas servidor autenticadas.

## Pagos sandbox

Configura las variables del proveedor en `.env.local` y registra estos endpoints:

- Stripe: `POST /api/webhooks/stripe`
- Mercado Pago: `POST /api/webhooks/mercadopago`
- PayPal: `POST /api/webhooks/paypal`

Usa el dominio público de preview para webhooks; `localhost` no es accesible para los proveedores.
No actives claves live hasta validar importes, eventos firmados, reintentos e idempotencia.

La transferencia crea un pedido pendiente y abre WhatsApp con folio y total. Los pedidos cancelados
desde administración liberan inventario mediante una función transaccional.

## Carga de catálogo

La plantilla está disponible en `public/templates/productos-ktvt.csv`. El importador:

- valida columnas y tipos antes de enviar;
- procesa hasta 1,000 filas por operación;
- actualiza por SKU;
- crea categorías inexistentes;
- informa errores por fila.

Las imágenes se guardan en el bucket público `catalog` con límite de 10 MB y tipos JPG, PNG, WebP o
AVIF.

## Calidad

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Playwright valida móvil y escritorio: home, filtros compartibles, carrito persistente y llegada al
checkout.

## Despliegue

El proyecto está preparado para Vercel:

1. Crea el proyecto Supabase productivo y aplica las migraciones.
2. Configura todas las variables de `.env.example` en Vercel.
3. Añade el dominio final a Auth, proveedores de pago y webhooks.
4. Ejecuta build, pruebas y asesores de seguridad/rendimiento de Supabase.
5. Realiza un pedido completo por cada método sandbox antes de activar claves live.

## Checklist previo al lanzamiento

- Definir logo, paleta, tipografías, fotografía e identidad final.
- Sustituir número de WhatsApp, correo, dominio y redes provisionales.
- Cargar el catálogo real y eliminar los datos `KTVT-DEMO-*`.
- Revisar los textos de Nosotros y los tres artículos.
- Obtener revisión legal de políticas, aviso de privacidad y términos.
- Definir proveedor, cobertura y tarifas de entrega local/nacional.
- Activar Resend o proveedor de correo y verificar el dominio remitente.
- Configurar GA4, Meta Pixel y Search Console.
- Probar reembolsos, cancelaciones, inventario y conciliación de pagos.
- Ejecutar pruebas de accesibilidad y rendimiento con los assets finales.

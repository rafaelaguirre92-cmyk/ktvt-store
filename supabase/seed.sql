-- Datos de demostración para desarrollo local. No representan el catálogo productivo.
insert into public.categories (id, slug, name, sort_order)
values
  ('20000000-0000-0000-0000-000000000001', 'primeras-lecturas', 'Primeras lecturas', 1),
  ('20000000-0000-0000-0000-000000000002', 'album-ilustrado', 'Álbum ilustrado', 2),
  ('20000000-0000-0000-0000-000000000003', 'emociones', 'Emociones', 3),
  ('20000000-0000-0000-0000-000000000004', 'naturaleza', 'Naturaleza', 4),
  ('20000000-0000-0000-0000-000000000005', 'familia', 'Familia', 5)
on conflict (id) do nothing;

insert into public.products (
  id, category_id, slug, sku, title, short_description, description, recommendation,
  price_cents, stock, age_range, is_recommended, is_published
)
values
  (
    '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003',
    'la-casa-de-los-abrazos', 'KTVT-DEMO-001', 'La casa de los abrazos',
    'Una historia para conversar sobre cariño, límites y familia.',
    'Un álbum ilustrado de lectura pausada para abrir conversaciones sencillas sobre las distintas formas de expresar afecto.',
    'Permite nombrar lo que sienten sin convertir la lectura en una lección.', 28900, 8, '3–5 años', true, true
  ),
  (
    '00000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004',
    'pequeno-jardin', 'KTVT-DEMO-002', 'Un pequeño jardín',
    'Curiosidad y naturaleza en una historia para leer juntos.',
    'Una niña observa cómo cambia una semilla y descubre que cuidar también es saber esperar.',
    'Conecta la lectura con una actividad cotidiana: sembrar algo en casa.', 31500, 4, '6–8 años', true, true
  ),
  (
    '00000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001',
    'buenas-noches-luna-nueva', 'KTVT-DEMO-003', 'Buenas noches, luna nueva',
    'Ritmo, repetición y calma para las primeras lecturas.',
    'Texto breve y musical pensado para compartir desde los primeros meses.',
    'Su repetición convierte la lectura en una rutina reconocible y tranquila.', 24500, 0, '0–2 años', false, true
  ),
  (
    '00000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005',
    'el-mapa-de-ines', 'KTVT-DEMO-004', 'El mapa de Inés',
    'Una aventura sobre pertenecer, preguntar y encontrar el camino.',
    'Inés dibuja un mapa de los lugares y personas que hacen hogar.',
    'Combina una aventura cercana con oportunidades para dibujar un mapa afectivo.', 34900, 12, '9–12 años', true, true
  )
on conflict (id) do nothing;

insert into public.events (
  id, slug, title, event_type, audience, modality, duration, description,
  price_cents, capacity, starts_at, is_published
)
values
  (
    '10000000-0000-0000-0000-000000000001', 'dibuja-jugadores-favoritos',
    'Dibuja a tus jugadores favoritos', 'Taller creativo', 'Niñas y niños de 6 a 12 años',
    'Presencial · CDMX', '90 minutos',
    'Taller de dibujo para que tus hijos plasmen a sus jugadores o personajes favoritos. Materiales incluidos, ambiente relajado y cero presión.',
    35000, 16, '2026-09-13T11:00:00-06:00', true
  ),
  (
    '10000000-0000-0000-0000-000000000002', 'como-leerle-narnia',
    'Cómo leerle Narnia a tus hijos', 'Taller', 'Mamás y papás',
    'En línea', '75 minutos',
    'Ideas para compartir Las crónicas de Narnia en casa: por dónde empezar, qué enfatizar y cómo hacerlo disfrutable para cada edad.',
    39000, 20, '2026-08-22T19:00:00-06:00', true
  )
on conflict (id) do nothing;

insert into public.articles (
  slug, title, excerpt, category, content, reading_minutes, published_at, is_published
)
values
  (
    'como-elegir-libros-por-edad', 'Cómo elegir libros infantiles según la edad',
    'La edad orienta, pero no decide sola. Estas señales ayudan a elegir un libro que sí invite a volver.',
    'Libros por edad',
    '["Elegir por edad es un buen punto de partida, no una regla rígida.","Para bebés, busca ritmo, contraste y materiales resistentes.","Cuando comienzan a leer de forma autónoma, alterna libros que puedan leer solos con otros acompañados.","La mejor señal es que el libro provoque una pregunta, una risa o la petición de leerlo otra vez."]',
    6, '2026-07-10', true
  ),
  (
    'rutina-de-lectura-en-casa', 'Una rutina de lectura que sí cabe en la vida real',
    'No necesitas media hora perfecta cada noche. Empieza con un momento breve, visible y repetible.',
    'Lectura en casa',
    '["Una rutina sostenible suele ser pequeña.","Deja algunos libros al alcance y acepta releer.","Relaciona la lectura con un momento que ya existe.","Si un día no funciona, retoma al siguiente sin convertirlo en obligación."]',
    5, '2026-07-08', true
  ),
  (
    'tres-actividades-despues-de-leer', 'Tres actividades sencillas después de leer',
    'Dibujar un mapa, cambiar el final o buscar una textura: propuestas sin materiales complicados.',
    'Actividades familiares',
    '["Una actividad puede prolongar el juego del libro, pero no es requisito.","Dibujen el recorrido de un personaje o inventen una escena anterior.","También pueden cambiar una decisión del protagonista.","Papel, colores y objetos cotidianos bastan."]',
    4, '2026-07-05', true
  )
on conflict (slug) do nothing;

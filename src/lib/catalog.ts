export type Product = {
  id: string;
  slug: string;
  sku: string;
  title: string;
  shortDescription: string;
  description: string;
  recommendation: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  age: string;
  category: string;
  recommended: boolean;
  isNew: boolean;
  published: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  type: string;
  audience: string;
  modality: string;
  duration: string;
  price?: number;
  capacity?: number;
  date?: string;
  description: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingMinutes: number;
  content: string[];
};

export const ages = ["0–2 años", "3–5 años", "6–8 años", "9–12 años", "Para toda la familia"];
export const categories = [
  "Primeras lecturas",
  "Álbum ilustrado",
  "Emociones",
  "Naturaleza",
  "Familia",
];

export const products: Product[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    slug: "la-casa-de-los-abrazos",
    sku: "KTVT-DEMO-001",
    title: "La casa de los abrazos",
    shortDescription: "Una historia para conversar sobre cariño, límites y familia.",
    description:
      "Un álbum ilustrado de lectura pausada para abrir conversaciones sencillas sobre las distintas formas de expresar afecto. Ideal para acompañar la rutina antes de dormir.",
    recommendation:
      "Porque permite que niñas y niños nombren lo que sienten sin convertir la lectura en una lección. Da pie a preguntas naturales y a volver al libro muchas veces.",
    price: 28900,
    compareAtPrice: 32900,
    stock: 8,
    age: "3–5 años",
    category: "Emociones",
    recommended: true,
    isNew: false,
    published: true,
    images: [],
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    slug: "pequeno-jardin",
    sku: "KTVT-DEMO-002",
    title: "Un pequeño jardín",
    shortDescription: "Curiosidad y naturaleza en una historia para leer juntos.",
    description:
      "Una niña observa cómo cambia una semilla y descubre que cuidar también es saber esperar. Ilustraciones llenas de detalles invitan a mirar una y otra vez.",
    recommendation:
      "Nos gusta porque conecta la lectura con una actividad cotidiana: sembrar algo en casa y registrar sus cambios.",
    price: 31500,
    stock: 4,
    age: "6–8 años",
    category: "Naturaleza",
    recommended: true,
    isNew: true,
    published: true,
    images: [],
    rating: 4.7,
    reviewCount: 11,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    slug: "buenas-noches-luna-nueva",
    sku: "KTVT-DEMO-003",
    title: "Buenas noches, luna nueva",
    shortDescription: "Ritmo, repetición y calma para las primeras lecturas.",
    description:
      "Texto breve y musical pensado para compartir desde los primeros meses. Cada página propone un pequeño ritual de despedida.",
    recommendation:
      "Su repetición ayuda a anticipar palabras y convierte el momento de lectura en una rutina reconocible y tranquila.",
    price: 24500,
    stock: 0,
    age: "0–2 años",
    category: "Primeras lecturas",
    recommended: false,
    isNew: true,
    published: true,
    images: [],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    slug: "el-mapa-de-ines",
    sku: "KTVT-DEMO-004",
    title: "El mapa de Inés",
    shortDescription: "Una aventura sobre pertenecer, preguntar y encontrar el camino.",
    description:
      "Inés dibuja un mapa de los lugares y personas que hacen hogar. Una historia con capítulos cortos para lectores que comienzan a leer de forma autónoma.",
    recommendation:
      "Combina una aventura cercana con oportunidades para que cada familia dibuje su propio mapa afectivo.",
    price: 34900,
    compareAtPrice: 39900,
    stock: 12,
    age: "9–12 años",
    category: "Familia",
    recommended: true,
    isNew: false,
    published: true,
    images: [],
    rating: 4.6,
    reviewCount: 9,
  },
];

export const events: Event[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    slug: "dibuja-jugadores-favoritos",
    title: "Dibuja a tus jugadores favoritos",
    type: "Taller creativo",
    audience: "Niñas y niños de 6 a 12 años",
    modality: "Presencial · CDMX",
    duration: "90 minutos",
    price: 35000,
    capacity: 16,
    date: "2026-09-13T11:00:00-06:00",
    description:
      "Taller de dibujo para que tus hijos plasmen a sus jugadores o personajes favoritos. Materiales incluidos, ambiente relajado y cero presión.",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    slug: "como-leerle-narnia",
    title: "Cómo leerle Narnia a tus hijos",
    type: "Taller",
    audience: "Mamás y papás",
    modality: "En línea",
    duration: "75 minutos",
    price: 39000,
    capacity: 20,
    date: "2026-08-22T19:00:00-06:00",
    description:
      "Ideas para compartir Las crónicas de Narnia en casa: por dónde empezar, qué enfatizar y cómo hacerlo disfrutable para cada edad.",
  },
];

export const articles: Article[] = [
  {
    slug: "como-elegir-libros-por-edad",
    title: "Cómo elegir libros infantiles según la edad",
    excerpt:
      "La edad orienta, pero no decide sola. Estas señales ayudan a elegir un libro que sí invite a volver.",
    category: "Libros por edad",
    publishedAt: "2026-07-10",
    readingMinutes: 6,
    content: [
      "Elegir por edad es un buen punto de partida, no una regla rígida. También importan los intereses, el momento lector y la forma en que compartirán el libro.",
      "Para bebés, busca ritmo, contraste y materiales resistentes. Entre tres y cinco años funcionan bien las historias que pueden anticipar y las ilustraciones que cuentan algo más que el texto.",
      "Cuando comienzan a leer de forma autónoma, alterna libros que puedan leer solos con otros más complejos que todavía disfruten acompañados.",
      "La mejor señal es sencilla: el libro provoca una pregunta, una risa o la petición de leerlo otra vez.",
    ],
  },
  {
    slug: "rutina-de-lectura-en-casa",
    title: "Una rutina de lectura que sí cabe en la vida real",
    excerpt:
      "No necesitas media hora perfecta cada noche. Empieza con un momento breve, visible y repetible.",
    category: "Lectura en casa",
    publishedAt: "2026-07-08",
    readingMinutes: 5,
    content: [
      "Una rutina sostenible suele ser pequeña. Cinco o diez minutos repetidos tienen más efecto que una sesión larga que ocurre una vez al mes.",
      "Deja algunos libros al alcance, permite que niñas y niños elijan y acepta releer. La repetición construye seguridad y comprensión.",
      "Relaciona la lectura con un momento que ya existe: después del baño, antes de apagar la luz o durante una espera.",
      "Si un día no funciona, no es una deuda. Retoma al siguiente sin convertir la lectura en obligación.",
    ],
  },
  {
    slug: "tres-actividades-despues-de-leer",
    title: "Tres actividades sencillas después de leer",
    excerpt:
      "Dibujar un mapa, cambiar el final o buscar una textura: propuestas sin materiales complicados.",
    category: "Actividades familiares",
    publishedAt: "2026-07-05",
    readingMinutes: 4,
    content: [
      "Una actividad puede prolongar el juego del libro, pero no es requisito para comprenderlo. Úsala solo cuando haya ganas.",
      "Dibujen el recorrido de un personaje, inventen una escena que ocurrió antes de la primera página o encuentren en casa objetos de los colores del libro.",
      "También pueden cambiar una decisión del protagonista y conversar sobre lo que ocurriría. No hay una respuesta correcta.",
      "Mantén los materiales simples. Papel, colores y objetos cotidianos bastan para volver a entrar en la historia.",
    ],
  },
];

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount / 100);

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: date.includes("T") ? "numeric" : undefined,
    minute: date.includes("T") ? "2-digit" : undefined,
  }).format(new Date(date));

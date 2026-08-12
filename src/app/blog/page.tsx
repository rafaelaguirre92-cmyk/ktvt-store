import type { Metadata } from "next";
import { ArticleCard, PageHero } from "@/components/content";
import { getArticles } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guías, recomendaciones y actividades para fomentar la lectura en casa.",
};

export default async function BlogPage() {
  const articles = await getArticles();
  const categories = [
    "Libros por edad",
    "Lectura en casa",
    "Recomendaciones",
    "Actividades familiares",
    "Guías",
  ];

  return (
    <>
      <PageHero
        eyebrow="Ideas para leer en familia"
        title="Acompañamiento que puedes llevar a casa"
        description="Guías concretas, recomendaciones honestas y actividades sencillas para disfrutar más las historias."
      />
      <section className="section">
        <div className="container">
          <div className="cluster mb-4">
            {categories.map((category) => (
              <span className="badge" key={category}>
                {category}
              </span>
            ))}
          </div>
          <div className="grid-3">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

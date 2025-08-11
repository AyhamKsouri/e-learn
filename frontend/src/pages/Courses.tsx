import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { CourseCard } from "@/components/CourseCard";
import { mockCourses } from "@/data/mockCourses";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Courses() {
  const [q, setQ] = useState("");
  const { t } = useTranslation();
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return mockCourses;
    return mockCourses.filter(
      (c) => c.title.toLowerCase().includes(s) || c.instructor.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <div className="container py-12">
      <Helmet>
        <title>{t("courses.meta.title")}</title>
        <meta name="description" content={t("courses.meta.description") as string} />
        <link rel="canonical" href="/courses" />
      </Helmet>

      <section className="mb-8">
        <h1 className="text-3xl font-semibold">{t("courses.heading")}</h1>
        <p className="text-muted-foreground">{t("courses.subheading")}</p>
      </section>

      <div className="mb-8 max-w-xl">
        <Input
          placeholder={t("courses.searchPlaceholder") as string}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </section>
    </div>
  );
}

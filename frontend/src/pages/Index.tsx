// Update this page (the content is just a fallback if you fail to update the page)

import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import StudentWelcome from "@/components/StudentWelcome";
import hero from "@/assets/hero-education.jpg";
import { mockCourses } from "@/data/mockCourses";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description") as string} />
        <link rel="canonical" href="/" />
      </Helmet>

      <section
        onMouseMove={(e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        className="relative overflow-hidden border-b"
        style={{
          backgroundImage: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary-glow)/0.15), transparent 40%)`,
        }}
      >
        <div className="container grid lg:grid-cols-2 gap-10 py-20 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              {t("home.hero.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("home.hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" className="px-6 py-6 text-base">
                <Link to="/courses">{t("home.hero.browse")}</Link>
              </Button>
              <Button asChild variant="outline" className="px-6 py-6 text-base">
                <Link to="/dashboard/teacher">{t("home.hero.becomeTeacher")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[16/10] rounded-lg overflow-hidden border shadow-lg">
              <img src={hero} alt={t("home.hero.imgAlt") as string} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Student Welcome Section - Shows personalized content for logged-in students */}
      <StudentWelcome />

      <section className="container py-16">
        <h2 className="text-2xl font-semibold">{t("home.featured.title")}</h2>
        <p className="text-muted-foreground">{t("home.featured.subtitle")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockCourses.slice(0, 3).map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;

// frontend/src/pages/about.tsx
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import teamImage from "@/assets/images/team-learning.jpg"; // Example image, replace with actual path

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("about.meta.title")}</title>
        <meta
          name="description"
          content={t("about.meta.description") as string}
        />
      </Helmet>

      {/* Hero Section - Now matches your site theme */}
      <section className="relative overflow-hidden border-b">
        <div className="container py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            {t("about.hero.title")} <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">EduFlow</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
            {t("about.hero.subtitle")}
          </p>
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link to="/courses">{t("home.hero.browse")}</Link>
          </Button>
        </div>
        
        {/* Subtle gradient background matching your main page */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </section>

      {/* Mission & Story - Clean, consistent styling */}
      <section className="py-16">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-6">
              {t("about.mission.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t("about.mission.description")}
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link to="/courses">{t("about.mission.button")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border shadow-lg">
              <img
                src={teamImage}
                alt="Team collaborating on education technology"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Subtle accent overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-xl" />
          </div>
        </div>
      </section>

      {/* Features Overview - Consistent with your site */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold mb-12">
            {t("about.features.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">
                {t("about.features.learnAtPace.title")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("about.features.learnAtPace.description")}
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">
                {t("about.features.expertTeachers.title")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("about.features.expertTeachers.description")}
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">
                {t("about.features.modernTech.title")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("about.features.modernTech.description")}
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3">
                {t("about.features.communitySupport.title")}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("about.features.communitySupport.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - New addition to build credibility */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">{t("about.stats.activeStudents")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">{t("about.stats.expertTeachers")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">{t("about.stats.satisfactionRate")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Footer - Now matches your site theme */}
      <section className="py-16 bg-muted/50 border-t">
        <div className="container text-center">
          <h2 className="text-3xl font-semibold mb-4">
            {t("about.cta.title")}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            {t("about.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link to="/auth">{t("about.cta.getStarted")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Link to="/courses">{t("about.cta.exploreCourses")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

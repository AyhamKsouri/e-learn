import { ArrowRight, BookOpen, Users, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import StudentWelcome from "@/components/StudentWelcome";
import hero from "@/assets/hero-education.jpg";
import { mockCourses } from "@/data/mockCourses";
import { CourseCard } from "@/components/CourseCard";
import { useTranslation } from "react-i18next";
import { useUser } from "@/contexts/UserContext"; // your hook

const Index = () => {
  const { user } = useUser(); // get the logged-in user
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { t } = useTranslation();

  const features = [
    { icon: BookOpen, title: "Create Courses", description: "Build comprehensive courses with structured lessons and resources" },
    { icon: Users, title: "Manage Students", description: "Track student progress and engage with your learning community" },
    { icon: Star, title: "Analytics & Reviews", description: "Monitor performance with detailed analytics and student feedback" },
    { icon: TrendingUp, title: "Grow Your Revenue", description: "Scale your teaching business with powerful monetization tools" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{t("home.meta.title")}</title>
        <meta name="description" content={t("home.meta.description") as string} />
        <link rel="canonical" href="/" />
      </Helmet>

      {user?.role === "teacher" ? (
        <>
          {/* Teacher Hero Section */}
          <section className="container mx-auto px-6 pt-20 pb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-6">
                Teach. Share. Inspire.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create and sell online courses with our comprehensive teaching platform. 
                Build your curriculum, engage students, and grow your educational business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-strong)] transition-all duration-300">
                  <Link to="/dashboard/teacher">
                    Start Teaching
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools you need to create, market, and sell your courses online.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-[var(--shadow-medium)] transition-all duration-300 bg-gradient-to-b from-card to-muted/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Student / General Hero Section */}
          <section
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
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

          {/* Student Welcome Section */}
          <StudentWelcome />

          {/* Featured Courses */}
          <section className="container py-16">
            <h2 className="text-2xl font-semibold">{t("home.featured.title")}</h2>
            <p className="text-muted-foreground">{t("home.featured.subtitle")}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockCourses.slice(0, 3).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import { Loader2, BookOpen, Users, Star, Clock, GraduationCap, Globe, Shield, Zap } from "lucide-react";
import StudentWelcome from "@/components/StudentWelcome";
import { CourseCard } from "@/components/CourseCard";
import { coursesAPI } from "@/api/courses";
import type { Course } from "@/api/courses";
import hero from "@/assets/hero-education.jpg";

const Index = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Fetch featured courses
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await coursesAPI.getAll({ limit: 3, sortBy: 'rating', sortOrder: 'desc' });
        setFeaturedCourses(response.courses);
      } catch (error) {
        console.error('Failed to fetch featured courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: t("home.features.learnAtPace.title"),
      description: t("home.features.learnAtPace.description"),
    },
    {
      icon: Users,
      title: t("home.features.expertTeachers.title"),
      description: t("home.features.expertTeachers.description"),
    },
    {
      icon: Zap,
      title: t("home.features.modernTech.title"),
      description: t("home.features.modernTech.description"),
    },
    {
      icon: Globe,
      title: t("home.features.communitySupport.title"),
      description: t("home.features.communitySupport.description"),
    },
  ];

  // Render different content based on user role
  if (user?.role === 'teacher') {
    return (
      <div className="min-h-screen">
        {/* Teacher Hero Section */}
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
                {t("home.teacherHero.title")}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{t("home.teacherHero.subtitle")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" className="px-6 py-6 text-base">
                  <Link to="/dashboard/teacher">{t("home.teacherHero.dashboard")}</Link>
                </Button>
                <Button asChild variant="outline" className="px-6 py-6 text-base">
                  <Link to="/dashboard/teacher/create-course">{t("home.teacherHero.createCourse")}</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[16/10] rounded-lg overflow-hidden border shadow-lg">
                <img src={hero} alt={t("home.teacherHero.imgAlt") as string} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Teacher Features */}
        <section className="container py-16">
          <h2 className="text-2xl font-semibold">{t("home.teacherFeatures.title")}</h2>
          <p className="text-muted-foreground">{t("home.teacherFeatures.subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
                <Link to="/auth">{t("home.hero.becomeTeacher")}</Link>
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
        
        {loadingCourses ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{t("home.featured.loading")}</span>
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center py-12">
            <p className="text-muted-foreground">{t("home.featured.noCourses")}</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/auth">{t("home.featured.becomeTeacher")}</Link>
            </Button>
          </div>
        )}
        
        {featuredCourses.length > 0 && (
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/courses">{t("home.featured.viewAll")}</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;

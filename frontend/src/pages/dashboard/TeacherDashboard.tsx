import { useState, useEffect } from "react";
import { Plus, Users, DollarSign, Star, TrendingUp, BookOpen, PlayCircle, Edit3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsCard } from "@/components/ui/analytics-card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { courseAPI } from "@/api/teacher";
import type { Course } from "@/api/courses";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseAPI.getTeacherCourses();
        setCourses(response.courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Calculate dashboard statistics
  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);
  const totalRevenue = courses.reduce((sum, course) => {
    return sum + (course.price * course.enrolledStudents.length);
  }, 0);
  
  const coursesWithRatings = courses.filter(c => c.rating.average > 0);
  const averageRating = coursesWithRatings.length > 0 
    ? coursesWithRatings.reduce((sum, course) => sum + course.rating.average, 0) / coursesWithRatings.length 
    : 0;
  
  const publishedCourses = courses.filter(c => c.isPublished).length;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t("dashboards.teacher.loading")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t("dashboards.teacher.heading")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboards.teacher.subtitle")}
          </p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/teacher/create-course")}
          className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-medium)] transition-all duration-300"
        >
          <Plus className="h-4 h-4 mr-2" />
          {t("dashboards.teacher.createCourse")}
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          change="+12% from last month"
          changeType="positive"
          icon={<Users className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+8% from last month"
          changeType="positive"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Average Rating"
          value={averageRating.toFixed(1)}
          change="Excellent performance"
          changeType="positive"
          icon={<Star className="w-4 h-4" />}
        />
        <AnalyticsCard
          title="Published Courses"
          value={publishedCourses.toString()}
          change={`${courses.length - publishedCourses} in draft`}
          changeType="neutral"
          icon={<BookOpen className="w-4 h-4" />}
        />
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{t("dashboards.teacher.yourCourses")}</h2>
          <Button variant="outline" onClick={() => navigate("/dashboard/teacher/courses")}>
            {t("dashboards.teacher.viewAllCourses")}
          </Button>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("dashboards.teacher.noCourses")}</h3>
            <p className="text-muted-foreground mb-6">
              {t("dashboards.teacher.noCoursesSubtitle")}
            </p>
            <Button 
              onClick={() => navigate("/dashboard/teacher/create-course")}
              className="bg-gradient-to-r from-primary to-primary-glow"
            >
              <Plus className="h-4 h-4 mr-2" />
              {t("dashboards.teacher.createFirstCourse")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course._id} className="group hover:shadow-[var(--shadow-medium)] transition-all duration-300 bg-gradient-to-br from-card to-muted/10">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <BookOpen className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                      {course.isPublished ? "published" : "draft"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {course.description}
                      </CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => navigate(`/dashboard/teacher/courses/${course._id}/edit`)}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{course.enrolledStudents.length} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-muted-foreground" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    {course.enrolledStudents.length > 0 && (
                      <>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span>${(course.price * course.enrolledStudents.length).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-muted-foreground" />
                          <span>{course.rating.average.toFixed(1)}/5.0</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate(`/dashboard/teacher/courses/${course._id}`)}
                    >
                      Manage
                    </Button>
                    {course.isPublished && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/dashboard/teacher/courses/${course._id}/analytics`)}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
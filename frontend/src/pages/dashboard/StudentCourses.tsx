import { useState, useEffect } from "react";
import { Search, BookOpen, Clock, Star, TrendingUp, Play, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { coursesAPI } from "@/api/courses";
import type { Course } from "@/api/courses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

interface EnrolledCourse extends Course {
  progress: number;
  enrolledAt: string;
  lastAccessed?: string;
}

const StudentCourses = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user?.enrolledCourses) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch course details for each enrolled course
        const coursePromises = user.enrolledCourses.map(async (enrollment) => {
          try {
            const course = await coursesAPI.getById(enrollment.course);
            return {
              ...course,
              progress: enrollment.progress,
              enrolledAt: enrollment.enrolledAt,
            } as EnrolledCourse;
          } catch (err) {
            console.error(`Failed to fetch course ${enrollment.course}:`, err);
            return null;
          }
        });

        const courses = (await Promise.all(coursePromises)).filter(Boolean) as EnrolledCourse[];
        setEnrolledCourses(courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch enrolled courses');
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  // Filter courses based on search
  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate overall stats
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const inProgressCourses = enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length;
  const notStartedCourses = enrolledCourses.filter(course => course.progress === 0).length;
  const averageProgress = totalCourses > 0
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses)
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t("student.courses.loading")}</span>
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
            {t("student.courses.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("student.courses.subtitle")}
          </p>
        </div>
        <Button
          onClick={() => navigate("/courses")}
          className="bg-gradient-to-r from-primary to-primary-glow"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          {t("student.courses.browseCourses")}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalCourses}</div>
                <div className="text-sm text-muted-foreground">{t("student.courses.stats.totalCourses")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success-glow/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <div className="text-2xl font-bold">{completedCourses}</div>
                <div className="text-sm text-muted-foreground">{t("student.courses.stats.completed")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning-glow/5 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-warning" />
              <div>
                <div className="text-2xl font-bold">{inProgressCourses}</div>
                <div className="text-sm text-muted-foreground">{t("student.courses.stats.inProgress")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-muted/5 to-muted-glow/5 border-muted/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{averageProgress}%</div>
                <div className="text-sm text-muted-foreground">{t("student.courses.stats.avgProgress")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("student.courses.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          {enrolledCourses.length === 0 ? (
            <>
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("student.courses.noCoursesEnrolled")}</h3>
              <p className="text-muted-foreground mb-6">
                {t("student.courses.startJourney")}
              </p>
              <Button
                onClick={() => navigate("/courses")}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {t("student.courses.browseCourses")}
              </Button>
            </>
          ) : (
            <>
              <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("student.courses.noCoursesFound")}</h3>
              <p className="text-muted-foreground mb-6">
                {t("student.courses.adjustSearch")}
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                {t("student.courses.clearSearch")}
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course._id} className="group hover:shadow-[var(--shadow-medium)] transition-all duration-300">
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
                  <Badge variant={course.progress === 100 ? "default" : course.progress > 0 ? "secondary" : "outline"}>
                    {course.progress === 100 ? "Completed" : course.progress > 0 ? "In Progress" : "Not Started"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{course.category}</Badge>
                  <Badge variant="outline" className="text-xs">{course.level}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Section */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>{t("student.courses.progress")}</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-muted-foreground" />
                    <span>{course.lessons.length} {t("student.courses.lessons")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 w-4 text-muted-foreground" />
                    <span>{Math.floor(course.duration)}h</span>
                  </div>
                  {course.rating.average > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <span>{course.rating.average.toFixed(1)}/5.0</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    {course.progress === 100 ? "Review Course" : "Continue Learning"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/courses/${course._id}/progress`)}
                  >
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredCourses.length > 0 && (
        <div className="text-center py-6 border-t">
          <p className="text-muted-foreground">
            {t("student.courses.showingCourses")} {filteredCourses.length} {t("student.courses.of")} {enrolledCourses.length} {t("student.courses.enrolledCourses")}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

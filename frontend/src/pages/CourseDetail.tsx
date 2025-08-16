import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { coursesAPI, Course } from "@/api/courses";
import { Loader2, Clock, Users, Star, BookOpen, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const courseData = await coursesAPI.getById(id);
        setCourse(courseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Format duration from hours to readable format
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours === 1) return '1h';
    return `${hours}h`;
  };

  // Format lesson duration from minutes to readable format
  const formatLessonDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading course...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-16">
        <Alert>
          <AlertDescription>
            {error || 'Course not found'}
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link to="/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("course.backToCourses")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Helmet>
        <title>{course.title} | EduFlow</title>
        <meta name="description" content={course.description} />
        <link rel="canonical" href={`/courses/${course._id}`} />
      </Helmet>

      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/courses">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="aspect-video rounded-md overflow-hidden border">
            <div
              className="h-full w-full bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)))]"
              style={{ 
                backgroundImage: course.thumbnail ? `url(${course.thumbnail})` : undefined, 
                backgroundSize: course.thumbnail ? "cover" : undefined, 
                backgroundPosition: "center" 
              }}
            />
          </div>

          {/* Course Info */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            
            <h1 className="text-3xl font-semibold">{course.title}</h1>
            
            <div className="flex items-center gap-6 mt-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{course.enrolledStudents.length} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>{course.rating.average.toFixed(1)} ({course.rating.count} reviews)</span>
              </div>
            </div>

            <p className="mt-4 text-base leading-relaxed">{course.description}</p>

            {/* Tags */}
            {course.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lessons */}
          {course.lessons.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t("course.lessons")} ({course.lessons.length})
              </h2>
              <ul className="mt-3 space-y-2">
                {course.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <li key={lesson._id || index} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">#{index + 1}</span>
                        <div>
                          <span className="font-medium">{lesson.title}</span>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {formatLessonDuration(lesson.duration)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Instructor Info */}
          <div className="mt-8 p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-3">About the Instructor</h3>
            <div className="flex items-center gap-3">
              {course.instructor.profileImage && (
                <img 
                  src={course.instructor.profileImage} 
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">{course.instructor.name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <Card className="p-6 sticky top-24">
            <div className="text-3xl font-semibold">${course.price.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">{t("course.oneTimePurchase")}</p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lessons:</span>
                <span>{course.lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="capitalize">{course.level}</span>
              </div>
            </div>

            <Button className="mt-6 w-full">{t("course.buyNow")}</Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link to="/auth">{t("course.signInToSave")}</Link>
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

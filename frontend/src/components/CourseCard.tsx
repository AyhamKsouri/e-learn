import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Course } from "@/api/courses";

export function CourseCard({ course }: { course: Course }) {
  const { t } = useTranslation();
  
  // Format duration from hours to readable format
  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours === 1) return '1h';
    return `${hours}h`;
  };

  // Get instructor name
  const instructorName = course.instructor?.name || 'Unknown Instructor';
  
  // Get rating with fallback
  const rating = course.rating?.average || 0;
  
  // Get thumbnail or use default
  const thumbnail = course.thumbnail || '/placeholder-course.jpg';

  return (
    <Card className="group overflow-hidden h-full border hover:shadow-lg transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5">
      <div className="relative aspect-[16/9] overflow-hidden">
        <div
          className="h-full w-full bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)))]"
          style={{ 
            backgroundImage: thumbnail ? `url(${thumbnail})` : undefined, 
            backgroundSize: thumbnail ? "cover" : undefined, 
            backgroundPosition: "center" 
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t("courseCard.by", { instructor: instructorName })}</span>
          <span className="font-medium">${course.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{course.category}</span>
          <span>{course.level}</span>
          <span>{formatDuration(course.duration)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">⭐ {rating.toFixed(1)}</span>
        <Button asChild size="sm">
          <Link to={`/courses/${course._id}`}>{t("courseCard.view")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

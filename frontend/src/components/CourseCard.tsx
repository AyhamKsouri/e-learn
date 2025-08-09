import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Lesson = { title: string; duration: string };
export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  rating: number;
  image?: string;
  lessons?: Lesson[];
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group overflow-hidden h-full border hover:shadow-lg transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5">
      <div className="relative aspect-[16/9] overflow-hidden">
        <div
          className="h-full w-full bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)))]"
          style={{ backgroundImage: course.image ? `url(${course.image})` : undefined, backgroundSize: course.image ? "cover" : undefined, backgroundPosition: "center" }}
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">By {course.instructor}</span>
          <span className="font-medium">${course.price.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">⭐ {course.rating.toFixed(1)}</span>
        <Button asChild size="sm">
          <Link to={`/courses/${course.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

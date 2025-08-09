import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { mockCourses } from "@/data/mockCourses";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CourseDetail() {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="container py-16">
        <p className="text-muted-foreground">Course not found.</p>
        <Button asChild className="mt-4"><Link to="/courses">Back to courses</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Helmet>
        <title>{course.title} | EduFlow</title>
        <meta name="description" content={course.description} />
        <link rel="canonical" href={`/courses/${course.id}`} />
      </Helmet>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-md overflow-hidden border">
            <div
              className="h-full w-full bg-[linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)))]"
              style={{ backgroundImage: course.image ? `url(${course.image})` : undefined, backgroundSize: course.image ? "cover" : undefined, backgroundPosition: "center" }}
            />
          </div>
          <h1 className="mt-6 text-3xl font-semibold">{course.title}</h1>
          <p className="text-muted-foreground mt-2">By {course.instructor} • ⭐ {course.rating.toFixed(1)}</p>
          <p className="mt-4 text-base leading-relaxed">{course.description}</p>

          <h2 className="mt-8 text-xl font-medium">Lessons</h2>
          <ul className="mt-3 space-y-2">
            {course.lessons?.map((l, i) => (
              <li key={i} className="flex items-center justify-between rounded-md border p-3">
                <span>{l.title}</span>
                <span className="text-muted-foreground text-sm">{l.duration}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <Card className="p-6 sticky top-24">
            <div className="text-3xl font-semibold">${course.price.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">One-time purchase</p>
            <Button className="mt-6 w-full">Buy Now (Mock)</Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link to="/auth">Sign in to save progress</Link>
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

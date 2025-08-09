import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  return (
    <div className="container py-12 space-y-8">
      <Helmet>
        <title>Teacher Dashboard | EduFlow</title>
        <meta name="description" content="Create and manage your courses on EduFlow." />
        <link rel="canonical" href="/dashboard/teacher" />
      </Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your Teaching</h1>
        <Button variant="hero">Create Course</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">$1,842</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Enrolled Students</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">128</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Courses</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">4</CardContent>
        </Card>
      </div>
    </div>
  );
}

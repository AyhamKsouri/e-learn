import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboard() {
  return (
    <div className="container py-12 space-y-8">
      <Helmet>
        <title>Student Dashboard | EduFlow</title>
        <meta name="description" content="Track your learning progress on EduFlow." />
        <link rel="canonical" href="/dashboard/student" />
      </Helmet>

      <h1 className="text-3xl font-semibold">Your Learning</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Active Courses</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">3</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completed</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">5</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Hours Studied</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">42</CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="container py-12 space-y-8">
      <Helmet>
        <title>Admin Dashboard | EduFlow</title>
        <meta name="description" content="Manage users, reports and analytics on EduFlow." />
        <link rel="canonical" href="/dashboard/admin" />
      </Helmet>

      <h1 className="text-3xl font-semibold">Platform Overview</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">2,431</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Courses</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">87</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">$12,094</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reports</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">6</CardContent>
        </Card>
      </div>
    </div>
  );
}

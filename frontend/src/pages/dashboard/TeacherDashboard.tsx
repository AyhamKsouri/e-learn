import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function TeacherDashboard() {
  const { t } = useTranslation();
  return (
    <div className="container py-12 space-y-8">
      <Helmet>
        <title>{t("dashboards.teacher.meta.title")}</title>
        <meta name="description" content={t("dashboards.teacher.meta.description") as string} />
        <link rel="canonical" href="/dashboard/teacher" />
      </Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("dashboards.teacher.heading")}</h1>
        <Button variant="hero">{t("dashboards.teacher.createCourse")}</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{t("dashboards.teacher.stats.totalSales")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">$1,842</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.teacher.stats.enrolledStudents")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">128</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.teacher.stats.courses")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">4</CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function StudentDashboard() {
  const { t } = useTranslation();
  return (
    <div className="container py-12 space-y-8">
      <Helmet>
        <title>{t("dashboards.student.meta.title")}</title>
        <meta name="description" content={t("dashboards.student.meta.description") as string} />
        <link rel="canonical" href="/dashboard/student" />
      </Helmet>

      <h1 className="text-3xl font-semibold">{t("dashboards.student.heading")}</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>{t("dashboards.student.stats.activeCourses")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">3</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.student.stats.completed")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">5</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.student.stats.hoursStudied")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">42</CardContent>
        </Card>
      </div>
    </div>
  );
}

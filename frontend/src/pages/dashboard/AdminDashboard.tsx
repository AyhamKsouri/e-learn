import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <div className="container py-12 space-y-8">
      <Helmet>
        <title>{t("dashboards.admin.meta.title")}</title>
        <meta name="description" content={t("dashboards.admin.meta.description") as string} />
        <link rel="canonical" href="/dashboard/admin" />
      </Helmet>

      <h1 className="text-3xl font-semibold">{t("dashboards.admin.heading")}</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>{t("dashboards.admin.stats.users")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">2,431</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.admin.stats.activeCourses")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">87</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.admin.stats.monthlyRevenue")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">$12,094</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t("dashboards.admin.stats.reports")}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold">6</CardContent>
        </Card>
      </div>
    </div>
  );
}

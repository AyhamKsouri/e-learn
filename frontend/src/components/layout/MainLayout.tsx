import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/features/theme/ThemeToggle";
import LanguageSwitcher from "@/features/i18n/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"} transition-colors`;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-semibold text-lg tracking-tight">
            {t("brand.name")}
          </Link>
          {!isMobile && (
            <nav className="flex items-center gap-6 text-sm">
              <NavLink to="/" end className={navLinkCls}>
                {t("nav.home")}
              </NavLink>
              <NavLink to="/courses" className={navLinkCls}>
                {t("nav.courses")}
              </NavLink>
              <NavLink to="/about" className={navLinkCls}>
                {t("nav.about")}
              </NavLink>
             
            </nav>
          )}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild variant="outline">
              <Link to="/auth">{t("auth.signIn")}</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">{t("auth.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-8">
        <div className="container text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-6">
            <Link to="/courses" className="hover:text-foreground transition-colors">{t("footer.browse")}</Link>
            <Link to="/dashboard/teacher" className="hover:text-foreground transition-colors">{t("footer.teach")}</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">{t("footer.login")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

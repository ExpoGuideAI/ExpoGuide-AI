import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";

export function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
      <h1 className="text-6xl font-bold text-gradient mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">{t("Page Not Found", "الصفحة غير موجودة")}</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        {t("The page you're looking for doesn't exist or has been moved.", "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.")}
      </p>
      <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-md transition-colors border border-white/10">
        {t("Return Home", "العودة للرئيسية")}
      </Link>
    </div>
  );
}

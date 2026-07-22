import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="container-editorial flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-heading text-7xl font-extrabold text-primary md:text-8xl">404</p>
      <h1 className="mt-4 font-heading text-3xl font-extrabold md:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          {t("home")}
        </Link>
        <Link href="/fleet" className="btn-blue">
          {t("fleet")}
        </Link>
      </div>
    </section>
  );
}

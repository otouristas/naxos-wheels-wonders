"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-editorial flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-heading text-3xl font-extrabold md:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          {t("retry")}
        </button>
        <Link href="/" className="btn-blue">
          {t("home")}
        </Link>
      </div>
    </section>
  );
}

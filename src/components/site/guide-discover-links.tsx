import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getGuideDiscoverLinks } from "@/lib/guide-discover";
import { discoverCycladesUrl } from "@/lib/discover-cyclades";

export async function GuideDiscoverLinks({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const t = await getTranslations("footer");
  const guide = await getTranslations("guide");
  const links = getGuideDiscoverLinks(locale, slug);

  return (
    <aside className="mt-12 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-sand/80 via-white to-secondary/40 p-6 md:p-8">
      <div className="flex flex-wrap items-start gap-4">
        <a
          href={discoverCycladesUrl(locale, "")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3"
        >
          <Image
            src="https://discovercyclades.gr/favicon.svg"
            alt="Discover Cyclades"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span>
            <span className="block text-sm font-bold text-primary">Discover Cyclades</span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {t("dcPartner")}
            </span>
          </span>
        </a>
      </div>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">{guide("discoverLead")}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-primary/12 bg-white/80 px-3.5 py-2 text-xs font-semibold text-primary/80 transition hover:border-primary/30 hover:text-primary"
            >
              {t(link.labelKey)} ↗
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

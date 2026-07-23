import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { MobileBookBar } from "@/components/site/mobile-book-bar";
import { TouristasFloatingChat } from "@/components/site/touristas-floating-chat";
import { OrganizationSchema } from "@/components/site/structured-data";
import { GoogleAnalytics } from "@/components/site/google-analytics";
import { siteConfig } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  const title = `${siteConfig.name}: ${t("subtitle").slice(0, 60)}`;
  const description = t("subtitle");
  const ogImage = `${siteConfig.domain}/naxos/hero.jpg`;

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: `${siteConfig.name}: Car Rental on Naxos Island`,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: siteConfig.name,
      locale,
      url: `${siteConfig.domain}${locale === "en" ? "" : `/${locale}`}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    verification: {
      google: siteConfig.googleSiteVerification,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <GoogleAnalytics />
        <NextIntlClientProvider>
          <OrganizationSchema />
          <div className="flex min-h-screen flex-col pb-20 md:pb-0">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <MobileBookBar />
          <TouristasFloatingChat locale={locale} />
          <Toaster position="top-center" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

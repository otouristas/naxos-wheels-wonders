import { siteConfig } from "@/lib/site-config";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        // LocalBusiness is required for Google Review Snippet eligibility;
        // CarRental alone triggers "Invalid object type for field" in GSC.
        "@type": ["CarRental", "LocalBusiness"],
        name: siteConfig.name,
        image: `${siteConfig.domain}/naxos/hero.jpg`,
        url: siteConfig.domain,
        telephone: siteConfig.phonePrimary,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Galanado Village",
          addressLocality: "Naxos",
          postalCode: "84300",
          addressCountry: "GR",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: siteConfig.rating,
          reviewCount: siteConfig.reviewCount,
          bestRating: 5,
        },
        priceRange: "€€",
        areaServed: "Naxos, Cyclades, Greece",
        sameAs: [siteConfig.social.facebook, siteConfig.social.google],
      }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        brand: { "@type": "Brand", name: siteConfig.name },
        offers: {
          "@type": "Offer",
          priceCurrency: "EUR",
          price,
          url,
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}

export function ArticleSchema({
  headline,
  description,
  image,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        image,
        url,
        author: { "@type": "Organization", name: siteConfig.name },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.domain}/brand/logo.png`,
          },
        },
      }}
    />
  );
}

export function FaqSchema({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({
          "@type": "Question",
          name: i.q,
          acceptedAnswer: { "@type": "Answer", text: i.a },
        })),
      }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

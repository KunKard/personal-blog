import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function generateSiteMetadata({
  title,
  description,
  image,
  type = "website",
  publishedAt,
  updatedAt,
  tags,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const finalTitle = title
    ? `${title} | ${SITE_CONFIG.title}`
    : `${SITE_CONFIG.title} - ${SITE_CONFIG.name}`;
  const finalDescription = description || SITE_CONFIG.description;
  const finalImage = image || `${SITE_CONFIG.url}/og-image.png`;

  return {
    title: finalTitle,
    description: finalDescription,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: [{ url: finalImage, width: 1200, height: 630 }],
      locale: SITE_CONFIG.locale,
      type,
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
      ...(tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

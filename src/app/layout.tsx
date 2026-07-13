import type { Metadata } from "next";
import { Providers } from "@/components/global/providers";
import { ParticleBackground } from "@/components/home/particle-background";
import { CursorParticles } from "@/components/effects/cursor-particles";
import { SITE_CONFIG } from "@/lib/utils/constants";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Kworld",
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <ParticleBackground />
        <Providers>{children}</Providers>
        <CursorParticles />
      </body>
    </html>
  );
}

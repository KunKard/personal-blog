import { generateSiteMetadata } from "@/lib/utils/metadata";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [{ slug: "placeholder" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateSiteMetadata({
    title: `试玩: ${slug}`,
    description: `在线试玩游戏 ${slug}`,
  });
}

export default async function GamePlayerPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-40">
      {/* Top bar */}
      <div className="h-12 bg-background border-b border-border flex items-center justify-between px-4">
        <a href="/" className="text-sm text-muted hover:text-foreground transition-colors">
          ← 返回首页
        </a>
        <span className="text-sm font-bold tracking-tight">
          {slug}
        </span>
        <span className="text-xs text-muted">Unity WebGL</span>
      </div>

      {/* Game iframe */}
      <iframe
        src={`/games/${slug}/index.html`}
        className="flex-1 w-full border-0"
        allowFullScreen
        title={`${slug} - Unity WebGL`}
      />
    </div>
  );
}

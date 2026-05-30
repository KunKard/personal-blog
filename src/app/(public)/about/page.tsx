import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { TECH_STACK } from "@/lib/utils/constants";
import { generateSiteMetadata } from "@/lib/utils/metadata";

export const metadata = generateSiteMetadata({
  title: "关于我",
  description: "一个热爱游戏开发的独立开发者",
});

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title="关于我" subtitle="一个热爱创造游戏世界的开发者" />

        <div className="max-w-3xl mx-auto">
          {/* Profile */}
          <div className="text-center mb-16">
            <div className="w-28 h-28 mx-auto rounded-full border-2 border-border bg-surface flex items-center justify-center text-5xl mb-6">
              🎮
            </div>
            <h2 className="text-2xl font-bold mb-2">Kard</h2>
            <p className="text-muted mb-4">独立游戏开发者 / 学生</p>
            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              热衷于使用 Unity 构建独立游戏。
              相信游戏作为一种艺术媒介，能够传递深刻的情感和独特的体验。
              目前在不断学习和探索游戏开发的各个方面。
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h3 className="text-lg font-bold mb-6 text-center">技术栈</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm rounded-full border border-border bg-surface hover:border-foreground/30 hover:bg-surface-hover transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Contact & Links */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-6">找到我</h3>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                GitHub
              </a>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center px-6 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Email
              </a>
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center px-6 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
              >
                下载简历
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

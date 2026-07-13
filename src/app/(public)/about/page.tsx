import { Container } from "@/components/layout/container";
import { TECH_STACK } from "@/lib/utils/constants";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { assetPath } from "@/lib/utils/asset-path";

export const metadata = generateSiteMetadata({
  title: "关于我",
  description: "独立游戏开发者",
});

const links = [
  { label: "GitHub", href: "https://github.com/KunKard" },
  { label: "Email", href: "mailto:kunkard@foxmail.com" },
  { label: "Bilibili", href: "https://space.bilibili.com/471089291" },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="max-w-lg mx-auto text-center">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full border-2 border-border overflow-hidden mb-6">
            <img
              src={assetPath("/avatar.jpg")}
              alt="Kard"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name + Role */}
          <h1 className="text-2xl font-bold mb-1">Kard</h1>
          <p className="text-sm text-muted mb-8">独立游戏开发者 / 学生</p>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-full bg-foreground text-background font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-border mx-auto mb-10" />

          {/* Links */}
          <div className="flex justify-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

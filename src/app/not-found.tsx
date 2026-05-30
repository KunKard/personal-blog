import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container>
        <div className="text-center">
          <p className="text-7xl font-bold mb-4 text-muted">404</p>
          <h1 className="text-2xl font-bold mb-3 tracking-tight">
            页面未找到
          </h1>
          <p className="text-muted mb-8 max-w-sm mx-auto">
            你来到了一个不存在的页面...
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </Container>
    </div>
  );
}

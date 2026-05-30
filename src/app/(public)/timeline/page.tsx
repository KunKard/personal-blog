import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { getTimelineEntries } from "@/lib/db/timeline";
import { generateSiteMetadata } from "@/lib/utils/metadata";
import { formatDate } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

export const metadata = generateSiteMetadata({
  title: "时间轴",
  description: "我的游戏开发学习与成长记录",
});

const categoryColors: Record<string, string> = {
  learning: "border-blue-500",
  jam: "border-accent",
  project: "border-primary",
  milestone: "border-yellow-500",
  demo: "border-green-500",
};

export default async function TimelinePage() {
  let entries: Awaited<ReturnType<typeof getTimelineEntries>> = [];

  try {
    entries = await getTimelineEntries();
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="pt-24 pb-16">
      <Container>
        <SectionHeading title="开发时间轴" subtitle="记录每一步的成长与进步" />

        {entries.length > 0 ? (
          <div className="max-w-2xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

            <div className="space-y-8">
              {entries.map((entry, i) => (
                <div
                  key={entry.id}
                  className={cn(
                    "relative pl-12 md:pl-0",
                    i % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:pl-[50%]"
                  )}
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      "absolute left-2 md:left-1/2 w-5 h-5 rounded-full border-2 bg-background -translate-x-1/2",
                      categoryColors[entry.category] || "border-muted"
                    )}
                  />

                  {/* Card */}
                  <div className="bg-surface border border-border rounded-lg p-4 md:mx-6">
                    <div className="text-xs text-muted mb-1">
                      {formatDate(entry.date)}
                    </div>
                    <h3 className="font-bold mb-1">
                      {entry.icon && <span className="mr-1">{entry.icon}</span>}
                      {entry.title}
                    </h3>
                    {entry.description && (
                      <p className="text-sm text-muted">{entry.description}</p>
                    )}
                    {entry.links.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {entry.links.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">⏳</p>
            <p className="text-xl text-muted mb-2">时间轴即将上线</p>
            <p className="text-sm text-muted">
              连接 Supabase 后将在此展示学习与开发记录
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getAdminProjects } from "@/lib/db/projects";
import { getAdminPosts } from "@/lib/db/posts";
import { getAdminTimeline } from "@/lib/db/timeline";
import Link from "next/link";

export default async function AdminDashboardPage() {
  let projectCount = 0;
  let postCount = 0;
  let timelineCount = 0;

  try {
    const [projects, posts, timeline] = await Promise.all([
      getAdminProjects(),
      getAdminPosts(),
      getAdminTimeline(),
    ]);
    projectCount = projects.length;
    postCount = posts.length;
    timelineCount = timeline.length;
  } catch {
    // Supabase not configured
  }

  const stats = [
    { label: "作品", value: projectCount, href: "/admin/projects", icon: "🎮" },
    { label: "文章", value: postCount, href: "/admin/posts", icon: "📝" },
    { label: "时间轴", value: timelineCount, href: "/admin/timeline", icon: "⏳" },
  ];

  const quickActions = [
    { label: "新建文章", href: "/admin/posts/new", icon: "✏️" },
    { label: "新建作品", href: "/admin/projects/new", icon: "🆕" },
    { label: "管理媒体", href: "/admin/media", icon: "🖼️" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">仪表盘</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="h-full hover:border-primary/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold mb-4">快捷操作</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Card className="h-full">
              <CardContent className="pt-6 flex items-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <span>{action.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

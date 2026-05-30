import { SessionProvider } from "@/components/admin/session-provider";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AuthGuard } from "@/components/admin/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </AuthGuard>
    </SessionProvider>
  );
}

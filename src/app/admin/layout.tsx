import { getAuthFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthFromCookies();

  // Login page doesn't need the admin shell
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-ivory">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-sand bg-white px-4 md:px-6">
          <div className="flex items-center gap-4">
            <h1 className="hidden sm:block font-serif text-lg font-semibold text-ink">
              Sani Ul Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted truncate max-w-[140px]">{user.email}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

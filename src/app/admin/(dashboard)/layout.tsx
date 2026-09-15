import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-50/50 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}

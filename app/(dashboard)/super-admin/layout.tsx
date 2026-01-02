import { Sidebar } from '@/components/layout/sidebar';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        portal="super-admin"
        user={{
          name: 'System Administrator',
          email: 'admin@deltamed.com',
          role: 'Super Admin',
        }}
      />
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}

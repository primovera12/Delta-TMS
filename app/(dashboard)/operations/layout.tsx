import { Sidebar } from '@/components/layout/sidebar';

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        portal="operations"
        user={{
          name: 'Operations Manager',
          email: 'ops@deltamed.com',
          role: 'Operations Manager',
        }}
      />
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
}

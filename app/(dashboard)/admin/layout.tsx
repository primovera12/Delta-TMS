import { DashboardLayout } from '@/components/layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Prevent static prerendering of admin pages
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = {
    name: session.user.name || 'Admin',
    email: session.user.email || '',
    avatar: undefined,
    role: 'Administrator',
  };

  const notifications = [
    {
      id: '1',
      title: 'New User Registration',
      message: 'John Doe has registered as a driver',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'System Update',
      message: 'Database maintenance completed successfully',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '3',
      title: 'License Expiring',
      message: 'Driver Mike Smith license expires in 7 days',
      time: '2 hours ago',
      read: false,
    },
  ];

  return (
    <DashboardLayout
      portal="admin"
      user={user}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}

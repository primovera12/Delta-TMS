import { DashboardLayout } from '@/components/layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = {
    name: session.user.name || 'Driver',
    email: session.user.email || '',
    avatar: undefined,
    role: 'Driver',
  };

  const notifications = [
    {
      id: '1',
      title: 'New Trip Assigned',
      message: 'Trip #TR-20260115-008 has been assigned to you',
      time: '2 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Schedule Updated',
      message: 'Your 2:00 PM trip has been moved to 2:30 PM',
      time: '30 min ago',
      read: true,
    },
  ];

  return (
    <DashboardLayout
      portal="driver"
      user={user}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}

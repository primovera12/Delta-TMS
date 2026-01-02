import { DashboardLayout } from '@/components/layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Prevent static prerendering of dispatcher pages
export const dynamic = 'force-dynamic';

export default async function DispatcherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Mock user data - in production, this would come from the session
  const user = {
    name: session.user.name || 'Dispatcher',
    email: session.user.email || '',
    avatar: undefined,
    role: 'Dispatcher',
  };

  // Mock notifications - in production, this would come from the API
  const notifications = [
    {
      id: '1',
      title: 'New Trip Request',
      message: 'John Smith has requested a ride from 123 Main St',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Driver Arrived',
      message: 'Mike Johnson arrived at pickup location',
      time: '15 min ago',
      read: false,
    },
    {
      id: '3',
      title: 'Trip Completed',
      message: 'Trip #TR-20260115-001 completed successfully',
      time: '1 hour ago',
      read: true,
    },
  ];

  return (
    <DashboardLayout
      portal="dispatcher"
      user={user}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}

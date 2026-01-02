import { DashboardLayout } from '@/components/layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = {
    name: session.user.name || 'Family Member',
    email: session.user.email || '',
    avatar: undefined,
    role: 'Family Member',
  };

  const notifications = [
    {
      id: '1',
      title: 'Trip Started',
      message: 'John Smith\'s ride to Memorial Hospital has started',
      time: '10 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Trip Completed',
      message: 'John Smith arrived safely at his appointment',
      time: '2 hours ago',
      read: true,
    },
  ];

  return (
    <DashboardLayout
      portal="family"
      user={user}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}

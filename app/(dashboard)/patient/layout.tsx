import { DashboardLayout } from '@/components/layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Prevent static prerendering of patient pages
export const dynamic = 'force-dynamic';

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = {
    name: session.user.name || 'Patient',
    email: session.user.email || '',
    avatar: undefined,
    role: 'Patient',
  };

  const notifications = [
    {
      id: '1',
      title: 'Ride Confirmed',
      message: 'Your ride for tomorrow at 10:30 AM is confirmed',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '2',
      title: 'Driver En Route',
      message: 'Your driver is 5 minutes away',
      time: '2 hours ago',
      read: true,
    },
  ];

  return (
    <DashboardLayout
      portal="patient"
      user={user}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}

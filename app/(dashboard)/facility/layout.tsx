import { DashboardLayout } from '@/components/layout';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Prevent static prerendering of facility pages
export const dynamic = 'force-dynamic';

export default async function FacilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = {
    name: session.user.name || 'Facility Staff',
    email: session.user.email || '',
    avatar: undefined,
    role: 'Memorial Hospital',
  };

  const notifications = [
    {
      id: '1',
      title: 'Trip Confirmed',
      message: 'Transport for John Smith confirmed for 10:30 AM',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Driver En Route',
      message: 'Driver is 10 minutes away for pickup',
      time: '15 min ago',
      read: true,
    },
    {
      id: '3',
      title: 'Invoice Ready',
      message: 'December invoice is ready for review',
      time: '1 hour ago',
      read: false,
    },
  ];

  return (
    <DashboardLayout
      portal="facility"
      user={user}
      notifications={notifications}
    >
      {children}
    </DashboardLayout>
  );
}

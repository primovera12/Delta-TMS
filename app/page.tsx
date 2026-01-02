import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-display mb-6">
              Delta <span className="text-primary-600">TMS</span>
            </h1>
            <p className="text-body-lg max-w-2xl mx-auto mb-10">
              Professional wheelchair transportation management platform.
              Book rides, manage drivers, track trips in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 transition-colors duration-150"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-150"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-h2 text-center mb-12">
          Built for Medical Transportation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="card card-padded">
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-h3 mb-2">{feature.title}</h3>
              <p className="text-body">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portal Cards */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-h2 text-center mb-12">
          Access Your Portal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal) => (
            <Link key={portal.title} href={portal.href} className="group">
              <div className="card card-padded card-interactive text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-50 transition-colors">
                  <portal.icon className="w-8 h-8 text-gray-600 group-hover:text-primary-600 transition-colors" />
                </div>
                <h3 className="text-h4 mb-1">{portal.title}</h3>
                <p className="text-body-sm">{portal.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-body-sm">
          <p>&copy; {new Date().getFullYear()} Delta TMS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

// Feature icons as simple components
const DispatchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-3-3m3 3l-3 3m-6 4H4m0 0l3 3m-3-3l3-3" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const features = [
  {
    title: 'Smart Dispatch',
    description: 'AI-powered driver assignment with real-time availability tracking and conflict detection.',
    icon: DispatchIcon,
  },
  {
    title: 'Live Tracking',
    description: 'Real-time GPS tracking for all vehicles. Know exactly where your drivers are.',
    icon: MapIcon,
  },
  {
    title: 'Automated Scheduling',
    description: 'Standing orders, recurring trips, and intelligent route optimization.',
    icon: ClockIcon,
  },
  {
    title: 'Multi-Stop Trips',
    description: 'Handle complex routes with multiple pickups and dropoffs efficiently.',
    icon: CarIcon,
  },
  {
    title: 'Facility Management',
    description: 'Dedicated portal for hospitals, nursing homes, and dialysis centers.',
    icon: BuildingIcon,
  },
  {
    title: 'Patient Care',
    description: 'Medical profiles, accessibility requirements, and family member access.',
    icon: HeartIcon,
  },
];

const portals = [
  {
    title: 'Dispatcher',
    description: 'Book and manage rides',
    href: '/dispatcher',
    icon: DispatchIcon,
  },
  {
    title: 'Driver',
    description: 'View and complete trips',
    href: '/driver',
    icon: CarIcon,
  },
  {
    title: 'Facility',
    description: 'Manage patient transport',
    href: '/facility',
    icon: BuildingIcon,
  },
  {
    title: 'Patient',
    description: 'Book your rides',
    href: '/patient',
    icon: UserIcon,
  },
];

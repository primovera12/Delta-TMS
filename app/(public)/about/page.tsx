import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Delta <span className="text-primary-600">TMS</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-gray-900">Services</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-primary-600">About</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/login" className="text-sm font-medium text-white bg-primary-600 px-4 py-2 rounded-md hover:bg-primary-700">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Delta TMS</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Providing safe, reliable, and compassionate wheelchair transportation since 2010.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At Delta TMS, we believe that access to healthcare should never be limited by mobility challenges.
              Our mission is to provide dignified, safe, and reliable transportation services to those who need it most.
            </p>
            <p className="text-gray-600 mb-4">
              We understand that medical appointments can be stressful. That&apos;s why we focus not just on getting
              you there on time, but on making the journey comfortable and worry-free.
            </p>
            <p className="text-gray-600">
              Every member of our team is trained to provide compassionate care, treating each passenger
              with the respect and dignity they deserve.
            </p>
          </div>
          <div className="bg-gray-200 rounded-xl h-80 flex items-center justify-center">
            <span className="text-gray-500">Mission Image</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-primary-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Certifications & Compliance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-white rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-xs text-gray-500">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Our Leadership Team</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Dedicated professionals with decades of combined experience in healthcare transportation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-400">{member.initials}</span>
              </div>
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-primary-600 mb-2">{member.role}</p>
              <p className="text-xs text-gray-500">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Network</h2>
          <p className="text-lg text-gray-300 mb-8">
            Whether you&apos;re a healthcare facility looking for a transportation partner or
            a driver wanting to make a difference, we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-900 bg-white rounded-md hover:bg-gray-100"
            >
              Partner With Us
            </Link>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white rounded-md hover:bg-white/10"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Delta TMS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

// Icons
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const stats = [
  { value: '14+', label: 'Years of Service' },
  { value: '50K+', label: 'Trips Completed' },
  { value: '100+', label: 'Professional Drivers' },
  { value: '98%', label: 'On-Time Rate' },
];

const values = [
  {
    title: 'Compassion',
    description: 'We treat every passenger with kindness and understanding, recognizing their unique needs and challenges.',
    icon: HeartIcon,
  },
  {
    title: 'Safety',
    description: 'Safety is our top priority. All vehicles are inspected daily and all drivers undergo rigorous training and background checks.',
    icon: ShieldIcon,
  },
  {
    title: 'Reliability',
    description: 'We understand that medical appointments are time-sensitive. We pride ourselves on being punctual and dependable.',
    icon: ClockIcon,
  },
];

const certifications = [
  { name: 'HIPAA Compliant', description: 'Patient privacy protected' },
  { name: 'ADA Compliant', description: 'Full accessibility standards' },
  { name: 'DOT Certified', description: 'Federal safety compliance' },
  { name: 'State Licensed', description: 'All required permits' },
];

const team = [
  {
    name: 'Sarah Johnson',
    initials: 'SJ',
    role: 'CEO & Founder',
    bio: '20+ years in healthcare administration',
  },
  {
    name: 'Michael Chen',
    initials: 'MC',
    role: 'COO',
    bio: 'Former hospital operations director',
  },
  {
    name: 'Lisa Williams',
    initials: 'LW',
    role: 'Director of Safety',
    bio: 'Certified safety professional',
  },
];

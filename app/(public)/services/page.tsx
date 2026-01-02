import Link from 'next/link';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Delta <span className="text-primary-600">TMS</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/services" className="text-sm font-medium text-primary-600">Services</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</Link>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive wheelchair transportation solutions for medical facilities, patients, and families.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Our Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.name} className="bg-white rounded-xl p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <vehicle.icon className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{vehicle.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {vehicle.specs.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today for a free consultation and pricing quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Get a Quote
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              View Pricing
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
const WheelchairIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const AmbulanceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const VanIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-3-3m3 3l-3 3m-6 4H4m0 0l3 3m-3-3l3-3" />
  </svg>
);

const services = [
  {
    title: 'Medical Appointments',
    description: 'Reliable transportation to and from doctor visits, dialysis, physical therapy, and other medical appointments.',
    icon: WheelchairIcon,
    features: [
      'Door-to-door service',
      'Assistance with entry and exit',
      'Wheelchair and mobility device accommodation',
      'Wait time included for appointments',
    ],
  },
  {
    title: 'Hospital Discharge',
    description: 'Safe and comfortable transportation from hospital to home or care facility after discharge.',
    icon: AmbulanceIcon,
    features: [
      'Coordination with hospital staff',
      'Stretcher and gurney capable vehicles',
      'Medical equipment transport',
      '24/7 availability for discharges',
    ],
  },
  {
    title: 'Recurring Transportation',
    description: 'Standing orders for regular appointments like dialysis, chemotherapy, or rehabilitation sessions.',
    icon: CalendarIcon,
    features: [
      'Automated scheduling',
      'Consistent driver assignment when possible',
      'Flexible schedule modifications',
      'Volume discounts available',
    ],
  },
  {
    title: 'Facility Contracts',
    description: 'Dedicated transportation partnerships with hospitals, nursing homes, and healthcare facilities.',
    icon: BuildingIcon,
    features: [
      'Priority scheduling',
      'Dedicated account management',
      'Consolidated billing',
      'Custom reporting and analytics',
    ],
  },
];

const vehicles = [
  {
    name: 'Wheelchair Accessible Van',
    description: 'Side or rear-entry ramp vehicles for wheelchair users',
    icon: VanIcon,
    specs: [
      'Power ramp access',
      'Wheelchair tie-down system',
      'Climate controlled',
    ],
  },
  {
    name: 'Stretcher Vehicle',
    description: 'For patients requiring lying down position during transport',
    icon: AmbulanceIcon,
    specs: [
      'Gurney/stretcher capable',
      'Medical oxygen ready',
      'Trained medical transport staff',
    ],
  },
  {
    name: 'Ambulatory Vehicle',
    description: 'Comfortable sedan for patients who can walk with minimal assistance',
    icon: WheelchairIcon,
    specs: [
      'Easy entry/exit design',
      'Fold-away walker storage',
      'Extended door opening',
    ],
  },
];

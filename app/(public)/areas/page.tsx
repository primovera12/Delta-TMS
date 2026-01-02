import Link from 'next/link';

export default function ServiceAreasPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Areas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We proudly serve the greater Los Angeles metropolitan area and surrounding counties.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="md:col-span-2">
            <div className="bg-gray-200 rounded-xl h-[500px] flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive Map</p>
                <p className="text-sm text-gray-400">Google Maps integration</p>
              </div>
            </div>
          </div>

          {/* Service Area List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Coverage Areas</h3>
            <div className="space-y-4">
              {serviceAreas.map((area) => (
                <div key={area.name} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{area.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      area.coverage === 'Full'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {area.coverage} Coverage
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{area.cities.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Details */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Coverage Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Full Coverage</h3>
              <p className="text-sm text-gray-600">
                All services available including same-day booking, stretcher transport, and 24/7 dispatch.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Limited Coverage</h3>
              <p className="text-sm text-gray-600">
                Wheelchair transport available with 48-hour advance booking. Additional mileage charges may apply.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Request Coverage</h3>
              <p className="text-sm text-gray-600">
                Don&apos;t see your area? Contact us to discuss possible service expansion or special arrangements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zip Code Lookup */}
      <section className="py-16">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Coverage</h2>
          <p className="text-gray-600 mb-6">
            Enter your zip code to see if we service your area.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter zip code"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Check
            </button>
          </div>
        </div>
      </section>

      {/* Partner Facilities */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Partner Facilities</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We have established partnerships with these major healthcare facilities in our service area.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {facilities.map((facility) => (
              <div key={facility} className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <p className="text-sm font-medium text-gray-900">{facility}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Expand Your Transportation Options</h2>
          <p className="text-lg text-gray-600 mb-8">
            Are you a healthcare facility looking for reliable transportation for your patients?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            Become a Partner
          </Link>
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

// Icon
const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const serviceAreas = [
  {
    name: 'Los Angeles County',
    coverage: 'Full',
    cities: ['Los Angeles', 'Long Beach', 'Pasadena', 'Santa Monica', 'Burbank', 'Glendale'],
  },
  {
    name: 'Orange County',
    coverage: 'Full',
    cities: ['Anaheim', 'Irvine', 'Santa Ana', 'Huntington Beach', 'Garden Grove'],
  },
  {
    name: 'Ventura County',
    coverage: 'Limited',
    cities: ['Oxnard', 'Thousand Oaks', 'Ventura', 'Camarillo'],
  },
  {
    name: 'San Bernardino County',
    coverage: 'Limited',
    cities: ['Ontario', 'Rancho Cucamonga', 'Fontana', 'San Bernardino'],
  },
];

const facilities = [
  'UCLA Medical Center',
  'Cedars-Sinai Medical Center',
  'Kaiser Permanente',
  'Providence St. Joseph',
  'Hoag Memorial Hospital',
  'UCI Medical Center',
  'Huntington Hospital',
  'Methodist Hospital',
];

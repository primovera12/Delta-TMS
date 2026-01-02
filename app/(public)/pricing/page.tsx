import Link from 'next/link';

export default function PricingPage() {
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
            <Link href="/pricing" className="text-sm font-medium text-primary-600">Pricing</Link>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, straightforward pricing with no hidden fees. Pay only for what you use.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-sm border p-8 ${
                index === 1 ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'
              }`}
            >
              {index === 1 && (
                <span className="inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">${plan.basePrice}</span>
                <span className="text-gray-600">/ride</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`block w-full text-center py-3 rounded-md font-medium ${
                  index === 1
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Details */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Pricing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Base Rate Structure</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  {rateStructure.map((item) => (
                    <tr key={item.label}>
                      <td className="py-3 text-gray-600">{item.label}</td>
                      <td className="py-3 text-right font-medium text-gray-900">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-200">
                  {additionalServices.map((item) => (
                    <tr key={item.label}>
                      <td className="py-3 text-gray-600">{item.label}</td>
                      <td className="py-3 text-right font-medium text-gray-900">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {pricingFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Quote?</h2>
          <p className="text-lg text-primary-100 mb-8">
            For high-volume accounts or special requirements, we offer customized pricing plans.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-600 bg-white rounded-md hover:bg-gray-100"
          >
            Contact Sales
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

const pricingPlans = [
  {
    name: 'Standard',
    description: 'Perfect for occasional medical appointments',
    basePrice: 45,
    features: [
      'Wheelchair accessible vehicles',
      'Door-to-door service',
      'Basic wait time included (15 min)',
      'Same-day booking available',
      'Phone and email support',
    ],
  },
  {
    name: 'Medical',
    description: 'Ideal for regular medical transportation needs',
    basePrice: 55,
    features: [
      'All Standard features',
      'Priority scheduling',
      'Extended wait time (30 min)',
      'Stretcher/gurney vehicles',
      'Medical oxygen transport',
      'Direct facility billing',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For healthcare facilities and organizations',
    basePrice: 40,
    features: [
      'All Medical features',
      'Volume discounts',
      'Dedicated account manager',
      'Custom reporting',
      'API integration',
      '24/7 priority support',
    ],
  },
];

const rateStructure = [
  { label: 'Base fare', value: '$25.00' },
  { label: 'Per mile (0-10 miles)', value: '$2.50/mile' },
  { label: 'Per mile (10+ miles)', value: '$2.00/mile' },
  { label: 'Wait time (after free period)', value: '$0.50/min' },
  { label: 'After hours (6PM-6AM)', value: '+25%' },
  { label: 'Weekend/Holiday', value: '+15%' },
];

const additionalServices = [
  { label: 'Wheelchair assistance', value: 'Included' },
  { label: 'Stretcher transport', value: '+$75.00' },
  { label: 'Bariatric vehicle', value: '+$50.00' },
  { label: 'Medical escort', value: '+$25.00/hr' },
  { label: 'Same-day booking', value: '+$10.00' },
  { label: 'Cancellation (< 2 hours)', value: '$25.00 fee' },
];

const pricingFaqs = [
  {
    question: 'How is the fare calculated?',
    answer: 'Fares are calculated based on a base rate plus mileage. Distance is measured from pickup to drop-off location. Additional charges may apply for special services, after-hours transport, or same-day bookings.',
  },
  {
    question: 'Is wait time included?',
    answer: 'Yes, we include 15-30 minutes of free wait time depending on your service level. Additional wait time is charged at $0.50 per minute.',
  },
  {
    question: 'Do you accept insurance?',
    answer: 'We work with most major insurance providers including Medicare and Medicaid. Contact us to verify your coverage and get prior authorization if needed.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and ACH bank transfers. Facilities can set up direct billing with net-30 terms.',
  },
];

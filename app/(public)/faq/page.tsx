'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our wheelchair transportation services.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Contact Support
            </Link>
            <a
              href="tel:5551234567"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Call (555) 123-4567
            </a>
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

const categories = [
  { id: 'general', label: 'General' },
  { id: 'booking', label: 'Booking' },
  { id: 'payment', label: 'Payment & Insurance' },
  { id: 'service', label: 'Service Details' },
  { id: 'safety', label: 'Safety' },
];

const faqs = [
  // General
  {
    category: 'general',
    question: 'What types of transportation do you provide?',
    answer: 'We provide wheelchair accessible transportation for medical appointments, hospital discharges, dialysis treatments, physical therapy, and other healthcare-related trips. We have vehicles equipped for standard wheelchairs, stretchers, and bariatric patients.',
  },
  {
    category: 'general',
    question: 'What areas do you serve?',
    answer: 'We serve the greater Los Angeles metropolitan area, including Orange County, parts of Ventura County, and San Bernardino County. Check our service areas page for a complete list of covered zip codes.',
  },
  {
    category: 'general',
    question: 'Do you operate on holidays?',
    answer: 'Yes, we operate 365 days a year, including all major holidays. However, holiday surcharges may apply. Please check our pricing page for details.',
  },
  {
    category: 'general',
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 24-48 hours in advance to ensure availability. However, we do accept same-day bookings based on vehicle availability. A same-day booking fee may apply.',
  },

  // Booking
  {
    category: 'booking',
    question: 'How do I book a ride?',
    answer: 'You can book a ride through our website, mobile app, or by calling our dispatch center at (555) 123-4567. For recurring appointments, we can set up standing orders to make booking easier.',
  },
  {
    category: 'booking',
    question: 'Can I book rides for someone else?',
    answer: 'Yes, family members, caregivers, or facility staff can book rides on behalf of patients. We recommend creating a family account to manage multiple passengers.',
  },
  {
    category: 'booking',
    question: 'What information do I need to book a ride?',
    answer: 'You will need the passenger name, pickup and drop-off addresses, appointment time, mobility equipment requirements (wheelchair, stretcher, etc.), and any special medical needs or instructions.',
  },
  {
    category: 'booking',
    question: 'Can I cancel or reschedule my ride?',
    answer: 'Yes, you can cancel or reschedule up to 2 hours before your scheduled pickup time without any fee. Cancellations within 2 hours may incur a $25 cancellation fee.',
  },

  // Payment & Insurance
  {
    category: 'payment',
    question: 'Do you accept insurance?',
    answer: 'Yes, we work with most major insurance providers including Medicare, Medicaid, and private insurance plans. Contact us to verify your coverage and obtain prior authorization if required.',
  },
  {
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex), debit cards, ACH bank transfers, and cash. Healthcare facilities can set up direct billing with net-30 payment terms.',
  },
  {
    category: 'payment',
    question: 'How much does a typical ride cost?',
    answer: 'Pricing starts at $45 for a standard wheelchair transport within 10 miles. Final pricing depends on distance, vehicle type, wait time, and additional services. Visit our pricing page for detailed rates.',
  },
  {
    category: 'payment',
    question: 'Do you offer discounts for regular riders?',
    answer: 'Yes, we offer volume discounts for facilities with high trip volumes and subscription plans for patients with regular recurring appointments like dialysis.',
  },

  // Service Details
  {
    category: 'service',
    question: 'Will the driver help me get in and out of the vehicle?',
    answer: 'Yes, all our drivers are trained to assist passengers with boarding and exiting the vehicle, including wheelchair securement. Door-to-door service is included in all trips.',
  },
  {
    category: 'service',
    question: 'Can I bring a companion with me?',
    answer: 'Yes, one companion can ride with the patient at no additional charge. Additional companions may be accommodated based on vehicle capacity.',
  },
  {
    category: 'service',
    question: 'How long will the driver wait for my appointment?',
    answer: 'We include 15-30 minutes of free wait time depending on your service level. Additional wait time is billed at $0.50 per minute. For longer appointments, we can arrange a separate return trip.',
  },
  {
    category: 'service',
    question: 'Do you transport medical equipment?',
    answer: 'Yes, we can transport oxygen tanks, portable medical devices, and other necessary medical equipment. Please inform us of any equipment at the time of booking.',
  },

  // Safety
  {
    category: 'safety',
    question: 'Are your drivers trained and certified?',
    answer: 'Yes, all drivers undergo extensive training including wheelchair securement, patient assistance, first aid, CPR, and defensive driving. They also pass thorough background checks and drug screening.',
  },
  {
    category: 'safety',
    question: 'Are the vehicles inspected regularly?',
    answer: 'All vehicles undergo daily pre-trip inspections and regular maintenance checks. Our fleet meets or exceeds all DOT and ADA requirements for medical transportation.',
  },
  {
    category: 'safety',
    question: 'What COVID-19 precautions do you take?',
    answer: 'All vehicles are sanitized between rides. Drivers follow CDC guidelines including mask usage when requested. We have enhanced ventilation and provide hand sanitizer in all vehicles.',
  },
  {
    category: 'safety',
    question: 'What happens in case of an emergency during transport?',
    answer: 'All drivers are trained in emergency response and have direct communication with dispatch. In medical emergencies, drivers will contact 911 immediately and stay with the patient until help arrives.',
  },
];

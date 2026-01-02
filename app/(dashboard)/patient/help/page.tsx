'use client';

import * as React from 'react';
import {
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Clock,
  Calendar,
  Car,
  CreditCard,
  User,
  Shield,
  ExternalLink,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'booking',
    question: 'How do I book a ride?',
    answer: 'You can book a ride through the "Book Ride" section in your dashboard. Select your pickup and dropoff locations, choose your transport type, and pick a date and time. You can also call our dispatch team at (555) 123-4567 to book over the phone.',
  },
  {
    category: 'booking',
    question: 'How far in advance can I schedule a ride?',
    answer: 'You can schedule rides up to 30 days in advance. For recurring appointments, you can set up standing orders that automatically book your regular trips.',
  },
  {
    category: 'booking',
    question: 'Can I book a round trip?',
    answer: 'Yes! When booking a ride, simply select the "Round Trip" option. You can specify different pickup times for each leg of the journey.',
  },
  {
    category: 'rides',
    question: 'How do I track my ride?',
    answer: 'Once your driver is assigned and en route, you can track their location in real-time from your dashboard. You\'ll also receive text notifications with updates about your driver\'s arrival.',
  },
  {
    category: 'rides',
    question: 'What if my driver is late?',
    answer: 'If your driver is running late, you\'ll receive an automatic notification. You can also contact our dispatch team at (555) 123-4567 for immediate assistance.',
  },
  {
    category: 'rides',
    question: 'Can I cancel or reschedule a ride?',
    answer: 'Yes, you can cancel or reschedule rides up to 24 hours before the scheduled time without any fee. Changes within 24 hours may incur a fee. Go to "My Rides" to make changes.',
  },
  {
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, HSA/FSA cards, and direct insurance billing. You can manage your payment methods in the Payment section of your profile.',
  },
  {
    category: 'payment',
    question: 'Is my transportation covered by insurance?',
    answer: 'Many insurance plans, including Medicare and Medicaid, cover non-emergency medical transportation. We can verify your coverage and handle billing directly with your insurance provider.',
  },
  {
    category: 'payment',
    question: 'How do I get a receipt for my ride?',
    answer: 'Receipts are automatically emailed after each completed ride. You can also download receipts from your ride history in the "My Rides" section.',
  },
  {
    category: 'account',
    question: 'How do I update my profile information?',
    answer: 'Go to "Profile" in your dashboard to update your contact information, emergency contacts, and medical requirements.',
  },
  {
    category: 'account',
    question: 'Can I add a family member to my account?',
    answer: 'Yes, family members or caregivers can be added through the Family Portal. They can book rides on your behalf and receive trip notifications.',
  },
  {
    category: 'safety',
    question: 'Are your drivers background checked?',
    answer: 'Yes, all our drivers undergo comprehensive background checks, drug testing, and are trained in passenger assistance and safety protocols.',
  },
  {
    category: 'safety',
    question: 'What COVID-19 safety measures are in place?',
    answer: 'Our vehicles are sanitized between each ride, drivers wear masks, and hand sanitizer is available in all vehicles. Please inform us of any health concerns when booking.',
  },
];

const categories = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'booking', label: 'Booking', icon: Calendar },
  { id: 'rides', label: 'Rides', icon: Car },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'account', label: 'Account', icon: User },
  { id: 'safety', label: 'Safety', icon: Shield },
];

export default function PatientHelpPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());
  const [contactSubject, setContactSubject] = React.useState('');
  const [contactMessage, setContactMessage] = React.useState('');
  const [contactSubmitted, setContactSubmitted] = React.useState(false);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const handleContactSubmit = () => {
    console.log('Contact form submitted:', { contactSubject, contactMessage });
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactSubject('');
      setContactMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Help Center</h1>
        <p className="text-gray-500 mt-1">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* Search */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact */}
      <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
        <Card className="hover:border-primary-300 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="font-medium text-gray-900">Call Us</h3>
            <p className="text-primary-600 font-medium">(555) 123-4567</p>
            <p className="text-xs text-gray-500 mt-1">24/7 Support</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary-300 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="font-medium text-gray-900">Live Chat</h3>
            <p className="text-success-600 font-medium">Start Chat</p>
            <p className="text-xs text-gray-500 mt-1">Avg response: 2 min</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary-300 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-info-100 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-info-600" />
            </div>
            <h3 className="font-medium text-gray-900">Email</h3>
            <p className="text-info-600 font-medium">support@delta-tms.com</p>
            <p className="text-xs text-gray-500 mt-1">Response within 24hr</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                  <p className="text-gray-500">
                    Try a different search term or browse all categories
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Collapsible
                  key={index}
                  open={openItems.has(index)}
                  onOpenChange={() => toggleItem(index)}
                >
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="h-4 w-4 text-primary-600" />
                            </div>
                            <span className="font-medium text-gray-900">{faq.question}</span>
                          </div>
                          {openItems.has(index) ? (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 pt-0">
                        <div className="pl-11">
                          <p className="text-gray-600">{faq.answer}</p>
                          <Badge variant="secondary" className="mt-3">
                            {categories.find((c) => c.id === faq.category)?.label}
                          </Badge>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactSubmitted ? (
                <div className="py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-success-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Message Sent!</h3>
                  <p className="text-gray-500">
                    We&apos;ll get back to you within 24 hours
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={contactSubject} onValueChange={setContactSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Help</SelectItem>
                        <SelectItem value="ride">Ride Issue</SelectItem>
                        <SelectItem value="payment">Payment Question</SelectItem>
                        <SelectItem value="account">Account Help</SelectItem>
                        <SelectItem value="complaint">File a Complaint</SelectItem>
                        <SelectItem value="feedback">General Feedback</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="Describe your question or issue in detail..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleContactSubmit}
                    disabled={!contactSubject || !contactMessage}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="mt-6 border-warning-200 bg-warning-50">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 text-warning-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-warning-900">Need Immediate Assistance?</h3>
                  <p className="text-sm text-warning-700 mt-1">
                    For urgent matters or ride emergencies, please call our 24/7 dispatch line:
                  </p>
                  <a
                    href="tel:5551234567"
                    className="inline-flex items-center gap-2 mt-2 text-warning-900 font-medium hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    (555) 123-4567
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Resources */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-500" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Patient Rights', description: 'Learn about your rights as a patient' },
              { title: 'Service Areas', description: 'View our coverage areas and service zones' },
              { title: 'Vehicle Types', description: 'Information about our transportation options' },
              { title: 'Privacy Policy', description: 'How we protect your information' },
            ].map((resource) => (
              <a
                key={resource.title}
                href="#"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{resource.title}</p>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-info-500" />
            Support Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Phone Support</h4>
              <p className="text-gray-600">24 hours a day, 7 days a week</p>
              <Badge className="mt-2 bg-success-100 text-success-700">Available Now</Badge>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
              <p className="text-gray-600">Mon-Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-gray-600">Sat-Sun: 9:00 AM - 3:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

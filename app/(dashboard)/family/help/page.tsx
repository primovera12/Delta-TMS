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
  Users,
  CreditCard,
  ExternalLink,
  Send,
  AlertCircle,
  Shield,
  Link,
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
    category: 'linking',
    question: 'How do I link a family member to my account?',
    answer: 'Go to "My Patients" in your dashboard and click "Link New Patient." You\'ll need the patient\'s member ID or an authorization code provided by the patient or their healthcare provider.',
  },
  {
    category: 'linking',
    question: 'Can I manage multiple family members?',
    answer: 'Yes, you can link multiple patients to your family account. Each linked patient will appear in your "My Patients" list, and you can book and manage rides for all of them.',
  },
  {
    category: 'booking',
    question: 'How do I book a ride for my family member?',
    answer: 'From your dashboard, click "Book Ride" and select which family member the ride is for. Then follow the booking steps to select pickup/dropoff locations, date, and time.',
  },
  {
    category: 'booking',
    question: 'Can I schedule recurring rides?',
    answer: 'Yes, when booking a ride, you can set it up as a recurring trip for regular appointments like dialysis or therapy. Select the "Recurring" option and choose the frequency.',
  },
  {
    category: 'booking',
    question: 'How far in advance can I book rides?',
    answer: 'You can schedule rides up to 30 days in advance. For urgent same-day transportation, please call our dispatch line for availability.',
  },
  {
    category: 'tracking',
    question: 'How can I track a ride in progress?',
    answer: 'Once a driver is assigned and en route, you\'ll see real-time tracking on the ride details page. You\'ll also receive text and/or email notifications with status updates.',
  },
  {
    category: 'tracking',
    question: 'Will I be notified when the ride is complete?',
    answer: 'Yes, you\'ll receive notifications when: the driver is en route, the driver arrives at pickup, the patient is picked up, and when the trip is complete.',
  },
  {
    category: 'payment',
    question: 'How is billing handled for family member rides?',
    answer: 'Billing is typically handled through the patient\'s insurance or the facility. If there are any out-of-pocket costs, you can add a payment method to your account.',
  },
  {
    category: 'payment',
    question: 'Can I pay for rides not covered by insurance?',
    answer: 'Yes, you can add a credit card to your account for any costs not covered by insurance. You\'ll see the estimated cost before confirming any ride.',
  },
  {
    category: 'safety',
    question: 'What safety measures are in place for my family member?',
    answer: 'All drivers are background checked and trained in patient assistance. Vehicles are regularly inspected and sanitized. You can track rides in real-time and contact dispatch anytime.',
  },
  {
    category: 'safety',
    question: 'What if my family member needs special assistance?',
    answer: 'When booking, you can specify any special needs like wheelchair assistance, oxygen equipment, or mobility aids. Drivers are trained to accommodate these requirements.',
  },
  {
    category: 'account',
    question: 'How do I update my contact information?',
    answer: 'Go to "Profile" in your dashboard to update your phone number, email, or notification preferences.',
  },
];

const categories = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'linking', label: 'Linking Patients', icon: Link },
  { id: 'booking', label: 'Booking', icon: Calendar },
  { id: 'tracking', label: 'Tracking', icon: Car },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'account', label: 'Account', icon: Users },
];

export default function FamilyHelpPage() {
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
        <h1 className="text-2xl font-semibold text-gray-900">Family Portal Help Center</h1>
        <p className="text-gray-500 mt-1">
          Get help managing transportation for your family members
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
            <p className="text-xs text-gray-500 mt-1">24/7 Family Support</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary-300 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="font-medium text-gray-900">Live Chat</h3>
            <p className="text-success-600 font-medium">Start Chat</p>
            <p className="text-xs text-gray-500 mt-1">Avg response: 3 min</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary-300 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-info-100 flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-info-600" />
            </div>
            <h3 className="font-medium text-gray-900">Email</h3>
            <p className="text-info-600 font-medium">family@delta-tms.com</p>
            <p className="text-xs text-gray-500 mt-1">Response within 24hr</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto py-3">
              <Users className="h-4 w-4 mr-2 text-primary-500" />
              Link a Patient
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3">
              <Car className="h-4 w-4 mr-2 text-success-500" />
              Book a Ride
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3">
              <Calendar className="h-4 w-4 mr-2 text-info-500" />
              View Scheduled Rides
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3">
              <CreditCard className="h-4 w-4 mr-2 text-warning-500" />
              Payment Methods
            </Button>
          </div>
        </CardContent>
      </Card>

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
                Fill out the form below and our family support team will get back to you
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
                    Our family support team will respond within 24 hours
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Select value={contactSubject} onValueChange={setContactSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linking">Linking a Patient</SelectItem>
                        <SelectItem value="booking">Booking Help</SelectItem>
                        <SelectItem value="tracking">Tracking a Ride</SelectItem>
                        <SelectItem value="payment">Payment Question</SelectItem>
                        <SelectItem value="account">Account Help</SelectItem>
                        <SelectItem value="complaint">File a Complaint</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      placeholder="How can we help you today?"
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
                  <h3 className="font-medium text-warning-900">Need Immediate Help?</h3>
                  <p className="text-sm text-warning-700 mt-1">
                    For urgent matters about an active ride or emergencies, call our 24/7 line:
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

      {/* Helpful Resources */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-500" />
            Helpful Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Family Caregiver Guide', description: 'Tips for coordinating medical transport' },
              { title: 'Understanding NEMT', description: 'What non-emergency medical transport covers' },
              { title: 'Insurance Coverage FAQ', description: 'What insurance typically covers' },
              { title: 'Patient Safety', description: 'Our commitment to patient safety' },
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

      {/* Support Hours */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-info-500" />
            Family Support Hours
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
              <h4 className="font-medium text-gray-900 mb-2">Email & Chat Support</h4>
              <p className="text-gray-600">Mon-Fri: 7:00 AM - 8:00 PM</p>
              <p className="text-gray-600">Sat-Sun: 8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

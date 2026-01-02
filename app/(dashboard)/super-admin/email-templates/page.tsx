'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Mail,
  Eye,
  Edit,
  Plus,
  Search,
  Send,
  Copy,
} from 'lucide-react';

// Mock email templates
const mockTemplates = [
  {
    id: 'TPL-001',
    name: 'Welcome Email',
    subject: 'Welcome to Delta TMS!',
    category: 'onboarding',
    status: 'active',
    lastEdited: '2024-01-10',
  },
  {
    id: 'TPL-002',
    name: 'Trip Confirmation',
    subject: 'Your trip has been confirmed',
    category: 'trips',
    status: 'active',
    lastEdited: '2024-01-12',
  },
  {
    id: 'TPL-003',
    name: 'Driver Assignment',
    subject: 'A driver has been assigned to your trip',
    category: 'trips',
    status: 'active',
    lastEdited: '2024-01-08',
  },
  {
    id: 'TPL-004',
    name: 'Trip Reminder',
    subject: 'Reminder: Your trip is tomorrow',
    category: 'trips',
    status: 'active',
    lastEdited: '2024-01-15',
  },
  {
    id: 'TPL-005',
    name: 'Password Reset',
    subject: 'Reset your password',
    category: 'auth',
    status: 'active',
    lastEdited: '2024-01-05',
  },
  {
    id: 'TPL-006',
    name: 'Invoice',
    subject: 'Invoice #{invoice_number}',
    category: 'billing',
    status: 'active',
    lastEdited: '2024-01-14',
  },
  {
    id: 'TPL-007',
    name: 'Trip Cancelled',
    subject: 'Your trip has been cancelled',
    category: 'trips',
    status: 'draft',
    lastEdited: '2024-01-13',
  },
];

const templateVariables = [
  { name: '{user_name}', description: 'User\'s full name' },
  { name: '{company_name}', description: 'Company name' },
  { name: '{trip_date}', description: 'Trip date' },
  { name: '{trip_time}', description: 'Trip time' },
  { name: '{pickup_address}', description: 'Pickup location' },
  { name: '{dropoff_address}', description: 'Dropoff location' },
  { name: '{driver_name}', description: 'Driver name' },
  { name: '{vehicle_info}', description: 'Vehicle information' },
  { name: '{invoice_number}', description: 'Invoice number' },
  { name: '{amount}', description: 'Amount due' },
];

export default function SuperAdminEmailTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: 'bg-blue-100 text-blue-800',
      trips: 'bg-green-100 text-green-800',
      auth: 'bg-purple-100 text-purple-800',
      billing: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600">Customize email templates for system notifications</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setFilterCategory}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-shadow hover:shadow-md ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{template.name}</h3>
                          {template.status === 'draft' && (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{template.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPreviewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templateVariables.map((variable) => (
                  <div
                    key={variable.name}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm group cursor-pointer hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-mono text-blue-600">{variable.name}</p>
                      <p className="text-xs text-gray-500">{variable.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Send Test Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              This is how the email will appear to recipients
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-6 bg-white">
            <div className="border-b pb-4 mb-4">
              <p className="text-sm text-gray-500">Subject:</p>
              <p className="font-medium">Welcome to Delta TMS!</p>
            </div>
            <div className="space-y-4 text-sm">
              <p>Hi John,</p>
              <p>
                Welcome to Delta TMS! We're excited to have you on board.
              </p>
              <p>
                Your account has been created successfully. You can now log in
                and start managing your medical transportation operations.
              </p>
              <p>
                If you have any questions, please don't hesitate to reach out
                to our support team.
              </p>
              <p>Best regards,<br />The Delta TMS Team</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

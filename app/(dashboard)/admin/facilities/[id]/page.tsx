'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Edit,
  Trash2,
  Plus,
  Download,
  User,
  Car,
} from 'lucide-react';

// Mock facility data
const mockFacility = {
  id: 'FAC-001',
  name: 'Metro General Hospital',
  type: 'Hospital',
  status: 'active',
  address: {
    street: '1234 Medical Center Dr',
    city: 'Metro City',
    state: 'CA',
    zip: '90210',
  },
  contact: {
    name: 'Sarah Johnson',
    title: 'Transportation Coordinator',
    phone: '(555) 123-4567',
    email: 'sjohnson@metrogen.com',
  },
  billing: {
    paymentTerms: 'Net 30',
    accountNumber: 'ACC-78901',
    taxId: '12-3456789',
    primaryContact: 'Accounting Dept',
    phone: '(555) 123-4500',
    email: 'billing@metrogen.com',
  },
  contract: {
    number: 'CNT-2024-001',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    autoRenew: true,
    value: '$250,000',
  },
  stats: {
    totalTrips: 1247,
    thisMonth: 156,
    activePatients: 89,
    avgTripsPerDay: 5.2,
  },
  notes: 'VIP client. Priority scheduling for dialysis patients.',
  createdAt: '2022-06-15',
};

const mockUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sjohnson@metrogen.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15 09:30 AM' },
  { id: 2, name: 'Mike Peters', email: 'mpeters@metrogen.com', role: 'Staff', status: 'active', lastLogin: '2024-01-15 08:15 AM' },
  { id: 3, name: 'Lisa Chen', email: 'lchen@metrogen.com', role: 'Staff', status: 'inactive', lastLogin: '2024-01-10 02:45 PM' },
];

const mockPatients = [
  { id: 'PAT-001', name: 'John Smith', membershipType: 'Medicaid', trips: 24, lastTrip: '2024-01-15', status: 'active' },
  { id: 'PAT-002', name: 'Mary Johnson', membershipType: 'Medicare', trips: 18, lastTrip: '2024-01-14', status: 'active' },
  { id: 'PAT-003', name: 'Robert Davis', membershipType: 'Private Pay', trips: 12, lastTrip: '2024-01-12', status: 'active' },
  { id: 'PAT-004', name: 'Jennifer Wilson', membershipType: 'Medicaid', trips: 36, lastTrip: '2024-01-15', status: 'active' },
];

const mockRecentTrips = [
  { id: 'TRP-1001', patient: 'John Smith', date: '2024-01-15', time: '09:00 AM', destination: 'City Dialysis Center', status: 'completed', cost: '$45.00' },
  { id: 'TRP-1002', patient: 'Mary Johnson', date: '2024-01-15', time: '10:30 AM', destination: 'Metro General Hospital', status: 'in_progress', cost: '$35.00' },
  { id: 'TRP-1003', patient: 'Robert Davis', date: '2024-01-15', time: '02:00 PM', destination: 'Oncology Center', status: 'scheduled', cost: '$55.00' },
];

const mockInvoices = [
  { id: 'INV-2024-001', date: '2024-01-01', amount: '$12,450.00', trips: 156, status: 'paid', dueDate: '2024-01-31' },
  { id: 'INV-2023-012', date: '2023-12-01', amount: '$11,890.00', trips: 142, status: 'paid', dueDate: '2023-12-31' },
  { id: 'INV-2023-011', date: '2023-11-01', amount: '$13,200.00', trips: 168, status: 'paid', dueDate: '2023-11-30' },
];

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-purple-100 text-purple-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{mockFacility.name}</h1>
              <Badge className={getStatusColor(mockFacility.status)}>
                {mockFacility.status}
              </Badge>
            </div>
            <p className="text-gray-600">{mockFacility.id} • {mockFacility.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Facility</DialogTitle>
                <DialogDescription>Update facility information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Facility Name</Label>
                    <Input defaultValue={mockFacility.name} />
                  </div>
                  <div>
                    <Label>Facility Type</Label>
                    <Select defaultValue={mockFacility.type.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="dialysis">Dialysis Center</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="nursing">Nursing Home</SelectItem>
                        <SelectItem value="rehab">Rehab Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Street Address</Label>
                  <Input defaultValue={mockFacility.address.street} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input defaultValue={mockFacility.address.city} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input defaultValue={mockFacility.address.state} />
                  </div>
                  <div>
                    <Label>ZIP Code</Label>
                    <Input defaultValue={mockFacility.address.zip} />
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea defaultValue={mockFacility.notes} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Deactivate
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{mockFacility.stats.totalTrips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{mockFacility.stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">{mockFacility.stats.activePatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Trips/Day</p>
                <p className="text-2xl font-bold text-gray-900">{mockFacility.stats.avgTripsPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{mockFacility.address.street}</p>
                    <p className="text-gray-600">{mockFacility.address.city}, {mockFacility.address.state} {mockFacility.address.zip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{mockFacility.contact.name}</p>
                    <p className="text-sm text-gray-600">{mockFacility.contact.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{mockFacility.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{mockFacility.contact.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contract Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract Number</span>
                  <span className="font-medium text-gray-900">{mockFacility.contract.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium text-gray-900">{mockFacility.contract.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium text-gray-900">{mockFacility.contract.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contract Value</span>
                  <span className="font-medium text-gray-900">{mockFacility.contract.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto-Renew</span>
                  <Badge variant={mockFacility.contract.autoRenew ? 'default' : 'secondary'}>
                    {mockFacility.contract.autoRenew ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number</span>
                  <span className="font-medium text-gray-900">{mockFacility.billing.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ID</span>
                  <span className="font-medium text-gray-900">{mockFacility.billing.taxId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Terms</span>
                  <span className="font-medium text-gray-900">{mockFacility.billing.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Contact</span>
                  <span className="font-medium text-gray-900">{mockFacility.billing.primaryContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Email</span>
                  <span className="font-medium text-gray-900">{mockFacility.billing.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mockFacility.notes}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Facility added on {mockFacility.createdAt}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facility Users</CardTitle>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Facility User</DialogTitle>
                    <DialogDescription>Create a new user for this facility</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input placeholder="Enter name" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="Enter email" />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="readonly">Read Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsAddUserDialogOpen(false)}>Add User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Last Login</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 text-gray-600">{user.email}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{user.role}</Badge>
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </td>
                      <td className="py-3 text-gray-600">{user.lastLogin}</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facility Patients</CardTitle>
              <div className="flex items-center gap-2">
                <Input placeholder="Search patients..." className="w-64" />
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Patient ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Membership</th>
                    <th className="pb-3 font-medium">Total Trips</th>
                    <th className="pb-3 font-medium">Last Trip</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="py-3 font-mono text-sm text-gray-600">{patient.id}</td>
                      <td className="py-3 font-medium text-gray-900">{patient.name}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{patient.membershipType}</Badge>
                      </td>
                      <td className="py-3 text-gray-600">{patient.trips}</td>
                      <td className="py-3 text-gray-600">{patient.lastTrip}</td>
                      <td className="py-3">
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Trips</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trips</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Trip ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Destination</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockRecentTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td className="py-3 font-mono text-sm text-blue-600 cursor-pointer hover:underline">{trip.id}</td>
                      <td className="py-3 font-medium text-gray-900">{trip.patient}</td>
                      <td className="py-3 text-gray-600">{trip.date}</td>
                      <td className="py-3 text-gray-600">{trip.time}</td>
                      <td className="py-3 text-gray-600">{trip.destination}</td>
                      <td className="py-3">
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 font-medium text-gray-900">{trip.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Invoice #</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Trips</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Due Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="py-3 font-mono text-sm text-blue-600 cursor-pointer hover:underline">{invoice.id}</td>
                      <td className="py-3 text-gray-600">{invoice.date}</td>
                      <td className="py-3 text-gray-600">{invoice.trips}</td>
                      <td className="py-3 font-medium text-gray-900">{invoice.amount}</td>
                      <td className="py-3 text-gray-600">{invoice.dueDate}</td>
                      <td className="py-3">
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

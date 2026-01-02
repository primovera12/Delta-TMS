'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
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
  Phone,
  MapPin,
  Clock,
  Car,
  User,
  Calendar,
  Navigation,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Printer,
  DollarSign,
  FileText,
  RefreshCw,
  Truck,
} from 'lucide-react';

// Mock ride data for admin view
const mockRide = {
  id: 'TRP-5001',
  status: 'completed',
  createdAt: '2024-01-14 10:30 AM',
  createdBy: 'Sarah Johnson (Facility)',
  source: 'Facility Portal',
  patient: {
    id: 'PAT-089',
    name: 'John Smith',
    phone: '(555) 123-4567',
    dateOfBirth: '1955-03-15',
    memberId: 'MED-456789',
    membershipType: 'Medicare',
    mobilityRequirements: ['wheelchair'],
    specialNotes: 'Needs extra assistance during transfers',
    facility: 'Metro General Hospital',
  },
  driver: {
    id: 'DRV-001',
    name: 'Michael Johnson',
    phone: '(555) 234-5678',
    vehicle: '2023 Toyota Sienna',
    licensePlate: 'ABC-1234',
    avatar: null,
    rating: 4.8,
  },
  schedule: {
    date: '2024-01-15',
    appointmentTime: '10:00 AM',
    pickupTime: '9:00 AM',
    actualPickup: '9:05 AM',
    dropoffTime: '9:48 AM',
    returnPickupTime: '11:30 AM',
    actualReturnPickup: '11:35 AM',
    returnDropoffTime: '12:18 PM',
  },
  pickup: {
    address: '456 Maple Lane, Metro City, CA 90210',
    type: 'Residence',
    notes: 'Ring doorbell, patient may need a few minutes',
  },
  dropoff: {
    address: '789 Medical Center Dr, Metro City, CA 90210',
    name: 'Metro General Hospital',
    department: 'Cardiology - 3rd Floor',
    notes: 'Drop off at main entrance',
  },
  tripType: 'Round Trip',
  serviceLevel: 'Wheelchair Van',
  billing: {
    base: 35.00,
    mileage: 12.50,
    waitTime: 5.00,
    additionalServices: 0,
    total: 52.50,
    paymentMethod: 'Medicare',
    claimStatus: 'submitted',
    claimNumber: 'CLM-2024-0892',
    invoiceNumber: 'INV-2024-001-156',
  },
  miles: {
    pickup: 8.5,
    return: 8.5,
    total: 17.0,
  },
  ratings: {
    patient: 5,
    driver: 5,
  },
  notes: [
    { author: 'Michael Johnson (Driver)', time: '9:05 AM', text: 'Patient picked up, slight delay due to wheelchair prep' },
    { author: 'Michael Johnson (Driver)', time: '9:48 AM', text: 'Dropped off at main entrance, assisted to door' },
    { author: 'Michael Johnson (Driver)', time: '11:35 AM', text: 'Return pickup completed' },
    { author: 'Michael Johnson (Driver)', time: '12:18 PM', text: 'Trip completed successfully' },
  ],
};

const mockTimeline = [
  { time: '10:30 AM', date: '2024-01-14', event: 'Trip created', user: 'Sarah Johnson', status: 'completed' },
  { time: '11:00 AM', date: '2024-01-14', event: 'Driver assigned', user: 'System', status: 'completed' },
  { time: '8:45 AM', date: '2024-01-15', event: 'Driver dispatched', user: 'System', status: 'completed' },
  { time: '9:00 AM', date: '2024-01-15', event: 'En route to pickup', user: 'Driver', status: 'completed' },
  { time: '9:05 AM', date: '2024-01-15', event: 'Arrived at pickup', user: 'Driver', status: 'completed' },
  { time: '9:08 AM', date: '2024-01-15', event: 'Patient onboard', user: 'Driver', status: 'completed' },
  { time: '9:48 AM', date: '2024-01-15', event: 'Arrived at destination', user: 'Driver', status: 'completed' },
  { time: '11:35 AM', date: '2024-01-15', event: 'Return pickup', user: 'Driver', status: 'completed' },
  { time: '12:18 PM', date: '2024-01-15', event: 'Trip completed', user: 'Driver', status: 'completed' },
  { time: '12:20 PM', date: '2024-01-15', event: 'Billing submitted', user: 'System', status: 'completed' },
];

export default function AdminRideDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-purple-100 text-purple-800',
      confirmed: 'bg-blue-100 text-blue-800',
      dispatched: 'bg-cyan-100 text-cyan-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-orange-100 text-orange-800',
      submitted: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800',
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
              <h1 className="text-2xl font-bold text-gray-900">Ride {mockRide.id}</h1>
              <Badge className={getStatusColor(mockRide.status)}>
                {mockRide.status}
              </Badge>
            </div>
            <p className="text-gray-600">{mockRide.tripType} • {mockRide.serviceLevel} • {mockRide.schedule.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Ride</DialogTitle>
                <DialogDescription>Modify ride details</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue={mockRide.status}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea placeholder="Add internal notes..." rows={3} className="mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refund
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Refund</DialogTitle>
                <DialogDescription>Issue a refund for this ride</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Original Amount</span>
                    <span className="font-medium">${mockRide.billing.total.toFixed(2)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Refund Amount</label>
                  <input type="number" className="w-full border rounded-lg p-2 mt-1" defaultValue={mockRide.billing.total} step="0.01" />
                </div>
                <div>
                  <label className="text-sm font-medium">Reason</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cancelled">Trip Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                      <SelectItem value="service_issue">Service Issue</SelectItem>
                      <SelectItem value="billing_error">Billing Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea placeholder="Refund notes..." rows={2} className="mt-1" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => setIsRefundDialogOpen(false)}>Process Refund</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Navigation className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Miles</p>
                <p className="text-xl font-bold text-gray-900">{mockRide.miles.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fare</p>
                <p className="text-xl font-bold text-gray-900">${mockRide.billing.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wait Time</p>
                <p className="text-xl font-bold text-gray-900">10 min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Claim Status</p>
                <Badge className={getStatusColor(mockRide.billing.claimStatus)}>
                  {mockRide.billing.claimStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Source</p>
                <p className="font-medium text-gray-900 text-sm">{mockRide.source}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Patient Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{mockRide.patient.name}</p>
                    <p className="text-sm text-gray-600">DOB: {mockRide.patient.dateOfBirth}</p>
                    <p className="text-sm text-gray-600">{mockRide.patient.memberId}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/patients/${mockRide.patient.id}`)}>
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{mockRide.patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  {mockRide.patient.mobilityRequirements.map((req) => (
                    <Badge key={req} variant="secondary">{req}</Badge>
                  ))}
                  <Badge variant="outline">{mockRide.patient.membershipType}</Badge>
                </div>
                {mockRide.patient.specialNotes && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    {mockRide.patient.specialNotes}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Driver & Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {mockRide.driver.avatar ? (
                      <AvatarImage src={mockRide.driver.avatar} />
                    ) : (
                      <AvatarFallback>
                        {mockRide.driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{mockRide.driver.name}</p>
                    <p className="text-sm text-gray-600">{mockRide.driver.vehicle}</p>
                    <p className="text-sm text-gray-500">{mockRide.driver.licensePlate}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/drivers/${mockRide.driver.id}`)}>
                    View Profile
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{mockRide.driver.phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Route Card */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-8">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div>
                        <p className="text-sm text-gray-500">PICKUP • {mockRide.schedule.pickupTime}</p>
                        <p className="font-medium text-gray-900">{mockRide.pickup.address}</p>
                        <p className="text-sm text-gray-500">{mockRide.pickup.type}</p>
                        {mockRide.schedule.actualPickup && (
                          <p className="text-sm text-green-600">Actual: {mockRide.schedule.actualPickup}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">B</div>
                      <div>
                        <p className="text-sm text-gray-500">DROPOFF • Appt {mockRide.schedule.appointmentTime}</p>
                        <p className="font-medium text-gray-900">{mockRide.dropoff.name}</p>
                        <p className="text-sm text-gray-600">{mockRide.dropoff.address}</p>
                        <p className="text-sm text-gray-500">{mockRide.dropoff.department}</p>
                        {mockRide.schedule.dropoffTime && (
                          <p className="text-sm text-green-600">Actual: {mockRide.schedule.dropoffTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {mockRide.tripType === 'Round Trip' && (
                    <div className="flex-1 border-l pl-8">
                      <p className="font-medium text-gray-900 mb-4">Return Trip</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scheduled Pickup</span>
                          <span>{mockRide.schedule.returnPickupTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Actual Pickup</span>
                          <span className="text-green-600">{mockRide.schedule.actualReturnPickup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dropoff Time</span>
                          <span className="text-green-600">{mockRide.schedule.returnDropoffTime}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fare Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">${mockRide.billing.base.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mileage ({mockRide.miles.total} mi)</span>
                    <span className="font-medium">${mockRide.billing.mileage.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wait Time</span>
                    <span className="font-medium">${mockRide.billing.waitTime.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Services</span>
                    <span className="font-medium">${mockRide.billing.additionalServices.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${mockRide.billing.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment & Claim Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <Badge variant="secondary">{mockRide.billing.paymentMethod}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Claim Status</span>
                    <Badge className={getStatusColor(mockRide.billing.claimStatus)}>
                      {mockRide.billing.claimStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Claim Number</span>
                    <span className="font-mono text-sm">{mockRide.billing.claimNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Number</span>
                    <span className="font-mono text-sm">{mockRide.billing.invoiceNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTimeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {index < mockTimeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{item.event}</p>
                        <p className="text-sm text-gray-500">{item.time} • {item.date}</p>
                      </div>
                      <p className="text-sm text-gray-500">By: {item.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Trip Notes</CardTitle>
              <Button size="sm">Add Note</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRide.notes.map((note, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{note.author}</span>
                      <span className="text-sm text-gray-500">{note.time}</span>
                    </div>
                    <p className="text-gray-700">{note.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span>{mockRide.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created By</span>
                  <span>{mockRide.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source</span>
                  <span>{mockRide.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient Rating</span>
                  <span>⭐ {mockRide.ratings.patient}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

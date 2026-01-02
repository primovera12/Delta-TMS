'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
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
  Calendar,
  User,
  Edit,
  Trash2,
  Play,
  Pause,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';

// Mock standing order data
const mockStandingOrder = {
  id: 'SO-001',
  status: 'active',
  patient: {
    id: 'PAT-089',
    name: 'Eleanor Williams',
    phone: '(555) 123-4567',
    dateOfBirth: '1948-05-20',
    memberId: 'MED-789456',
    membershipType: 'Medicare',
    mobilityRequirements: ['wheelchair'],
    address: '456 Maple Lane, Metro City, CA 90210',
  },
  destination: {
    name: 'Metro Dialysis Center',
    address: '789 Medical Center Dr, Metro City, CA 90210',
    department: 'Dialysis Unit - 2nd Floor',
    phone: '(555) 456-7890',
  },
  schedule: {
    frequency: 'MWF',
    days: ['Monday', 'Wednesday', 'Friday'],
    pickupTime: '9:00 AM',
    appointmentTime: '10:00 AM',
    tripType: 'Round Trip',
    returnPickupTime: '1:30 PM',
  },
  serviceLevel: 'Wheelchair Van',
  preferredDriver: {
    id: 'DRV-001',
    name: 'Michael Johnson',
  },
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  createdAt: '2023-12-15',
  createdBy: 'Sarah Johnson',
  notes: 'Patient prefers same driver when possible. May need extra time for wheelchair prep.',
  totalTripsScheduled: 156,
  tripsCompleted: 24,
  tripsCancelled: 2,
};

const mockUpcomingTrips = [
  { id: 'TRP-2010', date: '2024-01-17', day: 'Wednesday', time: '9:00 AM', driver: 'Michael J.', status: 'confirmed' },
  { id: 'TRP-2011', date: '2024-01-19', day: 'Friday', time: '9:00 AM', driver: 'Pending', status: 'scheduled' },
  { id: 'TRP-2012', date: '2024-01-22', day: 'Monday', time: '9:00 AM', driver: 'Pending', status: 'scheduled' },
  { id: 'TRP-2013', date: '2024-01-24', day: 'Wednesday', time: '9:00 AM', driver: 'Pending', status: 'scheduled' },
  { id: 'TRP-2014', date: '2024-01-26', day: 'Friday', time: '9:00 AM', driver: 'Pending', status: 'scheduled' },
];

const mockTripHistory = [
  { id: 'TRP-2005', date: '2024-01-15', day: 'Monday', driver: 'Michael J.', status: 'completed', onTime: true },
  { id: 'TRP-2004', date: '2024-01-12', day: 'Friday', driver: 'Michael J.', status: 'completed', onTime: true },
  { id: 'TRP-2003', date: '2024-01-10', day: 'Wednesday', driver: 'Sarah K.', status: 'completed', onTime: false },
  { id: 'TRP-2002', date: '2024-01-08', day: 'Monday', driver: 'Michael J.', status: 'cancelled', onTime: null },
  { id: 'TRP-2001', date: '2024-01-05', day: 'Friday', driver: 'Michael J.', status: 'completed', onTime: true },
];

const mockExceptions = [
  { id: 1, date: '2024-01-25', type: 'skip', reason: 'Patient hospitalized', createdBy: 'Sarah Johnson' },
  { id: 2, date: '2024-02-14', type: 'reschedule', reason: 'Appointment changed', newTime: '10:00 AM', createdBy: 'Dispatcher' },
];

export default function DispatcherStandingOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExceptionDialogOpen, setIsExceptionDialogOpen] = useState(false);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      confirmed: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
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
              <h1 className="text-2xl font-bold text-gray-900">Standing Order {mockStandingOrder.id}</h1>
              <Badge className={getStatusColor(mockStandingOrder.status)}>
                {mockStandingOrder.status}
              </Badge>
            </div>
            <p className="text-gray-600">
              {mockStandingOrder.schedule.frequency} • {mockStandingOrder.schedule.tripType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mockStandingOrder.status === 'active' ? (
            <Dialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pause Standing Order</DialogTitle>
                  <DialogDescription>Temporarily pause this recurring schedule</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pause From</Label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div>
                      <Label>Resume On</Label>
                      <Input type="date" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Reason</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hospitalized">Patient Hospitalized</SelectItem>
                        <SelectItem value="vacation">Patient on Vacation</SelectItem>
                        <SelectItem value="temporary">Temporary Hold</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPauseDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsPauseDialogOpen(false)}>Pause Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Standing Order</DialogTitle>
                <DialogDescription>Modify the recurring schedule</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Pickup Time</Label>
                    <Input type="time" defaultValue="09:00" className="mt-1" />
                  </div>
                  <div>
                    <Label>Appointment Time</Label>
                    <Input type="time" defaultValue="10:00" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Schedule Days</Label>
                  <div className="flex gap-2 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <Button
                        key={day}
                        variant={['Mon', 'Wed', 'Fri'].includes(day) ? 'default' : 'outline'}
                        size="sm"
                        className="w-12"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Level</Label>
                    <Select defaultValue="wheelchair">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambulatory">Ambulatory</SelectItem>
                        <SelectItem value="wheelchair">Wheelchair Van</SelectItem>
                        <SelectItem value="stretcher">Stretcher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Preferred Driver</Label>
                    <Select defaultValue="drv-001">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Available</SelectItem>
                        <SelectItem value="drv-001">Michael Johnson</SelectItem>
                        <SelectItem value="drv-002">Sarah Kim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" defaultValue="2024-12-31" className="mt-1" />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch id="auto-renew" />
                    <Label htmlFor="auto-renew">Auto-renew</Label>
                  </div>
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
            Cancel Order
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{mockStandingOrder.totalTripsScheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{mockStandingOrder.tripsCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">{mockStandingOrder.tripsCancelled}</p>
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
                <p className="text-sm text-gray-600">Valid Until</p>
                <p className="text-lg font-bold text-gray-900">{mockStandingOrder.endDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{mockStandingOrder.patient.name}</p>
                <p className="text-sm text-gray-600">{mockStandingOrder.patient.memberId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{mockStandingOrder.patient.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{mockStandingOrder.patient.address}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockStandingOrder.patient.mobilityRequirements.map((req) => (
                  <Badge key={req} variant="secondary">{req}</Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push(`/dispatcher/patients/${mockStandingOrder.patient.id}`)}>
                View Patient Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">{mockStandingOrder.destination.name}</p>
                <p className="text-sm text-gray-600">{mockStandingOrder.destination.address}</p>
                <p className="text-sm text-gray-500">{mockStandingOrder.destination.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{mockStandingOrder.destination.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Frequency</span>
                <span className="font-medium">{mockStandingOrder.schedule.frequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days</span>
                <span className="font-medium">{mockStandingOrder.schedule.days.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Time</span>
                <span className="font-medium">{mockStandingOrder.schedule.pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appointment</span>
                <span className="font-medium">{mockStandingOrder.schedule.appointmentTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Type</span>
                <Badge variant="secondary">{mockStandingOrder.schedule.tripType}</Badge>
              </div>
              {mockStandingOrder.schedule.returnPickupTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Return Pickup</span>
                  <span className="font-medium">{mockStandingOrder.schedule.returnPickupTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Service Level</span>
                <Badge variant="secondary">{mockStandingOrder.serviceLevel}</Badge>
              </div>
              {mockStandingOrder.preferredDriver && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Driver</span>
                  <span className="font-medium">{mockStandingOrder.preferredDriver.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {mockStandingOrder.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{mockStandingOrder.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Trips */}
        <div className="col-span-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
                <TabsTrigger value="history">Trip History</TabsTrigger>
                <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
              </TabsList>
              <Dialog open={isExceptionDialogOpen} onOpenChange={setIsExceptionDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exception
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Exception</DialogTitle>
                    <DialogDescription>Skip or reschedule a specific date</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div>
                      <Label>Date</Label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <div>
                      <Label>Exception Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skip">Skip this date</SelectItem>
                          <SelectItem value="reschedule">Reschedule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment_change">Appointment Changed</SelectItem>
                          <SelectItem value="patient_request">Patient Request</SelectItem>
                          <SelectItem value="facility_closed">Facility Closed</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExceptionDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsExceptionDialogOpen(false)}>Add Exception</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="upcoming" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="p-4 font-medium">Trip ID</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Day</th>
                        <th className="p-4 font-medium">Time</th>
                        <th className="p-4 font-medium">Driver</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockUpcomingTrips.map((trip) => (
                        <tr key={trip.id}>
                          <td className="p-4 font-mono text-sm text-blue-600 cursor-pointer hover:underline">{trip.id}</td>
                          <td className="p-4 text-gray-900">{trip.date}</td>
                          <td className="p-4 text-gray-600">{trip.day}</td>
                          <td className="p-4 text-gray-600">{trip.time}</td>
                          <td className="p-4 text-gray-600">{trip.driver}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="p-4 font-medium">Trip ID</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Day</th>
                        <th className="p-4 font-medium">Driver</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">On Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockTripHistory.map((trip) => (
                        <tr key={trip.id}>
                          <td className="p-4 font-mono text-sm text-blue-600 cursor-pointer hover:underline">{trip.id}</td>
                          <td className="p-4 text-gray-900">{trip.date}</td>
                          <td className="p-4 text-gray-600">{trip.day}</td>
                          <td className="p-4 text-gray-600">{trip.driver}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                          </td>
                          <td className="p-4">
                            {trip.onTime === true && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {trip.onTime === false && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                            {trip.onTime === null && <span className="text-gray-400">-</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exceptions" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {mockExceptions.length > 0 ? (
                    <div className="space-y-4">
                      {mockExceptions.map((exception) => (
                        <div key={exception.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <p className="text-lg font-bold text-gray-900">{new Date(exception.date).getDate()}</p>
                              <p className="text-sm text-gray-500">{new Date(exception.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant={exception.type === 'skip' ? 'destructive' : 'secondary'}>
                                  {exception.type}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mt-1">{exception.reason}</p>
                              {exception.newTime && (
                                <p className="text-sm text-blue-600">New time: {exception.newTime}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">Added by {exception.createdBy}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No exceptions scheduled</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

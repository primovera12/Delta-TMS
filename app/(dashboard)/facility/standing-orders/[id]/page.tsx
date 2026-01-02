'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Calendar,
  User,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
} from 'lucide-react';

// Mock standing order data for facility view
const mockStandingOrder = {
  id: 'SO-002',
  status: 'active',
  patient: {
    id: 'PAT-123',
    name: 'James Wilson',
    phone: '(555) 987-6543',
    dateOfBirth: '1945-08-12',
    memberId: 'MED-456123',
    membershipType: 'Medicaid',
    mobilityRequirements: ['stretcher'],
    address: '789 Pine Street, Metro City, CA 90210',
  },
  destination: {
    name: 'City Oncology Center',
    address: '321 Health Blvd, Metro City, CA 90215',
    department: 'Chemotherapy Unit',
    phone: '(555) 789-0123',
  },
  schedule: {
    frequency: 'Weekly',
    days: ['Tuesday'],
    pickupTime: '8:00 AM',
    appointmentTime: '9:00 AM',
    tripType: 'Round Trip',
    returnPickupTime: '2:00 PM',
  },
  serviceLevel: 'Stretcher',
  startDate: '2024-01-02',
  endDate: '2024-06-30',
  createdAt: '2023-12-20',
  notes: 'Patient requires oxygen during transport. Appointment typically runs 4-5 hours.',
};

const mockUpcomingTrips = [
  { id: 'TRP-3001', date: '2024-01-16', day: 'Tuesday', time: '8:00 AM', status: 'confirmed' },
  { id: 'TRP-3002', date: '2024-01-23', day: 'Tuesday', time: '8:00 AM', status: 'scheduled' },
  { id: 'TRP-3003', date: '2024-01-30', day: 'Tuesday', time: '8:00 AM', status: 'scheduled' },
  { id: 'TRP-3004', date: '2024-02-06', day: 'Tuesday', time: '8:00 AM', status: 'scheduled' },
];

const mockTripHistory = [
  { id: 'TRP-2995', date: '2024-01-09', status: 'completed', driver: 'David L.' },
  { id: 'TRP-2990', date: '2024-01-02', status: 'completed', driver: 'David L.' },
];

export default function FacilityStandingOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
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
                    <Textarea placeholder="Enter reason for pause..." className="mt-1" rows={3} />
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
                Request Change
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Schedule Change</DialogTitle>
                <DialogDescription>Submit a change request to the transportation provider</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label>Change Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select change type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Change Pickup Time</SelectItem>
                      <SelectItem value="day">Change Days</SelectItem>
                      <SelectItem value="destination">Change Destination</SelectItem>
                      <SelectItem value="service">Change Service Level</SelectItem>
                      <SelectItem value="cancel">Cancel Standing Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Effective Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label>Details</Label>
                  <Textarea placeholder="Describe the requested change..." className="mt-1" rows={4} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                <p className="text-sm text-gray-600">DOB: {mockStandingOrder.patient.dateOfBirth}</p>
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
                <Badge variant="outline">{mockStandingOrder.patient.membershipType}</Badge>
              </div>
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
                <span className="text-gray-600">Day(s)</span>
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
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date</span>
                  <span>{mockStandingOrder.startDate}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">End Date</span>
                  <span>{mockStandingOrder.endDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {mockStandingOrder.notes && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Notes</p>
                    <p className="text-amber-700 text-sm">{mockStandingOrder.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Trips */}
        <div className="col-span-2 space-y-4">
          {/* Upcoming Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Trips</CardTitle>
              <Dialog open={isSkipDialogOpen} onOpenChange={setIsSkipDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Skip a Date</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Skip a Trip Date</DialogTitle>
                    <DialogDescription>Cancel a specific upcoming trip</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div>
                      <Label>Select Date to Skip</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a date" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUpcomingTrips.map((trip) => (
                            <SelectItem key={trip.id} value={trip.date}>
                              {trip.date} ({trip.day})
                            </SelectItem>
                          ))}
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
                          <SelectItem value="appointment_cancelled">Appointment Cancelled</SelectItem>
                          <SelectItem value="patient_unavailable">Patient Unavailable</SelectItem>
                          <SelectItem value="hospitalized">Patient Hospitalized</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Notes (optional)</Label>
                      <Textarea placeholder="Additional notes..." className="mt-1" rows={2} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSkipDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => setIsSkipDialogOpen(false)}>Skip This Date</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockUpcomingTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px] bg-gray-50 rounded-lg p-2">
                        <p className="text-sm text-gray-500">{trip.day.slice(0, 3)}</p>
                        <p className="text-xl font-bold text-gray-900">{new Date(trip.date).getDate()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{trip.date}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Pickup at {trip.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trip History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Trip ID</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Driver</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockTripHistory.map((trip) => (
                    <tr key={trip.id}>
                      <td className="py-3 font-mono text-sm text-blue-600 cursor-pointer hover:underline">{trip.id}</td>
                      <td className="py-3 text-gray-900">{trip.date}</td>
                      <td className="py-3 text-gray-600">{trip.driver}</td>
                      <td className="py-3">
                        <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Star,
} from 'lucide-react';

// Mock trip data for facility view
const mockTrip = {
  id: 'TRP-3001',
  status: 'in_progress',
  patient: {
    id: 'PAT-089',
    name: 'John Smith',
    phone: '(555) 123-4567',
    dateOfBirth: '1955-03-15',
    memberId: 'MED-456789',
    mobilityRequirements: ['wheelchair'],
    specialNotes: 'Needs extra assistance during transfers',
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
    estimatedArrival: '9:45 AM',
    returnPickupTime: '11:30 AM',
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
  fare: {
    base: '$35.00',
    mileage: '$12.50',
    waitTime: '$0.00',
    total: '$47.50',
    paymentMethod: 'Medicare',
  },
  createdAt: '2024-01-10 2:30 PM',
  createdBy: 'Sarah Johnson',
};

const mockTimeline = [
  { time: '9:00 AM', event: 'Driver dispatched', status: 'completed' },
  { time: '9:15 AM', event: 'Driver en route to pickup', status: 'completed' },
  { time: '9:35 AM', event: 'Driver arrived at pickup', status: 'completed' },
  { time: '9:40 AM', event: 'Patient picked up', status: 'completed' },
  { time: '9:45 AM', event: 'En route to destination', status: 'in_progress' },
  { time: '10:00 AM', event: 'Arrive at destination', status: 'pending' },
  { time: '11:30 AM', event: 'Return pickup', status: 'pending' },
  { time: '12:00 PM', event: 'Return to residence', status: 'pending' },
];

export default function FacilityTripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-purple-100 text-purple-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Navigation className="h-5 w-5 text-blue-500 animate-pulse" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Trip {mockTrip.id}</h1>
              <Badge className={getStatusColor(mockTrip.status)}>
                {mockTrip.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-gray-600">{mockTrip.tripType} • {mockTrip.serviceLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {mockTrip.status === 'in_progress' && (
            <Button variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Track Live
            </Button>
          )}
          {mockTrip.status === 'completed' && (
            <Dialog open={isRateDialogOpen} onOpenChange={setIsRateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Trip
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rate This Trip</DialogTitle>
                  <DialogDescription>How was the transportation service?</DialogDescription>
                </DialogHeader>
                <div className="py-6">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-10 w-10 transition-colors ${
                            star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Textarea placeholder="Additional feedback (optional)" rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsRateDialogOpen(false)}>Submit Rating</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {(mockTrip.status === 'scheduled' || mockTrip.status === 'confirmed') && (
            <>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Trip</DialogTitle>
                    <DialogDescription>Modify trip details</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Pickup Time</label>
                      <input type="time" className="w-full border rounded-lg p-2 mt-1" defaultValue="09:00" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Special Instructions</label>
                      <Textarea defaultValue={mockTrip.pickup.notes} rows={3} className="mt-1" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Trip
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Trip</DialogTitle>
                    <DialogDescription>Are you sure you want to cancel this trip?</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label className="text-sm font-medium">Cancellation Reason</label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient_request">Patient Request</SelectItem>
                        <SelectItem value="appointment_cancelled">Appointment Cancelled</SelectItem>
                        <SelectItem value="patient_hospitalized">Patient Hospitalized</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Additional notes..." className="mt-3" rows={3} />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Keep Trip</Button>
                    <Button variant="destructive" onClick={() => setIsCancelDialogOpen(false)}>Cancel Trip</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-4">
          {/* Patient Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg text-gray-900">{mockTrip.patient.name}</p>
                    <p className="text-gray-600">DOB: {mockTrip.patient.dateOfBirth} • ID: {mockTrip.patient.memberId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{mockTrip.patient.phone}</span>
                    <Button variant="ghost" size="sm" onClick={() => window.open(`tel:${mockTrip.patient.phone}`)}>
                      Call
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {mockTrip.patient.mobilityRequirements.map((req) => (
                      <Badge key={req} variant="secondary">{req}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              {mockTrip.patient.specialNotes && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Special Notes</p>
                      <p className="text-amber-700">{mockTrip.patient.specialNotes}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Route Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pickup */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-600" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 my-2" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="text-sm text-gray-500 mb-1">PICKUP • {mockTrip.schedule.pickupTime}</p>
                    <p className="font-medium text-gray-900">{mockTrip.pickup.address}</p>
                    <p className="text-sm text-gray-500">{mockTrip.pickup.type}</p>
                    {mockTrip.pickup.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{mockTrip.pickup.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">DROPOFF • Appt at {mockTrip.schedule.appointmentTime}</p>
                    <p className="font-medium text-gray-900">{mockTrip.dropoff.name}</p>
                    <p className="text-gray-600">{mockTrip.dropoff.address}</p>
                    <p className="text-sm text-gray-500">{mockTrip.dropoff.department}</p>
                    {mockTrip.dropoff.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{mockTrip.dropoff.notes}"</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Card */}
          {mockTrip.driver && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Driver & Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      {mockTrip.driver.avatar ? (
                        <AvatarImage src={mockTrip.driver.avatar} />
                      ) : (
                        <AvatarFallback>
                          {mockTrip.driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{mockTrip.driver.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{mockTrip.driver.rating}</span>
                      </div>
                      <p className="text-sm text-gray-600">{mockTrip.driver.vehicle}</p>
                      <p className="text-sm text-gray-500">{mockTrip.driver.licensePlate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`tel:${mockTrip.driver.phone}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Driver
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTimeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    {getTimelineIcon(item.status)}
                    <div className="flex-1">
                      <p className={`font-medium ${item.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>
                        {item.event}
                      </p>
                      <p className={`text-sm ${item.status === 'pending' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fare Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fare Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Base Fare</span>
                  <span>{mockTrip.fare.base}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Mileage</span>
                  <span>{mockTrip.fare.mileage}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Wait Time</span>
                  <span>{mockTrip.fare.waitTime}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{mockTrip.fare.total}</span>
                </div>
                <div className="pt-2">
                  <Badge variant="secondary">{mockTrip.fare.paymentMethod}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">{mockTrip.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created By</span>
                  <span className="text-gray-900">{mockTrip.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip ID</span>
                  <span className="font-mono text-gray-900">{mockTrip.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

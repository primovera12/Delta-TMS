'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  MapPin,
  Clock,
  Calendar,
  Plus,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Pause,
  Play,
  Phone,
} from 'lucide-react';

// Mock standing orders for patient
const mockStandingOrders = [
  {
    id: 'SO-001',
    status: 'active',
    destination: {
      name: 'Metro Dialysis Center',
      address: '789 Medical Center Dr',
    },
    schedule: {
      frequency: 'MWF',
      days: ['Monday', 'Wednesday', 'Friday'],
      pickupTime: '9:00 AM',
      appointmentTime: '10:00 AM',
      tripType: 'Round Trip',
    },
    serviceLevel: 'Wheelchair Van',
    nextTrip: {
      date: '2024-01-17',
      day: 'Wednesday',
    },
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
  {
    id: 'SO-002',
    status: 'active',
    destination: {
      name: 'City Physical Therapy',
      address: '456 Health Way',
    },
    schedule: {
      frequency: 'TTh',
      days: ['Tuesday', 'Thursday'],
      pickupTime: '2:00 PM',
      appointmentTime: '3:00 PM',
      tripType: 'Round Trip',
    },
    serviceLevel: 'Ambulatory',
    nextTrip: {
      date: '2024-01-18',
      day: 'Thursday',
    },
    startDate: '2024-01-08',
    endDate: '2024-03-31',
  },
];

const mockUpcomingTrips = [
  { id: 'TRP-1001', date: '2024-01-17', day: 'Wed', time: '9:00 AM', destination: 'Metro Dialysis Center', status: 'confirmed' },
  { id: 'TRP-1002', date: '2024-01-18', day: 'Thu', time: '2:00 PM', destination: 'City Physical Therapy', status: 'scheduled' },
  { id: 'TRP-1003', date: '2024-01-19', day: 'Fri', time: '9:00 AM', destination: 'Metro Dialysis Center', status: 'scheduled' },
  { id: 'TRP-1004', date: '2024-01-22', day: 'Mon', time: '9:00 AM', destination: 'Metro Dialysis Center', status: 'scheduled' },
  { id: 'TRP-1005', date: '2024-01-23', day: 'Tue', time: '2:00 PM', destination: 'City Physical Therapy', status: 'scheduled' },
];

export default function PatientStandingOrdersPage() {
  const router = useRouter();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      confirmed: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Standing Orders</h1>
          <p className="text-gray-600">Manage your recurring trip schedules</p>
        </div>
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Standing Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Request a Standing Order</DialogTitle>
              <DialogDescription>
                Submit a request for recurring transportation. Our team will review and set up your schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label>Destination Name</Label>
                <Input placeholder="e.g., Metro Dialysis Center" className="mt-1" />
              </div>
              <div>
                <Label>Destination Address</Label>
                <Input placeholder="Full address" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Appointment Time</Label>
                  <Input type="time" className="mt-1" />
                </div>
                <div>
                  <Label>Trip Type</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">Round Trip</SelectItem>
                      <SelectItem value="one_way">One Way Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="How often?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="mwf">Mon/Wed/Fri</SelectItem>
                    <SelectItem value="tth">Tue/Thu</SelectItem>
                    <SelectItem value="weekly">Once per week</SelectItem>
                    <SelectItem value="biweekly">Every two weeks</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label>End Date (optional)</Label>
                  <Input type="date" className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any special requirements or instructions..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsRequestDialogOpen(false)}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">What are Standing Orders?</p>
              <p className="text-sm text-blue-700">
                Standing orders are recurring trips that are automatically scheduled for you.
                Perfect for regular appointments like dialysis, therapy, or other ongoing treatments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Standing Orders */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Active Schedules</h2>

        {mockStandingOrders.length > 0 ? (
          <div className="grid gap-4">
            {mockStandingOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{order.destination.name}</h3>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                          <span className="text-gray-600 text-sm">{order.destination.address}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                          <span className="text-gray-600 text-sm">{order.schedule.days.join(', ')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-gray-400 mt-1" />
                          <span className="text-gray-600 text-sm">Pickup: {order.schedule.pickupTime}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <RefreshCw className="h-4 w-4 text-gray-400 mt-1" />
                          <span className="text-gray-600 text-sm">{order.schedule.tripType}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{order.serviceLevel}</Badge>
                        <span className="text-sm text-gray-500">
                          Valid: {order.startDate} - {order.endDate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-500 mb-1">Next Trip</p>
                        <p className="font-semibold text-gray-900">{order.nextTrip.day}, {order.nextTrip.date.split('-')[1]}/{order.nextTrip.date.split('-')[2]}</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Standing Orders</h3>
              <p className="text-gray-600 mb-4">
                You don't have any recurring trip schedules set up yet.
              </p>
              <Button onClick={() => setIsRequestDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Request Standing Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Trips from Standing Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Scheduled Trips</CardTitle>
          <Dialog open={isSkipDialogOpen} onOpenChange={setIsSkipDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Skip a Trip</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Skip a Scheduled Trip</DialogTitle>
                <DialogDescription>Select a trip you need to cancel</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label>Select Trip</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a trip to skip" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUpcomingTrips.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.date} - {trip.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reason</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Why are you skipping?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_appointment">No appointment that day</SelectItem>
                      <SelectItem value="feeling_unwell">Not feeling well</SelectItem>
                      <SelectItem value="other_transport">Have other transportation</SelectItem>
                      <SelectItem value="other">Other reason</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSkipDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => setIsSkipDialogOpen(false)}>Skip Trip</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockUpcomingTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[50px] bg-gray-100 rounded-lg p-2">
                    <p className="text-xs text-gray-500">{trip.day}</p>
                    <p className="text-lg font-bold text-gray-900">{trip.date.split('-')[2]}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{trip.destination}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Pickup at {trip.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Need to make changes?</p>
                <p className="text-sm text-gray-600">
                  Contact us to modify or cancel your standing orders
                </p>
              </div>
            </div>
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Calendar,
  Clock,
  Car,
  AlertCircle,
  Plus,
  Star,
  Heart,
  Wheelchair,
  User,
  FileText,
} from 'lucide-react';

// Mock patient data for family view
const mockPatient = {
  id: 'PAT-001',
  firstName: 'Eleanor',
  lastName: 'Williams',
  relationship: 'Mother',
  dateOfBirth: '1948-05-20',
  age: 75,
  phone: '(555) 123-4567',
  avatar: null,
  address: {
    street: '456 Maple Lane',
    city: 'Metro City',
    state: 'CA',
    zip: '90210',
  },
  mobilityRequirements: ['wheelchair', 'assistance_required'],
  medicalNotes: 'Diabetic, requires insulin. May need extra time for transfers.',
  primaryFacility: 'Metro Dialysis Center',
  membershipType: 'Medicare',
  memberId: 'MED-789456',
};

const mockUpcomingTrips = [
  {
    id: 'TRP-2001',
    date: '2024-01-17',
    time: '9:00 AM',
    type: 'Round Trip',
    pickup: '456 Maple Lane',
    destination: 'Metro Dialysis Center',
    status: 'confirmed',
    driver: 'Michael J.',
    vehicle: 'Wheelchair Van',
  },
  {
    id: 'TRP-2002',
    date: '2024-01-19',
    time: '9:00 AM',
    type: 'Round Trip',
    pickup: '456 Maple Lane',
    destination: 'Metro Dialysis Center',
    status: 'confirmed',
    driver: 'Pending',
    vehicle: 'Wheelchair Van',
  },
  {
    id: 'TRP-2003',
    date: '2024-01-22',
    time: '9:00 AM',
    type: 'Round Trip',
    pickup: '456 Maple Lane',
    destination: 'Metro Dialysis Center',
    status: 'pending',
    driver: 'Pending',
    vehicle: 'Wheelchair Van',
  },
];

const mockTripHistory = [
  { id: 'TRP-1990', date: '2024-01-15', destination: 'Metro Dialysis Center', driver: 'Michael J.', rating: 5, status: 'completed' },
  { id: 'TRP-1985', date: '2024-01-12', destination: 'Metro Dialysis Center', driver: 'Sarah K.', rating: 5, status: 'completed' },
  { id: 'TRP-1980', date: '2024-01-10', destination: 'Metro General Hospital', driver: 'Michael J.', rating: 4, status: 'completed' },
  { id: 'TRP-1975', date: '2024-01-08', destination: 'Metro Dialysis Center', driver: 'David L.', rating: 5, status: 'completed' },
];

const mockStandingOrders = [
  {
    id: 'SO-001',
    destination: 'Metro Dialysis Center',
    frequency: 'MWF',
    time: '9:00 AM',
    type: 'Round Trip',
    status: 'active',
    nextDate: '2024-01-17',
  },
];

export default function FamilyPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isBookTripOpen, setIsBookTripOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
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
          <Avatar className="h-14 w-14">
            {mockPatient.avatar ? (
              <AvatarImage src={mockPatient.avatar} />
            ) : (
              <AvatarFallback className="text-lg bg-pink-100 text-pink-700">
                {mockPatient.firstName[0]}{mockPatient.lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {mockPatient.firstName} {mockPatient.lastName}
              </h1>
              <Badge variant="outline" className="border-pink-300 text-pink-700">
                <Heart className="h-3 w-3 mr-1" />
                {mockPatient.relationship}
              </Badge>
            </div>
            <p className="text-gray-600">{mockPatient.age} years old • {mockPatient.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open(`tel:${mockPatient.phone}`)}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Dialog open={isBookTripOpen} onOpenChange={setIsBookTripOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Book a Trip for {mockPatient.firstName}</DialogTitle>
                <DialogDescription>Schedule a new trip</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                <div>
                  <Label>Pickup Address</Label>
                  <Input defaultValue={`${mockPatient.address.street}, ${mockPatient.address.city}`} />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dialysis">Metro Dialysis Center</SelectItem>
                      <SelectItem value="hospital">Metro General Hospital</SelectItem>
                      <SelectItem value="other">Other (Enter Address)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Trip Type</Label>
                  <Select defaultValue="round">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_way">One Way</SelectItem>
                      <SelectItem value="round">Round Trip</SelectItem>
                      <SelectItem value="wait_return">Wait & Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookTripOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsBookTripOpen(false)}>Book Trip</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Patient Info Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Home Address</p>
                <p className="font-medium text-gray-900 text-sm">
                  {mockPatient.address.street}
                </p>
                <p className="text-sm text-gray-500">
                  {mockPatient.address.city}, {mockPatient.address.state}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wheelchair className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobility Needs</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mockPatient.mobilityRequirements.map((req) => (
                    <Badge key={req} variant="secondary" className="text-xs">
                      {req.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Insurance</p>
                <p className="font-medium text-gray-900 text-sm">{mockPatient.membershipType}</p>
                <p className="text-sm text-gray-500">{mockPatient.memberId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Notes Alert */}
      {mockPatient.medicalNotes && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Medical Notes</p>
                <p className="text-amber-700">{mockPatient.medicalNotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
          <TabsTrigger value="history">Trip History</TabsTrigger>
          <TabsTrigger value="standing">Standing Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Trips ({mockUpcomingTrips.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingTrips.map((trip) => (
                  <div key={trip.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="text-center min-w-[80px] bg-gray-50 rounded-lg p-2">
                          <p className="text-sm text-gray-500">{new Date(trip.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                          <p className="text-xl font-bold text-gray-900">{new Date(trip.date).getDate()}</p>
                          <p className="text-sm text-gray-500">{new Date(trip.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                            <span className="text-sm text-gray-500">{trip.type}</span>
                          </div>
                          <p className="font-medium text-gray-900">{trip.destination}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Clock className="h-4 w-4" />
                            Pickup at {trip.time}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Car className="h-4 w-4" />
                            {trip.driver} • {trip.vehicle}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Track</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Cancel</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip History</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Destination</th>
                    <th className="pb-3 font-medium">Driver</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockTripHistory.map((trip) => (
                    <tr key={trip.id}>
                      <td className="py-3 text-gray-900">{trip.date}</td>
                      <td className="py-3 text-gray-600">{trip.destination}</td>
                      <td className="py-3 text-gray-600">{trip.driver}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < trip.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
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

        <TabsContent value="standing" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Standing Orders</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Request Standing Order
              </Button>
            </CardHeader>
            <CardContent>
              {mockStandingOrders.length > 0 ? (
                <div className="space-y-4">
                  {mockStandingOrders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <span className="font-mono text-sm text-gray-500">{order.id}</span>
                          </div>
                          <p className="font-medium text-gray-900">{order.destination}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {order.frequency}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {order.time}
                            </span>
                            <span>{order.type}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Next trip: {order.nextDate}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No standing orders</p>
                  <p className="text-sm">Request recurring trips for regular appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

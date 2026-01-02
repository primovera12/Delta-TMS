'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  Mail,
  MapPin,
  Car,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Truck,
  FileText,
  CheckCircle,
  AlertTriangle,
  Navigation,
} from 'lucide-react';

// Mock driver data
const mockDriver = {
  id: 'DRV-001',
  firstName: 'Michael',
  lastName: 'Johnson',
  email: 'mjohnson@deltamed.com',
  phone: '(555) 234-5678',
  status: 'available',
  avatar: null,
  rating: 4.8,
  totalTrips: 1247,
  completionRate: 98.5,
  onTimeRate: 96.2,
  currentLocation: 'Downtown Metro City',
  vehicle: {
    id: 'VEH-042',
    make: 'Toyota',
    model: 'Sienna',
    year: '2023',
    licensePlate: 'ABC-1234',
    type: 'wheelchair_van',
  },
  capabilities: ['wheelchair', 'stretcher', 'bariatric'],
  certifications: ['CPR', 'First Aid', 'Wheelchair Transport'],
  licenseExpiry: '2025-06-15',
  hireDate: '2022-03-10',
  shift: {
    name: 'Morning Shift',
    start: '6:00 AM',
    end: '2:00 PM',
  },
};

const mockTodayTrips = [
  { id: 'TRP-1001', patient: 'John Smith', time: '7:00 AM', pickup: '123 Main St', dropoff: 'Metro Dialysis Center', status: 'completed' },
  { id: 'TRP-1002', patient: 'Mary Johnson', time: '9:30 AM', pickup: 'Metro Hospital', dropoff: '456 Oak Ave', status: 'completed' },
  { id: 'TRP-1003', patient: 'Robert Davis', time: '11:00 AM', pickup: '789 Pine St', dropoff: 'Oncology Center', status: 'in_progress' },
  { id: 'TRP-1004', patient: 'Jennifer Wilson', time: '1:30 PM', pickup: 'Rehab Center', dropoff: '321 Elm St', status: 'scheduled' },
];

const mockRecentTrips = [
  { id: 'TRP-0998', date: '2024-01-14', patient: 'Alice Brown', trips: 4, rating: 5, earnings: '$145.00' },
  { id: 'TRP-0995', date: '2024-01-13', patient: 'David Lee', trips: 5, rating: 5, earnings: '$178.00' },
  { id: 'TRP-0992', date: '2024-01-12', patient: 'Sarah Miller', trips: 3, rating: 4, earnings: '$112.00' },
  { id: 'TRP-0989', date: '2024-01-11', patient: 'James Wilson', trips: 6, rating: 5, earnings: '$195.00' },
];

const mockPerformance = {
  thisWeek: { trips: 24, onTime: 23, rating: 4.9 },
  thisMonth: { trips: 98, onTime: 94, rating: 4.8 },
  thisYear: { trips: 1247, onTime: 1200, rating: 4.8 },
};

export default function DispatcherDriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('today');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      on_trip: 'bg-blue-100 text-blue-800',
      offline: 'bg-gray-100 text-gray-800',
      break: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-purple-100 text-purple-800',
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
            {mockDriver.avatar ? (
              <AvatarImage src={mockDriver.avatar} />
            ) : (
              <AvatarFallback className="text-lg">
                {mockDriver.firstName[0]}{mockDriver.lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {mockDriver.firstName} {mockDriver.lastName}
              </h1>
              <Badge className={getStatusColor(mockDriver.status)}>
                {mockDriver.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                {mockDriver.rating}
              </span>
              <span>•</span>
              <span>{mockDriver.totalTrips} trips</span>
              <span>•</span>
              <span>{mockDriver.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open(`tel:${mockDriver.phone}`)}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
                <DialogDescription>Send a message to {mockDriver.firstName}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <textarea
                  className="w-full h-32 p-3 border rounded-lg resize-none"
                  placeholder="Type your message..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsMessageDialogOpen(false)}>Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Car className="h-4 w-4 mr-2" />
                Assign Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Trip</DialogTitle>
                <DialogDescription>Assign a pending trip to {mockDriver.firstName}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trp-1010">TRP-1010 - John Doe, 2:00 PM</SelectItem>
                    <SelectItem value="trp-1011">TRP-1011 - Jane Smith, 3:30 PM</SelectItem>
                    <SelectItem value="trp-1012">TRP-1012 - Bob Johnson, 4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsAssignDialogOpen(false)}>Assign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Navigation className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900 text-sm truncate">{mockDriver.currentLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium text-gray-900 text-sm">{mockDriver.vehicle.licensePlate}</p>
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
                <p className="text-sm text-gray-600">Shift</p>
                <p className="font-medium text-gray-900 text-sm">{mockDriver.shift.start} - {mockDriver.shift.end}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion</p>
                <p className="font-medium text-gray-900 text-sm">{mockDriver.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">On-Time Rate</p>
                <p className="font-medium text-gray-900 text-sm">{mockDriver.onTimeRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Driver Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{mockDriver.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{mockDriver.email}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-medium">{mockDriver.vehicle.year} {mockDriver.vehicle.make} {mockDriver.vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">License Plate</span>
                <span className="font-medium">{mockDriver.vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <Badge variant="secondary">{mockDriver.vehicle.type.replace('_', ' ')}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockDriver.capabilities.map((cap) => (
                  <Badge key={cap} variant="secondary">{cap}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockDriver.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-900">{cert}</span>
                </div>
              ))}
              <div className="pt-2 border-t mt-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">License expires: {mockDriver.licenseExpiry}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Trips & Performance */}
        <div className="col-span-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="today">Today's Schedule</TabsTrigger>
              <TabsTrigger value="history">Trip History</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Today's Trips ({mockTodayTrips.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockTodayTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-semibold text-gray-900">{trip.time.split(' ')[0]}</p>
                            <p className="text-xs text-gray-500">{trip.time.split(' ')[1]}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{trip.patient}</p>
                            <p className="text-sm text-gray-500">{trip.pickup} → {trip.dropoff}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(trip.status)}>
                            {trip.status.replace('_', ' ')}
                          </Badge>
                          <Button variant="ghost" size="sm">View</Button>
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
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b">
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Trips</th>
                        <th className="pb-3 font-medium">Rating</th>
                        <th className="pb-3 font-medium">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockRecentTrips.map((day) => (
                        <tr key={day.id}>
                          <td className="py-3 text-gray-900">{day.date}</td>
                          <td className="py-3 text-gray-600">{day.trips} trips</td>
                          <td className="py-3">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              {day.rating}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-gray-900">{day.earnings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Trips Completed</span>
                          <span className="font-medium">{mockPerformance.thisWeek.trips}</span>
                        </div>
                        <Progress value={mockPerformance.thisWeek.trips / 30 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-Time</span>
                          <span className="font-medium">{mockPerformance.thisWeek.onTime}/{mockPerformance.thisWeek.trips}</span>
                        </div>
                        <Progress value={mockPerformance.thisWeek.onTime / mockPerformance.thisWeek.trips * 100} className="bg-green-100" />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{mockPerformance.thisWeek.rating} avg rating</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Trips Completed</span>
                          <span className="font-medium">{mockPerformance.thisMonth.trips}</span>
                        </div>
                        <Progress value={mockPerformance.thisMonth.trips / 120 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-Time</span>
                          <span className="font-medium">{mockPerformance.thisMonth.onTime}/{mockPerformance.thisMonth.trips}</span>
                        </div>
                        <Progress value={mockPerformance.thisMonth.onTime / mockPerformance.thisMonth.trips * 100} className="bg-green-100" />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{mockPerformance.thisMonth.rating} avg rating</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600">This Year</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Trips Completed</span>
                          <span className="font-medium">{mockPerformance.thisYear.trips}</span>
                        </div>
                        <Progress value={mockPerformance.thisYear.trips / 1500 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>On-Time</span>
                          <span className="font-medium">{mockPerformance.thisYear.onTime}/{mockPerformance.thisYear.trips}</span>
                        </div>
                        <Progress value={mockPerformance.thisYear.onTime / mockPerformance.thisYear.trips * 100} className="bg-green-100" />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{mockPerformance.thisYear.rating} avg rating</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

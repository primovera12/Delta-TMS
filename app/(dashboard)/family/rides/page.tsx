'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Search,
  Filter,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Ride {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  pickupTime: string;
  returnTime?: string;
  pickupAddress: string;
  dropoffAddress: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  transportType: string;
  isRoundTrip: boolean;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  estimatedArrival?: string;
  tripType: string;
  cost?: number;
}

const mockRides: Ride[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Robert Johnson',
    date: '2024-01-20',
    pickupTime: '9:00 AM',
    returnTime: '12:30 PM',
    pickupAddress: '123 Oak Street, Springfield, IL',
    dropoffAddress: 'Regional Dialysis Center',
    status: 'scheduled',
    transportType: 'Wheelchair',
    isRoundTrip: true,
    driver: {
      name: 'John Smith',
      phone: '(555) 111-2222',
      vehicle: 'Van #102',
    },
    tripType: 'Dialysis',
    cost: 45.00,
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Margaret Johnson',
    date: '2024-01-18',
    pickupTime: '2:00 PM',
    pickupAddress: '123 Oak Street, Springfield, IL',
    dropoffAddress: 'Downtown Clinic',
    status: 'scheduled',
    transportType: 'Ambulatory',
    isRoundTrip: false,
    driver: {
      name: 'Sarah Davis',
      phone: '(555) 333-4444',
      vehicle: 'Sedan #45',
    },
    tripType: 'Doctor Visit',
    cost: 25.00,
  },
  {
    id: '3',
    patientId: '1',
    patientName: 'Robert Johnson',
    date: '2024-01-17',
    pickupTime: '9:00 AM',
    returnTime: '12:30 PM',
    pickupAddress: '123 Oak Street, Springfield, IL',
    dropoffAddress: 'Regional Dialysis Center',
    status: 'completed',
    transportType: 'Wheelchair',
    isRoundTrip: true,
    driver: {
      name: 'John Smith',
      phone: '(555) 111-2222',
      vehicle: 'Van #102',
    },
    tripType: 'Dialysis',
    cost: 45.00,
  },
  {
    id: '4',
    patientId: '1',
    patientName: 'Robert Johnson',
    date: '2024-01-15',
    pickupTime: '9:00 AM',
    returnTime: '12:30 PM',
    pickupAddress: '123 Oak Street, Springfield, IL',
    dropoffAddress: 'Regional Dialysis Center',
    status: 'completed',
    transportType: 'Wheelchair',
    isRoundTrip: true,
    tripType: 'Dialysis',
    cost: 45.00,
  },
  {
    id: '5',
    patientId: '2',
    patientName: 'Margaret Johnson',
    date: '2024-01-12',
    pickupTime: '10:00 AM',
    pickupAddress: '123 Oak Street, Springfield, IL',
    dropoffAddress: 'City Medical Center',
    status: 'cancelled',
    transportType: 'Ambulatory',
    isRoundTrip: false,
    tripType: 'Doctor Visit',
    cost: 0,
  },
  {
    id: '6',
    patientId: '3',
    patientName: 'James Johnson',
    date: '2024-01-10',
    pickupTime: '3:00 PM',
    pickupAddress: '456 Elm Avenue, Springfield, IL',
    dropoffAddress: 'Physical Therapy Center',
    status: 'no_show',
    transportType: 'Stretcher',
    isRoundTrip: false,
    tripType: 'Therapy',
    cost: 0,
  },
];

export default function FamilyRidesPage() {
  const router = useRouter();
  const [rides, setRides] = React.useState<Ride[]>(mockRides);
  const [activeTab, setActiveTab] = React.useState('upcoming');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [patientFilter, setPatientFilter] = React.useState('all');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const upcomingRides = rides.filter(
    (r) => r.status === 'scheduled' || r.status === 'in_progress'
  );
  const pastRides = rides.filter(
    (r) => r.status === 'completed' || r.status === 'cancelled' || r.status === 'no_show'
  );

  const filteredRides = (activeTab === 'upcoming' ? upcomingRides : pastRides).filter((ride) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !ride.patientName.toLowerCase().includes(query) &&
        !ride.dropoffAddress.toLowerCase().includes(query) &&
        !ride.tripType.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (patientFilter !== 'all' && ride.patientId !== patientFilter) {
      return false;
    }
    return true;
  });

  const uniquePatients = Array.from(
    new Map(rides.map((r) => [r.patientId, { id: r.patientId, name: r.patientName }])).values()
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-gray-400" />;
      case 'no_show':
        return <AlertCircle className="h-5 w-5 text-error-600" />;
      case 'in_progress':
        return <Car className="h-5 w-5 text-warning-600" />;
      default:
        return <Clock className="h-5 w-5 text-info-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rides</h1>
          <p className="text-sm text-gray-500">View and manage rides for your family members</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => router.push('/family/book')}>
            <Plus className="h-4 w-4 mr-2" />
            Book New Ride
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingRides.length}</p>
                <p className="text-sm text-gray-500">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {rides.filter((r) => r.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {rides.filter((r) => r.status === 'in_progress').length}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{uniquePatients.length}</p>
                <p className="text-sm text-gray-500">Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by patient, destination, or trip type..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={patientFilter} onValueChange={setPatientFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All patients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            {uniquePatients.map((patient) => (
              <SelectItem key={patient.id} value={patient.id}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingRides.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastRides.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          {filteredRides.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming rides</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {searchQuery || patientFilter !== 'all'
                    ? 'Try changing your filters'
                    : 'Book a ride to get started'}
                </p>
                {!searchQuery && patientFilter === 'all' && (
                  <Button onClick={() => router.push('/family/book')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book a Ride
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRides.map((ride) => (
                <Card key={ride.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        ride.status === 'in_progress'
                          ? 'bg-warning-100'
                          : 'bg-info-100'
                      }`}>
                        {getStatusIcon(ride.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{ride.patientName}</h3>
                            {getStatusBadge(ride.status)}
                            {ride.isRoundTrip && (
                              <Badge variant="outline">Round Trip</Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{ride.date}</p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-gray-600">
                                Pickup: {ride.pickupTime}
                                {ride.returnTime && ` • Return: ${ride.returnTime}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{ride.transportType}</Badge>
                            <span className="text-gray-500">{ride.tripType}</span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-success-500 mt-0.5" />
                          <div>
                            <p className="text-gray-600">{ride.pickupAddress}</p>
                            <ChevronRight className="h-3 w-3 text-gray-400 my-1" />
                            <p className="text-gray-600">{ride.dropoffAddress}</p>
                          </div>
                        </div>

                        {ride.driver && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{ride.driver.name}</p>
                                <p className="text-xs text-gray-500">{ride.driver.vehicle}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Call Driver
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {filteredRides.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No past rides</h3>
                <p className="text-sm text-gray-500">
                  {searchQuery || patientFilter !== 'all'
                    ? 'Try changing your filters'
                    : 'Past rides will appear here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRides.map((ride) => (
                <Card key={ride.id} className={`${
                  ride.status === 'cancelled' || ride.status === 'no_show'
                    ? 'opacity-75'
                    : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        ride.status === 'completed'
                          ? 'bg-success-100'
                          : ride.status === 'no_show'
                          ? 'bg-error-100'
                          : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(ride.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{ride.patientName}</h3>
                            {getStatusBadge(ride.status)}
                          </div>
                          <p className="text-sm text-gray-500">{ride.date}</p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {ride.pickupTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {ride.dropoffAddress}
                          </span>
                          <span>{ride.tripType}</span>
                        </div>

                        {ride.cost !== undefined && ride.cost > 0 && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Cost: </span>
                            <span className="font-medium text-gray-900">${ride.cost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => router.push('/family/book')}>
                        Rebook
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

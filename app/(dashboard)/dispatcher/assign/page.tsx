'use client';

import * as React from 'react';
import {
  UserPlus,
  Car,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Star,
  Navigation,
  Users,
  Calendar,
  Truck,
  ChevronDown,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UnassignedTrip {
  id: string;
  tripNumber: string;
  patientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledTime: string;
  transportType: 'ambulatory' | 'wheelchair' | 'stretcher' | 'bariatric';
  urgency: 'normal' | 'high' | 'urgent';
  distance: number;
  estimatedDuration: string;
  specialNeeds: string[];
}

interface AvailableDriver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  currentLocation: string;
  status: 'available' | 'on_trip' | 'break' | 'offline';
  rating: number;
  tripsToday: number;
  distanceFromPickup?: number;
  etaToPickup?: string;
  capabilities: string[];
}

const unassignedTrips: UnassignedTrip[] = [
  {
    id: '1',
    tripNumber: 'TRP-2024-0156',
    patientName: 'Robert Johnson',
    pickupAddress: '456 Oak Avenue, Suite 200',
    dropoffAddress: 'Regional Medical Center',
    scheduledTime: '9:00 AM',
    transportType: 'wheelchair',
    urgency: 'normal',
    distance: 8.5,
    estimatedDuration: '25 min',
    specialNeeds: ['Oxygen'],
  },
  {
    id: '2',
    tripNumber: 'TRP-2024-0157',
    patientName: 'Mary Williams',
    pickupAddress: '789 Pine Street',
    dropoffAddress: 'City General Hospital',
    scheduledTime: '9:30 AM',
    transportType: 'ambulatory',
    urgency: 'high',
    distance: 5.2,
    estimatedDuration: '15 min',
    specialNeeds: [],
  },
  {
    id: '3',
    tripNumber: 'TRP-2024-0158',
    patientName: 'James Wilson',
    pickupAddress: 'Sunrise Senior Living',
    dropoffAddress: 'Dialysis Center',
    scheduledTime: '10:00 AM',
    transportType: 'stretcher',
    urgency: 'urgent',
    distance: 12.3,
    estimatedDuration: '35 min',
    specialNeeds: ['Oxygen', 'Cardiac Monitor'],
  },
  {
    id: '4',
    tripNumber: 'TRP-2024-0159',
    patientName: 'Elizabeth Brown',
    pickupAddress: '321 Maple Drive',
    dropoffAddress: 'Physical Therapy Plus',
    scheduledTime: '10:30 AM',
    transportType: 'wheelchair',
    urgency: 'normal',
    distance: 6.8,
    estimatedDuration: '20 min',
    specialNeeds: [],
  },
];

const availableDrivers: AvailableDriver[] = [
  {
    id: 'd1',
    name: 'Mike Thompson',
    phone: '(555) 234-5678',
    vehicleType: 'Wheelchair Van',
    vehicleNumber: '#12',
    currentLocation: '2.5 miles away',
    status: 'available',
    rating: 4.9,
    tripsToday: 3,
    distanceFromPickup: 2.5,
    etaToPickup: '8 min',
    capabilities: ['Wheelchair', 'Oxygen', 'Stretcher'],
  },
  {
    id: 'd2',
    name: 'Sarah Davis',
    phone: '(555) 345-6789',
    vehicleType: 'Sedan',
    vehicleNumber: '#5',
    currentLocation: '4.1 miles away',
    status: 'available',
    rating: 4.8,
    tripsToday: 5,
    distanceFromPickup: 4.1,
    etaToPickup: '12 min',
    capabilities: ['Ambulatory'],
  },
  {
    id: 'd3',
    name: 'John Smith',
    phone: '(555) 456-7890',
    vehicleType: 'Wheelchair Van',
    vehicleNumber: '#8',
    currentLocation: '1.8 miles away',
    status: 'on_trip',
    rating: 4.7,
    tripsToday: 4,
    distanceFromPickup: 1.8,
    etaToPickup: '6 min',
    capabilities: ['Wheelchair', 'Oxygen'],
  },
  {
    id: 'd4',
    name: 'Lisa Johnson',
    phone: '(555) 567-8901',
    vehicleType: 'Stretcher Unit',
    vehicleNumber: '#3',
    currentLocation: '5.5 miles away',
    status: 'available',
    rating: 4.9,
    tripsToday: 2,
    distanceFromPickup: 5.5,
    etaToPickup: '15 min',
    capabilities: ['Stretcher', 'Wheelchair', 'Oxygen', 'Cardiac'],
  },
  {
    id: 'd5',
    name: 'David Wilson',
    phone: '(555) 678-9012',
    vehicleType: 'Sedan',
    vehicleNumber: '#11',
    currentLocation: '3.2 miles away',
    status: 'break',
    rating: 4.6,
    tripsToday: 6,
    distanceFromPickup: 3.2,
    etaToPickup: '10 min',
    capabilities: ['Ambulatory'],
  },
];

export default function DispatcherAssignPage() {
  const [trips, setTrips] = React.useState<UnassignedTrip[]>(unassignedTrips);
  const [drivers] = React.useState<AvailableDriver[]>(availableDrivers);
  const [selectedTrip, setSelectedTrip] = React.useState<UnassignedTrip | null>(null);
  const [selectedDriver, setSelectedDriver] = React.useState<AvailableDriver | null>(null);
  const [showAssignDialog, setShowAssignDialog] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [driverStatusFilter, setDriverStatusFilter] = React.useState<string>('available');

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      searchQuery === '' ||
      trip.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || trip.transportType === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredDrivers = drivers.filter((driver) => {
    if (driverStatusFilter === 'all') return true;
    return driver.status === driverStatusFilter;
  });

  const handleSelectTrip = (trip: UnassignedTrip) => {
    setSelectedTrip(trip);
    setSelectedDriver(null);
  };

  const handleSelectDriver = (driver: AvailableDriver) => {
    setSelectedDriver(driver);
  };

  const handleAssign = () => {
    if (selectedTrip && selectedDriver) {
      // Remove the trip from unassigned list
      setTrips(trips.filter((t) => t.id !== selectedTrip.id));
      setShowAssignDialog(false);
      setSelectedTrip(null);
      setSelectedDriver(null);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-warning-100 text-warning-700">High Priority</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-success-100 text-success-700">Available</Badge>;
      case 'on_trip':
        return <Badge className="bg-info-100 text-info-700">On Trip</Badge>;
      case 'break':
        return <Badge className="bg-warning-100 text-warning-700">On Break</Badge>;
      case 'offline':
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'wheelchair':
        return '♿';
      case 'stretcher':
        return '🛏️';
      case 'bariatric':
        return '⚖️';
      default:
        return '🚶';
    }
  };

  const canAssign = (driver: AvailableDriver, trip: UnassignedTrip): boolean => {
    // Check if driver's capabilities match trip requirements
    const tripCapability = trip.transportType === 'wheelchair' ? 'Wheelchair' :
                          trip.transportType === 'stretcher' ? 'Stretcher' :
                          trip.transportType === 'bariatric' ? 'Bariatric' : 'Ambulatory';
    return driver.capabilities.includes(tripCapability);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Driver Assignment</h1>
          <p className="text-sm text-gray-500">
            Assign drivers to unassigned trips
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-base px-3 py-1">
            {trips.length} Unassigned
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Unassigned Trips */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-warning-500" />
              Unassigned Trips
            </CardTitle>
            <CardDescription>Select a trip to assign a driver</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ambulatory">Ambulatory</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair</SelectItem>
                  <SelectItem value="stretcher">Stretcher</SelectItem>
                  <SelectItem value="bariatric">Bariatric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Trips List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {filteredTrips.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-success-300 mb-4" />
                    <p className="font-medium">All trips assigned!</p>
                    <p className="text-sm">No unassigned trips at this time.</p>
                  </div>
                ) : (
                  filteredTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTrip?.id === trip.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'hover:bg-gray-50'
                      } ${trip.urgency === 'urgent' ? 'border-error-200' : ''}`}
                      onClick={() => handleSelectTrip(trip)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getTransportIcon(trip.transportType)}</span>
                            <span className="font-medium text-gray-900">{trip.tripNumber}</span>
                            {getUrgencyBadge(trip.urgency)}
                          </div>
                          <p className="text-sm text-gray-600">{trip.patientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{trip.scheduledTime}</p>
                          <p className="text-xs text-gray-500">{trip.estimatedDuration}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-3 w-3 text-success-500" />
                          <span className="truncate">{trip.pickupAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="h-3 w-3 text-error-500" />
                          <span className="truncate">{trip.dropoffAddress}</span>
                        </div>
                      </div>
                      {trip.specialNeeds.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {trip.specialNeeds.map((need) => (
                            <Badge key={need} variant="outline" className="text-xs">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Available Drivers */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-success-500" />
              Available Drivers
            </CardTitle>
            <CardDescription>
              {selectedTrip
                ? `Select a driver for ${selectedTrip.tripNumber}`
                : 'Select a trip first'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter */}
            <Select value={driverStatusFilter} onValueChange={setDriverStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="on_trip">On Trip</SelectItem>
                <SelectItem value="break">On Break</SelectItem>
              </SelectContent>
            </Select>

            {/* Drivers List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-4">
                {filteredDrivers.map((driver) => {
                  const isCompatible = selectedTrip ? canAssign(driver, selectedTrip) : true;
                  return (
                    <div
                      key={driver.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedDriver?.id === driver.id
                          ? 'border-primary-500 bg-primary-50'
                          : !isCompatible && selectedTrip
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-50 cursor-pointer'
                      }`}
                      onClick={() => {
                        if (isCompatible || !selectedTrip) {
                          handleSelectDriver(driver);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {driver.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{driver.name}</span>
                              {getStatusBadge(driver.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Truck className="h-3 w-3" />
                              {driver.vehicleType} {driver.vehicleNumber}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-warning-500">
                            <Star className="h-4 w-4 fill-warning-500" />
                            <span className="font-medium">{driver.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{driver.tripsToday} trips today</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Navigation className="h-3 w-3" />
                          <span>{driver.currentLocation}</span>
                        </div>
                        {driver.etaToPickup && (
                          <span className="text-success-600 font-medium">
                            ETA: {driver.etaToPickup}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {driver.capabilities.map((cap) => (
                          <Badge
                            key={cap}
                            variant="outline"
                            className={`text-xs ${
                              selectedTrip &&
                              (selectedTrip.transportType === 'wheelchair' && cap === 'Wheelchair' ||
                               selectedTrip.transportType === 'stretcher' && cap === 'Stretcher' ||
                               selectedTrip.transportType === 'ambulatory' && cap === 'Ambulatory')
                                ? 'bg-success-50 border-success-300 text-success-700'
                                : ''
                            }`}
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      {!isCompatible && selectedTrip && (
                        <div className="mt-2 text-xs text-error-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Cannot handle {selectedTrip.transportType} transport
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Action */}
      {selectedTrip && selectedDriver && (
        <Card className="border-primary-200 bg-primary-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary-600" />
                  <span className="font-medium">{selectedTrip.tripNumber}</span>
                </div>
                <span className="text-gray-400">→</span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {selectedDriver.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{selectedDriver.name}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTrip(null);
                    setSelectedDriver(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowAssignDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Driver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Assignment</DialogTitle>
            <DialogDescription>
              Assign this driver to the selected trip?
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && selectedDriver && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Trip</p>
                  <p className="font-medium">{selectedTrip.tripNumber} - {selectedTrip.patientName}</p>
                  <p className="text-sm text-gray-600">{selectedTrip.scheduledTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driver</p>
                  <p className="font-medium">{selectedDriver.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedDriver.vehicleType} {selectedDriver.vehicleNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ETA to Pickup</p>
                  <p className="font-medium text-success-600">{selectedDriver.etaToPickup}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

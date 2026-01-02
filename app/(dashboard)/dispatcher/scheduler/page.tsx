'use client';

import * as React from 'react';
import {
  Calendar,
  Clock,
  User,
  RefreshCw,
  Filter,
  AlertTriangle,
  CheckCircle,
  Plus,
  Settings,
  Download,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { DragDropScheduler } from '@/components/domain/drag-drop-scheduler';

interface Trip {
  id: string;
  patientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  tripType: string;
  status: string;
  estimatedDuration: number;
}

interface Driver {
  id: string;
  name: string;
  vehicleType: string;
  status: 'available' | 'on-trip' | 'offline';
  trips: Trip[];
}

// Mock data
const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    vehicleType: 'Wheelchair',
    status: 'available',
    trips: [
      {
        id: 'TR-001',
        patientName: 'Mary Johnson',
        pickupAddress: '123 Oak St',
        dropoffAddress: 'Memorial Hospital',
        pickupTime: '06:30',
        tripType: 'medical',
        status: 'scheduled',
        estimatedDuration: 45,
      },
      {
        id: 'TR-002',
        patientName: 'Robert Williams',
        pickupAddress: 'Memorial Hospital',
        dropoffAddress: '456 Pine Ave',
        pickupTime: '08:00',
        tripType: 'return',
        status: 'scheduled',
        estimatedDuration: 30,
      },
      {
        id: 'TR-003',
        patientName: 'Helen Davis',
        pickupAddress: '789 Elm Blvd',
        dropoffAddress: 'Dialysis Center',
        pickupTime: '10:15',
        tripType: 'medical',
        status: 'scheduled',
        estimatedDuration: 60,
      },
    ],
  },
  {
    id: 'DRV-002',
    name: 'Mike Johnson',
    vehicleType: 'Stretcher',
    status: 'on-trip',
    trips: [
      {
        id: 'TR-004',
        patientName: 'James Wilson',
        pickupAddress: 'Sunrise Nursing Home',
        dropoffAddress: 'Methodist Hospital',
        pickupTime: '07:00',
        tripType: 'medical',
        status: 'in_progress',
        estimatedDuration: 50,
      },
      {
        id: 'TR-005',
        patientName: 'Patricia Brown',
        pickupAddress: 'Methodist Hospital',
        dropoffAddress: 'Sunset Care Facility',
        pickupTime: '09:30',
        tripType: 'return',
        status: 'scheduled',
        estimatedDuration: 40,
      },
    ],
  },
  {
    id: 'DRV-003',
    name: 'Sarah Williams',
    vehicleType: 'Wheelchair',
    status: 'available',
    trips: [
      {
        id: 'TR-006',
        patientName: 'Linda Taylor',
        pickupAddress: '321 Maple Rd',
        dropoffAddress: 'VA Hospital',
        pickupTime: '08:00',
        tripType: 'medical',
        status: 'scheduled',
        estimatedDuration: 55,
      },
    ],
  },
  {
    id: 'DRV-004',
    name: 'David Lee',
    vehicleType: 'Ambulatory',
    status: 'available',
    trips: [
      {
        id: 'TR-007',
        patientName: 'Thomas Moore',
        pickupAddress: '555 Cedar Ln',
        dropoffAddress: 'City Clinic',
        pickupTime: '11:00',
        tripType: 'medical',
        status: 'scheduled',
        estimatedDuration: 35,
      },
      {
        id: 'TR-008',
        patientName: 'Nancy Clark',
        pickupAddress: 'City Clinic',
        dropoffAddress: '777 Birch St',
        pickupTime: '13:00',
        tripType: 'return',
        status: 'scheduled',
        estimatedDuration: 25,
      },
    ],
  },
];

export default function SchedulerPage() {
  const [drivers, setDrivers] = React.useState<Driver[]>(mockDrivers);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [vehicleFilter, setVehicleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [loading, setLoading] = React.useState(false);
  const [selectedTrip, setSelectedTrip] = React.useState<Trip | null>(null);
  const [showTripDialog, setShowTripDialog] = React.useState(false);
  const [showMoveConfirmation, setShowMoveConfirmation] = React.useState(false);
  const [pendingMove, setPendingMove] = React.useState<{
    tripId: string;
    fromDriverId: string;
    toDriverId: string;
    newTime: string;
  } | null>(null);

  const handleTripMove = (
    tripId: string,
    fromDriverId: string,
    toDriverId: string,
    newTime: string
  ) => {
    // Show confirmation dialog for the move
    setPendingMove({ tripId, fromDriverId, toDriverId, newTime });
    setShowMoveConfirmation(true);
  };

  const confirmMove = () => {
    if (!pendingMove) return;

    const { tripId, fromDriverId, toDriverId, newTime } = pendingMove;

    setDrivers((prev) => {
      // Find the trip
      let movedTrip: Trip | undefined;
      const newDrivers = prev.map((driver) => {
        if (driver.id === fromDriverId) {
          const tripIndex = driver.trips.findIndex((t) => t.id === tripId);
          if (tripIndex !== -1) {
            movedTrip = { ...driver.trips[tripIndex], pickupTime: newTime };
            return {
              ...driver,
              trips: driver.trips.filter((t) => t.id !== tripId),
            };
          }
        }
        return driver;
      });

      // Add to new driver
      if (movedTrip) {
        return newDrivers.map((driver) => {
          if (driver.id === toDriverId) {
            return {
              ...driver,
              trips: [...driver.trips, movedTrip!].sort((a, b) =>
                a.pickupTime.localeCompare(b.pickupTime)
              ),
            };
          }
          return driver;
        });
      }

      return newDrivers;
    });

    setShowMoveConfirmation(false);
    setPendingMove(null);
  };

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowTripDialog(true);
  };

  const filteredDrivers = drivers.filter((driver) => {
    if (vehicleFilter !== 'all' && driver.vehicleType.toLowerCase() !== vehicleFilter) {
      return false;
    }
    if (statusFilter !== 'all' && driver.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Calculate stats
  const totalTrips = drivers.reduce((sum, d) => sum + d.trips.length, 0);
  const scheduledTrips = drivers.reduce(
    (sum, d) => sum + d.trips.filter((t) => t.status === 'scheduled').length,
    0
  );
  const inProgressTrips = drivers.reduce(
    (sum, d) => sum + d.trips.filter((t) => t.status === 'in_progress').length,
    0
  );
  const availableDrivers = drivers.filter((d) => d.status === 'available').length;

  const getDriverName = (driverId: string) => {
    return drivers.find((d) => d.id === driverId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Trip Scheduler</h1>
          <p className="text-sm text-gray-500">
            Drag and drop to reschedule trips and reassign drivers
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <Zap className="h-4 w-4 mr-2" />
            Auto-Schedule
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
                <p className="text-sm text-gray-500">Total Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{scheduledTrips}</p>
                <p className="text-sm text-gray-500">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressTrips}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <User className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableDrivers}</p>
                <p className="text-sm text-gray-500">Available Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="stretcher">Stretcher</SelectItem>
                <SelectItem value="ambulatory">Ambulatory</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Driver Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on-trip">On Trip</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1" />

            <Button variant="ghost" size="sm" onClick={() => setLoading(true)}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scheduler */}
      <DragDropScheduler
        drivers={filteredDrivers}
        date={selectedDate}
        onTripMove={handleTripMove}
        onTripClick={handleTripClick}
        onDateChange={setSelectedDate}
      />

      {/* Tips Card */}
      <Card className="border-info-200 bg-info-50">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-info-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-info-900">Scheduling Tips</h4>
              <ul className="mt-1 text-sm text-info-700 space-y-1">
                <li>• Drag trips horizontally to change the pickup time</li>
                <li>• Drag trips to another driver's row to reassign</li>
                <li>• Click on a trip to view details and edit</li>
                <li>• Ensure at least 15 minutes between trips for travel time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Details Dialog */}
      <Dialog open={showTripDialog} onOpenChange={setShowTripDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>View and manage trip information</DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Patient</label>
                  <p className="text-gray-900">{selectedTrip.patientName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Trip Type</label>
                  <p className="text-gray-900 capitalize">{selectedTrip.tripType}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Pickup</label>
                <p className="text-gray-900">{selectedTrip.pickupAddress}</p>
                <p className="text-sm text-gray-500">at {selectedTrip.pickupTime}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Dropoff</label>
                <p className="text-gray-900">{selectedTrip.dropoffAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge
                    variant={
                      selectedTrip.status === 'scheduled'
                        ? 'secondary'
                        : selectedTrip.status === 'in_progress'
                        ? 'warning'
                        : 'success'
                    }
                    className="mt-1"
                  >
                    {selectedTrip.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">{selectedTrip.estimatedDuration} min</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowTripDialog(false)}>
              Close
            </Button>
            <Button>Edit Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Confirmation Dialog */}
      <Dialog open={showMoveConfirmation} onOpenChange={setShowMoveConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reschedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to move this trip?
            </DialogDescription>
          </DialogHeader>
          {pendingMove && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">From:</span>
                  <span className="font-medium">{getDriverName(pendingMove.fromDriverId)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">To:</span>
                  <span className="font-medium">{getDriverName(pendingMove.toDriverId)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">New Time:</span>
                  <span className="font-medium">{pendingMove.newTime}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowMoveConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMove}>Confirm Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

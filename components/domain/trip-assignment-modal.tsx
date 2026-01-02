'use client';

import * as React from 'react';
import {
  X,
  User,
  Car,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  Navigation,
  Star,
  Calendar,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Trip {
  id: string;
  patientName: string;
  patientPhone: string;
  pickupAddress: string;
  pickupTime: string;
  dropoffAddress: string;
  appointmentTime: string;
  vehicleType: string;
  status: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: string;
  rating: number;
  tripsToday: number;
  distanceToPickup?: number;
  eta?: string;
}

const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    phone: '(555) 123-4567',
    vehicleType: 'wheelchair',
    status: 'available',
    currentLocation: '2.5 mi away',
    rating: 4.9,
    tripsToday: 5,
    distanceToPickup: 2.5,
    eta: '8 min',
  },
  {
    id: 'DRV-002',
    name: 'Mike Johnson',
    phone: '(555) 234-5678',
    vehicleType: 'wheelchair',
    status: 'available',
    currentLocation: '4.2 mi away',
    rating: 4.7,
    tripsToday: 4,
    distanceToPickup: 4.2,
    eta: '12 min',
  },
  {
    id: 'DRV-003',
    name: 'Sarah Williams',
    phone: '(555) 345-6789',
    vehicleType: 'wheelchair',
    status: 'busy',
    currentLocation: 'On trip',
    rating: 4.8,
    tripsToday: 6,
    distanceToPickup: 5.8,
    eta: '20 min',
  },
  {
    id: 'DRV-004',
    name: 'David Lee',
    phone: '(555) 456-7890',
    vehicleType: 'ambulatory',
    status: 'available',
    currentLocation: '1.8 mi away',
    rating: 4.6,
    tripsToday: 3,
    distanceToPickup: 1.8,
    eta: '5 min',
  },
];

interface TripAssignmentModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (driverId: string) => void;
}

export function TripAssignmentModal({
  trip,
  isOpen,
  onClose,
  onAssign,
}: TripAssignmentModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDriver, setSelectedDriver] = React.useState<string | null>(null);
  const [isAssigning, setIsAssigning] = React.useState(false);
  const [showOnlyCompatible, setShowOnlyCompatible] = React.useState(true);

  const filteredDrivers = mockDrivers.filter((driver) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = !showOnlyCompatible || driver.vehicleType === trip.vehicleType;
    return matchesSearch && matchesVehicle;
  });

  // Sort by availability and distance
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (a.status === 'available' && b.status !== 'available') return -1;
    if (a.status !== 'available' && b.status === 'available') return 1;
    return (a.distanceToPickup || 0) - (b.distanceToPickup || 0);
  });

  const handleAssign = async () => {
    if (!selectedDriver) return;

    setIsAssigning(true);
    try {
      await onAssign(selectedDriver);
      onClose();
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assign Driver</h3>
            <p className="text-sm text-gray-500">Trip {trip.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Trip Summary */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{trip.patientName}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-success-500" />
                  <div className="h-6 border-l border-dashed border-gray-300" />
                  <div className="h-2 w-2 rounded-full bg-error-500" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">{trip.pickupAddress}</p>
                  <p className="text-gray-600">{trip.dropoffAddress}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>Pickup: {trip.pickupTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Appointment: {trip.appointmentTime}</span>
              </div>
              <Badge variant="secondary">
                <Car className="h-3 w-3 mr-1" />
                {trip.vehicleType}
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drivers..."
                className="pl-10"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyCompatible}
                onChange={(e) => setShowOnlyCompatible(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Compatible vehicles only</span>
            </label>
          </div>
        </div>

        {/* Driver List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {sortedDrivers.map((driver) => {
              const isCompatible = driver.vehicleType === trip.vehicleType;
              const isSelected = selectedDriver === driver.id;

              return (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver.id)}
                  disabled={driver.status === 'offline'}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : driver.status === 'offline'
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>
                            {driver.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                            driver.status === 'available'
                              ? 'bg-success-500'
                              : driver.status === 'busy'
                              ? 'bg-warning-500'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{driver.name}</p>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-primary-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-warning-500" />
                            {driver.rating}
                          </span>
                          <span>{driver.tripsToday} trips today</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          driver.status === 'available'
                            ? 'success'
                            : driver.status === 'busy'
                            ? 'warning'
                            : 'secondary'
                        }
                        size="sm"
                      >
                        {driver.status}
                      </Badge>
                      {!isCompatible && (
                        <div className="flex items-center gap-1 text-xs text-warning-600 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {driver.vehicleType}
                        </div>
                      )}
                    </div>
                  </div>

                  {driver.status !== 'offline' && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{driver.currentLocation}</span>
                      </div>
                      {driver.eta && (
                        <div className="flex items-center gap-2 text-sm">
                          <Navigation className="h-4 w-4 text-primary-500" />
                          <span className="font-medium text-primary-600">
                            ETA: {driver.eta}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}

            {sortedDrivers.length === 0 && (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No drivers found</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleAssign}
            disabled={!selectedDriver || isAssigning}
          >
            {isAssigning ? (
              'Assigning...'
            ) : selectedDriver ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Assign Driver
              </>
            ) : (
              'Select a Driver'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

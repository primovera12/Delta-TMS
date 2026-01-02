'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  MapPin,
  Car,
  User,
  Phone,
  Navigation,
  Search,
  Filter,
  Maximize2,
  RefreshCw,
  Clock,
} from 'lucide-react';

// Mock data for drivers on map
const mockDrivers = [
  { id: 'DRV-001', name: 'Michael Johnson', status: 'on_trip', lat: 34.052, lng: -118.243, vehicle: 'VEH-042', currentTrip: 'TRP-1001', eta: '10 min' },
  { id: 'DRV-002', name: 'Sarah Kim', status: 'available', lat: 34.062, lng: -118.253, vehicle: 'VEH-015', currentTrip: null, eta: null },
  { id: 'DRV-003', name: 'David Lee', status: 'on_trip', lat: 34.072, lng: -118.233, vehicle: 'VEH-023', currentTrip: 'TRP-1003', eta: '15 min' },
  { id: 'DRV-004', name: 'Lisa Martinez', status: 'break', lat: 34.045, lng: -118.260, vehicle: 'VEH-031', currentTrip: null, eta: null },
  { id: 'DRV-005', name: 'James Wilson', status: 'available', lat: 34.058, lng: -118.248, vehicle: 'VEH-007', currentTrip: null, eta: null },
  { id: 'DRV-006', name: 'Emily Chen', status: 'on_trip', lat: 34.068, lng: -118.255, vehicle: 'VEH-019', currentTrip: 'TRP-1005', eta: '8 min' },
];

const mockActiveRides = [
  { id: 'TRP-1001', patient: 'John Smith', driver: 'Michael Johnson', status: 'in_transit', pickup: '123 Main St', dropoff: 'Metro Hospital' },
  { id: 'TRP-1003', patient: 'Robert Davis', driver: 'David Lee', status: 'en_route_pickup', pickup: '456 Oak Ave', dropoff: 'Dialysis Center' },
  { id: 'TRP-1005', patient: 'Susan Brown', driver: 'Emily Chen', status: 'in_transit', pickup: 'Care Home', dropoff: 'City Clinic' },
];

export default function OperationsMapPage() {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      on_trip: 'bg-green-100 text-green-800',
      available: 'bg-blue-100 text-blue-800',
      break: 'bg-orange-100 text-orange-800',
      offline: 'bg-gray-100 text-gray-800',
      in_transit: 'bg-green-100 text-green-800',
      en_route_pickup: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      on_trip: 'bg-green-500',
      available: 'bg-blue-500',
      break: 'bg-orange-500',
      offline: 'bg-gray-400',
    };
    return colors[status] || 'bg-gray-400';
  };

  const filteredDrivers = filterStatus === 'all'
    ? mockDrivers
    : mockDrivers.filter(d => d.status === filterStatus);

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Map</h1>
          <p className="text-gray-600">Real-time driver locations and active rides</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-4 gap-4 h-full">
        {/* Map Area */}
        <div className="col-span-3 bg-gray-200 rounded-lg relative overflow-hidden">
          {/* Placeholder for actual map */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Interactive Map</p>
              <p className="text-gray-500 text-sm">Google Maps integration will display here</p>
              <p className="text-gray-400 text-xs mt-2">Showing {filteredDrivers.length} drivers</p>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Legend</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">On Trip</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-600">On Break</span>
              </div>
            </div>
          </div>

          {/* Driver Markers (Simulated) */}
          <div className="absolute top-4 right-4 space-y-2">
            {filteredDrivers.slice(0, 3).map((driver, i) => (
              <div
                key={driver.id}
                className={`bg-white rounded-lg shadow-lg p-2 cursor-pointer hover:shadow-xl transition-shadow ${selectedDriver === driver.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedDriver(driver.id)}
                style={{ transform: `translateY(${i * 10}px)` }}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusDot(driver.status)}`} />
                  <span className="text-xs font-medium">{driver.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4 overflow-y-auto">
          {/* Search & Filter */}
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search drivers..." className="pl-9" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  <SelectItem value="on_trip">On Trip</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="break">On Break</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Driver List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Drivers ({filteredDrivers.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-64 overflow-y-auto">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedDriver === driver.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedDriver(driver.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(driver.status)}`} />
                        <span className="font-medium text-sm">{driver.name}</span>
                      </div>
                      <Badge className={getStatusColor(driver.status)} variant="secondary">
                        {driver.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
                      <Car className="h-3 w-3" />
                      {driver.vehicle}
                      {driver.eta && (
                        <>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          ETA: {driver.eta}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Rides */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Rides ({mockActiveRides.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-48 overflow-y-auto">
                {mockActiveRides.map((ride) => (
                  <div key={ride.id} className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-gray-500">{ride.id}</span>
                      <Badge className={getStatusColor(ride.status)} variant="secondary">
                        {ride.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{ride.patient}</p>
                    <p className="text-xs text-gray-500">{ride.driver}</p>
                    <div className="mt-1 text-xs text-gray-400">
                      {ride.pickup} → {ride.dropoff}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Driver Details */}
          {selectedDriver && (
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Driver Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const driver = mockDrivers.find(d => d.id === selectedDriver);
                  if (!driver) return null;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-gray-500">{driver.vehicle}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Navigation className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Calendar,
  Wrench,
  FileText,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Camera,
  Upload,
  User,
  Fuel,
  Gauge,
  Shield,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VehicleDetails {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  type: 'sedan' | 'wheelchair_van' | 'stretcher' | 'bariatric';
  status: 'active' | 'maintenance' | 'inactive' | 'retired';
  mileage: number;
  fuelType: string;
  capacity: number;
  capabilities: string[];
  assignedDriver?: {
    id: string;
    name: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
  };
  registration: {
    state: string;
    expirationDate: string;
  };
  lastInspection: string;
  nextInspectionDue: string;
  purchaseDate: string;
  purchasePrice: number;
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  mileage: number;
  cost: number;
  vendor: string;
  notes?: string;
}

interface TripHistory {
  id: string;
  tripNumber: string;
  date: string;
  patient: string;
  driver: string;
  distance: number;
  status: string;
}

const mockVehicle: VehicleDetails = {
  id: '1',
  vehicleNumber: '12',
  make: 'Ford',
  model: 'Transit',
  year: 2022,
  vin: '1FTBW2CM5NKA12345',
  licensePlate: 'ABC-1234',
  type: 'wheelchair_van',
  status: 'active',
  mileage: 45678,
  fuelType: 'Gasoline',
  capacity: 2,
  capabilities: ['Wheelchair Lift', 'Oxygen Storage', 'Stretcher Compatible'],
  assignedDriver: {
    id: 'd1',
    name: 'Mike Thompson',
    phone: '(555) 234-5678',
  },
  insurance: {
    provider: 'Progressive Commercial',
    policyNumber: 'PC-789456123',
    expirationDate: '2024-06-30',
  },
  registration: {
    state: 'IL',
    expirationDate: '2024-12-31',
  },
  lastInspection: '2024-01-05',
  nextInspectionDue: '2024-04-05',
  purchaseDate: '2022-03-15',
  purchasePrice: 48500,
};

const mockMaintenance: MaintenanceRecord[] = [
  {
    id: 'm1',
    date: '2024-01-10',
    type: 'Scheduled Maintenance',
    description: 'Oil change, tire rotation, brake inspection',
    mileage: 45500,
    cost: 285.00,
    vendor: 'Fleet Service Center',
  },
  {
    id: 'm2',
    date: '2023-12-05',
    type: 'Repair',
    description: 'Wheelchair lift motor replacement',
    mileage: 43200,
    cost: 1250.00,
    vendor: 'Mobility Systems Inc',
    notes: 'Warranty covered labor, parts charged',
  },
  {
    id: 'm3',
    date: '2023-10-20',
    type: 'Scheduled Maintenance',
    description: 'Oil change, filter replacement',
    mileage: 40000,
    cost: 175.00,
    vendor: 'Fleet Service Center',
  },
  {
    id: 'm4',
    date: '2023-08-15',
    type: 'Inspection',
    description: 'Annual state inspection',
    mileage: 37500,
    cost: 50.00,
    vendor: 'State DMV',
  },
];

const mockTrips: TripHistory[] = [
  { id: 't1', tripNumber: 'TRP-2024-0156', date: '2024-01-15', patient: 'Robert Johnson', driver: 'Mike Thompson', distance: 12.5, status: 'completed' },
  { id: 't2', tripNumber: 'TRP-2024-0148', date: '2024-01-14', patient: 'Mary Williams', driver: 'Mike Thompson', distance: 8.2, status: 'completed' },
  { id: 't3', tripNumber: 'TRP-2024-0142', date: '2024-01-13', patient: 'James Wilson', driver: 'Mike Thompson', distance: 15.8, status: 'completed' },
  { id: 't4', tripNumber: 'TRP-2024-0135', date: '2024-01-12', patient: 'Elizabeth Brown', driver: 'Mike Thompson', distance: 6.4, status: 'completed' },
  { id: 't5', tripNumber: 'TRP-2024-0128', date: '2024-01-11', patient: 'Thomas Anderson', driver: 'Mike Thompson', distance: 10.1, status: 'cancelled' },
];

export default function AdminVehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle] = React.useState<VehicleDetails>(mockVehicle);
  const [maintenance] = React.useState<MaintenanceRecord[]>(mockMaintenance);
  const [trips] = React.useState<TripHistory[]>(mockTrips);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = React.useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-100 text-success-700">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-warning-100 text-warning-700">In Maintenance</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'retired':
        return <Badge variant="outline" className="text-gray-500">Retired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'wheelchair_van':
        return <Badge variant="outline" className="bg-primary-50 text-primary-700">Wheelchair Van</Badge>;
      case 'stretcher':
        return <Badge variant="outline" className="bg-info-50 text-info-700">Stretcher Unit</Badge>;
      case 'bariatric':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Bariatric</Badge>;
      case 'sedan':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Sedan</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const isExpiringSoon = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + m.cost, 0);
  const totalTripDistance = trips.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.distance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Vehicle #{vehicle.vehicleNumber}
            </h1>
            {getStatusBadge(vehicle.status)}
            {getTypeBadge(vehicle.type)}
          </div>
          <p className="text-sm text-gray-500">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="text-error-600 hover:bg-error-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Retire
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Gauge className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{vehicle.mileage.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Miles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalTripDistance.toFixed(1)}</p>
                <p className="text-sm text-gray-500">Miles This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${totalMaintenanceCost.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Maintenance YTD</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                <p className="text-sm text-gray-500">Trips This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary-500" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-mono text-sm">{vehicle.vin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">{vehicle.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium">{vehicle.capacity} passengers</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p className="font-medium">{vehicle.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purchase Price</p>
                    <p className="font-medium">${vehicle.purchasePrice.toLocaleString()}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-500 mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.capabilities.map((cap) => (
                      <Badge key={cap} variant="secondary">{cap}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Driver */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-success-500" />
                  Assigned Driver
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.assignedDriver ? (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {vehicle.assignedDriver.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{vehicle.assignedDriver.name}</p>
                      <p className="text-sm text-gray-500">{vehicle.assignedDriver.phone}</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No driver assigned</p>
                    <Button variant="outline" className="mt-4">Assign Driver</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-info-500" />
                  Compliance & Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-3 rounded-lg ${isExpiringSoon(vehicle.registration.expirationDate) ? 'bg-warning-50 border border-warning-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Registration</p>
                      <p className="font-medium">{vehicle.registration.state} - Expires {vehicle.registration.expirationDate}</p>
                    </div>
                    {isExpiringSoon(vehicle.registration.expirationDate) && (
                      <AlertCircle className="h-5 w-5 text-warning-600" />
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isExpiringSoon(vehicle.insurance.expirationDate) ? 'bg-warning-50 border border-warning-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Insurance</p>
                      <p className="font-medium">{vehicle.insurance.provider}</p>
                      <p className="text-xs text-gray-500">Policy: {vehicle.insurance.policyNumber}</p>
                      <p className="text-xs text-gray-500">Expires: {vehicle.insurance.expirationDate}</p>
                    </div>
                    {isExpiringSoon(vehicle.insurance.expirationDate) && (
                      <AlertCircle className="h-5 w-5 text-warning-600" />
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${isExpiringSoon(vehicle.nextInspectionDue) ? 'bg-warning-50 border border-warning-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Inspection</p>
                      <p className="font-medium">Last: {vehicle.lastInspection}</p>
                      <p className="text-xs text-gray-500">Next Due: {vehicle.nextInspectionDue}</p>
                    </div>
                    {isExpiringSoon(vehicle.nextInspectionDue) && (
                      <AlertCircle className="h-5 w-5 text-warning-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-warning-500" />
                  Maintenance History
                </CardTitle>
                <Button onClick={() => setShowMaintenanceDialog(true)}>
                  Add Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.map((record) => (
                  <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Wrench className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{record.type}</p>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{record.date}</span>
                            <span>{record.mileage.toLocaleString()} miles</span>
                            <span>{record.vendor}</span>
                          </div>
                          {record.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic">{record.notes}</p>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">${record.cost.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-success-500" />
                Recent Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trip #</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Patient</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Driver</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Distance</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-primary-600">{trip.tripNumber}</td>
                        <td className="py-3 px-4">{trip.date}</td>
                        <td className="py-3 px-4">{trip.patient}</td>
                        <td className="py-3 px-4">{trip.driver}</td>
                        <td className="py-3 px-4">{trip.distance} mi</td>
                        <td className="py-3 px-4">
                          <Badge className={trip.status === 'completed' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700'}>
                            {trip.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-info-500" />
                  Documents
                </CardTitle>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: 'Registration Certificate', type: 'PDF', uploaded: '2024-01-01' },
                  { name: 'Insurance Policy', type: 'PDF', uploaded: '2024-01-15' },
                  { name: 'Inspection Report', type: 'PDF', uploaded: '2024-01-05' },
                  { name: 'Title', type: 'PDF', uploaded: '2022-03-15' },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-info-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • Uploaded {doc.uploaded}</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Maintenance Dialog */}
      <Dialog open={showMaintenanceDialog} onOpenChange={setShowMaintenanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Maintenance Record</DialogTitle>
            <DialogDescription>
              Log a new maintenance entry for this vehicle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Mileage</Label>
                <Input type="number" placeholder="Current mileage" />
              </div>
              <div className="space-y-2">
                <Label>Cost</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Brief description of work performed" />
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Input placeholder="Service provider name" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMaintenanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowMaintenanceDialog(false)}>
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

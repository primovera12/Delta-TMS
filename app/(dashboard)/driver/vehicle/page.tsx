'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Car,
  FileText,
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  MapPin,
  Upload,
} from 'lucide-react';

// Mock vehicle data
const mockVehicle = {
  id: 'VEH-001',
  make: 'Toyota',
  model: 'Sienna',
  year: 2022,
  type: 'Wheelchair Van',
  vin: '1T4RR5FK5NW123456',
  licensePlate: 'ABC 1234',
  color: 'White',
  mileage: 45678,
  status: 'active',
  fuelType: 'Gasoline',
  fuelLevel: 75,
  lastInspection: '2024-01-10',
  nextInspection: '2024-01-17',
  insurance: {
    provider: 'ABC Insurance',
    policyNumber: 'POL-789012',
    expiresAt: '2024-06-15',
  },
  registration: {
    state: 'CA',
    expiresAt: '2024-12-31',
  },
};

const mockMaintenanceHistory = [
  {
    id: 'MNT-001',
    date: '2024-01-05',
    type: 'Oil Change',
    mileage: 45000,
    cost: 75,
    status: 'completed',
  },
  {
    id: 'MNT-002',
    date: '2023-12-15',
    type: 'Tire Rotation',
    mileage: 42000,
    cost: 50,
    status: 'completed',
  },
  {
    id: 'MNT-003',
    date: '2023-11-20',
    type: 'Brake Inspection',
    mileage: 39000,
    cost: 120,
    status: 'completed',
  },
];

const mockDocuments = [
  {
    id: 'DOC-001',
    name: 'Vehicle Registration',
    type: 'registration',
    expiresAt: '2024-12-31',
    status: 'valid',
  },
  {
    id: 'DOC-002',
    name: 'Insurance Card',
    type: 'insurance',
    expiresAt: '2024-06-15',
    status: 'valid',
  },
  {
    id: 'DOC-003',
    name: 'Wheelchair Lift Certification',
    type: 'certification',
    expiresAt: '2024-03-15',
    status: 'expiring_soon',
  },
];

export default function DriverVehiclePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      valid: 'bg-green-100 text-green-800',
      expiring_soon: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicle</h1>
          <p className="text-gray-600">Vehicle information and maintenance records</p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </div>

      {/* Vehicle Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <Car className="h-12 w-12 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {mockVehicle.year} {mockVehicle.make} {mockVehicle.model}
                  </h2>
                  <p className="text-gray-500">{mockVehicle.type}</p>
                </div>
                <Badge className={getStatusColor(mockVehicle.status)}>
                  {mockVehicle.status}
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">License Plate</p>
                  <p className="font-medium">{mockVehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">VIN</p>
                  <p className="font-medium text-sm">{mockVehicle.vin}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Color</p>
                  <p className="font-medium">{mockVehicle.color}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mileage</p>
                  <p className="font-medium">{mockVehicle.mileage.toLocaleString()} mi</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Fuel className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fuel Level</p>
                <p className="text-lg font-bold">{mockVehicle.fuelLevel}%</p>
              </div>
            </div>
            <Progress value={mockVehicle.fuelLevel} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Mileage</p>
                <p className="text-lg font-bold">{mockVehicle.mileage.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Inspection</p>
                <p className="text-lg font-bold">{mockVehicle.lastInspection}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Next Inspection</p>
                <p className="text-lg font-bold">{mockVehicle.nextInspection}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="maintenance" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="insurance">Insurance & Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Recent Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMaintenanceHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{record.type}</p>
                        <p className="text-sm text-gray-500">
                          {record.date} • {record.mileage.toLocaleString()} mi
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium">${record.cost}</p>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Vehicle Documents
              </CardTitle>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">Expires: {doc.expiresAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status === 'expiring_soon' ? 'Expiring Soon' : doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Insurance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Provider</p>
                  <p className="font-medium">{mockVehicle.insurance.provider}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Policy Number</p>
                  <p className="font-medium">{mockVehicle.insurance.policyNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{mockVehicle.insurance.expiresAt}</p>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">State</p>
                  <p className="font-medium">{mockVehicle.registration.state}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">License Plate</p>
                  <p className="font-medium">{mockVehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Expires</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{mockVehicle.registration.expiresAt}</p>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

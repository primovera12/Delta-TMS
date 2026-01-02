'use client';

import * as React from 'react';
import {
  Car,
  Search,
  Filter,
  Plus,
  MoreVertical,
  MapPin,
  Calendar,
  Wrench,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// Mock data
const vehicles = [
  {
    id: 'VEH-001',
    make: 'Toyota',
    model: 'Sienna',
    year: 2022,
    licensePlate: 'ABC-1234',
    vin: '1HGBH41JXMN109186',
    type: 'wheelchair',
    status: 'active',
    driver: 'John Smith',
    mileage: 45230,
    lastInspection: '2025-12-15',
    nextMaintenance: '2026-02-15',
    insuranceExpiry: '2026-06-30',
    registrationExpiry: '2026-04-15',
  },
  {
    id: 'VEH-002',
    make: 'Ford',
    model: 'Transit',
    year: 2023,
    licensePlate: 'DEF-5678',
    vin: '2HGBH41JXMN109187',
    type: 'stretcher',
    status: 'active',
    driver: 'Mike Johnson',
    mileage: 28450,
    lastInspection: '2026-01-05',
    nextMaintenance: '2026-03-05',
    insuranceExpiry: '2026-08-15',
    registrationExpiry: '2026-05-20',
  },
  {
    id: 'VEH-003',
    make: 'Dodge',
    model: 'Grand Caravan',
    year: 2021,
    licensePlate: 'GHI-9012',
    vin: '3HGBH41JXMN109188',
    type: 'ambulatory',
    status: 'maintenance',
    driver: null,
    mileage: 62180,
    lastInspection: '2025-11-20',
    nextMaintenance: '2026-01-20',
    insuranceExpiry: '2026-05-10',
    registrationExpiry: '2026-03-25',
  },
  {
    id: 'VEH-004',
    make: 'Toyota',
    model: 'Sienna',
    year: 2024,
    licensePlate: 'JKL-3456',
    vin: '4HGBH41JXMN109189',
    type: 'wheelchair',
    status: 'active',
    driver: 'Sarah Williams',
    mileage: 12450,
    lastInspection: '2026-01-10',
    nextMaintenance: '2026-04-10',
    insuranceExpiry: '2026-12-01',
    registrationExpiry: '2026-11-15',
  },
  {
    id: 'VEH-005',
    make: 'Mercedes',
    model: 'Sprinter',
    year: 2022,
    licensePlate: 'MNO-7890',
    vin: '5HGBH41JXMN109190',
    type: 'bariatric',
    status: 'inactive',
    driver: null,
    mileage: 38920,
    lastInspection: '2025-10-05',
    nextMaintenance: '2026-01-05',
    insuranceExpiry: '2026-04-20',
    registrationExpiry: '2026-02-28',
  },
];

const typeLabels: Record<string, string> = {
  wheelchair: 'Wheelchair Van',
  stretcher: 'Stretcher Van',
  ambulatory: 'Ambulatory',
  bariatric: 'Bariatric',
};

const typeColors: Record<string, string> = {
  wheelchair: 'bg-primary-100 text-primary-700',
  stretcher: 'bg-error-100 text-error-700',
  ambulatory: 'bg-success-100 text-success-700',
  bariatric: 'bg-warning-100 text-warning-700',
};

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  maintenance: 'warning',
  inactive: 'secondary',
  retired: 'destructive',
};

export default function AdminVehiclesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.driver?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const vehicleCounts = {
    all: vehicles.length,
    active: vehicles.filter((v) => v.status === 'active').length,
    maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
    inactive: vehicles.filter((v) => v.status === 'inactive').length,
  };

  const checkExpiringSoon = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
          <p className="text-sm text-gray-500">Manage vehicles, maintenance, and compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-gray-900">{vehicleCounts.active}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{vehicleCounts.maintenance}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{vehicleCounts.inactive}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-gray-600" />
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
            placeholder="Search by plate, make, model, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="wheelchair">Wheelchair Van</SelectItem>
            <SelectItem value="stretcher">Stretcher Van</SelectItem>
            <SelectItem value="ambulatory">Ambulatory</SelectItem>
            <SelectItem value="bariatric">Bariatric</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles List */}
      <div className="space-y-4">
        {paginatedVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Main Info */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Car className="h-7 w-7 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <Badge variant={statusVariants[vehicle.status]}>
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-mono text-gray-600">{vehicle.licensePlate}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[vehicle.type]}`}>
                            {typeLabels[vehicle.type]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                        <DropdownMenuItem>View Inspection History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-warning-600">
                          Mark as Inactive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-error-600">
                          Retire Vehicle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Driver</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {vehicle.driver || 'Unassigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Mileage</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {vehicle.mileage.toLocaleString()} mi
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Inspection</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {vehicle.lastInspection}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">VIN</p>
                      <p className="text-sm font-mono text-gray-600 mt-1 truncate">
                        {vehicle.vin}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance Sidebar */}
                <div className="p-6 border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50 lg:w-72">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Compliance</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Maintenance</span>
                      <span className={`text-sm font-medium ${checkExpiringSoon(vehicle.nextMaintenance) ? 'text-warning-600' : 'text-gray-900'}`}>
                        {vehicle.nextMaintenance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Insurance Expiry</span>
                      <span className={`text-sm font-medium ${checkExpiringSoon(vehicle.insuranceExpiry) ? 'text-warning-600' : 'text-gray-900'}`}>
                        {vehicle.insuranceExpiry}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Registration</span>
                      <span className={`text-sm font-medium ${checkExpiringSoon(vehicle.registrationExpiry) ? 'text-warning-600' : 'text-gray-900'}`}>
                        {vehicle.registrationExpiry}
                      </span>
                    </div>
                  </div>
                  {(checkExpiringSoon(vehicle.nextMaintenance) ||
                    checkExpiringSoon(vehicle.insuranceExpiry) ||
                    checkExpiringSoon(vehicle.registrationExpiry)) && (
                    <div className="mt-3 p-2 rounded bg-warning-100 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning-600" />
                      <span className="text-xs text-warning-700">Action required soon</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of{' '}
          {filteredVehicles.length} vehicles
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" placeholder="2024" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="Toyota" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Sienna" className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plate">License Plate</Label>
                <Input id="plate" placeholder="ABC-1234" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input id="vin" placeholder="1HGBH41JXMN109186" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="type">Vehicle Type</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheelchair">Wheelchair Van</SelectItem>
                  <SelectItem value="stretcher">Stretcher Van</SelectItem>
                  <SelectItem value="ambulatory">Ambulatory</SelectItem>
                  <SelectItem value="bariatric">Bariatric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance">Insurance Expiry</Label>
                <Input id="insurance" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="registration">Registration Expiry</Label>
                <Input id="registration" type="date" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="driver">Assign Driver (Optional)</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="sarah">Sarah Williams</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddModal(false)}>
              Add Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

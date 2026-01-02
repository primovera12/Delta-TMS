'use client';

import * as React from 'react';
import {
  CheckSquare,
  Square,
  Car,
  User,
  Calendar,
  Clock,
  MapPin,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronDown,
  Search,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Trip {
  id: string;
  tripNumber: string;
  patientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  driver?: string;
  transportType: string;
}

const mockTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'TRP-2024-0156',
    patientName: 'Robert Johnson',
    pickupAddress: '456 Oak Avenue',
    dropoffAddress: 'Regional Medical Center',
    scheduledDate: '2024-01-16',
    scheduledTime: '9:00 AM',
    status: 'scheduled',
    transportType: 'Wheelchair',
  },
  {
    id: '2',
    tripNumber: 'TRP-2024-0157',
    patientName: 'Mary Williams',
    pickupAddress: '789 Pine Street',
    dropoffAddress: 'City General Hospital',
    scheduledDate: '2024-01-16',
    scheduledTime: '10:30 AM',
    status: 'scheduled',
    transportType: 'Ambulatory',
  },
  {
    id: '3',
    tripNumber: 'TRP-2024-0158',
    patientName: 'James Wilson',
    pickupAddress: 'Sunrise Senior Living',
    dropoffAddress: 'Dialysis Center',
    scheduledDate: '2024-01-16',
    scheduledTime: '11:00 AM',
    status: 'assigned',
    driver: 'Mike Thompson',
    transportType: 'Stretcher',
  },
  {
    id: '4',
    tripNumber: 'TRP-2024-0159',
    patientName: 'Elizabeth Brown',
    pickupAddress: '321 Maple Drive',
    dropoffAddress: 'Physical Therapy Plus',
    scheduledDate: '2024-01-16',
    scheduledTime: '1:00 PM',
    status: 'scheduled',
    transportType: 'Wheelchair',
  },
  {
    id: '5',
    tripNumber: 'TRP-2024-0160',
    patientName: 'Thomas Anderson',
    pickupAddress: '555 Elm Court',
    dropoffAddress: 'Oncology Center',
    scheduledDate: '2024-01-16',
    scheduledTime: '2:30 PM',
    status: 'assigned',
    driver: 'Sarah Davis',
    transportType: 'Ambulatory',
  },
  {
    id: '6',
    tripNumber: 'TRP-2024-0161',
    patientName: 'Patricia Martinez',
    pickupAddress: 'Golden Years Care',
    dropoffAddress: 'Regional Medical Center',
    scheduledDate: '2024-01-17',
    scheduledTime: '8:00 AM',
    status: 'scheduled',
    transportType: 'Wheelchair',
  },
  {
    id: '7',
    tripNumber: 'TRP-2024-0162',
    patientName: 'Michael Garcia',
    pickupAddress: '888 Cedar Lane',
    dropoffAddress: 'Cardiology Associates',
    scheduledDate: '2024-01-17',
    scheduledTime: '9:30 AM',
    status: 'scheduled',
    transportType: 'Ambulatory',
  },
  {
    id: '8',
    tripNumber: 'TRP-2024-0163',
    patientName: 'Linda Davis',
    pickupAddress: 'Valley View Nursing',
    dropoffAddress: 'Eye Care Specialists',
    scheduledDate: '2024-01-17',
    scheduledTime: '11:00 AM',
    status: 'assigned',
    driver: 'John Smith',
    transportType: 'Wheelchair',
  },
];

const availableDrivers = [
  { id: 'd1', name: 'Mike Thompson', vehicle: 'Wheelchair Van #12' },
  { id: 'd2', name: 'Sarah Davis', vehicle: 'Sedan #5' },
  { id: 'd3', name: 'John Smith', vehicle: 'Wheelchair Van #8' },
  { id: 'd4', name: 'Lisa Johnson', vehicle: 'Stretcher Unit #3' },
  { id: 'd5', name: 'David Wilson', vehicle: 'Sedan #11' },
];

export default function DispatcherBatchOperationsPage() {
  const [trips, setTrips] = React.useState<Trip[]>(mockTrips);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFilter, setDateFilter] = React.useState<string>('all');
  const [showAssignDialog, setShowAssignDialog] = React.useState(false);
  const [showStatusDialog, setShowStatusDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedDriver, setSelectedDriver] = React.useState<string>('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      searchQuery === '' ||
      trip.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'today' && trip.scheduledDate === '2024-01-16') ||
      (dateFilter === 'tomorrow' && trip.scheduledDate === '2024-01-17');
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTrips.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTrips.map((t) => t.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchAssign = async () => {
    if (!selectedDriver) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const driver = availableDrivers.find((d) => d.id === selectedDriver);
    setTrips(
      trips.map((trip) =>
        selectedIds.has(trip.id)
          ? { ...trip, driver: driver?.name, status: 'assigned' as const }
          : trip
      )
    );
    setSelectedIds(new Set());
    setShowAssignDialog(false);
    setSelectedDriver('');
    setIsProcessing(false);
  };

  const handleBatchStatusUpdate = async () => {
    if (!selectedStatus) return;
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setTrips(
      trips.map((trip) =>
        selectedIds.has(trip.id)
          ? { ...trip, status: selectedStatus as Trip['status'] }
          : trip
      )
    );
    setSelectedIds(new Set());
    setShowStatusDialog(false);
    setSelectedStatus('');
    setIsProcessing(false);
  };

  const handleBatchDelete = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setTrips(trips.filter((trip) => !selectedIds.has(trip.id)));
    setSelectedIds(new Set());
    setShowDeleteDialog(false);
    setIsProcessing(false);
  };

  const handleExport = () => {
    console.log('Exporting selected trips:', Array.from(selectedIds));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'assigned':
        return <Badge className="bg-info-100 text-info-700">Assigned</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning-100 text-warning-700">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-success-100 text-success-700">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Batch Operations</h1>
          <p className="text-sm text-gray-500">
            Select multiple trips to perform bulk actions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={selectedIds.size === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Selected
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips or patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Selection Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-primary-900">
                  {selectedIds.size} trip{selectedIds.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setShowAssignDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Driver
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowStatusDialog(true)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-error-600 hover:bg-error-50"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Cancel Trips
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIds(new Set())}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trips Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-left">
                    <Checkbox
                      checked={selectedIds.size === filteredTrips.length && filteredTrips.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Trip #</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Patient</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Route</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date/Time</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Driver</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className={`border-b hover:bg-gray-50 ${
                      selectedIds.has(trip.id) ? 'bg-primary-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedIds.has(trip.id)}
                        onCheckedChange={() => handleSelectOne(trip.id)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{trip.tripNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{trip.patientName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3 text-success-500" />
                          {trip.pickupAddress}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MapPin className="h-3 w-3 text-error-500" />
                          {trip.dropoffAddress}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-900">
                          <Calendar className="h-3 w-3" />
                          {trip.scheduledDate}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          {trip.scheduledTime}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{trip.transportType}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {trip.driver ? (
                        <span className="text-gray-900">{trip.driver}</span>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(trip.status)}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Trip
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign Driver
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-error-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Trip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTrips.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Car className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No trips found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{trips.filter((t) => t.status === 'scheduled').length}</p>
            <p className="text-sm text-gray-500">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-info-600">{trips.filter((t) => t.status === 'assigned').length}</p>
            <p className="text-sm text-gray-500">Assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning-600">{trips.filter((t) => !t.driver).length}</p>
            <p className="text-sm text-gray-500">Unassigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success-600">{trips.filter((t) => t.status === 'completed').length}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Assign Driver Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Driver to {selectedIds.size} Trips</DialogTitle>
            <DialogDescription>
              Select a driver to assign to the selected trips.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a driver..." />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{driver.name}</span>
                        <span className="text-gray-400">- {driver.vehicle}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBatchAssign} disabled={!selectedDriver || isProcessing}>
              {isProcessing ? 'Assigning...' : 'Assign Driver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status for {selectedIds.size} Trips</DialogTitle>
            <DialogDescription>
              Select a new status for the selected trips.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBatchStatusUpdate} disabled={!selectedStatus || isProcessing}>
              {isProcessing ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-error-600">Cancel {selectedIds.size} Trips?</DialogTitle>
            <DialogDescription>
              This action will cancel the selected trips. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-error-800">Warning</p>
                <p className="text-sm text-error-700">
                  Cancelling trips may affect patient appointments. Make sure to notify
                  patients and facilities if needed.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Keep Trips
            </Button>
            <Button variant="destructive" onClick={handleBatchDelete} disabled={isProcessing}>
              {isProcessing ? 'Cancelling...' : 'Cancel Trips'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

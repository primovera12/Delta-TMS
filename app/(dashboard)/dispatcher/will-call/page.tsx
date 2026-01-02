'use client';

import * as React from 'react';
import {
  Phone,
  Clock,
  MapPin,
  User,
  Car,
  Search,
  Filter,
  Play,
  CheckCircle,
  AlertCircle,
  PhoneCall,
  PhoneOff,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Mock data for will-call returns
const willCallReturns = [
  {
    id: 'WC-001',
    tripId: 'TR-20260115-003',
    patient: {
      name: 'Robert Brown',
      phone: '(555) 345-6789',
    },
    facility: {
      name: 'City Dialysis Center',
      address: '2100 West Loop, Houston, TX',
      department: 'Dialysis Unit',
    },
    dropoffAddress: '789 Pine Rd, Houston, TX 77003',
    originalDropoffTime: '08:30 AM',
    estimatedReadyTime: '12:30 PM',
    status: 'waiting',
    callAttempts: 0,
    lastCallTime: null,
    notes: 'Patient typically ready 30 min after dialysis',
    vehicleType: 'wheelchair',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'WC-002',
    tripId: 'TR-20260115-008',
    patient: {
      name: 'Emily Davis',
      phone: '(555) 456-7890',
    },
    facility: {
      name: 'Cancer Center',
      address: '1000 Main St, Houston, TX',
      department: 'Oncology',
    },
    dropoffAddress: '321 Elm St, Houston, TX 77004',
    originalDropoffTime: '09:00 AM',
    estimatedReadyTime: '2:00 PM',
    status: 'called',
    callAttempts: 1,
    lastCallTime: '2026-01-15T13:30:00Z',
    notes: 'Treatment usually takes 4-5 hours',
    vehicleType: 'stretcher',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'WC-003',
    tripId: 'TR-20260115-012',
    patient: {
      name: 'John Smith',
      phone: '(555) 123-4567',
    },
    facility: {
      name: 'Memorial Hospital',
      address: '6400 Fannin St, Houston, TX',
      department: 'Cardiology',
    },
    dropoffAddress: '123 Main St, Houston, TX 77001',
    originalDropoffTime: '11:00 AM',
    estimatedReadyTime: '1:00 PM',
    status: 'ready',
    callAttempts: 2,
    lastCallTime: '2026-01-15T12:45:00Z',
    notes: null,
    vehicleType: 'wheelchair',
    createdAt: '2026-01-15T11:00:00Z',
  },
  {
    id: 'WC-004',
    tripId: 'TR-20260114-045',
    patient: {
      name: 'William Taylor',
      phone: '(555) 567-8901',
    },
    facility: {
      name: 'Heart Center',
      address: '900 Texas Ave, Houston, TX',
      department: 'Cardiac Testing',
    },
    dropoffAddress: '555 Cedar Lane, Houston, TX 77005',
    originalDropoffTime: '10:00 AM',
    estimatedReadyTime: '11:30 AM',
    status: 'dispatched',
    callAttempts: 1,
    lastCallTime: '2026-01-15T11:15:00Z',
    notes: 'Driver en route',
    vehicleType: 'ambulatory',
    createdAt: '2026-01-15T10:00:00Z',
    assignedDriver: 'Sarah Williams',
  },
];

const statusColors: Record<string, 'warning' | 'info' | 'success' | 'secondary'> = {
  waiting: 'warning',
  called: 'info',
  ready: 'success',
  dispatched: 'secondary',
  completed: 'secondary',
};

const statusLabels: Record<string, string> = {
  waiting: 'Waiting',
  called: 'Called',
  ready: 'Ready for Pickup',
  dispatched: 'Driver Dispatched',
  completed: 'Completed',
};

export default function DispatcherWillCallPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showCallModal, setShowCallModal] = React.useState(false);
  const [showDispatchModal, setShowDispatchModal] = React.useState(false);
  const [selectedReturn, setSelectedReturn] = React.useState<typeof willCallReturns[0] | null>(null);

  const filteredReturns = willCallReturns.filter((wc) => {
    const matchesSearch =
      wc.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || wc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: willCallReturns.length,
    waiting: willCallReturns.filter((wc) => wc.status === 'waiting').length,
    called: willCallReturns.filter((wc) => wc.status === 'called').length,
    ready: willCallReturns.filter((wc) => wc.status === 'ready').length,
    dispatched: willCallReturns.filter((wc) => wc.status === 'dispatched').length,
  };

  const handleCallClick = (wc: typeof willCallReturns[0]) => {
    setSelectedReturn(wc);
    setShowCallModal(true);
  };

  const handleDispatchClick = (wc: typeof willCallReturns[0]) => {
    setSelectedReturn(wc);
    setShowDispatchModal(true);
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Will-Call Returns</h1>
          <p className="text-sm text-gray-500">Manage patient return pickups</p>
        </div>
        <Button variant="secondary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Waiting</p>
                <p className="text-2xl font-bold text-warning-600">{statusCounts.waiting}</p>
              </div>
              <Clock className="h-8 w-8 text-warning-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Called</p>
                <p className="text-2xl font-bold text-info-600">{statusCounts.called}</p>
              </div>
              <Phone className="h-8 w-8 text-info-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ready</p>
                <p className="text-2xl font-bold text-success-600">{statusCounts.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dispatched</p>
                <p className="text-2xl font-bold text-gray-600">{statusCounts.dispatched}</p>
              </div>
              <Car className="h-8 w-8 text-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by patient, facility, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="called">Called</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="dispatched">Dispatched</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="waiting">Waiting ({statusCounts.waiting})</TabsTrigger>
          <TabsTrigger value="called">Called ({statusCounts.called})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({statusCounts.ready})</TabsTrigger>
          <TabsTrigger value="dispatched">Dispatched ({statusCounts.dispatched})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Will-Call List */}
      <div className="space-y-4">
        {filteredReturns.length === 0 ? (
          <Card className="py-12 text-center">
            <Phone className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No will-call returns</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'No pending returns at this time'}
            </p>
          </Card>
        ) : (
          filteredReturns.map((wc) => (
            <Card key={wc.id} className={wc.status === 'ready' ? 'border-success-300 bg-success-50' : ''}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Patient & Facility Info */}
                  <div className="flex items-start gap-4 min-w-[280px]">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {wc.patient.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{wc.patient.name}</h3>
                      <p className="text-sm text-gray-500">{wc.patient.phone}</p>
                      <Badge variant={statusColors[wc.status]} className="mt-1">
                        {statusLabels[wc.status]}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Current Location</p>
                      <p className="font-medium text-gray-900 mt-1">{wc.facility.name}</p>
                      <p className="text-sm text-gray-500">{wc.facility.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Return To</p>
                      <p className="text-sm text-gray-600 mt-1">{wc.dropoffAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Ready Time</p>
                      <p className="font-medium text-gray-900 mt-1">{wc.estimatedReadyTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Last Called</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {wc.callAttempts > 0
                          ? `${formatTime(wc.lastCallTime)} (${wc.callAttempts} attempts)`
                          : 'Not called yet'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    {wc.status === 'waiting' && (
                      <Button onClick={() => handleCallClick(wc)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Facility
                      </Button>
                    )}
                    {wc.status === 'called' && (
                      <>
                        <Button variant="secondary" onClick={() => handleCallClick(wc)}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Again
                        </Button>
                        <Button onClick={() => handleDispatchClick(wc)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Ready
                        </Button>
                      </>
                    )}
                    {wc.status === 'ready' && (
                      <Button onClick={() => handleDispatchClick(wc)}>
                        <Car className="h-4 w-4 mr-2" />
                        Dispatch Driver
                      </Button>
                    )}
                    {wc.status === 'dispatched' && (
                      <div className="text-center p-2 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-500">Driver</p>
                        <p className="font-medium text-gray-900">{(wc as any).assignedDriver}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {wc.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>{wc.notes}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Call Modal */}
      <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Call Facility</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-semibold text-gray-900">{selectedReturn.patient.name}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500">Facility</p>
                <p className="font-semibold text-gray-900">{selectedReturn.facility.name}</p>
                <p className="text-sm text-gray-600">{selectedReturn.facility.department}</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  <Phone className="h-4 w-4 mr-2" />
                  Call {selectedReturn.facility.name}
                </Button>
              </div>
              <div>
                <Label htmlFor="callNotes">Call Notes</Label>
                <Textarea
                  id="callNotes"
                  placeholder="Enter notes from the call..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCallModal(false)}>
              <PhoneOff className="h-4 w-4 mr-2" />
              Not Ready
            </Button>
            <Button onClick={() => setShowCallModal(false)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Patient Ready
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispatch Modal */}
      <Dialog open={showDispatchModal} onOpenChange={setShowDispatchModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dispatch Driver</DialogTitle>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-semibold text-gray-900">{selectedReturn.facility.name}</p>
                <p className="text-sm text-gray-600">{selectedReturn.facility.address}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500">Dropoff</p>
                <p className="font-semibold text-gray-900">{selectedReturn.dropoffAddress}</p>
              </div>
              <div>
                <Label htmlFor="driver">Assign Driver</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith (Available)</SelectItem>
                    <SelectItem value="sarah">Sarah Williams (Available)</SelectItem>
                    <SelectItem value="david">David Lee (Available)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-info-50 text-info-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">
                  Vehicle type required: <strong className="capitalize">{selectedReturn.vehicleType}</strong>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowDispatchModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowDispatchModal(false)}>
              <Car className="h-4 w-4 mr-2" />
              Dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

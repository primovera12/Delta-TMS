'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Search,
  Plus,
  MoreVertical,
  Clock,
  MapPin,
  User,
  Car,
  Repeat,
  Pause,
  Play,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Checkbox } from '@/components/ui/checkbox';

// Mock data
const standingOrders = [
  {
    id: 'SO-001',
    patient: {
      id: 'PAT-003',
      name: 'Robert Brown',
      phone: '(555) 345-6789',
    },
    type: 'Dialysis',
    frequency: 'Mon, Wed, Fri',
    schedule: {
      days: ['monday', 'wednesday', 'friday'],
      pickupTime: '08:00',
      appointmentTime: '08:30',
    },
    pickup: {
      address: '789 Pine Rd, Houston, TX 77003',
    },
    dropoff: {
      address: 'City Dialysis Center, 2100 West Loop',
    },
    vehicleType: 'wheelchair',
    specialNeeds: ['wheelchair'],
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    nextTrip: '2026-01-17',
    tripsCompleted: 85,
  },
  {
    id: 'SO-002',
    patient: {
      id: 'PAT-001',
      name: 'John Smith',
      phone: '(555) 123-4567',
    },
    type: 'Cardiology',
    frequency: 'Monthly',
    schedule: {
      days: ['first_wednesday'],
      pickupTime: '10:00',
      appointmentTime: '10:30',
    },
    pickup: {
      address: '123 Main St, Houston, TX 77001',
    },
    dropoff: {
      address: 'Memorial Hospital, Cardiology Dept',
    },
    vehicleType: 'wheelchair',
    specialNeeds: ['wheelchair', 'oxygen'],
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    nextTrip: '2026-02-05',
    tripsCompleted: 12,
  },
  {
    id: 'SO-003',
    patient: {
      id: 'PAT-002',
      name: 'Mary Jones',
      phone: '(555) 234-5678',
    },
    type: 'Physical Therapy',
    frequency: 'Tue, Thu',
    schedule: {
      days: ['tuesday', 'thursday'],
      pickupTime: '14:00',
      appointmentTime: '14:30',
    },
    pickup: {
      address: '456 Oak Ave, Houston, TX 77002',
    },
    dropoff: {
      address: 'Rehab Center, 500 Medical Dr',
    },
    vehicleType: 'ambulatory',
    specialNeeds: [],
    status: 'paused',
    startDate: '2025-09-01',
    endDate: '2026-02-28',
    nextTrip: null,
    tripsCompleted: 32,
  },
  {
    id: 'SO-004',
    patient: {
      id: 'PAT-004',
      name: 'Emily Davis',
      phone: '(555) 456-7890',
    },
    type: 'Oncology',
    frequency: 'Weekly',
    schedule: {
      days: ['monday'],
      pickupTime: '09:00',
      appointmentTime: '09:30',
    },
    pickup: {
      address: '321 Elm St, Houston, TX 77004',
    },
    dropoff: {
      address: 'Cancer Center, 1000 Main St',
    },
    vehicleType: 'stretcher',
    specialNeeds: ['stretcher', 'attendant'],
    status: 'active',
    startDate: '2025-11-01',
    endDate: '2026-04-30',
    nextTrip: '2026-01-20',
    tripsCompleted: 10,
  },
];

export default function DispatcherStandingOrdersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const filteredOrders = standingOrders.filter((order) => {
    const matchesSearch =
      order.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderCounts = {
    all: standingOrders.length,
    active: standingOrders.filter((o) => o.status === 'active').length,
    paused: standingOrders.filter((o) => o.status === 'paused').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Standing Orders</h1>
          <p className="text-sm text-gray-500">Manage recurring trip schedules</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Standing Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by patient, ID, or type..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({orderCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({orderCounts.active})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({orderCounts.paused})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No standing orders found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'Create your first standing order'}
            </p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Patient Info */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {order.patient.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.patient.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{order.id}</p>
                      <Badge
                        variant={order.status === 'active' ? 'success' : 'secondary'}
                        className="mt-1"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                      <p className="font-medium text-gray-900 mt-1">{order.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Schedule</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Repeat className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.frequency}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup Time</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{order.schedule.pickupTime}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Pickup</p>
                      <p className="text-sm text-gray-600 mt-1 truncate">{order.pickup.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Dropoff</p>
                      <p className="text-sm text-gray-600 mt-1 truncate">{order.dropoff.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Next Trip</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {order.nextTrip || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    {order.status === 'active' ? (
                      <Button variant="secondary" size="sm">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Trip History</DropdownMenuItem>
                        <DropdownMenuItem>Generate Next Trip</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-error-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Stats Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CheckCircle className="h-4 w-4" />
                    <span>{order.tripsCompleted} trips completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{order.startDate} - {order.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Car className="h-4 w-4" />
                    <span className="capitalize">{order.vehicleType}</span>
                  </div>
                  {order.specialNeeds.length > 0 && (
                    <div className="flex gap-1">
                      {order.specialNeeds.map((need) => (
                        <Badge key={need} variant="info" size="sm">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Standing Order Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Standing Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pat-001">John Smith</SelectItem>
                  <SelectItem value="pat-002">Mary Jones</SelectItem>
                  <SelectItem value="pat-003">Robert Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <Input id="type" placeholder="e.g., Dialysis, Physical Therapy" className="mt-1.5" />
            </div>
            <div>
              <Label className="mb-3 block">Schedule Days</Label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <label
                    key={day}
                    className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Checkbox id={day} />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Input id="pickupTime" type="time" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="apptTime">Appointment Time</Label>
                <Input id="apptTime" type="time" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambulatory">Ambulatory</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair Van</SelectItem>
                  <SelectItem value="stretcher">Stretcher Van</SelectItem>
                  <SelectItem value="bariatric">Bariatric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" className="mt-1.5" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Repeat,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  User,
  MoreVertical,
  Edit2,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface StandingOrder {
  id: string;
  patientId: string;
  patientName: string;
  transportType: string;
  pickupAddress: string;
  dropoffAddress: string;
  appointmentType: string;
  schedule: {
    daysOfWeek: number[];
    pickupTime: string;
    returnTime?: string;
  };
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'expired';
  isRoundTrip: boolean;
  totalTripsGenerated: number;
  nextTripDate: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const mockStandingOrders: StandingOrder[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Robert Johnson',
    transportType: 'Wheelchair',
    pickupAddress: '123 Oak Street, Springfield, IL',
    dropoffAddress: 'Regional Dialysis Center',
    appointmentType: 'Dialysis',
    schedule: {
      daysOfWeek: [1, 3, 5],
      pickupTime: '09:00',
      returnTime: '13:00',
    },
    startDate: '2024-01-01',
    status: 'active',
    isRoundTrip: true,
    totalTripsGenerated: 24,
    nextTripDate: '2024-01-17',
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Mary Williams',
    transportType: 'Ambulatory',
    pickupAddress: '456 Elm Ave, Springfield, IL',
    dropoffAddress: 'City Physical Therapy',
    appointmentType: 'Physical Therapy',
    schedule: {
      daysOfWeek: [2, 4],
      pickupTime: '14:00',
    },
    startDate: '2024-01-08',
    status: 'active',
    isRoundTrip: false,
    totalTripsGenerated: 8,
    nextTripDate: '2024-01-18',
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'James Wilson',
    transportType: 'Stretcher',
    pickupAddress: '789 Pine Road, Springfield, IL',
    dropoffAddress: 'Memorial Hospital - Oncology',
    appointmentType: 'Chemotherapy',
    schedule: {
      daysOfWeek: [3],
      pickupTime: '08:00',
      returnTime: '14:00',
    },
    startDate: '2023-11-15',
    endDate: '2024-02-15',
    status: 'active',
    isRoundTrip: true,
    totalTripsGenerated: 12,
    nextTripDate: '2024-01-24',
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Elizabeth Brown',
    transportType: 'Wheelchair',
    pickupAddress: '321 Maple Lane, Springfield, IL',
    dropoffAddress: 'Springfield Medical Center',
    appointmentType: 'Follow-up',
    schedule: {
      daysOfWeek: [1],
      pickupTime: '10:30',
    },
    startDate: '2024-01-01',
    status: 'paused',
    isRoundTrip: false,
    totalTripsGenerated: 2,
    nextTripDate: '-',
  },
];

export default function FacilityStandingOrdersPage() {
  const router = useRouter();
  const [standingOrders, setStandingOrders] = React.useState<StandingOrder[]>(mockStandingOrders);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<StandingOrder | null>(null);

  const filteredOrders = standingOrders.filter((order) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !order.patientName.toLowerCase().includes(query) &&
        !order.appointmentType.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleToggleStatus = (orderId: string) => {
    setStandingOrders(
      standingOrders.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: order.status === 'active' ? 'paused' : 'active',
          };
        }
        return order;
      })
    );
  };

  const handleDelete = () => {
    if (selectedOrder) {
      setStandingOrders(standingOrders.filter((o) => o.id !== selectedOrder.id));
      setIsDeleteOpen(false);
      setSelectedOrder(null);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const displayHour = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'paused':
        return <Badge variant="warning">Paused</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeCount = standingOrders.filter((o) => o.status === 'active').length;
  const pausedCount = standingOrders.filter((o) => o.status === 'paused').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Standing Orders</h1>
          <p className="text-sm text-gray-500">Manage recurring transportation schedules</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Standing Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Repeat className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{standingOrders.length}</p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Pause className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pausedCount}</p>
                <p className="text-sm text-gray-500">Paused</p>
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
            type="text"
            placeholder="Search by patient name or appointment type..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Standing Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Repeat className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No standing orders found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create a standing order to schedule recurring trips'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Standing Order
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className={order.status === 'paused' ? 'opacity-75' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    order.status === 'active'
                      ? 'bg-success-100'
                      : order.status === 'paused'
                      ? 'bg-warning-100'
                      : 'bg-gray-100'
                  }`}>
                    <Repeat className={`h-6 w-6 ${
                      order.status === 'active'
                        ? 'text-success-600'
                        : order.status === 'paused'
                        ? 'text-warning-600'
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{order.patientName}</h3>
                        {getStatusBadge(order.status)}
                        <Badge variant="secondary">{order.transportType}</Badge>
                        {order.isRoundTrip && (
                          <Badge variant="outline">Round Trip</Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(order.id)}>
                            {order.status === 'active' ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-error-600"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm font-medium text-primary-600 mb-2">
                      {order.appointmentType}
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p>{order.pickupAddress}</p>
                          <p className="text-gray-400">→</p>
                          <p>{order.dropoffAddress}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Pickup: {formatTime(order.schedule.pickupTime)}</span>
                          {order.schedule.returnTime && (
                            <span>• Return: {formatTime(order.schedule.returnTime)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div className="flex gap-1">
                            {DAYS_OF_WEEK.map((day, index) => (
                              <span
                                key={day}
                                className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
                                  order.schedule.daysOfWeek.includes(index)
                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                    : 'text-gray-400'
                                }`}
                              >
                                {day[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500">
                          {order.totalTripsGenerated} trips generated
                        </span>
                        {order.status === 'active' && order.nextTripDate !== '-' && (
                          <span className="text-success-600">
                            Next: {new Date(order.nextTripDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400">
                        Started {new Date(order.startDate).toLocaleDateString()}
                        {order.endDate && ` • Ends ${new Date(order.endDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog - Simplified placeholder */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Standing Order</DialogTitle>
            <DialogDescription>
              Create a recurring transportation schedule for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-info-50 border border-info-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-info-600 mt-0.5" />
                <p className="text-sm text-info-800">
                  This form will allow you to set up recurring trips. Select a patient,
                  specify the pickup/dropoff locations, and choose the recurring schedule.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Full form implementation would include patient selection, address inputs,
              day/time selectors, and date range options.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateOpen(false)}>
              Create Standing Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Standing Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this standing order for{' '}
              <strong>{selectedOrder?.patientName}</strong>? This will stop all future
              trips from being generated. Existing scheduled trips will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-error-600 hover:bg-error-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

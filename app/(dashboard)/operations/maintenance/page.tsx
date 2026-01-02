'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  Wrench,
  Car,
  AlertTriangle,
  Clock,
  CheckCircle,
  Calendar,
  FileText,
  DollarSign,
} from 'lucide-react';

// Mock maintenance data
const mockMaintenanceRecords = [
  {
    id: 'MNT-001',
    vehicle: 'VEH-042',
    vehicleType: 'Wheelchair Van',
    type: 'Scheduled',
    description: 'Oil change and tire rotation',
    status: 'completed',
    scheduledDate: '2024-01-15',
    completedDate: '2024-01-15',
    cost: 185.00,
    technician: 'Auto Shop Pro',
    mileage: 45200,
  },
  {
    id: 'MNT-002',
    vehicle: 'VEH-015',
    vehicleType: 'Sedan',
    type: 'Repair',
    description: 'Brake pad replacement',
    status: 'in_progress',
    scheduledDate: '2024-01-16',
    completedDate: null,
    cost: 350.00,
    technician: 'Fleet Service Center',
    mileage: 62100,
  },
  {
    id: 'MNT-003',
    vehicle: 'VEH-023',
    vehicleType: 'Stretcher',
    type: 'Inspection',
    description: 'Annual state inspection',
    status: 'scheduled',
    scheduledDate: '2024-01-20',
    completedDate: null,
    cost: 75.00,
    technician: 'State DMV',
    mileage: 38500,
  },
  {
    id: 'MNT-004',
    vehicle: 'VEH-031',
    vehicleType: 'Wheelchair Van',
    type: 'Repair',
    description: 'Wheelchair lift hydraulic repair',
    status: 'pending_parts',
    scheduledDate: '2024-01-18',
    completedDate: null,
    cost: 890.00,
    technician: 'Mobility Equipment Inc.',
    mileage: 52800,
  },
  {
    id: 'MNT-005',
    vehicle: 'VEH-007',
    vehicleType: 'Sedan',
    type: 'Scheduled',
    description: '60,000 mile service',
    status: 'scheduled',
    scheduledDate: '2024-01-22',
    completedDate: null,
    cost: 425.00,
    technician: 'Auto Shop Pro',
    mileage: 59800,
  },
];

const mockUpcomingMaintenance = [
  { vehicle: 'VEH-042', type: 'Oil Change', dueDate: '2024-02-15', dueMileage: '48,000 mi' },
  { vehicle: 'VEH-015', type: 'Tire Rotation', dueDate: '2024-02-01', dueMileage: '65,000 mi' },
  { vehicle: 'VEH-019', type: 'Brake Inspection', dueDate: '2024-02-10', dueMileage: '55,000 mi' },
];

export default function OperationsMaintenancePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      pending_parts: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      Scheduled: <Calendar className="h-4 w-4 text-blue-500" />,
      Repair: <Wrench className="h-4 w-4 text-orange-500" />,
      Inspection: <FileText className="h-4 w-4 text-purple-500" />,
    };
    return icons[type] || <Wrench className="h-4 w-4" />;
  };

  const filteredRecords = mockMaintenanceRecords.filter(record => {
    const matchesSearch =
      record.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: mockMaintenanceRecords.length,
    inProgress: mockMaintenanceRecords.filter(r => r.status === 'in_progress').length,
    scheduled: mockMaintenanceRecords.filter(r => r.status === 'scheduled').length,
    totalCost: mockMaintenanceRecords.reduce((sum, r) => sum + r.cost, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Maintenance</h1>
          <p className="text-gray-600">Track and manage fleet maintenance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost (MTD)</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records">
        <TabsList>
          <TabsTrigger value="records">Maintenance Records</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Due</TabsTrigger>
          <TabsTrigger value="history">Service History</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicles or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_parts">Pending Parts</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/operations/maintenance/${record.id}`)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{record.vehicle}</p>
                            <p className="text-sm text-gray-500">{record.vehicleType}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(record.type)}
                          <span>{record.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.scheduledDate}</TableCell>
                      <TableCell>{record.technician}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${record.cost.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Maintenance Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingMaintenance.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">{item.vehicle}</p>
                        <p className="text-sm text-gray-500">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.dueDate}</p>
                      <p className="text-sm text-gray-500">or {item.dueMileage}</p>
                    </div>
                    <Button size="sm">Schedule</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Schedule Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Fleet Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Regular Maintenance</span>
                  </div>
                  <span className="text-sm text-gray-500">Every 5,000 miles or 3 months</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Brake Inspection</span>
                  </div>
                  <span className="text-sm text-gray-500">Every 15,000 miles or 12 months</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>State Inspection</span>
                  </div>
                  <span className="text-sm text-gray-500">Annually</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Wheelchair Lift Service</span>
                  </div>
                  <span className="text-sm text-gray-500">Every 6 months</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Complete service history will be displayed here</p>
              <p className="text-sm text-gray-400 mt-2">Filter by vehicle or date range</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

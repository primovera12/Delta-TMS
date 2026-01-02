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
  MapPin,
  Clock,
  Car,
  Navigation,
  Edit,
  Trash2,
  Play,
  Eye,
  Route,
  TrendingUp,
} from 'lucide-react';

// Mock route data
const mockRoutes = [
  {
    id: 'RT-001',
    name: 'Downtown Medical Loop',
    status: 'active',
    stops: 8,
    totalMiles: 24.5,
    estimatedTime: '2h 15m',
    assignedDriver: 'Michael Johnson',
    frequency: 'Daily',
    lastRun: '2024-01-15 10:30 AM',
    efficiency: 94,
  },
  {
    id: 'RT-002',
    name: 'North Hospital Shuttle',
    status: 'active',
    stops: 5,
    totalMiles: 18.2,
    estimatedTime: '1h 30m',
    assignedDriver: 'Sarah Kim',
    frequency: 'Daily',
    lastRun: '2024-01-15 9:00 AM',
    efficiency: 98,
  },
  {
    id: 'RT-003',
    name: 'East District Dialysis',
    status: 'active',
    stops: 6,
    totalMiles: 32.8,
    estimatedTime: '2h 45m',
    assignedDriver: 'David Lee',
    frequency: 'Mon/Wed/Fri',
    lastRun: '2024-01-15 7:00 AM',
    efficiency: 91,
  },
  {
    id: 'RT-004',
    name: 'South Clinic Express',
    status: 'inactive',
    stops: 4,
    totalMiles: 15.6,
    estimatedTime: '1h 00m',
    assignedDriver: null,
    frequency: 'As Needed',
    lastRun: '2024-01-10 2:00 PM',
    efficiency: 88,
  },
  {
    id: 'RT-005',
    name: 'Rehab Center Route',
    status: 'active',
    stops: 7,
    totalMiles: 28.4,
    estimatedTime: '2h 30m',
    assignedDriver: 'Lisa Martinez',
    frequency: 'Tue/Thu',
    lastRun: '2024-01-14 8:00 AM',
    efficiency: 96,
  },
];

const mockRouteStops = [
  { id: 1, name: 'Metro Hospital', type: 'Medical', address: '100 Main St', pickups: 3 },
  { id: 2, name: 'City Dialysis Center', type: 'Dialysis', address: '250 Oak Ave', pickups: 2 },
  { id: 3, name: 'Downtown Clinic', type: 'Clinic', address: '500 Center Blvd', pickups: 4 },
  { id: 4, name: 'Care Home West', type: 'Residential', address: '750 West Dr', pickups: 2 },
];

export default function OperationsRoutesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600';
    if (efficiency >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredRoutes = mockRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockRoutes.length,
    active: mockRoutes.filter(r => r.status === 'active').length,
    totalMiles: mockRoutes.reduce((sum, r) => sum + r.totalMiles, 0),
    avgEfficiency: Math.round(mockRoutes.reduce((sum, r) => sum + r.efficiency, 0) / mockRoutes.length),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Management</h1>
          <p className="text-gray-600">Create and manage recurring transport routes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Route
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Route className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Routes</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Play className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Miles</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalMiles.toFixed(1)}</p>
              </div>
              <Navigation className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgEfficiency}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Routes List */}
        <div className="col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search routes..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Routes Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead className="text-center">Stops</TableHead>
                    <TableHead className="text-center">Miles</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-center">Efficiency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.map((route) => (
                    <TableRow
                      key={route.id}
                      className={`cursor-pointer ${selectedRoute === route.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedRoute(route.id)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{route.name}</p>
                          <p className="text-sm text-gray-500">{route.frequency}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{route.stops}</TableCell>
                      <TableCell className="text-center">{route.totalMiles} mi</TableCell>
                      <TableCell>
                        {route.assignedDriver || (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getEfficiencyColor(route.efficiency)}`}>
                          {route.efficiency}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(route.status)}>
                          {route.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Route Details Sidebar */}
        <div className="space-y-4">
          {selectedRoute ? (
            <>
              {(() => {
                const route = mockRoutes.find(r => r.id === selectedRoute);
                if (!route) return null;
                return (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{route.name}</CardTitle>
                          <Badge className={getStatusColor(route.status)}>
                            {route.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Total Stops</p>
                              <p className="font-semibold">{route.stops}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Miles</p>
                              <p className="font-semibold">{route.totalMiles} mi</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Est. Time</p>
                              <p className="font-semibold">{route.estimatedTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Frequency</p>
                              <p className="font-semibold">{route.frequency}</p>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-500">Assigned Driver</p>
                            <p className="font-semibold">
                              {route.assignedDriver || 'Unassigned'}
                            </p>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-500">Last Run</p>
                            <p className="font-semibold">{route.lastRun}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Route Stops */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Route Stops</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockRouteStops.map((stop, index) => (
                            <div key={stop.id} className="flex items-start gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                {index < mockRouteStops.length - 1 && (
                                  <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{stop.name}</p>
                                <p className="text-xs text-gray-500">{stop.address}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {stop.pickups} pickups
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Map Preview Placeholder */}
                    <Card>
                      <CardContent className="p-0">
                        <div className="h-48 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Route Map Preview</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Route className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a route to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

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
  Download,
  Car,
  TrendingUp,
  Calendar,
  Route,
  MapPin,
  Clock,
} from 'lucide-react';

// Mock mileage data
const mockMileageRecords = [
  {
    id: 'MLG-001',
    vehicle: 'VEH-042',
    driver: 'Michael Johnson',
    date: '2024-01-15',
    startOdometer: 45150,
    endOdometer: 45200,
    totalMiles: 50,
    trips: 5,
    revenuemiles: 42,
    deadheadMiles: 8,
  },
  {
    id: 'MLG-002',
    vehicle: 'VEH-015',
    driver: 'Sarah Kim',
    date: '2024-01-15',
    startOdometer: 62050,
    endOdometer: 62100,
    totalMiles: 50,
    trips: 6,
    revenueMiles: 46,
    deadheadMiles: 4,
  },
  {
    id: 'MLG-003',
    vehicle: 'VEH-023',
    driver: 'David Lee',
    date: '2024-01-15',
    startOdometer: 38430,
    endOdometer: 38500,
    totalMiles: 70,
    trips: 7,
    revenueiles: 58,
    deadheadMiles: 12,
  },
  {
    id: 'MLG-004',
    vehicle: 'VEH-031',
    driver: 'Lisa Martinez',
    date: '2024-01-15',
    startOdometer: 52750,
    endOdometer: 52800,
    totalMiles: 50,
    trips: 4,
    revenueiles: 40,
    deadheadMiles: 10,
  },
  {
    id: 'MLG-005',
    vehicle: 'VEH-007',
    driver: 'James Wilson',
    date: '2024-01-15',
    startOdometer: 59750,
    endOdometer: 59800,
    totalMiles: 50,
    trips: 5,
    revenueiles: 45,
    deadheadMiles: 5,
  },
];

const mockVehicleSummary = [
  { vehicle: 'VEH-042', totalMiles: 2450, revenueRate: 84, avgDaily: 82 },
  { vehicle: 'VEH-015', totalMiles: 2180, revenueRate: 92, avgDaily: 73 },
  { vehicle: 'VEH-023', totalMiles: 2890, revenueRate: 83, avgDaily: 96 },
  { vehicle: 'VEH-031', totalMiles: 2020, revenueRate: 80, avgDaily: 67 },
  { vehicle: 'VEH-007', totalMiles: 1950, revenueRate: 90, avgDaily: 65 },
];

export default function OperationsMileagePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const filteredRecords = mockMileageRecords.filter(record => {
    const matchesSearch =
      record.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = filterVehicle === 'all' || record.vehicle === filterVehicle;
    return matchesSearch && matchesVehicle;
  });

  const stats = {
    totalMiles: mockMileageRecords.reduce((sum, r) => sum + r.totalMiles, 0),
    totalTrips: mockMileageRecords.reduce((sum, r) => sum + r.trips, 0),
    avgRevenueRate: 86,
    avgDailyMiles: 68,
  };

  const getRevenueRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mileage Tracking</h1>
          <p className="text-gray-600">Monitor vehicle mileage and utilization</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Miles (MTD)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMiles.toLocaleString()}</p>
              </div>
              <Route className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalTrips}</p>
              </div>
              <Car className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue Mile Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgRevenueRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Daily Miles</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgDailyMiles}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Mileage Records */}
        <div className="col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search vehicle or driver..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterVehicle} onValueChange={setFilterVehicle}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="VEH-042">VEH-042</SelectItem>
                <SelectItem value="VEH-015">VEH-015</SelectItem>
                <SelectItem value="VEH-023">VEH-023</SelectItem>
                <SelectItem value="VEH-031">VEH-031</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mileage Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-center">Trips</TableHead>
                    <TableHead className="text-center">Total Miles</TableHead>
                    <TableHead className="text-center">Revenue</TableHead>
                    <TableHead className="text-center">Deadhead</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="font-medium">{record.vehicle}</TableCell>
                      <TableCell>{record.driver}</TableCell>
                      <TableCell className="text-center">{record.trips}</TableCell>
                      <TableCell className="text-center font-medium">{record.totalMiles}</TableCell>
                      <TableCell className="text-center text-green-600">
                        {record.totalMiles - record.deadheadMiles}
                      </TableCell>
                      <TableCell className="text-center text-gray-500">
                        {record.deadheadMiles}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Vehicle Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vehicle Mileage Summary (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVehicleSummary.map((vehicle) => (
                  <div key={vehicle.vehicle} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{vehicle.vehicle}</span>
                      <span className="text-sm text-gray-500">
                        {vehicle.totalMiles.toLocaleString()} mi
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(vehicle.totalMiles / 3000) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Revenue rate: <span className={getRevenueRateColor(vehicle.revenueRate)}>{vehicle.revenueRate}%</span></span>
                      <span>Avg: {vehicle.avgDaily} mi/day</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mileage Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Mileage Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Miles</span>
                    <span className="font-semibold text-green-600">86%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '86%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Deadhead Miles</span>
                    <span className="font-semibold text-gray-600">14%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gray-400 h-4 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Fleet Target</p>
                  <p className="text-2xl font-bold text-blue-600">90% Revenue</p>
                  <Badge variant="secondary" className="mt-2">4% below target</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Highest Daily</span>
                  <span className="font-medium">VEH-023 (96 mi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Best Revenue Rate</span>
                  <span className="font-medium">VEH-015 (92%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Most Trips</span>
                  <span className="font-medium">VEH-023 (7/day)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

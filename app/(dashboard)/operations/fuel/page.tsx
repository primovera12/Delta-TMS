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
  Fuel,
  Car,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

// Mock fuel data
const mockFuelRecords = [
  {
    id: 'FUEL-001',
    vehicle: 'VEH-042',
    driver: 'Michael Johnson',
    date: '2024-01-15',
    station: 'Shell - Main St',
    gallons: 18.5,
    pricePerGallon: 3.45,
    totalCost: 63.83,
    odometer: 45200,
    mpg: 22.4,
  },
  {
    id: 'FUEL-002',
    vehicle: 'VEH-015',
    driver: 'Sarah Kim',
    date: '2024-01-15',
    station: 'Chevron - Oak Ave',
    gallons: 14.2,
    pricePerGallon: 3.52,
    totalCost: 49.98,
    odometer: 62100,
    mpg: 28.6,
  },
  {
    id: 'FUEL-003',
    vehicle: 'VEH-023',
    driver: 'David Lee',
    date: '2024-01-14',
    station: 'Mobil - Industrial',
    gallons: 22.8,
    pricePerGallon: 3.42,
    totalCost: 77.98,
    odometer: 38500,
    mpg: 18.2,
  },
  {
    id: 'FUEL-004',
    vehicle: 'VEH-031',
    driver: 'Lisa Martinez',
    date: '2024-01-14',
    station: 'Shell - Downtown',
    gallons: 19.5,
    pricePerGallon: 3.48,
    totalCost: 67.86,
    odometer: 52800,
    mpg: 20.5,
  },
  {
    id: 'FUEL-005',
    vehicle: 'VEH-007',
    driver: 'James Wilson',
    date: '2024-01-13',
    station: 'BP - South Blvd',
    gallons: 12.8,
    pricePerGallon: 3.55,
    totalCost: 45.44,
    odometer: 59800,
    mpg: 30.2,
  },
];

const mockVehicleStats = [
  { vehicle: 'VEH-042', avgMpg: 22.4, totalGallons: 125, totalCost: 431.25, trend: 'up' },
  { vehicle: 'VEH-015', avgMpg: 28.6, totalGallons: 98, totalCost: 345.10, trend: 'up' },
  { vehicle: 'VEH-023', avgMpg: 18.2, totalGallons: 145, totalCost: 496.90, trend: 'down' },
  { vehicle: 'VEH-031', avgMpg: 20.5, totalGallons: 132, totalCost: 459.36, trend: 'stable' },
];

export default function OperationsFuelPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const filteredRecords = mockFuelRecords.filter(record => {
    const matchesSearch =
      record.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.driver.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = filterVehicle === 'all' || record.vehicle === filterVehicle;
    return matchesSearch && matchesVehicle;
  });

  const stats = {
    totalGallons: mockFuelRecords.reduce((sum, r) => sum + r.gallons, 0),
    totalCost: mockFuelRecords.reduce((sum, r) => sum + r.totalCost, 0),
    avgPricePerGallon: mockFuelRecords.reduce((sum, r) => sum + r.pricePerGallon, 0) / mockFuelRecords.length,
    avgMpg: mockFuelRecords.reduce((sum, r) => sum + r.mpg, 0) / mockFuelRecords.length,
  };

  const getMpgColor = (mpg: number) => {
    if (mpg >= 25) return 'text-green-600';
    if (mpg >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fuel Tracking</h1>
          <p className="text-gray-600">Monitor fuel consumption and costs across the fleet</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Gallons (MTD)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGallons.toFixed(1)}</p>
              </div>
              <Fuel className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost (MTD)</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price/Gallon</p>
                <p className="text-2xl font-bold text-gray-900">${stats.avgPricePerGallon.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fleet Avg MPG</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgMpg.toFixed(1)}</p>
              </div>
              <Car className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Fuel Records */}
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

          {/* Fuel Records Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead className="text-center">Gallons</TableHead>
                    <TableHead className="text-center">$/Gal</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">MPG</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="font-medium">{record.vehicle}</TableCell>
                      <TableCell>{record.driver}</TableCell>
                      <TableCell className="text-center">{record.gallons}</TableCell>
                      <TableCell className="text-center">${record.pricePerGallon.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">${record.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold ${getMpgColor(record.mpg)}`}>
                          {record.mpg}
                        </span>
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
          {/* Vehicle Fuel Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vehicle Fuel Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVehicleStats.map((vehicle) => (
                  <div key={vehicle.vehicle} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{vehicle.vehicle}</p>
                      <p className="text-sm text-gray-500">{vehicle.totalGallons} gal used</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${getMpgColor(vehicle.avgMpg)}`}>
                        {vehicle.avgMpg} MPG
                      </span>
                      {vehicle.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {vehicle.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cost by Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Fuel Cost by Vehicle (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockVehicleStats.map((vehicle) => (
                  <div key={vehicle.vehicle}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{vehicle.vehicle}</span>
                      <span className="font-medium">${vehicle.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(vehicle.totalCost / 500) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fuel Price Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Average Fuel Price Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Price chart</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-gray-500">Low</p>
                  <p className="font-semibold text-green-600">$3.42</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg</p>
                  <p className="font-semibold">$3.48</p>
                </div>
                <div>
                  <p className="text-gray-500">High</p>
                  <p className="font-semibold text-red-600">$3.55</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Car,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  Users,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/domain/stat-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Mock data
const facilities = [
  {
    id: 'FAC-001',
    name: 'Memorial Hospital',
    type: 'hospital',
    address: '1234 Medical Center Dr, Houston, TX 77001',
    contact: 'Jane Wilson',
    email: 'scheduling@memorial.com',
    phone: '(555) 123-4567',
    status: 'active',
    monthlyTrips: 450,
    monthlyRevenue: 42500,
    outstandingBalance: 9350,
    paymentStatus: 'current',
  },
  {
    id: 'FAC-002',
    name: 'City Dialysis Center',
    type: 'dialysis',
    address: '789 Health Blvd, Houston, TX 77002',
    contact: 'Mike Roberts',
    email: 'transport@citydialysis.com',
    phone: '(555) 234-5678',
    status: 'active',
    monthlyTrips: 520,
    monthlyRevenue: 38000,
    outstandingBalance: 8750,
    paymentStatus: 'current',
  },
  {
    id: 'FAC-003',
    name: 'Regional Medical Center',
    type: 'hospital',
    address: '567 Healthcare Way, Houston, TX 77003',
    contact: 'Sarah Johnson',
    email: 'transport@rmc.com',
    phone: '(555) 345-6789',
    status: 'active',
    monthlyTrips: 280,
    monthlyRevenue: 28000,
    outstandingBalance: 6400,
    paymentStatus: 'overdue',
  },
  {
    id: 'FAC-004',
    name: 'Heart Care Clinic',
    type: 'clinic',
    address: '890 Cardio Dr, Houston, TX 77004',
    contact: 'Dr. Lisa Chen',
    email: 'admin@heartcare.com',
    phone: '(555) 456-7890',
    status: 'active',
    monthlyTrips: 180,
    monthlyRevenue: 15000,
    outstandingBalance: 0,
    paymentStatus: 'paid',
  },
  {
    id: 'FAC-005',
    name: 'Cancer Treatment Center',
    type: 'specialty',
    address: '567 Oncology Way, Houston, TX 77005',
    contact: 'Tom Williams',
    email: 'scheduling@ctc.com',
    phone: '(555) 567-8901',
    status: 'active',
    monthlyTrips: 140,
    monthlyRevenue: 18000,
    outstandingBalance: 3250,
    paymentStatus: 'current',
  },
  {
    id: 'FAC-006',
    name: 'Sunrise Nursing Home',
    type: 'nursing_home',
    address: '234 Elder Care Lane, Houston, TX 77006',
    contact: 'Nancy Brown',
    email: 'transport@sunrise.com',
    phone: '(555) 678-9012',
    status: 'inactive',
    monthlyTrips: 0,
    monthlyRevenue: 0,
    outstandingBalance: 1200,
    paymentStatus: 'overdue',
  },
];

const facilityTypes = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'dialysis', label: 'Dialysis Center' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'specialty', label: 'Specialty Center' },
  { value: 'nursing_home', label: 'Nursing Home' },
];

const typeColors: Record<string, string> = {
  hospital: 'bg-info-100 text-info-700',
  dialysis: 'bg-success-100 text-success-700',
  clinic: 'bg-warning-100 text-warning-700',
  specialty: 'bg-purple-100 text-purple-700',
  nursing_home: 'bg-pink-100 text-pink-700',
};

export default function AdminFacilitiesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || facility.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || facility.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalFacilities = facilities.length;
  const activeFacilities = facilities.filter((f) => f.status === 'active').length;
  const totalMonthlyRevenue = facilities.reduce((sum, f) => sum + f.monthlyRevenue, 0);
  const totalOutstanding = facilities.reduce((sum, f) => sum + f.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Facilities</h1>
          <p className="text-sm text-gray-500">Manage healthcare facility accounts</p>
        </div>
        <Link href="/admin/facilities/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Facilities"
          value={totalFacilities}
          icon={<Building2 className="h-6 w-6" />}
        />
        <StatCard
          title="Active Facilities"
          value={activeFacilities}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${totalMonthlyRevenue.toLocaleString()}`}
          trend="up"
          change={8}
          changeLabel="vs last month"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Outstanding Balance"
          value={`$${totalOutstanding.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {facilityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFacilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{facility.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[facility.type]}`}>
                              {facilityTypes.find((t) => t.value === facility.type)?.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {facility.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{facility.contact}</p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {facility.email}
                        </p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {facility.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          <span className="flex items-center gap-1">
                            <Car className="h-4 w-4 text-gray-400" />
                            {facility.monthlyTrips} trips
                          </span>
                        </p>
                        <p className="text-gray-500">
                          ${facility.monthlyRevenue.toLocaleString()} revenue
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          ${facility.outstandingBalance.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            facility.paymentStatus === 'paid'
                              ? 'success'
                              : facility.paymentStatus === 'overdue'
                              ? 'error'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {facility.paymentStatus}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={facility.status === 'active' ? 'success' : 'secondary'}
                      >
                        {facility.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/facilities/${facility.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Link href={`/admin/billing?facility=${facility.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

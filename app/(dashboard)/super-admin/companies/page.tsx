'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Building2,
  Users,
  Car,
  Calendar,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';

// Mock company data
const mockCompanies = [
  {
    id: 'CMP-001',
    name: 'Delta Medical Transport',
    plan: 'Enterprise',
    status: 'active',
    users: 45,
    drivers: 18,
    tripsThisMonth: 1245,
    createdAt: '2023-01-15',
    lastActive: '2024-01-15 10:30 AM',
  },
  {
    id: 'CMP-002',
    name: 'Metro Health Shuttle',
    plan: 'Professional',
    status: 'active',
    users: 28,
    drivers: 12,
    tripsThisMonth: 856,
    createdAt: '2023-03-22',
    lastActive: '2024-01-15 9:45 AM',
  },
  {
    id: 'CMP-003',
    name: 'City Care Transport',
    plan: 'Starter',
    status: 'active',
    users: 12,
    drivers: 6,
    tripsThisMonth: 342,
    createdAt: '2023-06-10',
    lastActive: '2024-01-14 4:20 PM',
  },
  {
    id: 'CMP-004',
    name: 'Regional Medical Transit',
    plan: 'Enterprise',
    status: 'trial',
    users: 8,
    drivers: 4,
    tripsThisMonth: 89,
    createdAt: '2024-01-01',
    lastActive: '2024-01-15 11:00 AM',
  },
  {
    id: 'CMP-005',
    name: 'Valley Healthcare Rides',
    plan: 'Professional',
    status: 'suspended',
    users: 22,
    drivers: 10,
    tripsThisMonth: 0,
    createdAt: '2023-04-18',
    lastActive: '2024-01-10 2:15 PM',
  },
];

export default function SuperAdminCompaniesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-blue-100 text-blue-800',
      suspended: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      Enterprise: 'bg-purple-100 text-purple-800',
      Professional: 'bg-blue-100 text-blue-800',
      Starter: 'bg-gray-100 text-gray-800',
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    const matchesPlan = filterPlan === 'all' || company.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = {
    total: mockCompanies.length,
    active: mockCompanies.filter(c => c.status === 'active').length,
    trial: mockCompanies.filter(c => c.status === 'trial').length,
    totalUsers: mockCompanies.reduce((sum, c) => sum + c.users, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
          <p className="text-gray-600">Manage all registered companies and their subscriptions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Trial</p>
                <p className="text-2xl font-bold text-blue-600">{stats.trial}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies..."
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
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPlan} onValueChange={setFilterPlan}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Starter">Starter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-center">Users</TableHead>
                <TableHead className="text-center">Drivers</TableHead>
                <TableHead className="text-center">Trips (MTD)</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/super-admin/companies/${company.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-gray-500">{company.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(company.plan)}>
                      {company.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{company.users}</TableCell>
                  <TableCell className="text-center">{company.drivers}</TableCell>
                  <TableCell className="text-center">{company.tripsThisMonth.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-gray-500">{company.lastActive}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(company.status)}>
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

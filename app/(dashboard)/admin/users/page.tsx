'use client';

import * as React from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const users = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    role: 'driver',
    status: 'active',
    createdAt: '2025-06-15',
    lastLogin: '2026-01-15 10:30 AM',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    phone: '(555) 234-5678',
    role: 'dispatcher',
    status: 'active',
    createdAt: '2025-08-22',
    lastLogin: '2026-01-15 09:45 AM',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '(555) 345-6789',
    role: 'driver',
    status: 'active',
    createdAt: '2025-07-10',
    lastLogin: '2026-01-14 04:20 PM',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 456-7890',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-05',
    lastLogin: '2026-01-15 11:00 AM',
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '(555) 567-8901',
    role: 'driver',
    status: 'inactive',
    createdAt: '2025-09-18',
    lastLogin: '2025-12-20 02:15 PM',
  },
  {
    id: '6',
    name: 'Lisa Chen',
    email: 'lisa.chen@email.com',
    phone: '(555) 678-9012',
    role: 'dispatcher',
    status: 'pending',
    createdAt: '2026-01-10',
    lastLogin: null,
  },
  {
    id: '7',
    name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '(555) 789-0123',
    role: 'facility',
    status: 'active',
    createdAt: '2025-11-05',
    lastLogin: '2026-01-15 08:30 AM',
  },
  {
    id: '8',
    name: 'Amanda Wilson',
    email: 'amanda.wilson@email.com',
    phone: '(555) 890-1234',
    role: 'driver',
    status: 'suspended',
    createdAt: '2025-04-20',
    lastLogin: '2026-01-05 03:45 PM',
  },
];

const roleColors: Record<string, string> = {
  admin: 'bg-error-100 text-error-700',
  dispatcher: 'bg-primary-100 text-primary-700',
  driver: 'bg-success-100 text-success-700',
  facility: 'bg-warning-100 text-warning-700',
  patient: 'bg-info-100 text-info-700',
};

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
  suspended: 'destructive',
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const userCounts = {
    all: users.length,
    admin: users.filter((u) => u.role === 'admin').length,
    dispatcher: users.filter((u) => u.role === 'dispatcher').length,
    driver: users.filter((u) => u.role === 'driver').length,
    facility: users.filter((u) => u.role === 'facility').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">Manage all system users and their permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="dispatcher">Dispatcher</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="facility">Facility</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Role Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setRoleFilter(v)}>
        <TabsList>
          <TabsTrigger value="all">All ({userCounts.all})</TabsTrigger>
          <TabsTrigger value="admin">Admins ({userCounts.admin})</TabsTrigger>
          <TabsTrigger value="dispatcher">Dispatchers ({userCounts.dispatcher})</TabsTrigger>
          <TabsTrigger value="driver">Drivers ({userCounts.driver})</TabsTrigger>
          <TabsTrigger value="facility">Facilities ({userCounts.facility})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">User</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Role</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-gray-500 text-sm">Last Login</th>
                  <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">Since {user.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariants[user.status]}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">
                        {user.lastLogin || 'Never'}
                      </p>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem className="text-warning-600">
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-success-600">
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-error-600">
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Smith" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="facility">Facility Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-info-50 text-info-700">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">An invitation email will be sent to the user</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

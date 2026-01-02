'use client';

import * as React from 'react';
import {
  Users,
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Shield,
  UserPlus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Key,
  Clock,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock users data
const facilityUsers = [
  {
    id: 'USR-001',
    name: 'Jane Wilson',
    email: 'jwilson@memorial.com',
    phone: '(555) 123-4567',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-01-15T10:30:00Z',
    createdAt: '2024-06-15T09:00:00Z',
  },
  {
    id: 'USR-002',
    name: 'Tom Davis',
    email: 'tdavis@memorial.com',
    phone: '(555) 234-5678',
    role: 'scheduler',
    status: 'active',
    lastLogin: '2026-01-15T08:15:00Z',
    createdAt: '2024-09-20T14:00:00Z',
  },
  {
    id: 'USR-003',
    name: 'Sarah Martinez',
    email: 'smartinez@memorial.com',
    phone: '(555) 345-6789',
    role: 'viewer',
    status: 'active',
    lastLogin: '2026-01-14T16:45:00Z',
    createdAt: '2025-01-10T11:00:00Z',
  },
  {
    id: 'USR-004',
    name: 'Mike Thompson',
    email: 'mthompson@memorial.com',
    phone: '(555) 456-7890',
    role: 'scheduler',
    status: 'invited',
    lastLogin: null,
    createdAt: '2026-01-10T09:00:00Z',
  },
];

const roles = [
  { value: 'admin', label: 'Administrator', description: 'Full access to all features' },
  { value: 'scheduler', label: 'Scheduler', description: 'Can book and manage trips' },
  { value: 'viewer', label: 'Viewer', description: 'View-only access' },
];

const roleColors: Record<string, 'info' | 'warning' | 'secondary'> = {
  admin: 'info',
  scheduler: 'warning',
  viewer: 'secondary',
};

export default function FacilityUsersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteData, setInviteData] = React.useState({
    email: '',
    name: '',
    role: 'scheduler',
  });

  const filteredUsers = facilityUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleInvite = () => {
    console.log('Inviting user:', inviteData);
    setShowInviteModal(false);
    setInviteData({ email: '', name: '', role: 'scheduler' });
  };

  const formatLastLogin = (date: string | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (hours < 48) return 'Yesterday';
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500">Manage your facility's user access</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{facilityUsers.length}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {facilityUsers.filter((u) => u.status === 'active').length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {facilityUsers.filter((u) => u.status === 'invited').length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {facilityUsers.filter((u) => u.role === 'admin').length}
                </p>
                <p className="text-sm text-gray-500">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.status === 'invited' && (
                        <Badge variant="warning" size="sm">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {user.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={roleColors[user.role]} size="sm">
                      {roles.find((r) => r.value === user.role)?.label}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">
                      Last active: {formatLastLogin(user.lastLogin)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {user.status === 'invited' && (
                      <Button variant="ghost" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error-600 hover:text-error-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {roles.map((role) => (
              <div
                key={role.value}
                className="p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={roleColors[role.value]}>{role.label}</Badge>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="colleague@hospital.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData({ ...inviteData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <p className="font-medium">{role.label}</p>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t border-gray-200">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleInvite}
                disabled={!inviteData.email || !inviteData.name}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Shield,
  Edit,
  Trash2,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogIn,
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: 'USR-001',
  firstName: 'John',
  lastName: 'Anderson',
  email: 'john.anderson@deltamed.com',
  phone: '(555) 123-4567',
  role: 'dispatcher',
  status: 'active',
  avatar: null,
  facility: null,
  department: 'Operations',
  title: 'Senior Dispatcher',
  createdAt: '2023-06-15',
  lastLogin: '2024-01-15 09:30:22 AM',
  lastPasswordChange: '2023-12-01',
  twoFactorEnabled: true,
  permissions: {
    trips: ['view', 'create', 'edit', 'delete'],
    patients: ['view', 'create', 'edit'],
    drivers: ['view', 'assign'],
    reports: ['view'],
    billing: [],
    settings: [],
  },
};

const mockActivityLog = [
  { id: 1, action: 'Logged in', timestamp: '2024-01-15 09:30:22 AM', ip: '192.168.1.100', status: 'success' },
  { id: 2, action: 'Assigned trip TRP-1234', timestamp: '2024-01-15 09:45:15 AM', ip: '192.168.1.100', status: 'success' },
  { id: 3, action: 'Created new trip TRP-1235', timestamp: '2024-01-15 10:12:00 AM', ip: '192.168.1.100', status: 'success' },
  { id: 4, action: 'Updated patient PAT-089', timestamp: '2024-01-15 11:30:45 AM', ip: '192.168.1.100', status: 'success' },
  { id: 5, action: 'Failed login attempt', timestamp: '2024-01-14 08:15:00 AM', ip: '192.168.1.105', status: 'failed' },
  { id: 6, action: 'Password changed', timestamp: '2023-12-01 02:30:00 PM', ip: '192.168.1.100', status: 'success' },
];

const mockSessions = [
  { id: 1, device: 'Chrome on Windows', ip: '192.168.1.100', location: 'Metro City, CA', lastActive: '2 minutes ago', current: true },
  { id: 2, device: 'Safari on iPhone', ip: '192.168.1.150', location: 'Metro City, CA', lastActive: '1 hour ago', current: false },
];

const roleOptions = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'dispatcher', label: 'Dispatcher', description: 'Trip management and scheduling' },
  { value: 'driver', label: 'Driver', description: 'Trip execution and status updates' },
  { value: 'facility_admin', label: 'Facility Admin', description: 'Facility-level management' },
  { value: 'facility_staff', label: 'Facility Staff', description: 'Basic trip booking' },
  { value: 'billing', label: 'Billing', description: 'Financial operations' },
  { value: 'readonly', label: 'Read Only', description: 'View only access' },
];

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      dispatcher: 'bg-blue-100 text-blue-800',
      driver: 'bg-green-100 text-green-800',
      facility_admin: 'bg-orange-100 text-orange-800',
      facility_staff: 'bg-yellow-100 text-yellow-800',
      billing: 'bg-pink-100 text-pink-800',
      readonly: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const permissionModules = [
    { key: 'trips', label: 'Trips' },
    { key: 'patients', label: 'Patients' },
    { key: 'drivers', label: 'Drivers' },
    { key: 'reports', label: 'Reports' },
    { key: 'billing', label: 'Billing' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-14 w-14">
            {mockUser.avatar ? (
              <AvatarImage src={mockUser.avatar} />
            ) : (
              <AvatarFallback className="text-lg">
                {mockUser.firstName[0]}{mockUser.lastName[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {mockUser.firstName} {mockUser.lastName}
              </h1>
              <Badge className={getStatusColor(mockUser.status)}>
                {mockUser.status}
              </Badge>
            </div>
            <p className="text-gray-600">{mockUser.title} • {mockUser.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update user information and settings</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input defaultValue={mockUser.firstName} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input defaultValue={mockUser.lastName} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue={mockUser.email} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input defaultValue={mockUser.phone} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Select defaultValue={mockUser.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select defaultValue={mockUser.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Input defaultValue={mockUser.department} />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input defaultValue={mockUser.title} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsEditDialogOpen(false)}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Deactivate
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <Badge className={getRoleBadgeColor(mockUser.role)}>
                  {mockUser.role.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <LogIn className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="font-medium text-gray-900 text-sm">Jan 15, 9:30 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">2FA Status</p>
                <Badge className={mockUser.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {mockUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900 text-sm">{mockUser.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{mockUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{mockUser.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">{mockUser.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-gray-900">{mockUser.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Created</span>
                  <span className="text-gray-900">{mockUser.createdAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Password Change</span>
                  <span className="text-gray-900">{mockUser.lastPasswordChange}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Two-Factor Auth</span>
                  <Badge className={mockUser.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {mockUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {permissionModules.map((module) => {
                  const permissions = mockUser.permissions[module.key as keyof typeof mockUser.permissions] || [];
                  return (
                    <div key={module.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{module.label}</h4>
                        <p className="text-sm text-gray-500">
                          {permissions.length > 0 ? permissions.join(', ') : 'No access'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {['view', 'create', 'edit', 'delete'].map((perm) => (
                          <Badge
                            key={perm}
                            variant={permissions.includes(perm) ? 'default' : 'outline'}
                            className={permissions.includes(perm) ? '' : 'opacity-50'}
                          >
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Last Changed</p>
                    <p className="text-sm text-gray-500">{mockUser.lastPasswordChange}</p>
                  </div>
                  <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Reset Password</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Send a password reset email to {mockUser.email}?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
                        <Button onClick={() => setIsResetPasswordOpen(false)}>Send Reset Email</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <p className="text-sm text-gray-500">
                      {mockUser.twoFactorEnabled ? 'Authenticator app configured' : 'Not configured'}
                    </p>
                  </div>
                  <Switch checked={mockUser.twoFactorEnabled} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.device}
                          {session.current && <span className="text-green-600 ml-2">(Current)</span>}
                        </p>
                        <p className="text-sm text-gray-500">{session.ip} • {session.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{session.lastActive}</span>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-red-600">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivityLog.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">IP: {activity.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{activity.timestamp}</p>
                      <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

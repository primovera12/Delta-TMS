'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  Lock,
  Eye,
} from 'lucide-react';

// Mock roles data
const mockRoles = [
  {
    id: 'ROLE-001',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    users: 2,
    isSystem: true,
    permissions: ['all'],
  },
  {
    id: 'ROLE-002',
    name: 'Company Admin',
    description: 'Full access within company scope',
    users: 12,
    isSystem: true,
    permissions: ['company.manage', 'users.manage', 'trips.manage', 'billing.view'],
  },
  {
    id: 'ROLE-003',
    name: 'Operations Manager',
    description: 'Manage operations, drivers, and fleet',
    users: 24,
    isSystem: true,
    permissions: ['operations.manage', 'drivers.manage', 'fleet.manage', 'reports.view'],
  },
  {
    id: 'ROLE-004',
    name: 'Dispatcher',
    description: 'Manage trips and driver assignments',
    users: 45,
    isSystem: true,
    permissions: ['trips.manage', 'drivers.view', 'patients.view'],
  },
  {
    id: 'ROLE-005',
    name: 'Driver',
    description: 'View assigned trips and update status',
    users: 156,
    isSystem: true,
    permissions: ['trips.own.view', 'trips.own.update'],
  },
  {
    id: 'ROLE-006',
    name: 'Facility Staff',
    description: 'Book trips and view facility patients',
    users: 89,
    isSystem: true,
    permissions: ['trips.create', 'patients.facility.view'],
  },
  {
    id: 'ROLE-007',
    name: 'Billing Specialist',
    description: 'Manage billing and invoices',
    users: 8,
    isSystem: false,
    permissions: ['billing.manage', 'invoices.manage', 'reports.billing'],
  },
];

const permissionGroups = [
  {
    name: 'Users',
    permissions: [
      { id: 'users.view', label: 'View Users' },
      { id: 'users.create', label: 'Create Users' },
      { id: 'users.edit', label: 'Edit Users' },
      { id: 'users.delete', label: 'Delete Users' },
    ],
  },
  {
    name: 'Trips',
    permissions: [
      { id: 'trips.view', label: 'View Trips' },
      { id: 'trips.create', label: 'Create Trips' },
      { id: 'trips.edit', label: 'Edit Trips' },
      { id: 'trips.delete', label: 'Delete Trips' },
      { id: 'trips.assign', label: 'Assign Drivers' },
    ],
  },
  {
    name: 'Drivers',
    permissions: [
      { id: 'drivers.view', label: 'View Drivers' },
      { id: 'drivers.manage', label: 'Manage Drivers' },
    ],
  },
  {
    name: 'Billing',
    permissions: [
      { id: 'billing.view', label: 'View Billing' },
      { id: 'billing.manage', label: 'Manage Billing' },
      { id: 'invoices.create', label: 'Create Invoices' },
    ],
  },
  {
    name: 'Reports',
    permissions: [
      { id: 'reports.view', label: 'View Reports' },
      { id: 'reports.export', label: 'Export Reports' },
    ],
  },
];

export default function SuperAdminRolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600">Manage user roles and their permissions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a new role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input placeholder="e.g., Billing Manager" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Brief description of the role" />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium">Permissions</label>
                {permissionGroups.map((group) => (
                  <div key={group.name} className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">{group.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-2">
                          <Checkbox id={permission.id} />
                          <label htmlFor={permission.id} className="text-sm">
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="col-span-2 space-y-4">
          {mockRoles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-shadow hover:shadow-md ${
                selectedRole === role.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-xs">System</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {role.users} users
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          {role.permissions.length} permissions
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!role.isSystem && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permission Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Permission Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissionGroups.map((group) => (
                  <div key={group.name}>
                    <p className="font-medium text-sm mb-2">{group.name}</p>
                    <div className="space-y-1">
                      {group.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="text-xs text-gray-500 pl-2 flex items-center gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                          {permission.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Role Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Roles</span>
                  <span className="font-medium">{mockRoles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">System Roles</span>
                  <span className="font-medium">{mockRoles.filter(r => r.isSystem).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Custom Roles</span>
                  <span className="font-medium">{mockRoles.filter(r => !r.isSystem).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Users</span>
                  <span className="font-medium">{mockRoles.reduce((sum, r) => sum + r.users, 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

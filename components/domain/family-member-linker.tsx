'use client';

import * as React from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Shield,
  Trash2,
  Check,
  X,
  Edit,
  Clock,
  Loader2,
  Send,
  Copy,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Permission {
  key: string;
  label: string;
  description: string;
}

interface FamilyMember {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: string;
  status: 'pending' | 'active' | 'declined';
  invitedAt: string;
  acceptedAt?: string;
  permissions: string[];
}

interface FamilyMemberLinkerProps {
  patientId: string;
  className?: string;
}

const PERMISSIONS: Permission[] = [
  {
    key: 'book_trips',
    label: 'Book Trips',
    description: 'Can schedule new rides',
  },
  {
    key: 'view_trips',
    label: 'View Trips',
    description: 'Can see trip history and upcoming rides',
  },
  {
    key: 'cancel_trips',
    label: 'Cancel Trips',
    description: 'Can cancel scheduled rides',
  },
  {
    key: 'track_trips',
    label: 'Real-time Tracking',
    description: 'Can track rides in progress',
  },
  {
    key: 'manage_payments',
    label: 'Manage Payments',
    description: 'Can view and manage payment methods',
  },
  {
    key: 'receive_notifications',
    label: 'Receive Notifications',
    description: 'Gets notified about trip updates',
  },
];

const RELATIONSHIPS = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Grandchild',
  'Caregiver',
  'Guardian',
  'Friend',
  'Other',
];

// Mock data
const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'fm-001',
    userId: 'user-456',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@email.com',
    phone: '(555) 987-6543',
    relationship: 'Spouse',
    status: 'active',
    invitedAt: '2025-12-01T10:00:00Z',
    acceptedAt: '2025-12-01T14:30:00Z',
    permissions: ['book_trips', 'view_trips', 'cancel_trips', 'track_trips', 'receive_notifications'],
  },
  {
    id: 'fm-002',
    firstName: 'Michael',
    lastName: 'Doe',
    email: 'michael.doe@email.com',
    phone: '(555) 555-1234',
    relationship: 'Child',
    status: 'pending',
    invitedAt: '2025-12-28T09:00:00Z',
    permissions: ['view_trips', 'track_trips', 'receive_notifications'],
  },
];

export function FamilyMemberLinker({ patientId, className }: FamilyMemberLinkerProps) {
  const [familyMembers, setFamilyMembers] = React.useState<FamilyMember[]>(mockFamilyMembers);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showInviteDialog, setShowInviteDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);
  const [selectedMember, setSelectedMember] = React.useState<FamilyMember | null>(null);
  const [isSending, setIsSending] = React.useState(false);
  const [inviteSent, setInviteSent] = React.useState(false);

  // Invite form state
  const [inviteForm, setInviteForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    relationship: '',
    permissions: ['view_trips', 'track_trips', 'receive_notifications'],
  });

  const resetInviteForm = () => {
    setInviteForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      relationship: '',
      permissions: ['view_trips', 'track_trips', 'receive_notifications'],
    });
    setInviteSent(false);
  };

  const handleOpenInvite = () => {
    resetInviteForm();
    setShowInviteDialog(true);
  };

  const handleTogglePermission = (permission: string) => {
    setInviteForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSendInvite = async () => {
    if (!inviteForm.firstName || !inviteForm.email || !inviteForm.relationship) {
      return;
    }

    setIsSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newMember: FamilyMember = {
      id: `fm-${Date.now()}`,
      firstName: inviteForm.firstName,
      lastName: inviteForm.lastName,
      email: inviteForm.email,
      phone: inviteForm.phone,
      relationship: inviteForm.relationship,
      status: 'pending',
      invitedAt: new Date().toISOString(),
      permissions: inviteForm.permissions,
    };

    setFamilyMembers((prev) => [...prev, newMember]);
    setIsSending(false);
    setInviteSent(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setInviteForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      relationship: member.relationship,
      permissions: member.permissions,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMember) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              firstName: inviteForm.firstName,
              lastName: inviteForm.lastName,
              email: inviteForm.email,
              phone: inviteForm.phone,
              relationship: inviteForm.relationship,
              permissions: inviteForm.permissions,
            }
          : m
      )
    );

    setIsSending(false);
    setShowEditDialog(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = async () => {
    if (!deleteConfirmId) return;

    setFamilyMembers((prev) => prev.filter((m) => m.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  const handleResendInvite = async (memberId: string) => {
    // Simulate resending invite
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Update invitedAt timestamp
    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, invitedAt: new Date().toISOString() }
          : m
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'declined':
        return <Badge variant="error">Declined</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Members
              </CardTitle>
              <CardDescription>
                Allow family members to book rides and track trips on your behalf
              </CardDescription>
            </div>
            <Button onClick={handleOpenInvite}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {familyMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No family members linked</p>
              <p className="text-sm mt-1">Invite family members to help manage your rides</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenInvite}>
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <Avatar size="md">
                      <AvatarFallback>
                        {member.firstName[0]}{member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </h4>
                        {getStatusBadge(member.status)}
                      </div>
                      <p className="text-sm text-gray-500">{member.relationship}</p>

                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {member.phone}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {member.permissions.map((perm) => {
                          const permInfo = PERMISSIONS.find((p) => p.key === perm);
                          return (
                            <Badge key={perm} variant="secondary" size="sm">
                              {permInfo?.label || perm}
                            </Badge>
                          );
                        })}
                      </div>

                      {member.status === 'pending' && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          Invited {formatDate(member.invitedAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResendInvite(member.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Resend
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => setDeleteConfirmId(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite Family Member</DialogTitle>
            <DialogDescription>
              Send an invitation to allow a family member to manage your rides
            </DialogDescription>
          </DialogHeader>

          {inviteSent ? (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Invitation Sent!</h3>
              <p className="text-gray-500 mt-2">
                We've sent an email to <strong>{inviteForm.email}</strong> with instructions to join.
              </p>
              <Button className="mt-6" onClick={() => setShowInviteDialog(false)}>
                Done
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={inviteForm.firstName}
                      onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                      className="mt-1"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={inviteForm.lastName}
                      onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                      className="mt-1"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="mt-1"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    className="mt-1"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label>Relationship *</Label>
                  <Select
                    value={inviteForm.relationship}
                    onValueChange={(v) => setInviteForm({ ...inviteForm, relationship: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map((rel) => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissions
                  </Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Choose what this family member can do
                  </p>
                  <div className="space-y-3">
                    {PERMISSIONS.map((perm) => (
                      <div
                        key={perm.key}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <Checkbox
                          id={perm.key}
                          checked={inviteForm.permissions.includes(perm.key)}
                          onCheckedChange={() => handleTogglePermission(perm.key)}
                        />
                        <label htmlFor={perm.key} className="flex-1 cursor-pointer">
                          <span className="font-medium text-gray-900 block">
                            {perm.label}
                          </span>
                          <span className="text-sm text-gray-500">{perm.description}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  disabled={isSending || !inviteForm.firstName || !inviteForm.email || !inviteForm.relationship}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Invitation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Family Member</DialogTitle>
            <DialogDescription>
              Update permissions and details for this family member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={inviteForm.firstName}
                  onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={inviteForm.lastName}
                  onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Relationship</Label>
              <Select
                value={inviteForm.relationship}
                onValueChange={(v) => setInviteForm({ ...inviteForm, relationship: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIPS.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissions
              </Label>
              <div className="mt-3 space-y-3">
                {PERMISSIONS.map((perm) => (
                  <div
                    key={perm.key}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Checkbox
                      id={`edit-${perm.key}`}
                      checked={inviteForm.permissions.includes(perm.key)}
                      onCheckedChange={() => handleTogglePermission(perm.key)}
                    />
                    <label htmlFor={`edit-${perm.key}`} className="flex-1 cursor-pointer">
                      <span className="font-medium text-gray-900 block">
                        {perm.label}
                      </span>
                      <span className="text-sm text-gray-500">{perm.description}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSending}>
              {isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Family Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this family member? They will no longer be able
              to manage your rides.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FamilyMemberLinker;

'use client';

import * as React from 'react';
import {
  Users,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Star,
  StarOff,
  AlertCircle,
  CheckCircle2,
  User,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  altPhone?: string;
  email?: string;
  isPrimary: boolean;
  canReceiveUpdates: boolean;
  canAuthorizeTrips: boolean;
}

const mockContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Mary Johnson',
    relationship: 'Spouse',
    phone: '(555) 234-5678',
    altPhone: '(555) 345-6789',
    email: 'mary.johnson@email.com',
    isPrimary: true,
    canReceiveUpdates: true,
    canAuthorizeTrips: true,
  },
  {
    id: '2',
    name: 'Michael Johnson Jr.',
    relationship: 'Son',
    phone: '(555) 456-7890',
    email: 'mjohnson@email.com',
    isPrimary: false,
    canReceiveUpdates: true,
    canAuthorizeTrips: false,
  },
  {
    id: '3',
    name: 'Sarah Williams',
    relationship: 'Daughter',
    phone: '(555) 567-8901',
    isPrimary: false,
    canReceiveUpdates: true,
    canAuthorizeTrips: true,
  },
];

const relationships = [
  'Spouse',
  'Son',
  'Daughter',
  'Parent',
  'Sibling',
  'Friend',
  'Caregiver',
  'Neighbor',
  'Other',
];

export default function PatientContactsPage() {
  const [contacts, setContacts] = React.useState<EmergencyContact[]>(mockContacts);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<EmergencyContact | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    relationship: '',
    phone: '',
    altPhone: '',
    email: '',
    canReceiveUpdates: true,
    canAuthorizeTrips: false,
  });

  const handleAdd = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: formData.name,
      relationship: formData.relationship,
      phone: formData.phone,
      altPhone: formData.altPhone || undefined,
      email: formData.email || undefined,
      isPrimary: contacts.length === 0,
      canReceiveUpdates: formData.canReceiveUpdates,
      canAuthorizeTrips: formData.canAuthorizeTrips,
    };
    setContacts([...contacts, newContact]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedContact) return;
    setContacts(
      contacts.map((c) =>
        c.id === selectedContact.id
          ? {
              ...c,
              name: formData.name,
              relationship: formData.relationship,
              phone: formData.phone,
              altPhone: formData.altPhone || undefined,
              email: formData.email || undefined,
              canReceiveUpdates: formData.canReceiveUpdates,
              canAuthorizeTrips: formData.canAuthorizeTrips,
            }
          : c
      )
    );
    setShowEditDialog(false);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedContact) return;
    setContacts(contacts.filter((c) => c.id !== selectedContact.id));
    setShowDeleteDialog(false);
    setSelectedContact(null);
  };

  const handleSetPrimary = (id: string) => {
    setContacts(
      contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
  };

  const openEditDialog = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      altPhone: contact.altPhone || '',
      email: contact.email || '',
      canReceiveUpdates: contact.canReceiveUpdates,
      canAuthorizeTrips: contact.canAuthorizeTrips,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (contact: EmergencyContact) => {
    setSelectedContact(contact);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      altPhone: '',
      email: '',
      canReceiveUpdates: true,
      canAuthorizeTrips: false,
    });
    setSelectedContact(null);
  };

  const primaryContact = contacts.find((c) => c.isPrimary);
  const otherContacts = contacts.filter((c) => !c.isPrimary);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Emergency Contacts</h1>
          <p className="text-sm text-gray-500">
            Manage contacts who can be reached in case of emergency
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-info-50 border-info-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-info-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-info-800">
                Your emergency contacts will be notified in case of any issues during transport.
                Make sure at least one contact is designated as the primary.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Contact */}
      {primaryContact && (
        <Card className="border-primary-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary-500 fill-primary-500" />
                Primary Emergency Contact
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{primaryContact.name}</h3>
                  <p className="text-sm text-gray-500">{primaryContact.relationship}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{primaryContact.phone}</span>
                    </div>
                    {primaryContact.altPhone && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{primaryContact.altPhone} (Alt)</span>
                      </div>
                    )}
                    {primaryContact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{primaryContact.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {primaryContact.canReceiveUpdates && (
                      <Badge variant="secondary">Receives Updates</Badge>
                    )}
                    {primaryContact.canAuthorizeTrips && (
                      <Badge variant="secondary">Can Authorize Trips</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(primaryContact)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Contacts */}
      {otherContacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              Additional Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {otherContacts.map((contact) => (
                <div key={contact.id} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {contact.phone}
                        </span>
                        {contact.email && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {contact.email}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {contact.canReceiveUpdates && (
                          <Badge variant="outline" className="text-xs">Receives Updates</Badge>
                        )}
                        {contact.canAuthorizeTrips && (
                          <Badge variant="outline" className="text-xs">Can Authorize</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetPrimary(contact.id)}
                      title="Set as primary"
                    >
                      <StarOff className="h-4 w-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(contact)}
                      className="text-error-600 hover:bg-error-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {contacts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Emergency Contacts</h3>
            <p className="text-gray-500 mb-4">
              Add at least one emergency contact for your safety
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Emergency Contact
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showEditDialog ? 'Edit Contact' : 'Add Emergency Contact'}
            </DialogTitle>
            <DialogDescription>
              {showEditDialog
                ? 'Update the contact information below.'
                : 'Enter the details of your emergency contact.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="relationship">Relationship *</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(v) => setFormData({ ...formData, relationship: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationships.map((rel) => (
                      <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altPhone">Alternate Phone</Label>
                <Input
                  id="altPhone"
                  type="tel"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="canReceiveUpdates"
                  checked={formData.canReceiveUpdates}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, canReceiveUpdates: checked === true })
                  }
                />
                <Label htmlFor="canReceiveUpdates" className="cursor-pointer">
                  <span className="font-medium">Receive trip updates</span>
                  <p className="text-sm text-gray-500">Will receive notifications about trip status</p>
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="canAuthorizeTrips"
                  checked={formData.canAuthorizeTrips}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, canAuthorizeTrips: checked === true })
                  }
                />
                <Label htmlFor="canAuthorizeTrips" className="cursor-pointer">
                  <span className="font-medium">Can authorize trips</span>
                  <p className="text-sm text-gray-500">Can book and modify trips on your behalf</p>
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setShowEditDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={showEditDialog ? handleEdit : handleAdd}
              disabled={!formData.name || !formData.relationship || !formData.phone}
            >
              {showEditDialog ? 'Save Changes' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-error-600">Remove Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedContact?.name} from your emergency contacts?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

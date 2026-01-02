'use client';

import * as React from 'react';
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Phone,
  Mail,
  MapPin,
  Edit,
  Check,
  X,
  Plus,
  Loader2,
  AlertCircle,
  Wheelchair,
  Heart,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PaymentMethods } from '@/components/domain/payment-methods';
import { FamilyMemberLinker } from '@/components/domain/family-member-linker';

// Mock user data
const mockUser = {
  id: 'user-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  phone: '(555) 123-4567',
  dateOfBirth: '1955-03-15',
  address: '123 Main Street, Houston, TX 77001',
};

const mockMedicalProfile = {
  mobilityStatus: 'wheelchair',
  requiresOxygen: false,
  requiresAttendant: true,
  specialNeeds: 'Needs extra time for transfers',
  allergies: 'None',
  medications: 'Blood pressure medication',
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '(555) 987-6543',
  },
};

const mockNotificationPrefs = {
  tripReminders: true,
  smsNotifications: true,
  emailNotifications: true,
  reminderHours: 24,
};

export default function PatientSettingsPage() {
  const [user] = React.useState(mockUser);
  const [medicalProfile, setMedicalProfile] = React.useState(mockMedicalProfile);
  const [notificationPrefs, setNotificationPrefs] = React.useState(mockNotificationPrefs);
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = React.useState(false);
  const [showEditMedicalDialog, setShowEditMedicalDialog] = React.useState(false);
  const [showEditEmergencyDialog, setShowEditEmergencyDialog] = React.useState(false);

  // Edit form state
  const [editForm, setEditForm] = React.useState({
    phone: user.phone,
    email: user.email,
    address: user.address,
  });

  const [medicalForm, setMedicalForm] = React.useState(medicalProfile);
  const [emergencyForm, setEmergencyForm] = React.useState(medicalProfile.emergencyContact);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowEditProfileDialog(false);
  };

  const handleSaveMedical = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMedicalProfile(medicalForm);
    setIsSaving(false);
    setShowEditMedicalDialog(false);
  };

  const handleSaveEmergency = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMedicalProfile((prev) => ({
      ...prev,
      emergencyContact: emergencyForm,
    }));
    setIsSaving(false);
    setShowEditEmergencyDialog(false);
  };

  const handleNotificationChange = (key: keyof typeof notificationPrefs, value: boolean | number) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-2">
            <Heart className="h-4 w-4" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="family" className="gap-2">
            <Users className="h-4 w-4" />
            Family
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
                </div>
                <Button variant="secondary" onClick={() => setShowEditProfileDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar size="lg" className="h-20 w-20">
                  <AvatarFallback className="text-xl">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-4 flex-1 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">
                      {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{user.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                </div>
                <Button variant="secondary">Change Password</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <Badge variant="warning">Not Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Tab */}
        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wheelchair className="h-5 w-5" />
                    Mobility & Medical Needs
                  </CardTitle>
                  <CardDescription>Information used to match you with appropriate transportation</CardDescription>
                </div>
                <Button variant="secondary" onClick={() => setShowEditMedicalDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mobility Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="info" className="capitalize">
                      {medicalProfile.mobilityStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Requires Attendant</label>
                  <p className="text-gray-900">{medicalProfile.requiresAttendant ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Oxygen Required</label>
                  <p className="text-gray-900">{medicalProfile.requiresOxygen ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Allergies</label>
                  <p className="text-gray-900">{medicalProfile.allergies || 'None listed'}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Special Needs</label>
                  <p className="text-gray-900">{medicalProfile.specialNeeds || 'None listed'}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Medications</label>
                  <p className="text-gray-900">{medicalProfile.medications || 'None listed'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                  <CardDescription>Who to contact in case of emergency</CardDescription>
                </div>
                <Button variant="secondary" onClick={() => setShowEditEmergencyDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{medicalProfile.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="text-gray-900">{medicalProfile.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{medicalProfile.emergencyContact.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6">
          <PaymentMethods userId={user.id} />

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your past payments and invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No billing history available</p>
                <p className="text-sm mt-1">Your payment history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Reminders</CardTitle>
              <CardDescription>Get notified before your scheduled trips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Enable Trip Reminders</p>
                  <p className="text-sm text-gray-500">
                    Receive reminders before your scheduled pickups
                  </p>
                </div>
                <Switch
                  checked={notificationPrefs.tripReminders}
                  onCheckedChange={(checked) => handleNotificationChange('tripReminders', checked)}
                />
              </div>

              {notificationPrefs.tripReminders && (
                <div className="pl-4 border-l-2 border-gray-200 space-y-4">
                  <div>
                    <Label>Reminder Time</Label>
                    <Select
                      value={notificationPrefs.reminderHours.toString()}
                      onValueChange={(v) => handleNotificationChange('reminderHours', parseInt(v))}
                    >
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour before</SelectItem>
                        <SelectItem value="2">2 hours before</SelectItem>
                        <SelectItem value="24">24 hours before</SelectItem>
                        <SelectItem value="48">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive text messages to {user.phone}</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPrefs.smsNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-info-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive emails to {user.email}</p>
                  </div>
                </div>
                <Switch
                  checked={notificationPrefs.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Tab */}
        <TabsContent value="family" className="space-y-6">
          <FamilyMemberLinker patientId={user.id} />
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfileDialog} onOpenChange={setShowEditProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your contact information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowEditProfileDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Medical Dialog */}
      <Dialog open={showEditMedicalDialog} onOpenChange={setShowEditMedicalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Medical Information</DialogTitle>
            <DialogDescription>Update your mobility and medical needs</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Mobility Status</Label>
              <Select
                value={medicalForm.mobilityStatus}
                onValueChange={(v) => setMedicalForm({ ...medicalForm, mobilityStatus: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambulatory">Ambulatory</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair</SelectItem>
                  <SelectItem value="stretcher">Stretcher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Requires Attendant</Label>
              <Switch
                checked={medicalForm.requiresAttendant}
                onCheckedChange={(v) => setMedicalForm({ ...medicalForm, requiresAttendant: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Requires Oxygen</Label>
              <Switch
                checked={medicalForm.requiresOxygen}
                onCheckedChange={(v) => setMedicalForm({ ...medicalForm, requiresOxygen: v })}
              />
            </div>
            <div>
              <Label>Allergies</Label>
              <Input
                value={medicalForm.allergies}
                onChange={(e) => setMedicalForm({ ...medicalForm, allergies: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Special Needs</Label>
              <Textarea
                value={medicalForm.specialNeeds}
                onChange={(e) => setMedicalForm({ ...medicalForm, specialNeeds: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Medications</Label>
              <Textarea
                value={medicalForm.medications}
                onChange={(e) => setMedicalForm({ ...medicalForm, medications: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowEditMedicalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMedical} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Emergency Contact Dialog */}
      <Dialog open={showEditEmergencyDialog} onOpenChange={setShowEditEmergencyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>Update your emergency contact information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Contact Name</Label>
              <Input
                value={emergencyForm.name}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Select
                value={emergencyForm.relationship}
                onValueChange={(v) => setEmergencyForm({ ...emergencyForm, relationship: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Caregiver">Caregiver</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={emergencyForm.phone}
                onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowEditEmergencyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmergency} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

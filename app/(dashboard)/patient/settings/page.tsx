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
  Loader2,
  Accessibility,
  Heart,
  Users,
  AlertCircle,
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
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaymentMethods } from '@/components/domain/payment-methods';
import { FamilyMemberLinker } from '@/components/domain/family-member-linker';
import { toast } from '@/components/ui/toast';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
}

interface MedicalProfile {
  mobilityStatus: string;
  requiresOxygen: boolean;
  requiresAttendant: boolean;
  specialNeeds: string;
  allergies: string;
  medications: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface NotificationPrefs {
  tripReminders: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  reminderHours: number;
}

export default function PatientSettingsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Profile state
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [medicalProfile, setMedicalProfile] = React.useState<MedicalProfile | null>(null);
  const [emergencyContact, setEmergencyContact] = React.useState<EmergencyContact | null>(null);
  const [notificationPrefs, setNotificationPrefs] = React.useState<NotificationPrefs>({
    tripReminders: true,
    smsNotifications: true,
    emailNotifications: true,
    reminderHours: 24,
  });

  // Dialog state
  const [showEditProfileDialog, setShowEditProfileDialog] = React.useState(false);
  const [showEditMedicalDialog, setShowEditMedicalDialog] = React.useState(false);
  const [showEditEmergencyDialog, setShowEditEmergencyDialog] = React.useState(false);

  // Edit form state
  const [editForm, setEditForm] = React.useState({
    phone: '',
    email: '',
    address: '',
  });
  const [medicalForm, setMedicalForm] = React.useState<MedicalProfile>({
    mobilityStatus: 'ambulatory',
    requiresOxygen: false,
    requiresAttendant: false,
    specialNeeds: '',
    allergies: '',
    medications: '',
  });
  const [emergencyForm, setEmergencyForm] = React.useState<EmergencyContact>({
    name: '',
    relationship: '',
    phone: '',
  });

  // Fetch profile data
  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/v1/patients/me');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const { data } = await response.json();

      setUser({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
      });

      if (data.medicalProfile) {
        setMedicalProfile({
          mobilityStatus: data.medicalProfile.mobilityStatus || 'ambulatory',
          requiresOxygen: data.medicalProfile.requiresOxygen || false,
          requiresAttendant: data.medicalProfile.requiresAttendant || false,
          specialNeeds: data.medicalProfile.specialNeeds || '',
          allergies: data.medicalProfile.allergies || '',
          medications: data.medicalProfile.medications || '',
        });
      }

      if (data.emergencyContact) {
        setEmergencyContact(data.emergencyContact);
      }

      if (data.notificationPreferences) {
        setNotificationPrefs(data.notificationPreferences);
      }

      // Initialize edit forms
      setEditForm({
        phone: data.phone || '',
        email: data.email || '',
        address: data.address
          ? `${data.address.addressLine1}, ${data.address.city}, ${data.address.state} ${data.address.zipCode}`
          : '',
      });

      if (data.medicalProfile) {
        setMedicalForm({
          mobilityStatus: data.medicalProfile.mobilityStatus || 'ambulatory',
          requiresOxygen: data.medicalProfile.requiresOxygen || false,
          requiresAttendant: data.medicalProfile.requiresAttendant || false,
          specialNeeds: data.medicalProfile.specialNeeds || '',
          allergies: data.medicalProfile.allergies || '',
          medications: data.medicalProfile.medications || '',
        });
      }

      if (data.emergencyContact) {
        setEmergencyForm(data.emergencyContact);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/v1/patients/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            phone: editForm.phone,
            email: editForm.email,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update local state
      setUser((prev) => prev ? { ...prev, phone: editForm.phone, email: editForm.email } : null);
      setShowEditProfileDialog(false);

      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMedical = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/v1/patients/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicalProfile: medicalForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update medical profile');
      }

      setMedicalProfile(medicalForm);
      setShowEditMedicalDialog(false);

      toast.success('Medical information updated successfully');
    } catch (err) {
      console.error('Error updating medical profile:', err);
      toast.error('Failed to update medical information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmergency = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/v1/patients/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyContact: emergencyForm,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update emergency contact');
      }

      setEmergencyContact(emergencyForm);
      setShowEditEmergencyDialog(false);

      toast.success('Emergency contact updated successfully');
    } catch (err) {
      console.error('Error updating emergency contact:', err);
      toast.error('Failed to update emergency contact. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (key: keyof NotificationPrefs, value: boolean | number) => {
    const newPrefs = { ...notificationPrefs, [key]: value };
    setNotificationPrefs(newPrefs);

    try {
      const response = await fetch('/api/v1/patients/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationPreferences: newPrefs,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      toast.success('Notification preferences saved');
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      // Revert on error
      setNotificationPrefs(notificationPrefs);
      toast.error('Failed to update preferences. Please try again.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Unable to load profile'}
            <Button variant="link" className="ml-2 p-0" onClick={fetchProfile}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatAddress = () => {
    if (!user.address) return 'No address on file';
    return `${user.address.addressLine1}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`;
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
                <Avatar className="h-20 w-20">
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
                      {user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Not provided'}
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
                      <p className="text-gray-900">{formatAddress()}</p>
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
                    <Accessibility className="h-5 w-5" />
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
              {medicalProfile ? (
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
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No medical information on file</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowEditMedicalDialog(true)}
                  >
                    Add Medical Info
                  </Button>
                </div>
              )}
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
              {emergencyContact ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relationship</label>
                    <p className="text-gray-900">{emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{emergencyContact.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No emergency contact on file</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowEditEmergencyDialog(true)}
                  >
                    Add Emergency Contact
                  </Button>
                </div>
              )}
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
                  <SelectValue placeholder="Select relationship" />
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

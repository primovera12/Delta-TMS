'use client';

import * as React from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Shield,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface MedicalProfile {
  mobilityStatus: string;
  mobilityAids: string[];
  requiresOxygen: boolean;
  requiresAttendant: boolean;
  wheelchairType: string | null;
  allergies: string[];
  medications: string[];
  specialNeeds: string;
  weightLbs: number | null;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addresses: Address[];
  medicalProfile: MedicalProfile;
  emergencyContact: EmergencyContact;
}

// Mock data
const mockProfile: PatientProfile = {
  id: '1',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@email.com',
  phone: '(555) 123-4567',
  dateOfBirth: '1955-03-15',
  addresses: [
    {
      id: '1',
      label: 'Home',
      addressLine1: '123 Oak Street',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Daughter\'s House',
      addressLine1: '456 Elm Avenue',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002',
      isDefault: false,
    },
  ],
  medicalProfile: {
    mobilityStatus: 'wheelchair',
    mobilityAids: ['Manual Wheelchair'],
    requiresOxygen: false,
    requiresAttendant: false,
    wheelchairType: 'standard',
    allergies: ['Penicillin'],
    medications: ['Metformin', 'Lisinopril'],
    specialNeeds: 'Patient prefers to sit on the right side of the vehicle.',
    weightLbs: 175,
  },
  emergencyContact: {
    name: 'Mary Smith',
    relationship: 'Daughter',
    phone: '(555) 234-5678',
  },
};

export default function PatientProfilePage() {
  const [profile, setProfile] = React.useState<PatientProfile>(mockProfile);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Temporary form data for editing
  const [formData, setFormData] = React.useState(profile);

  const handleStartEdit = () => {
    setFormData(profile);
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProfile(formData);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={handleStartEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCancelEdit} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4 text-success-600" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar size="xl">
              <AvatarFallback className="text-2xl">
                {profile.firstName[0]}{profile.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                {calculateAge(profile.dateOfBirth)} years old | DOB: {formatDate(profile.dateOfBirth)}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {profile.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {profile.email}
                </div>
              </div>
            </div>
            <Badge variant="success" className="text-sm">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  {isEditing ? (
                    <Input
                      className="mt-1.5"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.firstName}</p>
                  )}
                </div>
                <div>
                  <Label>Last Name</Label>
                  {isEditing ? (
                    <Input
                      className="mt-1.5"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.lastName}</p>
                  )}
                </div>
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      className="mt-1.5"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.email}</p>
                  )}
                </div>
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      className="mt-1.5"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.phone}</p>
                  )}
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      className="mt-1.5"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{formatDate(profile.dateOfBirth)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Profile Tab */}
        <TabsContent value="medical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-error-500" />
                Medical Information
              </CardTitle>
              <CardDescription>
                This information helps us provide the right vehicle and assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Mobility Status</Label>
                  {isEditing ? (
                    <Select
                      value={formData.medicalProfile.mobilityStatus}
                      onValueChange={(v) => setFormData({
                        ...formData,
                        medicalProfile: { ...formData.medicalProfile, mobilityStatus: v }
                      })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ambulatory">Ambulatory</SelectItem>
                        <SelectItem value="wheelchair">Wheelchair</SelectItem>
                        <SelectItem value="stretcher">Stretcher</SelectItem>
                        <SelectItem value="bariatric">Bariatric</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1.5">
                      <Badge variant="secondary" className="capitalize">
                        {profile.medicalProfile.mobilityStatus}
                      </Badge>
                    </p>
                  )}
                </div>
                <div>
                  <Label>Weight (lbs)</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      className="mt-1.5"
                      value={formData.medicalProfile.weightLbs || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        medicalProfile: { ...formData.medicalProfile, weightLbs: parseInt(e.target.value) || null }
                      })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">
                      {profile.medicalProfile.weightLbs ? `${profile.medicalProfile.weightLbs} lbs` : 'Not specified'}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <Label>Requires Oxygen</Label>
                    <p className="text-sm text-gray-500">Portable oxygen during transport</p>
                  </div>
                  {isEditing ? (
                    <Switch
                      checked={formData.medicalProfile.requiresOxygen}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        medicalProfile: { ...formData.medicalProfile, requiresOxygen: checked }
                      })}
                    />
                  ) : (
                    <Badge variant={profile.medicalProfile.requiresOxygen ? 'warning' : 'secondary'}>
                      {profile.medicalProfile.requiresOxygen ? 'Yes' : 'No'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                  <div>
                    <Label>Requires Attendant</Label>
                    <p className="text-sm text-gray-500">Caregiver accompanies during trips</p>
                  </div>
                  {isEditing ? (
                    <Switch
                      checked={formData.medicalProfile.requiresAttendant}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        medicalProfile: { ...formData.medicalProfile, requiresAttendant: checked }
                      })}
                    />
                  ) : (
                    <Badge variant={profile.medicalProfile.requiresAttendant ? 'warning' : 'secondary'}>
                      {profile.medicalProfile.requiresAttendant ? 'Yes' : 'No'}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label>Allergies</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {profile.medicalProfile.allergies.length > 0 ? (
                    profile.medicalProfile.allergies.map((allergy, i) => (
                      <Badge key={i} variant="error">{allergy}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">None listed</span>
                  )}
                </div>
              </div>

              <div>
                <Label>Special Instructions</Label>
                {isEditing ? (
                  <Textarea
                    className="mt-1.5"
                    rows={3}
                    value={formData.medicalProfile.specialNeeds}
                    onChange={(e) => setFormData({
                      ...formData,
                      medicalProfile: { ...formData.medicalProfile, specialNeeds: e.target.value }
                    })}
                  />
                ) : (
                  <p className="mt-1.5 text-gray-900">
                    {profile.medicalProfile.specialNeeds || 'None'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-500" />
                  Saved Addresses
                </CardTitle>
                {isEditing && (
                  <Button size="sm" variant="secondary">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Address
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 rounded-lg border ${address.isDefault ? 'border-primary-200 bg-primary-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{address.label}</span>
                          {address.isDefault && (
                            <Badge variant="default" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.addressLine1}
                          {address.addressLine2 && `, ${address.addressLine2}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-error-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contact Tab */}
        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-warning-500" />
                Emergency Contact
              </CardTitle>
              <CardDescription>
                This person will be contacted in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      className="mt-1.5"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.emergencyContact.name}</p>
                  )}
                </div>
                <div>
                  <Label>Relationship</Label>
                  {isEditing ? (
                    <Input
                      className="mt-1.5"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.emergencyContact.relationship}</p>
                  )}
                </div>
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      type="tel"
                      className="mt-1.5"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                      })}
                    />
                  ) : (
                    <p className="mt-1.5 text-gray-900">{profile.emergencyContact.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

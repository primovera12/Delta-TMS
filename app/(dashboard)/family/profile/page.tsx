'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  Bell,
  Key,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

interface FamilyProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  avatar?: string;
  linkedPatientsCount: number;
  accountCreated: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const mockProfile: FamilyProfile = {
  id: '1',
  firstName: 'Jennifer',
  lastName: 'Johnson',
  email: 'jennifer.johnson@email.com',
  phone: '(555) 987-6543',
  address: '456 Family Lane',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  linkedPatientsCount: 3,
  accountCreated: '2023-06-15',
  notificationPreferences: {
    email: true,
    sms: true,
    push: false,
  },
};

export default function FamilyProfilePage() {
  const [profile, setProfile] = React.useState<FamilyProfile>(mockProfile);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState(profile);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof typeof profile.notificationPreferences) => {
    setProfile((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {profile.avatar ? (
                    <AvatarImage src={profile.avatar} alt={profile.firstName} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <button
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                  aria-label="Change avatar"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 text-center">
                <Badge variant="success">Family Coordinator</Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {profile.linkedPatientsCount} linked patients
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editedProfile.firstName}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, firstName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{profile.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, email: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedProfile.address}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, address: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-sm font-medium text-gray-900">
                        {profile.address}, {profile.city}, {profile.state} {profile.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editedProfile.lastName}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, lastName: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{profile.lastName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, phone: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editedProfile.city}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, city: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={editedProfile.state}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, state: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={editedProfile.zipCode}
                          onChange={(e) =>
                            setEditedProfile({ ...editedProfile, zipCode: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-500" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to receive updates about rides</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive ride confirmations and updates via email</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.email}
              onCheckedChange={() => handleNotificationChange('email')}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Get text messages for ride reminders and driver updates</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.sms}
              onCheckedChange={() => handleNotificationChange('sms')}
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive instant notifications in your browser</p>
            </div>
            <Switch
              checked={profile.notificationPreferences.push}
              onCheckedChange={() => handleNotificationChange('push')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success-500" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="font-medium text-gray-900">
                {new Date(profile.accountCreated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Button variant="ghost" className="text-error-600 hover:text-error-700 hover:bg-error-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

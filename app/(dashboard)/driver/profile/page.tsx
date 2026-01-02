'use client';

import * as React from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Calendar,
  Star,
  Award,
  Clock,
  Edit2,
  Camera,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock driver data
const driverData = {
  id: 'DRV-001',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@delta-tms.com',
  phone: '(555) 123-4567',
  address: '123 Driver Lane, Houston, TX 77001',
  emergencyContact: {
    name: 'Jane Smith',
    phone: '(555) 987-6543',
    relationship: 'Spouse',
  },
  dateOfBirth: '1985-03-15',
  licenseNumber: 'DL12345678',
  licenseExpiry: '2027-03-15',
  hireDate: '2023-06-01',
  vehicleType: 'wheelchair',
  status: 'active',
  avatar: null,
  stats: {
    totalTrips: 2450,
    thisMonth: 145,
    rating: 4.9,
    onTimeRate: 97,
    hoursThisWeek: 42,
    yearsOfService: 2.5,
  },
  achievements: [
    { id: 1, name: 'Perfect Week', description: '100% on-time for 7 days', date: '2026-01-10' },
    { id: 2, name: '1000 Trips', description: 'Completed 1000 trips', date: '2024-08-15' },
    { id: 3, name: 'Top Rated', description: '5-star rating for 30 days', date: '2025-11-20' },
  ],
  complianceStatus: {
    license: 'valid',
    insurance: 'expiring',
    backgroundCheck: 'valid',
    medicalCert: 'valid',
  },
};

export default function DriverProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: driverData.firstName,
    lastName: driverData.lastName,
    email: driverData.email,
    phone: driverData.phone,
    address: driverData.address,
    emergencyContactName: driverData.emergencyContact.name,
    emergencyContactPhone: driverData.emergencyContact.phone,
    emergencyContactRelationship: driverData.emergencyContact.relationship,
  });

  const handleSave = () => {
    // Save profile changes
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      firstName: driverData.firstName,
      lastName: driverData.lastName,
      email: driverData.email,
      phone: driverData.phone,
      address: driverData.address,
      emergencyContactName: driverData.emergencyContact.name,
      emergencyContactPhone: driverData.emergencyContact.phone,
      emergencyContactRelationship: driverData.emergencyContact.relationship,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
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
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
                <div className="relative">
                  <Avatar size="xl">
                    {driverData.avatar ? (
                      <AvatarImage src={driverData.avatar} alt={`${driverData.firstName} ${driverData.lastName}`} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {driverData.firstName[0]}{driverData.lastName[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {driverData.firstName} {driverData.lastName}
                    </h2>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="text-gray-500 mb-2">Driver ID: {driverData.id}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Since {driverData.hireDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span className="capitalize">{driverData.vehicleType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="pt-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{formData.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{formData.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{formData.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{formData.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-2" />
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{formData.address}</p>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      {isEditing ? (
                        <Input
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{formData.emergencyContactName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      {isEditing ? (
                        <Input
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        />
                      ) : (
                        <p className="py-2 text-gray-900">{formData.emergencyContactPhone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      {isEditing ? (
                        <Select
                          value={formData.emergencyContactRelationship}
                          onValueChange={(value) => setFormData({ ...formData, emergencyContactRelationship: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Spouse">Spouse</SelectItem>
                            <SelectItem value="Parent">Parent</SelectItem>
                            <SelectItem value="Sibling">Sibling</SelectItem>
                            <SelectItem value="Friend">Friend</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="py-2 text-gray-900">{formData.emergencyContactRelationship}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {driverData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary-500 text-white flex items-center justify-center mb-3">
                      <Award className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-warning-500" />
                  <span className="text-gray-600">Rating</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{driverData.stats.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success-500" />
                  <span className="text-gray-600">On-Time Rate</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{driverData.stats.onTimeRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">Total Trips</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{driverData.stats.totalTrips.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-info-500" />
                  <span className="text-gray-600">This Month</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{driverData.stats.thisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">Hours This Week</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{driverData.stats.hoursThisWeek}h</span>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(driverData.complianceStatus).map(([key, status]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge
                    variant={
                      status === 'valid'
                        ? 'success'
                        : status === 'expiring'
                        ? 'warning'
                        : 'error'
                    }
                    size="sm"
                  >
                    {status === 'valid' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {status}
                  </Badge>
                </div>
              ))}
              <Button variant="secondary" className="w-full mt-4" asChild>
                <a href="/driver/documents">View Documents</a>
              </Button>
            </CardContent>
          </Card>

          {/* License Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">License Number</span>
                <span className="font-medium text-gray-900">{driverData.licenseNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expiration</span>
                <span className="font-medium text-gray-900">{driverData.licenseExpiry}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-medium text-gray-900">{driverData.dateOfBirth}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

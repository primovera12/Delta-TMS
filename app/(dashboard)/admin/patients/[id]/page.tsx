'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Car,
  User,
  Heart,
  FileText,
  Edit,
  Clock,
  AlertCircle,
  Loader2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  savedAddresses: Array<{
    id: string;
    label: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
  emergencyContact: {
    name: string | null;
    relationship: string | null;
    phone: string | null;
  } | null;
  medicalProfile: {
    mobilityStatus: string;
    mobilityAids: string[];
    wheelchairType: string | null;
    requiresOxygen: boolean;
    requiresAttendant: boolean;
    specialNeeds: string;
    allergies: string[];
    medications: string[];
    medicalConditions: string[];
  } | null;
  status: string;
  stats: {
    totalTrips: number;
    upcomingTrips: number;
    cancelledTrips: number;
  };
  createdAt: string;
  updatedAt: string;
}

const transportTypeColors: Record<string, string> = {
  ambulatory: 'bg-success-100 text-success-700',
  wheelchair: 'bg-info-100 text-info-700',
  stretcher: 'bg-warning-100 text-warning-700',
  bariatric: 'bg-purple-100 text-purple-700',
};

export default function AdminPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/patients/${patientId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Patient not found');
          }
          throw new Error('Failed to fetch patient');
        }
        const data = await response.json();
        setPatient(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Patient not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const age = patient.dateOfBirth
    ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="text-2xl font-semibold text-gray-900">Patient Details</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
          <Button asChild>
            <Link href={`/dispatcher/trips/new?patient=${patient.id}`}>
              <Plus className="h-4 w-4 mr-2" />
              Book Trip
            </Link>
          </Button>
        </div>
      </div>

      {/* Patient Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar size="xl">
                <AvatarFallback className="text-xl">
                  {patient.firstName[0]}{patient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                  <Badge variant={patient.status === 'ACTIVE' || patient.status === 'active' ? 'success' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {patient.id.slice(0, 8)}...{age !== null ? ` | Age: ${age}` : ''}
                  {patient.dateOfBirth && ` | DOB: ${patient.dateOfBirth}`}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{patient.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {patient.address
                        ? `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`
                        : 'No address'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trip Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Total Trips</span>
                </div>
                <span className="font-semibold">{patient.stats.totalTrips}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Upcoming</span>
                </div>
                <span className="font-semibold text-primary-600">{patient.stats.upcomingTrips}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="font-semibold text-error-600">{patient.stats.cancelledTrips}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="medical">
        <TabsList>
          <TabsTrigger value="medical">Medical Profile</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
          <TabsTrigger value="addresses">Saved Addresses</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
        </TabsList>

        <TabsContent value="medical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-error-500" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.medicalProfile ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Mobility Status</h4>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${transportTypeColors[patient.medicalProfile.mobilityStatus] || 'bg-gray-100 text-gray-700'}`}>
                      {patient.medicalProfile.mobilityStatus}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Mobility Aids</h4>
                    <div className="flex flex-wrap gap-1">
                      {patient.medicalProfile.mobilityAids.length > 0 ? (
                        patient.medicalProfile.mobilityAids.map((aid) => (
                          <Badge key={aid} variant="secondary">{aid}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Requires Oxygen</h4>
                    <Badge variant={patient.medicalProfile.requiresOxygen ? 'warning' : 'secondary'}>
                      {patient.medicalProfile.requiresOxygen ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Requires Attendant</h4>
                    <Badge variant={patient.medicalProfile.requiresAttendant ? 'warning' : 'secondary'}>
                      {patient.medicalProfile.requiresAttendant ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  {patient.medicalProfile.allergies.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Allergies</h4>
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalProfile.allergies.map((allergy) => (
                          <Badge key={allergy} variant="error">{allergy}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {patient.medicalProfile.specialNeeds && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Special Needs / Notes</h4>
                      <p className="text-sm text-gray-700">{patient.medicalProfile.specialNeeds}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No medical profile on file</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-warning-500" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.emergencyContact?.name ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                    <p className="text-sm">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Relationship</h4>
                    <p className="text-sm">{patient.emergencyContact.relationship || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                    <p className="text-sm">{patient.emergencyContact.phone || 'Not specified'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No emergency contact on file</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                Saved Addresses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.savedAddresses && patient.savedAddresses.length > 0 ? (
                <div className="space-y-3">
                  {patient.savedAddresses.map((addr) => (
                    <div key={addr.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                      <div>
                        <Badge variant="secondary" className="mb-1">{addr.label}</Badge>
                        <p className="text-sm text-gray-700">
                          {addr.addressLine1}, {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No saved addresses</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-success-500" />
                Recent Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Trip history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

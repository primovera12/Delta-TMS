'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Car,
  AlertCircle,
  Heart,
  FileText,
  ChevronLeft,
  Edit2,
  Plus,
  Activity,
  Pill,
  Shield,
  Users,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PatientDetail {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalProfile: {
    transportType: string;
    conditions: string[];
    medications: string[];
    allergies: string[];
    mobility: string;
    oxygenRequired: boolean;
    specialNeeds: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    authorizationNumber?: string;
  };
  stats: {
    totalTrips: number;
    upcomingTrips: number;
    completedThisMonth: number;
    noShows: number;
    onTimeRate: number;
  };
}

interface TripHistory {
  id: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  status: 'completed' | 'cancelled' | 'no-show' | 'scheduled';
  driver: string;
  tripType: string;
}

const mockPatient: PatientDetail = {
  id: '1',
  firstName: 'Robert',
  lastName: 'Johnson',
  dateOfBirth: '1945-03-15',
  gender: 'Male',
  phone: '(555) 123-4567',
  email: 'robert.johnson@email.com',
  address: '123 Oak Street, Springfield, IL 62701',
  emergencyContact: {
    name: 'Sarah Johnson',
    relationship: 'Daughter',
    phone: '(555) 987-6543',
  },
  medicalProfile: {
    transportType: 'Wheelchair',
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Mobility Impairment'],
    medications: ['Metformin', 'Lisinopril', 'Aspirin'],
    allergies: ['Penicillin', 'Shellfish'],
    mobility: 'Requires wheelchair assistance',
    oxygenRequired: false,
    specialNeeds: 'Needs assistance entering/exiting vehicle. Cannot climb stairs.',
  },
  insurance: {
    provider: 'Medicare',
    policyNumber: 'MED-2024-5678',
    groupNumber: 'GRP-001',
    authorizationNumber: 'AUTH-12345',
  },
  stats: {
    totalTrips: 156,
    upcomingTrips: 3,
    completedThisMonth: 8,
    noShows: 2,
    onTimeRate: 96,
  },
};

const mockTripHistory: TripHistory[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '9:00 AM',
    pickup: '123 Oak Street, Springfield, IL',
    destination: 'Regional Dialysis Center',
    status: 'scheduled',
    driver: 'John Smith',
    tripType: 'Dialysis',
  },
  {
    id: '2',
    date: '2024-01-12',
    time: '9:00 AM',
    pickup: '123 Oak Street, Springfield, IL',
    destination: 'Regional Dialysis Center',
    status: 'completed',
    driver: 'John Smith',
    tripType: 'Dialysis',
  },
  {
    id: '3',
    date: '2024-01-10',
    time: '2:00 PM',
    pickup: '123 Oak Street, Springfield, IL',
    destination: 'City Medical Center',
    status: 'completed',
    driver: 'Sarah Johnson',
    tripType: 'Doctor Visit',
  },
  {
    id: '4',
    date: '2024-01-08',
    time: '9:00 AM',
    pickup: '123 Oak Street, Springfield, IL',
    destination: 'Regional Dialysis Center',
    status: 'completed',
    driver: 'Mike Davis',
    tripType: 'Dialysis',
  },
  {
    id: '5',
    date: '2024-01-05',
    time: '9:00 AM',
    pickup: '123 Oak Street, Springfield, IL',
    destination: 'Regional Dialysis Center',
    status: 'no-show',
    driver: 'John Smith',
    tripType: 'Dialysis',
  },
];

export default function FacilityPatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [patient] = React.useState<PatientDetail>(mockPatient);
  const [tripHistory] = React.useState<TripHistory[]>(mockTripHistory);
  const [activeTab, setActiveTab] = React.useState('overview');

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'scheduled':
        return <Badge variant="info">Scheduled</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {calculateAge(patient.dateOfBirth)} years old
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {patient.gender}
                    </span>
                    <Badge variant="info">{patient.medicalProfile.transportType}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={() => router.push(`/facility/book?patientId=${patient.id}`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Ride
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{patient.stats.totalTrips}</p>
                  <p className="text-xs text-gray-500">Total Trips</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{patient.stats.upcomingTrips}</p>
                  <p className="text-xs text-gray-500">Upcoming</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-success-600">{patient.stats.onTimeRate}%</p>
                  <p className="text-xs text-gray-500">On-Time Rate</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-warning-600">{patient.stats.noShows}</p>
                  <p className="text-xs text-gray-500">No Shows</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical Profile</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{patient.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-error-500" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{patient.emergencyContact.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">{patient.emergencyContact.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{patient.emergencyContact.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Trips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-500" />
                Upcoming Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tripHistory
                  .filter((t) => t.status === 'scheduled')
                  .map((trip) => (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{trip.destination}</p>
                          <p className="text-sm text-gray-500">
                            {trip.date} at {trip.time} • {trip.tripType}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(trip.status)}
                    </div>
                  ))}
                {tripHistory.filter((t) => t.status === 'scheduled').length === 0 && (
                  <p className="text-center text-gray-500 py-4">No upcoming trips scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Profile Tab */}
        <TabsContent value="medical" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Medical Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-error-500" />
                  Medical Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalProfile.conditions.map((condition) => (
                    <Badge key={condition} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-info-500" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalProfile.medications.map((medication) => (
                    <Badge key={medication} variant="secondary">
                      {medication}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning-500" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalProfile.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transport Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary-500" />
                  Transport Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Transport Type</p>
                  <Badge variant="info">{patient.medicalProfile.transportType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobility</p>
                  <p className="text-sm font-medium">{patient.medicalProfile.mobility}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Oxygen Required</p>
                  <Badge variant={patient.medicalProfile.oxygenRequired ? 'warning' : 'secondary'}>
                    {patient.medicalProfile.oxygenRequired ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Needs */}
          {patient.medicalProfile.specialNeeds && (
            <Card className="border-warning-200 bg-warning-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning-900">Special Needs & Instructions</p>
                    <p className="text-sm text-warning-800 mt-1">{patient.medicalProfile.specialNeeds}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trip History Tab */}
        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary-500" />
                Trip History
              </CardTitle>
              <CardDescription>Complete history of all trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tripHistory.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        trip.status === 'completed'
                          ? 'bg-success-100'
                          : trip.status === 'scheduled'
                          ? 'bg-primary-100'
                          : trip.status === 'no-show'
                          ? 'bg-error-100'
                          : 'bg-gray-100'
                      }`}>
                        <Car className={`h-5 w-5 ${
                          trip.status === 'completed'
                            ? 'text-success-600'
                            : trip.status === 'scheduled'
                            ? 'text-primary-600'
                            : trip.status === 'no-show'
                            ? 'text-error-600'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{trip.destination}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{trip.date}</span>
                          <span>•</span>
                          <span>{trip.time}</span>
                          <span>•</span>
                          <span>{trip.tripType}</span>
                        </div>
                        <p className="text-sm text-gray-400">Driver: {trip.driver}</p>
                      </div>
                    </div>
                    {getStatusBadge(trip.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Tab */}
        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-success-500" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Insurance Provider</p>
                    <p className="font-medium text-gray-900">{patient.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Policy Number</p>
                    <p className="font-medium text-gray-900">{patient.insurance.policyNumber}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Group Number</p>
                    <p className="font-medium text-gray-900">{patient.insurance.groupNumber}</p>
                  </div>
                  {patient.insurance.authorizationNumber && (
                    <div>
                      <p className="text-sm text-gray-500">Authorization Number</p>
                      <p className="font-medium text-gray-900">{patient.insurance.authorizationNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success-600" />
                  <p className="font-medium text-success-900">Insurance Verified</p>
                </div>
                <p className="text-sm text-success-800 mt-1">
                  Coverage has been verified and is active. Authorization valid for medical transportation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

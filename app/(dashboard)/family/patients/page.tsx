'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  Calendar,
  Car,
  Heart,
  MoreVertical,
  Edit2,
  Trash2,
  Clock,
  AlertCircle,
  UserPlus,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface LinkedPatient {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  transportType: string;
  medicalConditions: string[];
  upcomingTrips: number;
  lastTripDate: string | null;
  totalTrips: number;
  status: 'active' | 'inactive';
}

const mockPatients: LinkedPatient[] = [
  {
    id: '1',
    firstName: 'Robert',
    lastName: 'Johnson',
    relationship: 'Father',
    dateOfBirth: '1945-03-15',
    phone: '(555) 123-4567',
    address: '123 Oak Street, Springfield, IL 62701',
    transportType: 'Wheelchair',
    medicalConditions: ['Diabetes', 'Mobility Issues'],
    upcomingTrips: 2,
    lastTripDate: '2024-01-12',
    totalTrips: 45,
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Margaret',
    lastName: 'Johnson',
    relationship: 'Mother',
    dateOfBirth: '1948-07-22',
    phone: '(555) 123-4568',
    address: '123 Oak Street, Springfield, IL 62701',
    transportType: 'Ambulatory',
    medicalConditions: ['Arthritis'],
    upcomingTrips: 1,
    lastTripDate: '2024-01-10',
    totalTrips: 32,
    status: 'active',
  },
  {
    id: '3',
    firstName: 'James',
    lastName: 'Johnson',
    relationship: 'Brother',
    dateOfBirth: '1965-11-08',
    phone: '(555) 234-5678',
    address: '456 Elm Avenue, Springfield, IL 62702',
    transportType: 'Stretcher',
    medicalConditions: ['Post-Surgery Recovery'],
    upcomingTrips: 0,
    lastTripDate: '2023-12-28',
    totalTrips: 8,
    status: 'inactive',
  },
];

export default function FamilyPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = React.useState<LinkedPatient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<LinkedPatient | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLinkPatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPatient: LinkedPatient = {
      id: Date.now().toString(),
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      relationship: formData.get('relationship') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      transportType: formData.get('transportType') as string,
      medicalConditions: [],
      upcomingTrips: 0,
      lastTripDate: null,
      totalTrips: 0,
      status: 'active',
    };

    setPatients([...patients, newPatient]);
    setIsLinkDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleUnlink = async () => {
    if (!selectedPatient) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setPatients(patients.filter((p) => p.id !== selectedPatient.id));
    setIsDeleteDialogOpen(false);
    setSelectedPatient(null);
    setIsSubmitting(false);
  };

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

  const getTransportBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'ambulatory':
        return 'success';
      case 'wheelchair':
        return 'info';
      case 'stretcher':
        return 'warning';
      case 'bariatric':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Patients</h1>
          <p className="text-sm text-gray-500">Manage family members you coordinate care for</p>
        </div>
        <Button onClick={() => setIsLinkDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Link New Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-sm text-gray-500">Linked Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.reduce((acc, p) => acc + p.upcomingTrips, 0)}
                </p>
                <p className="text-sm text-gray-500">Upcoming Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {patients.reduce((acc, p) => acc + p.totalTrips, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Trips</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search patients by name or relationship..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Patient Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary-700">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {patient.relationship}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/family/patients/${patient.id}`)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/family/book?patientId=${patient.id}`)}>
                      <Car className="h-4 w-4 mr-2" />
                      Book Ride
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-error-600"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Unlink Patient
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {calculateAge(patient.dateOfBirth)} years old
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {patient.phone}
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="line-clamp-1">{patient.address}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <Badge variant={getTransportBadgeVariant(patient.transportType) as any}>
                  {patient.transportType}
                </Badge>
                {patient.medicalConditions.slice(0, 2).map((condition) => (
                  <Badge key={condition} variant="outline" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Upcoming: </span>
                  <span className="font-medium text-gray-900">{patient.upcomingTrips} trips</span>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/family/book?patientId=${patient.id}`);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Book Ride
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No patients found</h3>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Link a patient to start managing their transportation'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsLinkDialogOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Link New Patient
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Link Patient Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Link New Patient</DialogTitle>
            <DialogDescription>
              Add a family member or patient you coordinate care for
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLinkPatient}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select name="relationship" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Sibling">Sibling</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Grandparent">Grandparent</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="Enter full address" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportType">Transport Type</Label>
                <Select name="transportType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ambulatory">Ambulatory</SelectItem>
                    <SelectItem value="Wheelchair">Wheelchair</SelectItem>
                    <SelectItem value="Stretcher">Stretcher</SelectItem>
                    <SelectItem value="Bariatric">Bariatric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-info-50 border border-info-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-info-600 mt-0.5" />
                  <div className="text-sm text-info-800">
                    <p className="font-medium">Verification Required</p>
                    <p>The patient will need to verify this link through their account or phone.</p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Linking...' : 'Link Patient'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Patient</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink {selectedPatient?.firstName} {selectedPatient?.lastName}?
              You will no longer be able to book rides or manage their transportation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlink}
              className="bg-error-600 hover:bg-error-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Unlinking...' : 'Unlink Patient'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

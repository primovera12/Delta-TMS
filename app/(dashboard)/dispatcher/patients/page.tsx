'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Accessibility,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
const patients = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    dateOfBirth: '1952-03-15',
    address: '123 Main St, Houston, TX 77001',
    medicalNeeds: ['wheelchair', 'oxygen'],
    lastTrip: '2026-01-10',
    totalTrips: 42,
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Mary',
    lastName: 'Jones',
    phone: '(555) 234-5678',
    email: 'mary.jones@email.com',
    dateOfBirth: '1965-07-22',
    address: '456 Oak Ave, Houston, TX 77002',
    medicalNeeds: ['wheelchair'],
    lastTrip: '2026-01-12',
    totalTrips: 28,
    status: 'active',
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Brown',
    phone: '(555) 345-6789',
    email: null,
    dateOfBirth: '1948-11-08',
    address: '789 Pine Rd, Houston, TX 77003',
    medicalNeeds: ['stretcher'],
    lastTrip: '2026-01-08',
    totalTrips: 15,
    status: 'active',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    phone: '(555) 456-7890',
    email: 'emily.davis@email.com',
    dateOfBirth: '1970-05-30',
    address: '321 Elm St, Houston, TX 77004',
    medicalNeeds: ['wheelchair', 'bariatric'],
    lastTrip: '2026-01-05',
    totalTrips: 8,
    status: 'active',
  },
  {
    id: '5',
    firstName: 'William',
    lastName: 'Taylor',
    phone: '(555) 567-8901',
    email: 'william.taylor@email.com',
    dateOfBirth: '1958-09-12',
    address: '654 Cedar Ln, Houston, TX 77005',
    medicalNeeds: [],
    lastTrip: '2025-12-20',
    totalTrips: 3,
    status: 'inactive',
  },
];

export default function PatientsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredPatients = React.useMemo(() => {
    if (!searchQuery) return patients;
    const query = searchQuery.toLowerCase();
    return patients.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        (patient.email?.toLowerCase().includes(query) ?? false)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getMedicalBadge = (need: string) => {
    const badges: Record<string, { label: string; variant: 'info' | 'warning' | 'error' }> = {
      wheelchair: { label: 'Wheelchair', variant: 'info' },
      oxygen: { label: 'Oxygen', variant: 'warning' },
      stretcher: { label: 'Stretcher', variant: 'error' },
      bariatric: { label: 'Bariatric', variant: 'info' },
    };
    return badges[need] || { label: need, variant: 'info' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">Manage patient profiles and medical information</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search patients by name, phone, or email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPatients.map((patient) => (
          <Card
            key={patient.id}
            interactive
            className="p-4"
            onClick={() => router.push(`/dispatcher/patients/${patient.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar size="lg">
                  <AvatarFallback>
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                    {patient.phone}
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="h-3.5 w-3.5" />
                      {patient.email}
                    </div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                  <DropdownMenuItem>Book Trip</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View Trip History</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{patient.address}</span>
            </div>

            {patient.medicalNeeds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {patient.medicalNeeds.map((need) => {
                  const badge = getMedicalBadge(need);
                  return (
                    <Badge key={need} variant={badge.variant} size="sm">
                      {badge.label}
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last trip: {patient.lastTrip}</span>
              </div>
              <Badge variant={patient.status === 'active' ? 'success' : 'secondary'} size="sm">
                {patient.totalTrips} trips
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of{' '}
            {filteredPatients.length} patients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {paginatedPatients.length === 0 && (
        <Card className="py-12 text-center">
          <User className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
          <p className="mt-2 text-sm text-gray-500">
            No patients match your search criteria.
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Card>
      )}
    </div>
  );
}

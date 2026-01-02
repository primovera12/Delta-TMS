'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const patients = [
  {
    id: 'PAT-001',
    name: 'John Smith',
    dob: '1952-03-15',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main St, Houston, TX 77001',
    membershipId: 'MBR-00012345',
    transportType: 'wheelchair',
    totalTrips: 45,
    lastTrip: '2026-01-15',
    status: 'active',
  },
  {
    id: 'PAT-002',
    name: 'Mary Jones',
    dob: '1948-07-22',
    phone: '(555) 234-5678',
    email: 'mary.jones@email.com',
    address: '456 Oak Ave, Houston, TX 77002',
    membershipId: 'MBR-00012346',
    transportType: 'ambulatory',
    totalTrips: 62,
    lastTrip: '2026-01-14',
    status: 'active',
  },
  {
    id: 'PAT-003',
    name: 'Robert Brown',
    dob: '1960-11-08',
    phone: '(555) 345-6789',
    email: 'robert.brown@email.com',
    address: '789 Pine Rd, Houston, TX 77003',
    membershipId: 'MBR-00012347',
    transportType: 'wheelchair',
    totalTrips: 28,
    lastTrip: '2026-01-13',
    status: 'active',
  },
  {
    id: 'PAT-004',
    name: 'Emily Davis',
    dob: '1955-04-30',
    phone: '(555) 456-7890',
    email: 'emily.davis@email.com',
    address: '321 Elm St, Houston, TX 77004',
    membershipId: 'MBR-00012348',
    transportType: 'stretcher',
    totalTrips: 15,
    lastTrip: '2026-01-12',
    status: 'active',
  },
  {
    id: 'PAT-005',
    name: 'William Taylor',
    dob: '1945-09-12',
    phone: '(555) 567-8901',
    email: 'william.taylor@email.com',
    address: '555 Cedar Lane, Houston, TX 77005',
    membershipId: 'MBR-00012349',
    transportType: 'ambulatory',
    totalTrips: 8,
    lastTrip: '2025-12-20',
    status: 'inactive',
  },
];

export default function FacilityPatientsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">Manage patient profiles and transport history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name, ID, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patients Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      <AvatarFallback>
                        {patient.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{patient.id}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                      <DropdownMenuItem>View Trip History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-error-600">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>DOB: {patient.dob}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{patient.phone}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant={patient.status === 'active' ? 'success' : 'secondary'}>
                    {patient.status}
                  </Badge>
                  <Badge variant="info" size="sm">
                    {patient.transportType}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-500">Trips: </span>
                  <span className="font-medium text-gray-900">{patient.totalTrips}</span>
                </div>
                <Link href={`/facility/trips/new?patient=${patient.id}`}>
                  <Button size="sm">
                    <Car className="h-4 w-4 mr-2" />
                    Book Trip
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery ? 'Try adjusting your search' : 'Add your first patient to get started'}
          </p>
        </Card>
      )}

      {/* Add Patient Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Smith" className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" type="email" placeholder="john@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St, Houston, TX" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="membershipId">Membership ID (Optional)</Label>
                <Input id="membershipId" placeholder="MBR-00012345" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="transportType">Default Transport Type</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambulatory">Ambulatory</SelectItem>
                    <SelectItem value="wheelchair">Wheelchair</SelectItem>
                    <SelectItem value="stretcher">Stretcher</SelectItem>
                    <SelectItem value="bariatric">Bariatric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddModal(false)}>
              Add Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

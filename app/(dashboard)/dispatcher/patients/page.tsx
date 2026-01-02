'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Loader2,
  AlertCircle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  } | null;
  defaultTransportType: string;
  specialNeeds: string[];
  status: string;
  stats: {
    totalTrips: number;
    upcomingTrips: number;
    cancelledTrips: number;
  };
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DispatcherPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [pagination, setPagination] = React.useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [transportFilter, setTransportFilter] = React.useState<string>('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    transportType: 'ambulatory',
    medicalNotes: '',
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch patients
  const fetchPatients = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', '12');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (transportFilter !== 'all') params.set('transportType', transportFilter);

      const response = await fetch(`/api/v1/patients?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch patients');

      const data = await response.json();
      setPatients(data.data || []);
      setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, debouncedSearch, transportFilter]);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Reset page when filters change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, transportFilter]);

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const addressParts = formData.address.split(',').map(s => s.trim());
      const addressObj = addressParts.length >= 3 ? {
        street: addressParts[0],
        city: addressParts[1],
        state: addressParts[2]?.split(' ')[0] || 'TX',
        zipCode: addressParts[2]?.split(' ')[1] || '',
      } : null;

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth || undefined,
        phone: formData.phone,
        email: formData.email || undefined,
        address: addressObj,
        defaultTransportType: formData.transportType,
        notes: formData.medicalNotes || undefined,
      };

      const response = await fetch('/api/v1/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create patient');
      }

      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        address: '',
        transportType: 'ambulatory',
        medicalNotes: '',
      });
      setShowCreateModal(false);
      fetchPatients();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getMedicalBadge = (need: string) => {
    const badges: Record<string, { label: string; variant: 'info' | 'warning' | 'error' }> = {
      wheelchair: { label: 'Wheelchair', variant: 'info' },
      oxygen: { label: 'Oxygen', variant: 'warning' },
      stretcher: { label: 'Stretcher', variant: 'error' },
      bariatric: { label: 'Bariatric', variant: 'info' },
      ambulatory: { label: 'Ambulatory', variant: 'info' },
    };
    return badges[need] || { label: need, variant: 'info' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">Manage patient profiles and book trips</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search patients by name, phone, or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={transportFilter} onValueChange={setTransportFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Transport Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ambulatory">Ambulatory</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="stretcher">Stretcher</SelectItem>
                <SelectItem value="bariatric">Bariatric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : patients.length === 0 ? (
        <Card className="py-12 text-center">
          <User className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {debouncedSearch || transportFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first patient'}
          </p>
          <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Card>
      ) : (
        <>
          {/* Patients Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => {
              const addressStr = patient.address
                ? `${patient.address.street}, ${patient.address.city}, ${patient.address.state}`
                : 'No address';

              return (
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
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="h-3.5 w-3.5" />
                          {patient.phone}
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate max-w-[150px]">{patient.email}</span>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/dispatcher/patients/${patient.id}`}>View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dispatcher/trips/new?patient=${patient.id}`}>Book Trip</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Trip History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{addressStr}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {patient.defaultTransportType && (
                      <Badge variant={getMedicalBadge(patient.defaultTransportType).variant} size="sm">
                        {getMedicalBadge(patient.defaultTransportType).label}
                      </Badge>
                    )}
                    {patient.specialNeeds?.filter(n => n !== patient.defaultTransportType).map((need) => {
                      const badge = getMedicalBadge(need);
                      return (
                        <Badge key={need} variant={badge.variant} size="sm">
                          {badge.label}
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{patient.stats.totalTrips} total trips</span>
                    </div>
                    <Badge variant={patient.status === 'active' ? 'success' : 'secondary'} size="sm">
                      {patient.status}
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} patients
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Patient Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {submitError && (
              <Alert variant="error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="mt-1.5"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  className="mt-1.5"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="mt-1.5"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  className="mt-1.5"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="mt-1.5"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, Houston, TX 77001"
                className="mt-1.5"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="transportType">Transport Type</Label>
              <Select
                value={formData.transportType}
                onValueChange={(value) => setFormData({ ...formData, transportType: value })}
              >
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
            <div>
              <Label htmlFor="medicalNotes">Medical Notes</Label>
              <Textarea
                id="medicalNotes"
                placeholder="Any special requirements or notes..."
                className="mt-1.5"
                rows={2}
                value={formData.medicalNotes}
                onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.firstName || !formData.lastName || !formData.phone}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Patient'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

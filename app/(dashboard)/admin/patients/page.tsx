'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Phone,
  MapPin,
  Car,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Accessibility,
  Heart,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/domain/stat-card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Patient type definition
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
    lat?: number;
    lng?: number;
  } | null;
  emergencyContact: {
    name: string | null;
    relationship: string | null;
    phone: string | null;
  } | null;
  insuranceProvider: string | null;
  medicaidNumber: string | null;
  medicareNumber: string | null;
  defaultTransportType: string;
  specialNeeds: string[];
  notes: string | null;
  status: string;
  stats: {
    totalTrips: number;
    upcomingTrips: number;
    cancelledTrips: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const transportTypeColors: Record<string, string> = {
  ambulatory: 'bg-success-100 text-success-700',
  wheelchair: 'bg-info-100 text-info-700',
  stretcher: 'bg-warning-100 text-warning-700',
  bariatric: 'bg-purple-100 text-purple-700',
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [pagination, setPagination] = React.useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [transportFilter, setTransportFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
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
    insuranceProvider: '',
    transportType: 'ambulatory',
    medicalNotes: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
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
      params.set('limit', '10');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (transportFilter !== 'all') params.set('transportType', transportFilter);

      const response = await fetch(`/api/v1/patients?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch patients');

      const data = await response.json();
      setPatients(data.data || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, debouncedSearch, statusFilter, transportFilter]);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Reset page when filters change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, statusFilter, transportFilter]);

  // Calculate stats
  const totalPatients = pagination.total;
  const activePatients = patients.filter((p) => p.status === 'active').length;
  const totalTrips = patients.reduce((sum, p) => sum + p.stats.totalTrips, 0);
  const wheelchairPatients = patients.filter((p) => p.defaultTransportType === 'wheelchair').length;

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Parse address into components (simple parsing)
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
        insuranceProvider: formData.insuranceProvider || undefined,
        defaultTransportType: formData.transportType,
        notes: formData.medicalNotes || undefined,
        emergencyContact: formData.emergencyName ? {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relationship: formData.emergencyRelationship,
        } : undefined,
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

      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        address: '',
        insuranceProvider: '',
        transportType: 'ambulatory',
        medicalNotes: '',
        emergencyName: '',
        emergencyPhone: '',
        emergencyRelationship: '',
      });
      setShowCreateModal(false);

      // Refresh patients list
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>
          <p className="text-sm text-gray-500">Manage patient profiles, medical requirements, and transport history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Active Patients"
          value={activePatients}
          icon={<Heart className="h-6 w-6" />}
        />
        <StatCard
          title="Total Trips"
          value={totalTrips.toLocaleString()}
          icon={<Car className="h-6 w-6" />}
        />
        <StatCard
          title="Wheelchair Patients"
          value={wheelchairPatients}
          icon={<Accessibility className="h-6 w-6" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, ID, phone, or membership..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No patients found</h3>
              <p className="text-gray-500 mb-4">
                {debouncedSearch || statusFilter !== 'all' || transportFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first patient'}
              </p>
              {!debouncedSearch && statusFilter === 'all' && transportFilter === 'all' && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insurance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trips
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient) => {
                      const age = patient.dateOfBirth
                        ? Math.floor((Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                        : null;
                      const addressStr = patient.address
                        ? `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`
                        : 'No address';

                      return (
                        <tr key={patient.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>
                                  {patient.name.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{patient.name}</p>
                                <p className="text-sm text-gray-500">
                                  {patient.id.slice(0, 8)}...{age !== null ? ` | Age: ${age}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                {patient.phone}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="truncate max-w-[200px]">{addressStr}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${transportTypeColors[patient.defaultTransportType] || 'bg-gray-100 text-gray-700'}`}>
                              {patient.defaultTransportType.charAt(0).toUpperCase() + patient.defaultTransportType.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-900">{patient.insuranceProvider || 'Not specified'}</p>
                            <p className="text-xs text-gray-500">
                              {patient.medicaidNumber || patient.medicareNumber || '-'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{patient.stats.totalTrips}</p>
                            <p className="text-xs text-gray-500">
                              {patient.stats.upcomingTrips} upcoming
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={patient.status === 'active' ? 'success' : 'secondary'}>
                              {patient.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
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
                                <DropdownMenuItem>Medical Notes</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/dispatcher/trips/new?patient=${patient.id}`}>
                                    Book Trip
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {patient.status === 'active' ? (
                                  <DropdownMenuItem className="text-warning-600">
                                    Deactivate Patient
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-success-600">
                                    Activate Patient
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
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
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={pagination.page === page ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Patient Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Error Message */}
            {submitError && (
              <Alert variant="error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Personal Information</h3>
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
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="mt-1.5"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1.5"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="mt-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, Houston, TX 77001"
                  className="mt-1.5"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Insurance Information</h3>
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Select
                  value={formData.insuranceProvider}
                  onValueChange={(value) => setFormData({ ...formData, insuranceProvider: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Medicare">Medicare</SelectItem>
                    <SelectItem value="Medicaid">Medicaid</SelectItem>
                    <SelectItem value="Blue Cross">Blue Cross</SelectItem>
                    <SelectItem value="Aetna">Aetna</SelectItem>
                    <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                    <SelectItem value="Private Pay">Private Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transport Requirements */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Transport Requirements</h3>
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
              <div className="mt-4">
                <Label htmlFor="medicalNotes">Medical Notes</Label>
                <Textarea
                  id="medicalNotes"
                  placeholder="Any medical conditions, special requirements, or notes for drivers..."
                  className="mt-1.5"
                  rows={3}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Mary Smith"
                    className="mt-1.5"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="(555) 123-4568"
                    className="mt-1.5"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    placeholder="Spouse, Child, etc."
                    className="mt-1.5"
                    value={formData.emergencyRelationship}
                    onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-info-50 text-info-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">Patient will receive login credentials via email if email is provided</p>
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

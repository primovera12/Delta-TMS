'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Loader2,
  AlertCircle,
  Car,
  FileText,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  hireDate: string | null;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  OFFLINE: 'bg-gray-100 text-gray-700',
  ONLINE: 'bg-success-100 text-success-700',
  AVAILABLE: 'bg-primary-100 text-primary-700',
  ASSIGNED: 'bg-info-100 text-info-700',
  EN_ROUTE: 'bg-warning-100 text-warning-700',
  ON_TRIP: 'bg-purple-100 text-purple-700',
  BREAK: 'bg-orange-100 text-orange-700',
};

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  OFFLINE: 'secondary',
  ONLINE: 'success',
  AVAILABLE: 'success',
  ASSIGNED: 'default',
  EN_ROUTE: 'warning',
  ON_TRIP: 'warning',
  BREAK: 'secondary',
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [pagination, setPagination] = React.useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
  });

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch drivers
  const fetchDrivers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', '10');
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const response = await fetch(`/api/v1/drivers?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch drivers');

      const data = await response.json();
      if (data.success) {
        setDrivers(data.data.drivers || []);
        setPagination(data.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
      } else {
        throw new Error(data.error || 'Failed to fetch drivers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, debouncedSearch, statusFilter]);

  React.useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Reset page when filters change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearch, statusFilter]);

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/v1/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create driver');
      }

      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: '',
        licenseState: '',
        licenseExpiry: '',
      });
      setShowCreateModal(false);

      // Refresh drivers list
      fetchDrivers();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getDriverName = (driver: Driver) => {
    return `${driver.user.firstName} ${driver.user.lastName}`;
  };

  const getInitials = (driver: Driver) => {
    return `${driver.user.firstName[0]}${driver.user.lastName[0]}`;
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiry <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Driver Management</h1>
          <p className="text-sm text-gray-500">Manage drivers, vehicles, and schedules</p>
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
            Add Driver
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                <p className="text-sm text-gray-500">Total Drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => ['ONLINE', 'AVAILABLE', 'ASSIGNED', 'EN_ROUTE', 'ON_TRIP'].includes(d.status)).length}
                </p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Car className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'ON_TRIP').length}
                </p>
                <p className="text-sm text-gray-500">On Trip</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {drivers.filter(d => d.status === 'OFFLINE').length}
                </p>
                <p className="text-sm text-gray-500">Offline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, or license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active (Online)</SelectItem>
            <SelectItem value="OFFLINE">Offline</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="ON_TRIP">On Trip</SelectItem>
            <SelectItem value="BREAK">On Break</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Tabs */}
      <Tabs defaultValue="all" onValueChange={(v) => setStatusFilter(v)}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="AVAILABLE">Available</TabsTrigger>
          <TabsTrigger value="ON_TRIP">On Trip</TabsTrigger>
          <TabsTrigger value="OFFLINE">Offline</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Drivers Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : drivers.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No drivers found</h3>
              <p className="text-gray-500 mb-4">
                {debouncedSearch || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first driver'}
              </p>
              {!debouncedSearch && statusFilter === 'all' && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Driver</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">License</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Hire Date</th>
                      <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => {
                      const licenseExpiringSoon = isLicenseExpiringSoon(driver.licenseExpiry);
                      const hireDate = driver.hireDate
                        ? new Date(driver.hireDate).toLocaleDateString()
                        : 'N/A';
                      const licenseExpiry = new Date(driver.licenseExpiry).toLocaleDateString();

                      return (
                        <tr
                          key={driver.id}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(driver)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <Link
                                  href={`/admin/drivers/${driver.id}`}
                                  className="font-medium text-gray-900 hover:text-primary-600"
                                >
                                  {getDriverName(driver)}
                                </Link>
                                <p className="text-sm text-gray-500">ID: {driver.id.slice(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-4 w-4 text-gray-400" />
                                {driver.user.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                {driver.user.phone || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FileText className="h-4 w-4 text-gray-400" />
                                {driver.licenseNumber}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">{driver.licenseState}</span>
                                <span className="text-xs text-gray-400">|</span>
                                <span className={`text-xs ${licenseExpiringSoon ? 'text-error-600 font-medium' : 'text-gray-500'}`}>
                                  Exp: {licenseExpiry}
                                  {licenseExpiringSoon && ' ⚠️'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[driver.status] || 'bg-gray-100 text-gray-700'}`}>
                              {driver.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {hireDate}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/drivers/${driver.id}`}>View Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Driver</DropdownMenuItem>
                                <DropdownMenuItem>View Schedule</DropdownMenuItem>
                                <DropdownMenuItem>View Documents</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Assign Vehicle</DropdownMenuItem>
                                <DropdownMenuItem>View Earnings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {driver.status !== 'OFFLINE' ? (
                                  <DropdownMenuItem className="text-warning-600">
                                    Set Offline
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-success-600">
                                    Set Available
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-error-600">
                                  Deactivate Driver
                                </DropdownMenuItem>
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
                  {pagination.total} drivers
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

      {/* Create Driver Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Error Message */}
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
            <div>
              <Label htmlFor="email">Email *</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  placeholder="DL123456789"
                  className="mt-1.5"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="licenseState">License State *</Label>
                <Select
                  value={formData.licenseState}
                  onValueChange={(value) => setFormData({ ...formData, licenseState: value })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="licenseExpiry">License Expiry Date *</Label>
              <Input
                id="licenseExpiry"
                type="date"
                className="mt-1.5"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-info-50 text-info-700">
              <Shield className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">Background check and document verification will be required</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.phone ||
                !formData.licenseNumber ||
                !formData.licenseState ||
                !formData.licenseExpiry
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Driver'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

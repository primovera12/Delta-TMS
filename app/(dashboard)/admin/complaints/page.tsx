'use client';

import * as React from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  MessageSquare,
  User,
  Car,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Complaint {
  id: string;
  ticketNumber: string;
  type: 'service' | 'driver' | 'billing' | 'vehicle' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  complainant: {
    name: string;
    type: 'patient' | 'family' | 'facility';
    email: string;
    phone: string;
  };
  relatedTrip?: string;
  relatedDriver?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    ticketNumber: 'CMP-2024-001',
    type: 'driver',
    priority: 'high',
    status: 'open',
    subject: 'Driver arrived late and was unprofessional',
    description: 'The driver arrived 30 minutes late for my appointment and was rude when I asked about the delay.',
    complainant: {
      name: 'Robert Johnson',
      type: 'patient',
      email: 'robert.j@email.com',
      phone: '(555) 123-4567',
    },
    relatedTrip: 'TRP-2024-1234',
    relatedDriver: 'John Smith',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    ticketNumber: 'CMP-2024-002',
    type: 'billing',
    priority: 'medium',
    status: 'in_progress',
    subject: 'Incorrect charge on invoice',
    description: 'We were charged for a round trip but only requested a one-way transport.',
    complainant: {
      name: 'Memorial Hospital',
      type: 'facility',
      email: 'billing@memorial.com',
      phone: '(555) 987-6543',
    },
    relatedTrip: 'TRP-2024-1198',
    assignedTo: 'Sarah Admin',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: '3',
    ticketNumber: 'CMP-2024-003',
    type: 'vehicle',
    priority: 'medium',
    status: 'resolved',
    subject: 'Vehicle was not clean',
    description: 'The wheelchair van had debris on the floor and the seats were dirty.',
    complainant: {
      name: 'Jennifer Wilson',
      type: 'family',
      email: 'j.wilson@email.com',
      phone: '(555) 456-7890',
    },
    relatedTrip: 'TRP-2024-1156',
    relatedDriver: 'Mike Davis',
    assignedTo: 'Fleet Manager',
    createdAt: '2024-01-12T08:15:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    resolution: 'Apologized to the family and scheduled deep cleaning of vehicle. Driver reminded of cleanliness standards.',
  },
  {
    id: '4',
    ticketNumber: 'CMP-2024-004',
    type: 'service',
    priority: 'low',
    status: 'closed',
    subject: 'Difficulty booking through phone system',
    description: 'Had to wait on hold for 20 minutes before speaking to someone.',
    complainant: {
      name: 'Thomas Anderson',
      type: 'patient',
      email: 't.anderson@email.com',
      phone: '(555) 234-5678',
    },
    assignedTo: 'Customer Service Lead',
    createdAt: '2024-01-10T11:45:00Z',
    updatedAt: '2024-01-11T14:30:00Z',
    resolution: 'Reviewed call center staffing during peak hours. Added additional staff member.',
  },
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = React.useState<Complaint[]>(mockComplaints);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isNewOpen, setIsNewOpen] = React.useState(false);

  const filteredComplaints = complaints.filter((complaint) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !complaint.subject.toLowerCase().includes(query) &&
        !complaint.ticketNumber.toLowerCase().includes(query) &&
        !complaint.complainant.name.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (statusFilter !== 'all' && complaint.status !== statusFilter) return false;
    if (typeFilter !== 'all' && complaint.type !== typeFilter) return false;
    return true;
  });

  const openCount = complaints.filter((c) => c.status === 'open').length;
  const inProgressCount = complaints.filter((c) => c.status === 'in_progress').length;
  const highPriorityCount = complaints.filter((c) => c.priority === 'high' && c.status !== 'closed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      service: 'Service',
      driver: 'Driver',
      billing: 'Billing',
      vehicle: 'Vehicle',
      other: 'Other',
    };
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setComplaints(
      complaints.map((c) =>
        c.id === id ? { ...c, status: newStatus as Complaint['status'], updatedAt: new Date().toISOString() } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Complaints</h1>
          <p className="text-sm text-gray-500">Manage and resolve customer complaints</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Complaint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className={openCount > 0 ? 'border-error-200' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${openCount > 0 ? 'bg-error-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <AlertCircle className={`h-5 w-5 ${openCount > 0 ? 'text-error-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{openCount}</p>
                <p className="text-sm text-gray-500">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={highPriorityCount > 0 ? 'border-warning-200' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${highPriorityCount > 0 ? 'bg-warning-100' : 'bg-gray-100'} flex items-center justify-center`}>
                <AlertTriangle className={`h-5 w-5 ${highPriorityCount > 0 ? 'text-warning-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{highPriorityCount}</p>
                <p className="text-sm text-gray-500">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length}</p>
                <p className="text-sm text-gray-500">Resolved</p>
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
            type="text"
            placeholder="Search by ticket, subject, or complainant..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="driver">Driver</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="vehicle">Vehicle</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-success-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No complaints found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'All complaints have been resolved'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card
              key={complaint.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                complaint.priority === 'high' && complaint.status === 'open'
                  ? 'border-l-4 border-l-error-500'
                  : ''
              }`}
              onClick={() => handleViewDetails(complaint)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    complaint.status === 'open'
                      ? 'bg-error-100'
                      : complaint.status === 'in_progress'
                      ? 'bg-warning-100'
                      : 'bg-gray-100'
                  }`}>
                    <MessageSquare className={`h-5 w-5 ${
                      complaint.status === 'open'
                        ? 'text-error-600'
                        : complaint.status === 'in_progress'
                        ? 'text-warning-600'
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-gray-500">{complaint.ticketNumber}</span>
                      {getStatusBadge(complaint.status)}
                      {getPriorityBadge(complaint.priority)}
                      {getTypeBadge(complaint.type)}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{complaint.subject}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {complaint.complainant.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                      {complaint.relatedTrip && (
                        <span className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          {complaint.relatedTrip}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Complaint Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-gray-500">{selectedComplaint?.ticketNumber}</span>
              {selectedComplaint && getStatusBadge(selectedComplaint.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 text-lg mb-2">{selectedComplaint.subject}</h3>
                <div className="flex gap-2 mb-4">
                  {getPriorityBadge(selectedComplaint.priority)}
                  {getTypeBadge(selectedComplaint.type)}
                </div>
                <p className="text-gray-600">{selectedComplaint.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Complainant</h4>
                  <p className="font-medium text-gray-900">{selectedComplaint.complainant.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{selectedComplaint.complainant.type}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedComplaint.complainant.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedComplaint.complainant.phone}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Related Information</h4>
                  {selectedComplaint.relatedTrip && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Trip: {selectedComplaint.relatedTrip}
                    </p>
                  )}
                  {selectedComplaint.relatedDriver && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Driver: {selectedComplaint.relatedDriver}
                    </p>
                  )}
                  {selectedComplaint.assignedTo && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assigned: {selectedComplaint.assignedTo}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                    <Clock className="h-4 w-4" />
                    Created: {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedComplaint.resolution && (
                <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                  <h4 className="text-sm font-medium text-success-900 mb-2">Resolution</h4>
                  <p className="text-sm text-success-800">{selectedComplaint.resolution}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Update Status</Label>
                <div className="flex gap-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedComplaint.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateStatus(selectedComplaint.id, status)}
                    >
                      {status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Complaint Dialog */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log New Complaint</DialogTitle>
            <DialogDescription>Record a customer complaint for tracking and resolution</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input placeholder="Brief description of the complaint" />
            </div>
            <div className="space-y-2">
              <Label>Complainant Name</Label>
              <Input placeholder="Name of person filing complaint" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Detailed description of the complaint..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Related Trip ID (optional)</Label>
              <Input placeholder="TRP-XXXX-XXXX" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsNewOpen(false)}>Submit Complaint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

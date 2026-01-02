'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Plus,
  AlertTriangle,
  AlertCircle,
  FileText,
  Car,
  User,
  Calendar,
  ChevronRight,
} from 'lucide-react';

// Mock incident data
const mockIncidents = [
  {
    id: 'INC-001',
    date: '2024-01-15',
    time: '10:30 AM',
    type: 'Vehicle Accident',
    severity: 'high',
    vehicle: 'VEH-042',
    driver: 'Michael Johnson',
    location: '500 Main St',
    status: 'investigating',
    description: 'Minor fender bender in parking lot',
    injuries: false,
  },
  {
    id: 'INC-002',
    date: '2024-01-14',
    time: '2:15 PM',
    type: 'Patient Complaint',
    severity: 'medium',
    vehicle: 'VEH-015',
    driver: 'Sarah Kim',
    location: 'Metro Hospital',
    status: 'resolved',
    description: 'Patient reported late pickup',
    injuries: false,
  },
  {
    id: 'INC-003',
    date: '2024-01-13',
    time: '9:00 AM',
    type: 'Equipment Issue',
    severity: 'low',
    vehicle: 'VEH-031',
    driver: 'Lisa Martinez',
    location: 'Care Home West',
    status: 'resolved',
    description: 'Wheelchair lift malfunction',
    injuries: false,
  },
  {
    id: 'INC-004',
    date: '2024-01-12',
    time: '4:45 PM',
    type: 'Near Miss',
    severity: 'medium',
    vehicle: 'VEH-023',
    driver: 'David Lee',
    location: '100 Oak Ave',
    status: 'closed',
    description: 'Avoided collision with pedestrian',
    injuries: false,
  },
  {
    id: 'INC-005',
    date: '2024-01-10',
    time: '11:20 AM',
    type: 'Service Issue',
    severity: 'low',
    vehicle: 'VEH-007',
    driver: 'James Wilson',
    location: 'City Clinic',
    status: 'resolved',
    description: 'Driver unable to locate patient pickup',
    injuries: false,
  },
];

export default function OperationsIncidentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      pending: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'high') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (severity === 'medium') return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesSearch =
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesType = filterType === 'all' || incident.type === filterType;
    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const stats = {
    total: mockIncidents.length,
    open: mockIncidents.filter(i => i.status === 'investigating').length,
    high: mockIncidents.filter(i => i.severity === 'high').length,
    resolved: mockIncidents.filter(i => i.status === 'resolved' || i.status === 'closed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
          <p className="text-gray-600">Track and manage safety incidents and complaints</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Report Incident
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Incidents (MTD)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Investigations</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Severity</p>
                <p className="text-2xl font-bold text-red-600">{stats.high}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <FileText className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search incidents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Vehicle Accident">Vehicle Accident</SelectItem>
            <SelectItem value="Patient Complaint">Patient Complaint</SelectItem>
            <SelectItem value="Equipment Issue">Equipment Issue</SelectItem>
            <SelectItem value="Near Miss">Near Miss</SelectItem>
            <SelectItem value="Service Issue">Service Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Driver/Vehicle</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/operations/incidents/${incident.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(incident.severity)}
                      <div>
                        <p className="font-medium">{incident.id}</p>
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {incident.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{incident.date}</p>
                      <p className="text-sm text-gray-500">{incident.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{incident.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        {incident.driver}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="h-3 w-3 text-gray-400" />
                        {incident.vehicle}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Incidents by Type (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Vehicle Accidents</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Patient Complaints</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Equipment Issues</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Near Misses</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Service Issues</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                  <span className="text-sm font-medium">1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Safety Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">15</p>
                <p className="text-sm text-gray-600">Days Without Major Incident</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-xl font-bold">0</p>
                  <p className="text-xs text-gray-500">Injuries (MTD)</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-xl font-bold">98%</p>
                  <p className="text-xs text-gray-500">Safety Score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

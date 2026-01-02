'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowLeft,
  AlertTriangle,
  Car,
  User,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Camera,
  Upload,
  Edit,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';

// Mock incident detail
const mockIncidentDetail = {
  id: 'INC-001',
  date: '2024-01-15',
  time: '10:30 AM',
  type: 'Vehicle Accident',
  severity: 'high',
  status: 'investigating',
  vehicle: {
    id: 'VEH-042',
    type: 'Wheelchair Van',
    make: 'Ford',
    model: 'Transit',
    year: 2022,
    licensePlate: 'ABC-1234',
  },
  driver: {
    id: 'DRV-001',
    name: 'Michael Johnson',
    phone: '(555) 234-5678',
    email: 'mjohnson@deltamed.com',
    yearsExperience: 3,
  },
  location: {
    address: '500 Main St, Suite 100',
    city: 'Downtown',
    coordinates: '34.052, -118.243',
  },
  description: 'Minor fender bender in parking lot. Vehicle was backing out of a parking space when it made contact with another parked vehicle. No passengers in the vehicle at the time.',
  injuries: false,
  injuryDetails: null,
  propertyDamage: true,
  damageEstimate: 2500.00,
  policeReport: true,
  policeReportNumber: 'PR-2024-001234',
  witnesses: [
    { name: 'John Doe', phone: '(555) 111-2222', statement: 'Saw the accident occur' },
  ],
  timeline: [
    { date: '2024-01-15 10:30 AM', action: 'Incident Occurred', user: 'Michael Johnson' },
    { date: '2024-01-15 10:45 AM', action: 'Incident Reported', user: 'Michael Johnson' },
    { date: '2024-01-15 11:00 AM', action: 'Police Report Filed', user: 'Michael Johnson' },
    { date: '2024-01-15 11:30 AM', action: 'Operations Manager Notified', user: 'System' },
    { date: '2024-01-15 12:00 PM', action: 'Investigation Started', user: 'Operations Manager' },
  ],
  photos: [
    { id: 1, name: 'Front damage', uploadedAt: '2024-01-15 10:50 AM' },
    { id: 2, name: 'Side view', uploadedAt: '2024-01-15 10:51 AM' },
    { id: 3, name: 'Other vehicle', uploadedAt: '2024-01-15 10:52 AM' },
  ],
  notes: [
    { id: 1, author: 'Operations Manager', date: '2024-01-15 12:00 PM', content: 'Reviewing dashcam footage' },
    { id: 2, author: 'Operations Manager', date: '2024-01-15 2:00 PM', content: 'Insurance company notified' },
  ],
};

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [resolution, setResolution] = useState('');

  const incident = mockIncidentDetail;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Incident {incident.id}</h1>
              <Badge className={getSeverityColor(incident.severity)}>
                {incident.severity} severity
              </Badge>
              <Badge className={getStatusColor(incident.status)}>
                {incident.status}
              </Badge>
            </div>
            <p className="text-gray-600">{incident.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {incident.status === 'investigating' && (
            <Button onClick={() => setShowResolveDialog(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Incident
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{incident.date} at {incident.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{incident.location.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{incident.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Injuries</p>
                  <p className="font-medium">{incident.injuries ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Property Damage</p>
                  <p className="font-medium">{incident.propertyDamage ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Damage Estimate</p>
                  <p className="font-medium">${incident.damageEstimate?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>

              {incident.policeReport && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Police Report</p>
                  <p className="font-medium">{incident.policeReportNumber}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Driver & Vehicle Info */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{incident.driver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{incident.driver.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{incident.driver.yearsExperience} years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">{incident.vehicle.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Make/Model</p>
                    <p className="font-medium">
                      {incident.vehicle.year} {incident.vehicle.make} {incident.vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">{incident.vehicle.licensePlate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Witnesses */}
          {incident.witnesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Witnesses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {incident.witnesses.map((witness, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between">
                        <p className="font-medium">{witness.name}</p>
                        <p className="text-sm text-gray-500">{witness.phone}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{witness.statement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Investigation Notes</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowAddNoteDialog(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incident.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{note.author}</span>
                      <span className="text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incident.timeline.map((event, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {index < incident.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-sm">{event.action}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                      <p className="text-xs text-gray-400">by {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Photos & Documents</CardTitle>
              <Button variant="ghost" size="sm">
                <Upload className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {incident.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200"
                  >
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
                <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Contact Driver
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Car className="h-4 w-4 mr-2" />
                View Vehicle History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Investigation Note</DialogTitle>
            <DialogDescription>
              Add a note to document your investigation findings.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddNoteDialog(false)}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Incident</DialogTitle>
            <DialogDescription>
              Mark this incident as resolved. Please provide a resolution summary.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Resolution Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_fault">No Fault</SelectItem>
                  <SelectItem value="driver_fault">Driver At Fault</SelectItem>
                  <SelectItem value="other_fault">Other Party At Fault</SelectItem>
                  <SelectItem value="pending_insurance">Pending Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Resolution summary..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowResolveDialog(false);
              router.push('/operations/incidents');
            }}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

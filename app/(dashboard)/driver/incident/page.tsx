'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertTriangle,
  Upload,
  Camera,
  MapPin,
  Clock,
  Car,
  User,
  Phone,
  FileText,
  Send,
} from 'lucide-react';

export default function DriverIncidentPage() {
  const [incidentType, setIncidentType] = useState('');
  const [hasInjuries, setHasInjuries] = useState(false);
  const [hasWitnesses, setHasWitnesses] = useState(false);
  const [policeInvolved, setPoliceInvolved] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Incident</h1>
          <p className="text-gray-600">Document any accidents, issues, or incidents</p>
        </div>
      </div>

      {/* Alert Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Important</p>
              <p className="text-sm text-red-700">
                If there are injuries, call 911 immediately. Document the scene only after ensuring everyone&apos;s safety.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Incident Type</Label>
                  <Select value={incidentType} onValueChange={setIncidentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accident">Vehicle Accident</SelectItem>
                      <SelectItem value="breakdown">Vehicle Breakdown</SelectItem>
                      <SelectItem value="patient_injury">Patient Injury</SelectItem>
                      <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                      <SelectItem value="property_damage">Property Damage</SelectItem>
                      <SelectItem value="theft">Theft/Vandalism</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor - No injuries/damage</SelectItem>
                      <SelectItem value="moderate">Moderate - Minor injuries/damage</SelectItem>
                      <SelectItem value="major">Major - Significant injuries/damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input className="pl-9" placeholder="Enter address or intersection" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what happened in detail..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Involved Parties */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Involved Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="injuries"
                  checked={hasInjuries}
                  onCheckedChange={(checked) => setHasInjuries(checked as boolean)}
                />
                <Label htmlFor="injuries">There were injuries</Label>
              </div>

              {hasInjuries && (
                <div className="space-y-2 p-4 bg-red-50 rounded-lg">
                  <Label>Injury Details</Label>
                  <Textarea
                    placeholder="Describe any injuries and who was affected..."
                    rows={3}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="witnesses"
                  checked={hasWitnesses}
                  onCheckedChange={(checked) => setHasWitnesses(checked as boolean)}
                />
                <Label htmlFor="witnesses">There were witnesses</Label>
              </div>

              {hasWitnesses && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Witness Name</Label>
                      <Input placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Witness Phone</Label>
                      <Input placeholder="Phone number" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    + Add Another Witness
                  </Button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="police"
                  checked={policeInvolved}
                  onCheckedChange={(checked) => setPoliceInvolved(checked as boolean)}
                />
                <Label htmlFor="police">Police were involved</Label>
              </div>

              {policeInvolved && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Police Report Number</Label>
                      <Input placeholder="Report #" />
                    </div>
                    <div className="space-y-2">
                      <Label>Officer Name/Badge</Label>
                      <Input placeholder="Officer information" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Party Information (for accidents) */}
          {incidentType === 'accident' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Other Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Driver Name</Label>
                    <Input placeholder="Other driver's name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Driver Phone</Label>
                    <Input placeholder="Phone number" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>License Plate</Label>
                    <Input placeholder="Plate #" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Make/Model</Label>
                    <Input placeholder="e.g., Toyota Camry" />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Color</Label>
                    <Input placeholder="Color" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Insurance Company</Label>
                    <Input placeholder="Insurance provider" />
                  </div>
                  <div className="space-y-2">
                    <Label>Policy Number</Label>
                    <Input placeholder="Policy #" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos & Evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Upload photos of the incident scene
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Include damage, surroundings, road conditions, and any relevant evidence
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Trip Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Related Trip (if any)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No related trip</SelectItem>
                    <SelectItem value="TRP-001">TRP-001 - 9:00 AM</SelectItem>
                    <SelectItem value="TRP-002">TRP-002 - 10:30 AM</SelectItem>
                    <SelectItem value="TRP-003">TRP-003 - 2:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Vehicle</Label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">2022 Toyota Sienna</p>
                  <p className="text-sm text-gray-500">ABC 1234</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Emergency</span>
                </div>
                <p className="text-lg font-bold">911</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Dispatch</span>
                </div>
                <p className="text-lg font-bold">(555) 123-4567</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">Supervisor</span>
                </div>
                <p className="text-lg font-bold">(555) 987-6543</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-1" />
                  <Label htmlFor="check-1" className="text-sm">Ensured everyone is safe</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-2" />
                  <Label htmlFor="check-2" className="text-sm">Called emergency services if needed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-3" />
                  <Label htmlFor="check-3" className="text-sm">Documented the scene with photos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-4" />
                  <Label htmlFor="check-4" className="text-sm">Exchanged information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-5" />
                  <Label htmlFor="check-5" className="text-sm">Notified dispatch</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Save Draft</Button>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Submit Report
        </Button>
      </div>
    </div>
  );
}

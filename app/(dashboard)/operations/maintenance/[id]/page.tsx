'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  Car,
  Wrench,
  Calendar,
  Clock,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  Edit,
  Printer,
  Upload,
} from 'lucide-react';

// Mock maintenance detail
const mockMaintenanceDetail = {
  id: 'MNT-002',
  vehicle: {
    id: 'VEH-015',
    type: 'Sedan',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    vin: '1HGBH41JXMN109186',
    licensePlate: 'ABC-1234',
    currentMileage: 62100,
  },
  type: 'Repair',
  description: 'Brake pad replacement',
  detailedNotes: 'Front brake pads worn below minimum threshold. Rear pads at 40% life remaining. Recommend replacement of front pads and rotors. Brake fluid flush recommended.',
  status: 'in_progress',
  scheduledDate: '2024-01-16',
  startedDate: '2024-01-16 8:30 AM',
  completedDate: null,
  estimatedCost: 350.00,
  actualCost: null,
  technician: {
    name: 'Fleet Service Center',
    phone: '(555) 987-6543',
    address: '500 Industrial Way, Suite 100',
  },
  parts: [
    { name: 'Front Brake Pads', quantity: 2, unitCost: 45.00, total: 90.00 },
    { name: 'Front Rotors', quantity: 2, unitCost: 85.00, total: 170.00 },
    { name: 'Brake Fluid', quantity: 1, unitCost: 25.00, total: 25.00 },
  ],
  labor: {
    hours: 2.5,
    rate: 85.00,
    total: 212.50,
  },
  timeline: [
    { date: '2024-01-14', action: 'Maintenance Scheduled', user: 'Operations Manager' },
    { date: '2024-01-16 8:00 AM', action: 'Vehicle Dropped Off', user: 'Michael Johnson' },
    { date: '2024-01-16 8:30 AM', action: 'Work Started', user: 'Fleet Service Center' },
    { date: '2024-01-16 10:00 AM', action: 'Parts Ordered', user: 'Fleet Service Center' },
  ],
  documents: [
    { name: 'Work Order', type: 'pdf', uploadedAt: '2024-01-16' },
    { name: 'Parts Invoice', type: 'pdf', uploadedAt: '2024-01-16' },
  ],
};

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');

  const maintenance = mockMaintenanceDetail;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      pending_parts: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const partsTotal = maintenance.parts.reduce((sum, p) => sum + p.total, 0);
  const estimatedTotal = partsTotal + maintenance.labor.total;

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
              <h1 className="text-2xl font-bold text-gray-900">Maintenance {maintenance.id}</h1>
              <Badge className={getStatusColor(maintenance.status)}>
                {maintenance.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-gray-600">{maintenance.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {maintenance.status === 'in_progress' && (
            <Button onClick={() => setShowCompleteDialog(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vehicle ID</p>
                  <p className="font-medium">{maintenance.vehicle.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Make/Model</p>
                  <p className="font-medium">
                    {maintenance.vehicle.year} {maintenance.vehicle.make} {maintenance.vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{maintenance.vehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">VIN</p>
                  <p className="font-mono text-sm">{maintenance.vehicle.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-medium">{maintenance.vehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Mileage</p>
                  <p className="font-medium">{maintenance.vehicle.currentMileage.toLocaleString()} mi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Work Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <Badge variant="outline">{maintenance.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="font-medium">{maintenance.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Detailed Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{maintenance.detailedNotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parts & Labor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Parts & Labor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Parts */}
                <div>
                  <h3 className="font-medium mb-2">Parts</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2">Part</th>
                          <th className="text-center p-2">Qty</th>
                          <th className="text-right p-2">Unit Cost</th>
                          <th className="text-right p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenance.parts.map((part, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{part.name}</td>
                            <td className="text-center p-2">{part.quantity}</td>
                            <td className="text-right p-2">${part.unitCost.toFixed(2)}</td>
                            <td className="text-right p-2 font-medium">${part.total.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="border-t bg-gray-50">
                          <td colSpan={3} className="p-2 text-right font-medium">Parts Subtotal</td>
                          <td className="text-right p-2 font-bold">${partsTotal.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Labor */}
                <div>
                  <h3 className="font-medium mb-2">Labor</h3>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between">
                      <span>{maintenance.labor.hours} hours @ ${maintenance.labor.rate}/hr</span>
                      <span className="font-bold">${maintenance.labor.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Estimated Total</span>
                    <span className="font-bold">${estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenance.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      {index < maintenance.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{event.action}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Service Provider */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Service Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{maintenance.technician.name}</p>
                    <p className="text-sm text-gray-500">{maintenance.technician.phone}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{maintenance.technician.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Schedule Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled</span>
                  <span className="font-medium">{maintenance.scheduledDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Started</span>
                  <span className="font-medium">{maintenance.startedDate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium">{maintenance.completedDate || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Parts</span>
                  <span className="font-medium">${partsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Labor</span>
                  <span className="font-medium">${maintenance.labor.total.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Documents</CardTitle>
                <Button variant="ghost" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {maintenance.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Maintenance</DialogTitle>
            <DialogDescription>
              Mark this maintenance record as complete. Add any final notes about the work performed.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Final notes (optional)..."
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowCompleteDialog(false);
              router.push('/operations/maintenance');
            }}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

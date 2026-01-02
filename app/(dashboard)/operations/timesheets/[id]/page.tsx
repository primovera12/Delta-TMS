'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Clock,
  Calendar,
  User,
  Car,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Printer,
} from 'lucide-react';

// Mock timesheet detail data
const mockTimesheetDetail = {
  id: 'TS-001',
  driver: {
    id: 'DRV-001',
    name: 'Michael Johnson',
    phone: '(555) 234-5678',
    email: 'mjohnson@deltamed.com',
    vehicle: 'VEH-042',
  },
  weekEnding: '2024-01-21',
  status: 'pending',
  submittedAt: '2024-01-21 6:00 PM',
  summary: {
    regularHours: 40,
    overtimeHours: 5,
    totalHours: 45,
    tripsCompleted: 28,
    totalMiles: 342,
  },
  dailyEntries: [
    {
      date: '2024-01-15',
      day: 'Monday',
      clockIn: '6:00 AM',
      clockOut: '3:00 PM',
      breakTime: '1:00',
      totalHours: 8,
      trips: 5,
      miles: 58,
      notes: '',
    },
    {
      date: '2024-01-16',
      day: 'Tuesday',
      clockIn: '6:00 AM',
      clockOut: '4:00 PM',
      breakTime: '1:00',
      totalHours: 9,
      trips: 6,
      miles: 72,
      notes: 'Extended shift - covered for Sarah K.',
    },
    {
      date: '2024-01-17',
      day: 'Wednesday',
      clockIn: '6:00 AM',
      clockOut: '3:00 PM',
      breakTime: '1:00',
      totalHours: 8,
      trips: 5,
      miles: 55,
      notes: '',
    },
    {
      date: '2024-01-18',
      day: 'Thursday',
      clockIn: '6:00 AM',
      clockOut: '4:00 PM',
      breakTime: '1:00',
      totalHours: 9,
      trips: 6,
      miles: 68,
      notes: 'Extra pickup in East District',
    },
    {
      date: '2024-01-19',
      day: 'Friday',
      clockIn: '6:00 AM',
      clockOut: '5:00 PM',
      breakTime: '1:00',
      totalHours: 10,
      trips: 4,
      miles: 62,
      notes: 'Long-distance transport to County Hospital',
    },
    {
      date: '2024-01-20',
      day: 'Saturday',
      clockIn: '7:00 AM',
      clockOut: '12:00 PM',
      breakTime: '0:30',
      totalHours: 4.5,
      trips: 2,
      miles: 27,
      notes: 'Half shift coverage',
    },
    {
      date: '2024-01-21',
      day: 'Sunday',
      clockIn: null,
      clockOut: null,
      breakTime: null,
      totalHours: 0,
      trips: 0,
      miles: 0,
      notes: 'Day off',
    },
  ],
  tripDetails: [
    { id: 'TRP-1001', date: '2024-01-15', patient: 'John Smith', type: 'Round Trip', miles: 12 },
    { id: 'TRP-1002', date: '2024-01-15', patient: 'Mary Johnson', type: 'Pickup', miles: 8 },
    { id: 'TRP-1003', date: '2024-01-15', patient: 'Robert Davis', type: 'Round Trip', miles: 15 },
    { id: 'TRP-1004', date: '2024-01-16', patient: 'Susan Miller', type: 'Dropoff', miles: 6 },
    { id: 'TRP-1005', date: '2024-01-16', patient: 'William Brown', type: 'Round Trip', miles: 18 },
  ],
};

export default function OperationsTimesheetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const timesheet = mockTimesheetDetail;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleApprove = () => {
    // Handle approve logic
    setShowApproveDialog(false);
    router.push('/operations/timesheets');
  };

  const handleReject = () => {
    // Handle reject logic
    setShowRejectDialog(false);
    router.push('/operations/timesheets');
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
              <h1 className="text-2xl font-bold text-gray-900">Timesheet {timesheet.id}</h1>
              <Badge className={getStatusColor(timesheet.status)}>
                {timesheet.status}
              </Badge>
            </div>
            <p className="text-gray-600">Week ending {timesheet.weekEnding}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {timesheet.status === 'pending' && (
            <>
              <Button variant="outline" onClick={() => setShowRejectDialog(true)}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setShowApproveDialog(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Daily Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Time Entries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Break</TableHead>
                    <TableHead className="text-center">Hours</TableHead>
                    <TableHead className="text-center">Trips</TableHead>
                    <TableHead className="text-center">Miles</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheet.dailyEntries.map((entry) => (
                    <TableRow key={entry.date}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.day}</p>
                          <p className="text-sm text-gray-500">{entry.date}</p>
                        </div>
                      </TableCell>
                      <TableCell>{entry.clockIn || '-'}</TableCell>
                      <TableCell>{entry.clockOut || '-'}</TableCell>
                      <TableCell>{entry.breakTime || '-'}</TableCell>
                      <TableCell className="text-center font-medium">
                        {entry.totalHours > 0 ? `${entry.totalHours}h` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.trips > 0 ? entry.trips : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.miles > 0 ? entry.miles : '-'}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-500 max-w-[200px] truncate">
                          {entry.notes || '-'}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Details (Sample)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Miles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheet.tripDetails.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-mono text-sm">{trip.id}</TableCell>
                      <TableCell>{trip.date}</TableCell>
                      <TableCell>{trip.patient}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{trip.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{trip.miles} mi</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Driver Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Driver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{timesheet.driver.name}</p>
                  <p className="text-sm text-gray-500">{timesheet.driver.id}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{timesheet.driver.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle</span>
                  <span>{timesheet.driver.vehicle}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Week Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Regular Hours</span>
                  <span className="font-semibold">{timesheet.summary.regularHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime Hours</span>
                  <span className="font-semibold text-orange-600">+{timesheet.summary.overtimeHours}h</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Total Hours</span>
                  <span className="font-bold text-lg">{timesheet.summary.totalHours}h</span>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trips Completed</span>
                    <span className="font-semibold">{timesheet.summary.tripsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Miles</span>
                    <span className="font-semibold">{timesheet.summary.totalMiles} mi</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span>{timesheet.submittedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge className={getStatusColor(timesheet.status)}>
                    {timesheet.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overtime Alert */}
          {timesheet.summary.overtimeHours > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-orange-800">Overtime Recorded</p>
                    <p className="text-sm text-orange-700">
                      This timesheet includes {timesheet.summary.overtimeHours} hours of overtime.
                      Verify coverage requests before approving.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Timesheet</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this timesheet for {timesheet.driver.name}?
              This will mark {timesheet.summary.totalHours} hours for payroll processing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Timesheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Timesheet</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this timesheet. The driver will be notified.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject Timesheet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

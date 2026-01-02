'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CalendarDays,
  Send,
} from 'lucide-react';

// Mock time off requests
const mockRequests = [
  {
    id: 'PTO-001',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-20',
    days: 5,
    status: 'approved',
    reason: 'Family vacation',
    submittedAt: '2024-01-10',
    approvedBy: 'Mike Wilson',
    approvedAt: '2024-01-12',
  },
  {
    id: 'PTO-002',
    type: 'sick',
    startDate: '2024-01-18',
    endDate: '2024-01-18',
    days: 1,
    status: 'approved',
    reason: 'Medical appointment',
    submittedAt: '2024-01-15',
    approvedBy: 'Mike Wilson',
    approvedAt: '2024-01-15',
  },
  {
    id: 'PTO-003',
    type: 'personal',
    startDate: '2024-03-01',
    endDate: '2024-03-01',
    days: 1,
    status: 'pending',
    reason: 'Personal errand',
    submittedAt: '2024-01-16',
  },
  {
    id: 'PTO-004',
    type: 'vacation',
    startDate: '2023-12-23',
    endDate: '2023-12-26',
    days: 3,
    status: 'approved',
    reason: 'Holiday break',
    submittedAt: '2023-12-01',
    approvedBy: 'Mike Wilson',
    approvedAt: '2023-12-02',
  },
];

const balances = {
  vacation: { available: 10, used: 8, total: 18 },
  sick: { available: 5, used: 3, total: 8 },
  personal: { available: 2, used: 1, total: 3 },
};

export default function DriverTimeOffPage() {
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      denied: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-purple-100 text-purple-800',
      personal: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Off</h1>
          <p className="text-gray-600">Request and manage your time off</p>
        </div>
        <Button onClick={() => setShowRequestDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Time Off
        </Button>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vacation Days</p>
                <p className="text-2xl font-bold text-blue-600">{balances.vacation.available}</p>
                <p className="text-xs text-gray-500">
                  {balances.vacation.used} used of {balances.vacation.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sick Days</p>
                <p className="text-2xl font-bold text-purple-600">{balances.sick.available}</p>
                <p className="text-xs text-gray-500">
                  {balances.sick.used} used of {balances.sick.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Personal Days</p>
                <p className="text-2xl font-bold text-orange-600">{balances.personal.available}</p>
                <p className="text-xs text-gray-500">
                  {balances.personal.used} used of {balances.personal.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {mockRequests.some(r => r.status === 'pending') && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRequests
                .filter(r => r.status === 'pending')
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50"
                  >
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-yellow-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{request.id}</p>
                          <Badge className={getTypeColor(request.type)}>
                            {request.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          {request.startDate} - {request.endDate} ({request.days} day{request.days > 1 ? 's' : ''})
                        </p>
                        <p className="text-sm text-gray-600">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Time Off History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(request.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{request.id}</p>
                      <Badge className={getTypeColor(request.type)}>
                        {request.type}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {request.startDate} - {request.endDate} ({request.days} day{request.days > 1 ? 's' : ''})
                    </p>
                    <p className="text-sm text-gray-600">{request.reason}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Submitted: {request.submittedAt}</p>
                  {request.approvedBy && (
                    <p>Approved by: {request.approvedBy}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
            <DialogDescription>
              Submit a new time off request for approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation ({balances.vacation.available} days available)</SelectItem>
                  <SelectItem value="sick">Sick Leave ({balances.sick.available} days available)</SelectItem>
                  <SelectItem value="personal">Personal ({balances.personal.available} days available)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea placeholder="Brief description of why you need time off..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRequestDialog(false)}>
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

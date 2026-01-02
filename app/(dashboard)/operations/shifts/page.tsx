'use client';

import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Plus,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  Users,
  Sun,
  Moon,
  Sunrise,
} from 'lucide-react';

// Mock shift data
const mockShifts = [
  { id: 'SH-001', name: 'Morning', startTime: '6:00 AM', endTime: '2:00 PM', drivers: 8, color: 'bg-yellow-500' },
  { id: 'SH-002', name: 'Afternoon', startTime: '2:00 PM', endTime: '10:00 PM', drivers: 6, color: 'bg-orange-500' },
  { id: 'SH-003', name: 'Night', startTime: '10:00 PM', endTime: '6:00 AM', drivers: 3, color: 'bg-purple-500' },
];

const mockSchedule = {
  '2024-01-15': [
    { shiftId: 'SH-001', drivers: ['Michael J.', 'Sarah K.', 'David L.', 'Lisa M.', 'Emily C.'] },
    { shiftId: 'SH-002', drivers: ['James W.', 'Robert T.', 'Jennifer H.'] },
    { shiftId: 'SH-003', drivers: ['Thomas B.', 'Nancy D.'] },
  ],
  '2024-01-16': [
    { shiftId: 'SH-001', drivers: ['Michael J.', 'Sarah K.', 'David L.', 'Lisa M.'] },
    { shiftId: 'SH-002', drivers: ['James W.', 'Robert T.', 'Jennifer H.', 'Emily C.'] },
    { shiftId: 'SH-003', drivers: ['Thomas B.', 'Nancy D.'] },
  ],
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function OperationsShiftsPage() {
  const [showAddShiftDialog, setShowAddShiftDialog] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('Jan 15 - Jan 21, 2024');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-gray-600">Configure and manage driver shifts</p>
        </div>
        <Dialog open={showAddShiftDialog} onOpenChange={setShowAddShiftDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Shift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shift</DialogTitle>
              <DialogDescription>
                Define a new shift template for driver scheduling.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Shift Name</Label>
                <Input placeholder="e.g., Morning, Evening" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {['bg-yellow-500', 'bg-orange-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500'].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} hover:ring-2 hover:ring-offset-2`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddShiftDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddShiftDialog(false)}>Create Shift</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Shift Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shift Templates</h2>
        <div className="grid grid-cols-3 gap-4">
          {mockShifts.map((shift) => (
            <Card key={shift.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${shift.color} flex items-center justify-center`}>
                      {shift.name === 'Morning' && <Sunrise className="h-5 w-5 text-white" />}
                      {shift.name === 'Afternoon' && <Sun className="h-5 w-5 text-white" />}
                      {shift.name === 'Night' && <Moon className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold">{shift.name}</p>
                      <p className="text-sm text-gray-500">
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{shift.drivers} drivers assigned</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium px-4">{selectedWeek}</span>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="ml-4">
                <Copy className="h-4 w-4 mr-2" />
                Copy Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b w-32">Shift</th>
                  {weekDays.map((day, idx) => (
                    <th key={day} className="text-center p-2 border-b">
                      <div className="font-medium">{day}</div>
                      <div className="text-sm text-gray-500">Jan {15 + idx}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockShifts.map((shift) => (
                  <tr key={shift.id}>
                    <td className="p-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${shift.color}`} />
                        <span className="font-medium">{shift.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </td>
                    {weekDays.map((day, idx) => (
                      <td key={`${shift.id}-${day}`} className="p-2 border-b text-center">
                        <div className="min-h-[60px] border rounded-lg p-2 hover:bg-gray-50 cursor-pointer">
                          {idx < 5 ? (
                            <div className="space-y-1">
                              {['Driver 1', 'Driver 2', 'Driver 3'].slice(0, Math.floor(Math.random() * 3) + 1).map((d, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {d}
                                </Badge>
                              ))}
                              <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600">
                                + Add
                              </Button>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm flex items-center justify-center h-full">
                              <Button variant="ghost" size="sm" className="text-xs">
                                + Add
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Summary */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Morning Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Required</span>
                <span className="font-semibold">8 drivers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scheduled</span>
                <span className="font-semibold text-green-600">8 drivers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-green-600">Fully staffed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Afternoon Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Required</span>
                <span className="font-semibold">6 drivers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scheduled</span>
                <span className="font-semibold text-yellow-600">5 drivers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '83%' }} />
              </div>
              <p className="text-xs text-yellow-600">1 driver short</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Night Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Required</span>
                <span className="font-semibold">3 drivers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scheduled</span>
                <span className="font-semibold text-green-600">3 drivers</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-green-600">Fully staffed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

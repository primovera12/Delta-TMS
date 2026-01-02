'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  GraduationCap,
  Award,
  Clock,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Play,
  FileText,
  BookOpen,
} from 'lucide-react';

// Mock training data
const mockDriverTraining = [
  {
    id: 'DRV-001',
    name: 'Michael Johnson',
    requiredCourses: 5,
    completedCourses: 5,
    certifications: ['CPR', 'First Aid', 'Wheelchair Safety'],
    status: 'compliant',
    nextDue: null,
  },
  {
    id: 'DRV-002',
    name: 'Sarah Kim',
    requiredCourses: 5,
    completedCourses: 4,
    certifications: ['CPR', 'First Aid'],
    status: 'in_progress',
    nextDue: 'Jan 30, 2024',
  },
  {
    id: 'DRV-003',
    name: 'David Lee',
    requiredCourses: 5,
    completedCourses: 5,
    certifications: ['CPR', 'First Aid', 'Wheelchair Safety', 'Stretcher Training'],
    status: 'compliant',
    nextDue: null,
  },
  {
    id: 'DRV-004',
    name: 'Lisa Martinez',
    requiredCourses: 5,
    completedCourses: 3,
    certifications: ['CPR'],
    status: 'overdue',
    nextDue: 'Jan 10, 2024',
  },
  {
    id: 'DRV-005',
    name: 'James Wilson',
    requiredCourses: 5,
    completedCourses: 5,
    certifications: ['CPR', 'First Aid', 'Wheelchair Safety'],
    status: 'compliant',
    nextDue: null,
  },
];

const mockCourses = [
  {
    id: 'CRS-001',
    name: 'Defensive Driving',
    type: 'Required',
    duration: '2 hours',
    enrolled: 18,
    completed: 15,
    dueDate: 'Ongoing',
  },
  {
    id: 'CRS-002',
    name: 'Patient Handling & Safety',
    type: 'Required',
    duration: '1.5 hours',
    enrolled: 18,
    completed: 16,
    dueDate: 'Ongoing',
  },
  {
    id: 'CRS-003',
    name: 'CPR Certification',
    type: 'Certification',
    duration: '4 hours',
    enrolled: 18,
    completed: 18,
    dueDate: 'Annual',
  },
  {
    id: 'CRS-004',
    name: 'Wheelchair & Mobility Equipment',
    type: 'Required',
    duration: '2 hours',
    enrolled: 12,
    completed: 10,
    dueDate: 'For W/C drivers',
  },
  {
    id: 'CRS-005',
    name: 'HIPAA Compliance',
    type: 'Required',
    duration: '1 hour',
    enrolled: 18,
    completed: 17,
    dueDate: 'Annual',
  },
];

const mockCertifications = [
  { name: 'CPR Certification', required: 18, active: 18, expiringSoon: 2 },
  { name: 'First Aid', required: 18, active: 16, expiringSoon: 1 },
  { name: 'Wheelchair Safety', required: 12, active: 10, expiringSoon: 0 },
  { name: 'Stretcher Training', required: 6, active: 6, expiringSoon: 1 },
];

export default function OperationsTrainingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      compliant: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredDrivers = mockDriverTraining.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalDrivers: mockDriverTraining.length,
    compliant: mockDriverTraining.filter(d => d.status === 'compliant').length,
    inProgress: mockDriverTraining.filter(d => d.status === 'in_progress').length,
    overdue: mockDriverTraining.filter(d => d.status === 'overdue').length,
  };

  const complianceRate = Math.round((stats.compliant / stats.totalDrivers) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & Compliance</h1>
          <p className="text-gray-600">Manage driver training and certifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{complianceRate}%</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDrivers}</p>
              </div>
              <User className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliant</p>
                <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="drivers">
        <TabsList>
          <TabsTrigger value="drivers">Driver Compliance</TabsTrigger>
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search drivers..."
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
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Driver Training Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-gray-500">{driver.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{driver.completedCourses}/{driver.requiredCourses}</span>
                            <span>{Math.round((driver.completedCourses / driver.requiredCourses) * 100)}%</span>
                          </div>
                          <Progress
                            value={(driver.completedCourses / driver.requiredCourses) * 100}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {driver.certifications.slice(0, 2).map((cert, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                          {driver.certifications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{driver.certifications.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {driver.nextDue ? (
                          <span className={driver.status === 'overdue' ? 'text-red-600 font-medium' : ''}>
                            {driver.nextDue}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(driver.status)}>
                          {driver.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-sm text-gray-500">{course.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.type}</Badge>
                      </TableCell>
                      <TableCell>{course.duration}</TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{course.completed}/{course.enrolled}</span>
                          </div>
                          <Progress
                            value={(course.completed / course.enrolled) * 100}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{course.dueDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button size="sm">
                            <Play className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {mockCertifications.map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      {cert.name}
                    </CardTitle>
                    {cert.expiringSoon > 0 && (
                      <Badge variant="outline" className="text-orange-600">
                        {cert.expiringSoon} expiring soon
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Required</span>
                      <span className="font-medium">{cert.required} drivers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currently Active</span>
                      <span className="font-medium text-green-600">{cert.active} drivers</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Coverage</span>
                        <span>{Math.round((cert.active / cert.required) * 100)}%</span>
                      </div>
                      <Progress
                        value={(cert.active / cert.required) * 100}
                        className="h-2"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

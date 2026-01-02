'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  Play,
  CheckCircle,
  Clock,
  Award,
  FileText,
  Video,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Lock,
} from 'lucide-react';

// Mock training modules
const mockModules = [
  {
    id: 'MOD-001',
    title: 'Wheelchair Safety and Handling',
    description: 'Learn proper techniques for securing wheelchairs and assisting passengers',
    category: 'safety',
    duration: '45 min',
    status: 'completed',
    completedAt: '2024-01-05',
    score: 95,
    required: true,
  },
  {
    id: 'MOD-002',
    title: 'Patient Communication',
    description: 'Best practices for communicating with patients with various needs',
    category: 'customer_service',
    duration: '30 min',
    status: 'completed',
    completedAt: '2024-01-03',
    score: 88,
    required: true,
  },
  {
    id: 'MOD-003',
    title: 'Defensive Driving',
    description: 'Advanced driving techniques to prevent accidents',
    category: 'safety',
    duration: '60 min',
    status: 'in_progress',
    progress: 65,
    required: true,
  },
  {
    id: 'MOD-004',
    title: 'HIPAA Compliance',
    description: 'Understanding patient privacy and data protection',
    category: 'compliance',
    duration: '30 min',
    status: 'not_started',
    required: true,
  },
  {
    id: 'MOD-005',
    title: 'Emergency Response',
    description: 'How to handle medical emergencies during transport',
    category: 'safety',
    duration: '45 min',
    status: 'not_started',
    required: true,
  },
  {
    id: 'MOD-006',
    title: 'Vehicle Pre-Trip Inspection',
    description: 'Comprehensive guide to daily vehicle inspections',
    category: 'operations',
    duration: '20 min',
    status: 'completed',
    completedAt: '2024-01-02',
    score: 100,
    required: true,
  },
];

const mockCertifications = [
  {
    id: 'CERT-001',
    name: 'Wheelchair Passenger Assistance',
    issuedAt: '2024-01-05',
    expiresAt: '2025-01-05',
    status: 'valid',
  },
  {
    id: 'CERT-002',
    name: 'First Aid & CPR',
    issuedAt: '2023-08-15',
    expiresAt: '2024-08-15',
    status: 'valid',
  },
  {
    id: 'CERT-003',
    name: 'Defensive Driving',
    issuedAt: '2023-06-01',
    expiresAt: '2024-03-01',
    status: 'expiring_soon',
  },
];

export default function DriverTrainingPage() {
  const completedModules = mockModules.filter(m => m.status === 'completed').length;
  const totalRequired = mockModules.filter(m => m.required).length;
  const overallProgress = Math.round((completedModules / mockModules.length) * 100);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      not_started: 'bg-gray-100 text-gray-800',
      valid: 'bg-green-100 text-green-800',
      expiring_soon: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      safety: 'bg-red-100 text-red-800',
      customer_service: 'bg-blue-100 text-blue-800',
      compliance: 'bg-purple-100 text-purple-800',
      operations: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Center</h1>
          <p className="text-gray-600">Complete required training and certifications</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-lg font-bold">{completedModules} / {mockModules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-lg font-bold">
                  {mockModules.filter(m => m.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Certifications</p>
                <p className="text-lg font-bold">{mockCertifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Overall Progress</span>
                <span className="font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Training Modules</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          {/* Required Training Alert */}
          {mockModules.some(m => m.required && m.status !== 'completed') && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Required Training Pending</p>
                    <p className="text-sm text-yellow-700">
                      You have {totalRequired - completedModules} required training module(s) to complete.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Training Modules */}
          <div className="space-y-4">
            {mockModules.map((module) => (
              <Card key={module.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        module.status === 'completed' ? 'bg-green-100' :
                        module.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {module.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : module.status === 'in_progress' ? (
                          <Play className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Lock className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{module.title}</h3>
                          {module.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{module.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getCategoryColor(module.category)}>
                            {module.category.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {module.duration}
                          </span>
                          {module.status === 'completed' && module.score && (
                            <span className="text-sm text-green-600 font-medium">
                              Score: {module.score}%
                            </span>
                          )}
                        </div>
                        {module.status === 'in_progress' && module.progress && (
                          <div className="mt-2">
                            <Progress value={module.progress} className="h-1.5 w-48" />
                            <span className="text-xs text-gray-500">{module.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(module.status)}>
                        {module.status.replace('_', ' ')}
                      </Badge>
                      {module.status === 'completed' ? (
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      ) : module.status === 'in_progress' ? (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {mockCertifications.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{cert.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Issued: {cert.issuedAt}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires: {cert.expiresAt}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status === 'expiring_soon' ? 'Expiring Soon' : cert.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-1" />
                      View Certificate
                    </Button>
                    {cert.status === 'expiring_soon' && (
                      <Button size="sm" className="flex-1">
                        Renew
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Training History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockModules
                  .filter(m => m.status === 'completed')
                  .map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{module.title}</p>
                          <p className="text-sm text-gray-500">
                            Completed on {module.completedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-green-600">{module.score}%</p>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

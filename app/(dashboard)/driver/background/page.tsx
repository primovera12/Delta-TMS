'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Car,
  Scale,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

// Mock background check data
const backgroundCheckData = {
  status: 'approved',
  submittedAt: '2024-01-02',
  completedAt: '2024-01-05',
  validUntil: '2025-01-05',
  provider: 'Checkr',
  checks: [
    {
      type: 'SSN Verification',
      status: 'passed',
      completedAt: '2024-01-03',
    },
    {
      type: 'Criminal Background',
      status: 'passed',
      completedAt: '2024-01-04',
    },
    {
      type: 'Motor Vehicle Record',
      status: 'passed',
      completedAt: '2024-01-04',
    },
    {
      type: 'Sex Offender Registry',
      status: 'passed',
      completedAt: '2024-01-03',
    },
    {
      type: 'National Criminal Database',
      status: 'passed',
      completedAt: '2024-01-05',
    },
    {
      type: 'Drug Screening',
      status: 'passed',
      completedAt: '2024-01-05',
    },
  ],
};

const previousChecks = [
  {
    id: 'BGC-002',
    submittedAt: '2023-01-02',
    completedAt: '2023-01-06',
    status: 'approved',
    validUntil: '2024-01-06',
  },
  {
    id: 'BGC-001',
    submittedAt: '2022-01-03',
    completedAt: '2022-01-08',
    status: 'approved',
    validUntil: '2023-01-08',
  },
];

export default function DriverBackgroundPage() {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      passed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_review: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCheckIcon = (type: string) => {
    if (type.includes('SSN') || type.includes('Criminal') || type.includes('National')) {
      return <User className="h-5 w-5" />;
    } else if (type.includes('Motor')) {
      return <Car className="h-5 w-5" />;
    } else if (type.includes('Sex Offender')) {
      return <Shield className="h-5 w-5" />;
    } else if (type.includes('Drug')) {
      return <Scale className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  const passedChecks = backgroundCheckData.checks.filter(c => c.status === 'passed').length;
  const totalChecks = backgroundCheckData.checks.length;
  const completionPercent = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Background Check</h1>
          <p className="text-gray-600">View your background check status and history</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Request New Check
        </Button>
      </div>

      {/* Current Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                backgroundCheckData.status === 'approved' ? 'bg-green-100' :
                backgroundCheckData.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {backgroundCheckData.status === 'approved' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : backgroundCheckData.status === 'pending' ? (
                  <Clock className="h-8 w-8 text-yellow-600" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Current Background Check</h2>
                  <Badge className={getStatusColor(backgroundCheckData.status)}>
                    {backgroundCheckData.status}
                  </Badge>
                </div>
                <p className="text-gray-500 mt-1">
                  Provider: {backgroundCheckData.provider}
                </p>
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="font-medium">{backgroundCheckData.submittedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="font-medium">{backgroundCheckData.completedAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="font-medium text-green-600">{backgroundCheckData.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Check Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Verification Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {passedChecks}/{totalChecks} checks passed
              </span>
              <Progress value={completionPercent} className="w-24 h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {backgroundCheckData.checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    check.status === 'passed' ? 'bg-green-100 text-green-600' :
                    check.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {getCheckIcon(check.type)}
                  </div>
                  <div>
                    <p className="font-medium">{check.type}</p>
                    <p className="text-xs text-gray-500">
                      {check.status === 'passed' ? `Completed ${check.completedAt}` : 'Pending'}
                    </p>
                  </div>
                </div>
                {check.status === 'passed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">About Background Checks</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Background checks are required annually to maintain active driver status</li>
                <li>• Checks include criminal history, driving record, and drug screening</li>
                <li>• You will be notified 30 days before your check expires</li>
                <li>• All information is kept confidential and secure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Previous Background Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {previousChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{check.id}</p>
                    <p className="text-sm text-gray-500">
                      {check.submittedAt} - {check.completedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Valid Until</p>
                    <p className="text-sm">{check.validUntil}</p>
                  </div>
                  <Badge className={getStatusColor(check.status === 'approved' && new Date(check.validUntil) < new Date() ? 'expired' : check.status)}>
                    {new Date(check.validUntil) < new Date() ? 'Expired' : check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

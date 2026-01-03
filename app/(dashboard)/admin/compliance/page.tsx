'use client';

import * as React from 'react';
import { Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Simple compliance data
const complianceItems = [
  { id: '1', name: "Driver's License - John Smith", status: 'expiring', category: 'Driver' },
  { id: '2', name: "Driver's License - Sarah Johnson", status: 'compliant', category: 'Driver' },
  { id: '3', name: 'Background Check - Mike Davis', status: 'expired', category: 'Driver' },
  { id: '4', name: 'Vehicle Registration - Van #102', status: 'compliant', category: 'Vehicle' },
  { id: '5', name: 'Annual Inspection - Van #103', status: 'compliant', category: 'Vehicle' },
  { id: '6', name: 'General Liability Insurance', status: 'compliant', category: 'Company' },
  { id: '7', name: 'CPR Certification - John Smith', status: 'expiring', category: 'Training' },
  { id: '8', name: 'HIPAA Training - All Staff', status: 'missing', category: 'Training' },
];

export default function AdminCompliancePage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge variant="success">Compliant</Badge>;
      case 'expiring':
        return <Badge variant="warning">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="error">Expired</Badge>;
      case 'missing':
        return <Badge variant="error">Missing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'expiring':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'expired':
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const compliantCount = complianceItems.filter(i => i.status === 'compliant').length;
  const issueCount = complianceItems.length - compliantCount;
  const complianceRate = Math.round((compliantCount / complianceItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Compliance Dashboard</h1>
        <p className="text-sm text-gray-500">Monitor regulatory compliance and document expiration</p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{complianceRate}%</h2>
              <p className="text-gray-600">Overall Compliance Rate</p>
            </div>
            <div className="ml-auto flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{compliantCount}</p>
                <p className="text-sm text-gray-500">Compliant</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{issueCount}</p>
                <p className="text-sm text-gray-500">Need Attention</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle>All Compliance Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {complianceItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(item.status)}
                  <Button variant="secondary" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

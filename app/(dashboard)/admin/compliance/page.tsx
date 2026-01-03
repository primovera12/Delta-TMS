'use client';

import * as React from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Users,
  Truck,
  Calendar,
  Download,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComplianceItem {
  id: string;
  category: 'driver' | 'vehicle' | 'company' | 'training';
  name: string;
  status: 'compliant' | 'expiring' | 'expired' | 'missing';
  expirationDate?: string;
  lastUpdated: string;
  owner?: string;
  details?: string;
}

interface ComplianceMetric {
  label: string;
  value: number;
  total: number;
  status: 'good' | 'warning' | 'critical';
}

const complianceMetrics: ComplianceMetric[] = [
  { label: 'Driver Licenses', value: 45, total: 48, status: 'warning' },
  { label: 'Vehicle Inspections', value: 32, total: 32, status: 'good' },
  { label: 'Insurance Policies', value: 32, total: 32, status: 'good' },
  { label: 'Training Certifications', value: 42, total: 48, status: 'warning' },
];

const mockComplianceItems: ComplianceItem[] = [
  // Drivers
  { id: '1', category: 'driver', name: "Driver's License - John Smith", status: 'expiring', expirationDate: '2024-02-15', lastUpdated: '2023-02-15', owner: 'John Smith' },
  { id: '2', category: 'driver', name: "Driver's License - Sarah Johnson", status: 'compliant', expirationDate: '2025-08-20', lastUpdated: '2023-08-20', owner: 'Sarah Johnson' },
  { id: '3', category: 'driver', name: 'Background Check - Mike Davis', status: 'expired', expirationDate: '2024-01-01', lastUpdated: '2023-01-01', owner: 'Mike Davis' },
  { id: '4', category: 'driver', name: 'DOT Medical Card - Emily Brown', status: 'expiring', expirationDate: '2024-02-28', lastUpdated: '2022-02-28', owner: 'Emily Brown' },
  // Vehicles
  { id: '5', category: 'vehicle', name: 'Vehicle Registration - Van #102', status: 'compliant', expirationDate: '2024-12-31', lastUpdated: '2024-01-01', owner: 'Van #102' },
  { id: '6', category: 'vehicle', name: 'Annual Inspection - Van #103', status: 'compliant', expirationDate: '2024-06-15', lastUpdated: '2023-06-15', owner: 'Van #103' },
  { id: '7', category: 'vehicle', name: 'Wheelchair Lift Certification - Van #104', status: 'expiring', expirationDate: '2024-02-10', lastUpdated: '2023-02-10', owner: 'Van #104' },
  // Company
  { id: '8', category: 'company', name: 'General Liability Insurance', status: 'compliant', expirationDate: '2024-12-31', lastUpdated: '2024-01-01' },
  { id: '9', category: 'company', name: 'Commercial Auto Insurance', status: 'compliant', expirationDate: '2024-12-31', lastUpdated: '2024-01-01' },
  { id: '10', category: 'company', name: "Workers' Compensation", status: 'compliant', expirationDate: '2024-06-30', lastUpdated: '2023-07-01' },
  { id: '11', category: 'company', name: 'NEMT Provider License', status: 'compliant', expirationDate: '2025-03-31', lastUpdated: '2024-01-15' },
  // Training
  { id: '12', category: 'training', name: 'CPR Certification - John Smith', status: 'expiring', expirationDate: '2024-02-20', lastUpdated: '2022-02-20', owner: 'John Smith' },
  { id: '13', category: 'training', name: 'Defensive Driving - Sarah Johnson', status: 'compliant', expirationDate: '2024-08-15', lastUpdated: '2023-08-15', owner: 'Sarah Johnson' },
  { id: '14', category: 'training', name: 'HIPAA Training - All Staff', status: 'missing', lastUpdated: '2023-01-01', details: '6 drivers need to complete' },
  { id: '15', category: 'training', name: 'Wheelchair Securement - Mike Davis', status: 'expired', expirationDate: '2024-01-10', lastUpdated: '2023-01-10', owner: 'Mike Davis' },
];

// Safe date formatting function
function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

export default function AdminCompliancePage() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

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
        return <CheckCircle2 className="h-5 w-5 text-success-600" />;
      case 'expiring':
        return <AlertTriangle className="h-5 w-5 text-warning-600" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-error-600" />;
      case 'missing':
        return <AlertCircle className="h-5 w-5 text-error-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'driver':
        return <Users className="h-5 w-5" />;
      case 'vehicle':
        return <Truck className="h-5 w-5" />;
      case 'company':
        return <Building2 className="h-5 w-5" />;
      case 'training':
        return <FileText className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const expiredCount = mockComplianceItems.filter((i) => i.status === 'expired' || i.status === 'missing').length;
  const expiringCount = mockComplianceItems.filter((i) => i.status === 'expiring').length;
  const compliantCount = mockComplianceItems.filter((i) => i.status === 'compliant').length;
  const overallComplianceRate = Math.round((compliantCount / mockComplianceItems.length) * 100);

  const itemsByCategory = {
    driver: mockComplianceItems.filter((i) => i.category === 'driver'),
    vehicle: mockComplianceItems.filter((i) => i.category === 'vehicle'),
    company: mockComplianceItems.filter((i) => i.category === 'company'),
    training: mockComplianceItems.filter((i) => i.category === 'training'),
  };

  const urgentItems = mockComplianceItems.filter((i) => i.status === 'expired' || i.status === 'missing' || i.status === 'expiring');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Compliance Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor regulatory compliance and document expiration</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={expiredCount > 0 ? 'border-error-200 bg-error-50' : expiringCount > 0 ? 'border-warning-200 bg-warning-50' : 'border-success-200 bg-success-50'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                expiredCount > 0 ? 'bg-error-100' : expiringCount > 0 ? 'bg-warning-100' : 'bg-success-100'
              }`}>
                <Shield className={`h-8 w-8 ${
                  expiredCount > 0 ? 'text-error-600' : expiringCount > 0 ? 'text-warning-600' : 'text-success-600'
                }`} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{overallComplianceRate}%</h2>
                <p className={`text-lg font-medium ${
                  expiredCount > 0 ? 'text-error-700' : expiringCount > 0 ? 'text-warning-700' : 'text-success-700'
                }`}>
                  {expiredCount > 0
                    ? 'Action Required'
                    : expiringCount > 0
                    ? 'Attention Needed'
                    : 'Fully Compliant'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-success-600">{compliantCount}</p>
                  <p className="text-sm text-gray-500">Compliant</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning-600">{expiringCount}</p>
                  <p className="text-sm text-gray-500">Expiring</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-error-600">{expiredCount}</p>
                  <p className="text-sm text-gray-500">Action Needed</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {complianceMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{metric.label}</span>
                <Badge
                  variant={
                    metric.status === 'good'
                      ? 'success'
                      : metric.status === 'warning'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {metric.value}/{metric.total}
                </Badge>
              </div>
              <Progress
                value={(metric.value / metric.total) * 100}
                className={`h-2 ${
                  metric.status === 'good'
                    ? '[&>div]:bg-success-500'
                    : metric.status === 'warning'
                    ? '[&>div]:bg-warning-500'
                    : '[&>div]:bg-error-500'
                }`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Urgent Items */}
      {urgentItems.length > 0 && (
        <Card className="border-warning-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-warning-700">
              <AlertTriangle className="h-5 w-5" />
              Items Requiring Attention ({urgentItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.expirationDate
                          ? `Expires: ${formatDate(item.expirationDate)}`
                          : item.details}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
            {urgentItems.length > 5 && (
              <Button variant="ghost" className="mt-2">
                View all {urgentItems.length} items
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drivers">
            Drivers
            {itemsByCategory.driver.filter((i) => i.status !== 'compliant').length > 0 && (
              <Badge variant="error" className="ml-2">
                {itemsByCategory.driver.filter((i) => i.status !== 'compliant').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {Object.entries(itemsByCategory).map(([category, items]) => {
              const categoryLabels: Record<string, string> = {
                driver: 'Driver Documents',
                vehicle: 'Vehicle Compliance',
                company: 'Company Policies',
                training: 'Training & Certifications',
              };
              const nonCompliant = items.filter((i) => i.status !== 'compliant').length;

              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {categoryLabels[category]}
                      </span>
                      {nonCompliant > 0 ? (
                        <Badge variant="warning">{nonCompliant} needs attention</Badge>
                      ) : (
                        <Badge variant="success">All compliant</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {items.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-700 truncate flex-1">{item.name}</span>
                          {getStatusBadge(item.status)}
                        </div>
                      ))}
                    </div>
                    {items.length > 4 && (
                      <Button
                        variant="ghost"
                        className="mt-2 p-0"
                        onClick={() => setActiveTab(category === 'driver' ? 'drivers' : category)}
                      >
                        View all {items.length} items
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {['drivers', 'vehicles', 'company', 'training'].map((tab) => {
          const category = tab === 'drivers' ? 'driver' : tab;
          const items = itemsByCategory[category as keyof typeof itemsByCategory];

          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {item.owner && <span>{item.owner}</span>}
                              {item.expirationDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Expires: {formatDate(item.expirationDate)}
                                </span>
                              )}
                              {item.details && <span>{item.details}</span>}
                            </div>
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
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Clock,
  Search,
  Download,
  Plus,
  ChevronRight,
  Building2,
  Truck,
  User,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Compliance item types
interface ComplianceItem {
  id: string;
  name: string;
  type: string;
  category: 'driver' | 'vehicle' | 'company' | 'training';
  status: 'compliant' | 'expiring' | 'expired' | 'missing';
  expirationDate?: string;
  lastUpdated?: string;
  assignedTo?: string;
}

// Sample compliance data
const complianceData: ComplianceItem[] = [
  { id: '1', name: "Driver's License", type: 'License', category: 'driver', status: 'compliant', expirationDate: '2026-08-15', assignedTo: 'John Smith' },
  { id: '2', name: "Driver's License", type: 'License', category: 'driver', status: 'expiring', expirationDate: '2026-02-28', assignedTo: 'Sarah Johnson' },
  { id: '3', name: 'Background Check', type: 'Certification', category: 'driver', status: 'expired', expirationDate: '2025-12-01', assignedTo: 'Mike Davis' },
  { id: '4', name: 'Medical Certificate', type: 'Certificate', category: 'driver', status: 'compliant', expirationDate: '2026-06-30', assignedTo: 'Emily Chen' },
  { id: '5', name: 'Vehicle Registration', type: 'Registration', category: 'vehicle', status: 'compliant', expirationDate: '2026-12-31', assignedTo: 'Van #102' },
  { id: '6', name: 'Annual Inspection', type: 'Inspection', category: 'vehicle', status: 'expiring', expirationDate: '2026-01-31', assignedTo: 'Van #103' },
  { id: '7', name: 'Vehicle Insurance', type: 'Insurance', category: 'vehicle', status: 'compliant', expirationDate: '2026-09-15', assignedTo: 'Van #101' },
  { id: '8', name: 'General Liability Insurance', type: 'Insurance', category: 'company', status: 'compliant', expirationDate: '2026-07-01' },
  { id: '9', name: 'Workers Compensation', type: 'Insurance', category: 'company', status: 'compliant', expirationDate: '2026-07-01' },
  { id: '10', name: 'Business License', type: 'License', category: 'company', status: 'compliant', expirationDate: '2026-12-31' },
  { id: '11', name: 'CPR Certification', type: 'Training', category: 'training', status: 'expiring', expirationDate: '2026-02-15', assignedTo: 'John Smith' },
  { id: '12', name: 'Defensive Driving', type: 'Training', category: 'training', status: 'compliant', expirationDate: '2026-11-30', assignedTo: 'All Drivers' },
  { id: '13', name: 'HIPAA Training', type: 'Training', category: 'training', status: 'missing', assignedTo: 'New Hires' },
  { id: '14', name: 'First Aid Certification', type: 'Training', category: 'training', status: 'compliant', expirationDate: '2026-08-20', assignedTo: 'Sarah Johnson' },
];

const categoryIcons = {
  driver: User,
  vehicle: Truck,
  company: Building2,
  training: GraduationCap,
};

const categoryLabels = {
  driver: 'Driver',
  vehicle: 'Vehicle',
  company: 'Company',
  training: 'Training',
};

export default function AdminCompliancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Filter items
  const filteredItems = complianceData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesStatus = !selectedStatus || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: complianceData.length,
    compliant: complianceData.filter(i => i.status === 'compliant').length,
    expiring: complianceData.filter(i => i.status === 'expiring').length,
    expired: complianceData.filter(i => i.status === 'expired').length,
    missing: complianceData.filter(i => i.status === 'missing').length,
  };

  const complianceRate = Math.round((stats.compliant / stats.total) * 100);

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
      case 'missing':
        return <XCircle className="h-5 w-5 text-error-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Compliance Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor regulatory compliance and document expiration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-900">{complianceRate}%</p>
                <p className="text-sm text-gray-500">Overall Compliance Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStatus === 'compliant' ? 'ring-2 ring-success-500' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'compliant' ? null : 'compliant')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success-600">{stats.compliant}</p>
                <p className="text-sm text-gray-500">Compliant</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStatus === 'expiring' ? 'ring-2 ring-warning-500' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'expiring' ? null : 'expiring')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-warning-600">{stats.expiring}</p>
                <p className="text-sm text-gray-500">Expiring Soon</p>
              </div>
              <Clock className="h-8 w-8 text-warning-200" />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedStatus === 'expired' || selectedStatus === 'missing' ? 'ring-2 ring-error-500' : ''}`}
          onClick={() => setSelectedStatus(selectedStatus === 'expired' ? null : 'expired')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-error-600">{stats.expired + stats.missing}</p>
                <p className="text-sm text-gray-500">Need Attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-error-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const Icon = categoryIcons[key as keyof typeof categoryIcons];
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          );
        })}
      </div>

      {/* Search and Items List */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Items</CardTitle>
              <CardDescription>{filteredItems.length} items</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No compliance items found</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const CategoryIcon = categoryIcons[item.category];
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <Badge variant="outline" size="sm">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {categoryLabels[item.category]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          {item.assignedTo && <span>{item.assignedTo}</span>}
                          {item.expirationDate && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {formatDate(item.expirationDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(item.status)}
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

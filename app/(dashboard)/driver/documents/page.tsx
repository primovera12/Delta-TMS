'use client';

import * as React from 'react';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Shield,
  Car,
  Award,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentManager, type Document } from '@/components/domain/document-manager';

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    name: 'Driver License',
    type: 'application/pdf',
    category: 'license',
    status: 'valid',
    fileUrl: '/documents/license.pdf',
    fileSize: 1024 * 512,
    expirationDate: '2027-05-15',
    uploadedAt: '2025-06-01T10:00:00Z',
    uploadedBy: 'Self',
  },
  {
    id: 'DOC-002',
    name: 'Auto Insurance',
    type: 'application/pdf',
    category: 'insurance',
    status: 'expiring',
    fileUrl: '/documents/insurance.pdf',
    fileSize: 1024 * 256,
    expirationDate: '2026-02-01',
    uploadedAt: '2025-02-01T14:30:00Z',
    uploadedBy: 'Self',
  },
  {
    id: 'DOC-003',
    name: 'CPR Certification',
    type: 'image/jpeg',
    category: 'certification',
    status: 'valid',
    fileUrl: '/documents/cpr-cert.jpg',
    fileSize: 1024 * 1024,
    expirationDate: '2027-03-20',
    uploadedAt: '2025-03-20T09:00:00Z',
    uploadedBy: 'Self',
  },
  {
    id: 'DOC-004',
    name: 'Background Check',
    type: 'application/pdf',
    category: 'background',
    status: 'valid',
    fileUrl: '/documents/background.pdf',
    fileSize: 1024 * 384,
    uploadedAt: '2025-01-15T11:00:00Z',
    uploadedBy: 'Admin',
  },
  {
    id: 'DOC-005',
    name: 'Vehicle Registration',
    type: 'application/pdf',
    category: 'vehicle',
    status: 'valid',
    fileUrl: '/documents/registration.pdf',
    fileSize: 1024 * 128,
    expirationDate: '2026-12-31',
    uploadedAt: '2025-01-01T08:00:00Z',
    uploadedBy: 'Self',
  },
  {
    id: 'DOC-006',
    name: 'Vehicle Inspection',
    type: 'application/pdf',
    category: 'vehicle',
    status: 'expired',
    fileUrl: '/documents/inspection.pdf',
    fileSize: 1024 * 192,
    expirationDate: '2025-12-31',
    uploadedAt: '2025-01-02T10:00:00Z',
    uploadedBy: 'Self',
  },
];

const documentRequirements = [
  { category: 'license', name: 'Driver License', icon: Shield, required: true },
  { category: 'insurance', name: 'Auto Insurance', icon: Car, required: true },
  { category: 'certification', name: 'CPR/First Aid Certification', icon: Award, required: true },
  { category: 'background', name: 'Background Check', icon: FileText, required: true },
  { category: 'vehicle', name: 'Vehicle Registration', icon: Car, required: true },
  { category: 'vehicle', name: 'Vehicle Inspection', icon: Car, required: true },
];

export default function DriverDocumentsPage() {
  const [documents, setDocuments] = React.useState<Document[]>(mockDocuments);

  const handleUpload = (file: File, category: Document['category'], expirationDate?: string) => {
    const newDoc: Document = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      type: file.type,
      category,
      status: 'pending',
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      expirationDate,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Self',
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const validCount = documents.filter((d) => d.status === 'valid').length;
  const expiringCount = documents.filter((d) => d.status === 'expiring').length;
  const expiredCount = documents.filter((d) => d.status === 'expired').length;
  const pendingCount = documents.filter((d) => d.status === 'pending').length;

  const compliancePercentage = Math.round(
    (validCount / documentRequirements.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Documents</h1>
          <p className="text-sm text-gray-500">
            Manage your licenses, certifications, and vehicle documents
          </p>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{validCount}</p>
                <p className="text-sm text-gray-500">Valid Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiringCount}</p>
                <p className="text-sm text-gray-500">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-error-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{expiredCount}</p>
                <p className="text-sm text-gray-500">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{compliancePercentage}%</p>
                <p className="text-sm text-gray-500">Compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Manager */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentManager
                documents={documents}
                entityType="driver"
                entityId="current-driver"
                onUpload={handleUpload}
                onDelete={handleDelete}
                onView={(doc) => window.open(doc.fileUrl, '_blank')}
                onDownload={(doc) => {
                  const link = document.createElement('a');
                  link.href = doc.fileUrl;
                  link.download = doc.name;
                  link.click();
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Requirements Checklist */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Required Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documentRequirements.map((req, index) => {
                  const hasDocument = documents.some(
                    (d) =>
                      d.category === req.category &&
                      (d.status === 'valid' || d.status === 'expiring')
                  );
                  const Icon = req.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            hasDocument
                              ? 'bg-success-100 text-success-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {hasDocument ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            hasDocument ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {req.name}
                        </span>
                      </div>
                      {hasDocument ? (
                        <Badge variant="success" size="sm">
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">
                          Missing
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Expiration Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Expirations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents
                  .filter((d) => d.expirationDate)
                  .sort(
                    (a, b) =>
                      new Date(a.expirationDate!).getTime() -
                      new Date(b.expirationDate!).getTime()
                  )
                  .slice(0, 5)
                  .map((doc) => {
                    const expDate = new Date(doc.expirationDate!);
                    const daysUntil = Math.ceil(
                      (expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar
                            className={`h-4 w-4 ${
                              daysUntil <= 0
                                ? 'text-error-500'
                                : daysUntil <= 30
                                ? 'text-warning-500'
                                : 'text-gray-400'
                            }`}
                          />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            daysUntil <= 0
                              ? 'text-error-600'
                              : daysUntil <= 30
                              ? 'text-warning-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {daysUntil <= 0
                            ? 'Expired'
                            : daysUntil === 1
                            ? '1 day'
                            : `${daysUntil} days`}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-primary-900">Need help?</p>
                  <p className="text-sm text-primary-700 mt-1">
                    Contact the office if you have questions about document
                    requirements or need assistance uploading files.
                  </p>
                  <p className="text-sm text-primary-600 font-medium mt-2">
                    (713) 555-0100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

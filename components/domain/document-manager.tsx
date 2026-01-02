'use client';

import * as React from 'react';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Plus,
  X,
  File,
  Image,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface Document {
  id: string;
  name: string;
  type: string;
  category: 'license' | 'insurance' | 'certification' | 'background' | 'vehicle' | 'other';
  status: 'valid' | 'expiring' | 'expired' | 'pending';
  fileUrl: string;
  fileSize: number;
  expirationDate?: string;
  uploadedAt: string;
  uploadedBy: string;
}

const categoryLabels: Record<Document['category'], string> = {
  license: 'Driver License',
  insurance: 'Insurance',
  certification: 'Certification',
  background: 'Background Check',
  vehicle: 'Vehicle Document',
  other: 'Other',
};

const statusConfig: Record<Document['status'], { label: string; variant: 'success' | 'warning' | 'error' | 'secondary'; icon: typeof CheckCircle }> = {
  valid: { label: 'Valid', variant: 'success', icon: CheckCircle },
  expiring: { label: 'Expiring Soon', variant: 'warning', icon: AlertCircle },
  expired: { label: 'Expired', variant: 'error', icon: AlertCircle },
  pending: { label: 'Pending Review', variant: 'secondary', icon: Clock },
};

const getFileIcon = (type: string) => {
  if (type.includes('image')) return Image;
  if (type.includes('spreadsheet') || type.includes('excel')) return FileSpreadsheet;
  return FileText;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface DocumentManagerProps {
  documents: Document[];
  entityType: 'driver' | 'vehicle' | 'facility';
  entityId: string;
  onUpload?: (file: File, category: Document['category'], expirationDate?: string) => void;
  onDelete?: (documentId: string) => void;
  onView?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  editable?: boolean;
}

export function DocumentManager({
  documents,
  entityType,
  entityId,
  onUpload,
  onDelete,
  onView,
  onDownload,
  editable = true,
}: DocumentManagerProps) {
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = React.useState<Document['category']>('other');
  const [expirationDate, setExpirationDate] = React.useState('');
  const [dragOver, setDragOver] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadFile(file);
      setShowUploadModal(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setShowUploadModal(true);
    }
  };

  const handleUpload = () => {
    if (uploadFile && onUpload) {
      onUpload(uploadFile, uploadCategory, expirationDate || undefined);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadCategory('other');
      setExpirationDate('');
    }
  };

  const expiringCount = documents.filter((d) => d.status === 'expiring').length;
  const expiredCount = documents.filter((d) => d.status === 'expired').length;

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {(expiringCount > 0 || expiredCount > 0) && (
        <div className="flex gap-4">
          {expiredCount > 0 && (
            <div className="flex-1 p-3 rounded-lg bg-error-50 border border-error-200 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-error-600" />
              <span className="text-sm text-error-700">
                {expiredCount} document{expiredCount !== 1 ? 's' : ''} expired
              </span>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex-1 p-3 rounded-lg bg-warning-50 border border-warning-200 flex items-center gap-3">
              <Clock className="h-5 w-5 text-warning-600" />
              <span className="text-sm text-warning-700">
                {expiringCount} document{expiringCount !== 1 ? 's' : ''} expiring soon
              </span>
            </div>
          )}
        </div>
      )}

      {/* Upload Zone */}
      {editable && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-400">
            Supports PDF, JPG, PNG up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Document List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p>No documents uploaded</p>
          </div>
        ) : (
          documents.map((doc) => {
            const status = statusConfig[doc.status];
            const StatusIcon = status.icon;
            const FileIcon = getFileIcon(doc.type);

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <Badge variant={status.variant} size="sm">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span>{categoryLabels[doc.category]}</span>
                      <span>•</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                      {doc.expirationDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Expires: {doc.expirationDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  {editable && onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(doc.id)}
                      className="text-error-600 hover:text-error-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* File Preview */}
              <div className="p-4 rounded-lg bg-gray-50 flex items-center gap-3">
                <File className="h-8 w-8 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {uploadFile?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {uploadFile && formatFileSize(uploadFile.size)}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Document Category</Label>
                <Select
                  value={uploadCategory}
                  onValueChange={(value) => setUploadCategory(value as Document['category'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="license">Driver License</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="background">Background Check</SelectItem>
                    <SelectItem value="vehicle">Vehicle Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expiration Date */}
              <div className="space-y-2">
                <Label>Expiration Date (Optional)</Label>
                <Input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact document list for cards
interface DocumentListProps {
  documents: Document[];
  maxShow?: number;
  onViewAll?: () => void;
}

export function DocumentList({ documents, maxShow = 3, onViewAll }: DocumentListProps) {
  const shownDocs = documents.slice(0, maxShow);
  const remaining = documents.length - maxShow;

  return (
    <div className="space-y-2">
      {shownDocs.map((doc) => {
        const status = statusConfig[doc.status];
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-700">{doc.name}</span>
            </div>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </div>
        );
      })}
      {remaining > 0 && onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View {remaining} more document{remaining !== 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}

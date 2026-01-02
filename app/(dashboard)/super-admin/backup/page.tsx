'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Database,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Trash2,
  RefreshCw,
  HardDrive,
} from 'lucide-react';

// Mock backup data
const mockBackups = [
  {
    id: 'BKP-001',
    type: 'Full',
    status: 'completed',
    size: '12.4 GB',
    createdAt: '2024-01-15 06:00 AM',
    duration: '45 min',
    retention: '30 days',
  },
  {
    id: 'BKP-002',
    type: 'Incremental',
    status: 'completed',
    size: '1.2 GB',
    createdAt: '2024-01-14 06:00 AM',
    duration: '8 min',
    retention: '7 days',
  },
  {
    id: 'BKP-003',
    type: 'Full',
    status: 'completed',
    size: '12.1 GB',
    createdAt: '2024-01-08 06:00 AM',
    duration: '42 min',
    retention: '30 days',
  },
  {
    id: 'BKP-004',
    type: 'Incremental',
    status: 'completed',
    size: '0.8 GB',
    createdAt: '2024-01-07 06:00 AM',
    duration: '5 min',
    retention: '7 days',
  },
  {
    id: 'BKP-005',
    type: 'Full',
    status: 'completed',
    size: '11.9 GB',
    createdAt: '2024-01-01 06:00 AM',
    duration: '40 min',
    retention: '90 days',
  },
];

export default function SuperAdminBackupPage() {
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-800';
    if (status === 'failed') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleStartBackup = () => {
    setBackupInProgress(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackupInProgress(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestore = (backupId: string) => {
    setSelectedBackup(backupId);
    setShowRestoreDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-gray-600">Manage database backups and disaster recovery</p>
        </div>
        <Button onClick={handleStartBackup} disabled={backupInProgress}>
          {backupInProgress ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {backupInProgress ? 'Backup in Progress...' : 'Start Backup'}
        </Button>
      </div>

      {/* Backup Progress */}
      {backupInProgress && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Creating full backup...</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Backups</p>
                <p className="text-2xl font-bold">{mockBackups.length}</p>
              </div>
              <Database className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">38.4 GB</p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Backup</p>
                <p className="text-2xl font-bold text-green-600">6h ago</p>
              </div>
              <Clock className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Scheduled</p>
                <p className="text-2xl font-bold">18h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Backup Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Full Backup</span>
              </div>
              <p className="text-sm text-gray-500">Every Sunday at 6:00 AM</p>
              <p className="text-xs text-gray-400 mt-1">Retention: 30 days</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-500" />
                <span className="font-medium">Incremental</span>
              </div>
              <p className="text-sm text-gray-500">Daily at 6:00 AM</p>
              <p className="text-xs text-gray-400 mt-1">Retention: 7 days</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Monthly Archive</span>
              </div>
              <p className="text-sm text-gray-500">1st of month at 2:00 AM</p>
              <p className="text-xs text-gray-400 mt-1">Retention: 1 year</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Backup History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Retention</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBackups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-mono">{backup.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{backup.type}</Badge>
                  </TableCell>
                  <TableCell>{backup.createdAt}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>{backup.duration}</TableCell>
                  <TableCell>{backup.retention}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(backup.status)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {backup.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(backup.id)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Restore Backup
            </DialogTitle>
            <DialogDescription>
              This will restore the database to the state from backup {selectedBackup}.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> All data created after this backup will be lost.
              Make sure to create a backup of the current state before proceeding.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowRestoreDialog(false);
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Restore Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

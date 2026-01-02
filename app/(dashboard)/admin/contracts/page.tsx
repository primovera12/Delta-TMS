'use client';

import * as React from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Contract {
  id: string;
  contractNumber: string;
  clientName: string;
  clientType: 'facility' | 'insurance' | 'broker' | 'government';
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired' | 'pending' | 'terminated';
  totalValue: number;
  billedAmount: number;
  terms: string;
  autoRenew: boolean;
  contactName: string;
  contactEmail: string;
}

const mockContracts: Contract[] = [
  {
    id: '1',
    contractNumber: 'CTR-2024-001',
    clientName: 'Sunrise Senior Living',
    clientType: 'facility',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    totalValue: 150000,
    billedAmount: 45000,
    terms: 'Monthly billing, net 30',
    autoRenew: true,
    contactName: 'Sarah Johnson',
    contactEmail: 'sjohnson@sunriseliving.com',
  },
  {
    id: '2',
    contractNumber: 'CTR-2024-002',
    clientName: 'Regional Medical Center',
    clientType: 'facility',
    startDate: '2024-02-01',
    endDate: '2025-01-31',
    status: 'active',
    totalValue: 250000,
    billedAmount: 83000,
    terms: 'Monthly billing, net 45',
    autoRenew: true,
    contactName: 'Michael Chen',
    contactEmail: 'mchen@regionalmed.org',
  },
  {
    id: '3',
    contractNumber: 'CTR-2023-045',
    clientName: 'Blue Cross Blue Shield',
    clientType: 'insurance',
    startDate: '2023-07-01',
    endDate: '2024-06-30',
    status: 'expiring',
    totalValue: 500000,
    billedAmount: 425000,
    terms: 'Per-trip billing, weekly settlement',
    autoRenew: false,
    contactName: 'Lisa Martinez',
    contactEmail: 'lmartinez@bcbs.com',
  },
  {
    id: '4',
    contractNumber: 'CTR-2023-032',
    clientName: 'State Medicaid Program',
    clientType: 'government',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: 'expired',
    totalValue: 750000,
    billedAmount: 750000,
    terms: 'State contract terms apply',
    autoRenew: false,
    contactName: 'Robert Williams',
    contactEmail: 'rwilliams@state.gov',
  },
  {
    id: '5',
    contractNumber: 'CTR-2024-008',
    clientName: 'TransportLink Brokers',
    clientType: 'broker',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    status: 'pending',
    totalValue: 100000,
    billedAmount: 0,
    terms: 'Per-trip plus mileage',
    autoRenew: true,
    contactName: 'David Thompson',
    contactEmail: 'dthompson@transportlink.com',
  },
];

export default function AdminContractsPage() {
  const [contracts, setContracts] = React.useState<Contract[]>(mockContracts);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [showNewDialog, setShowNewDialog] = React.useState(false);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState<Contract | null>(null);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      searchQuery === '' ||
      contract.contractNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.clientType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    active: contracts.filter((c) => c.status === 'active').length,
    expiring: contracts.filter((c) => c.status === 'expiring').length,
    totalValue: contracts.reduce((sum, c) => sum + c.totalValue, 0),
    totalBilled: contracts.reduce((sum, c) => sum + c.billedAmount, 0),
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success-100 text-success-700">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-warning-100 text-warning-700">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'terminated':
        return <Badge variant="outline" className="text-gray-500">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'facility':
        return <Badge variant="outline" className="bg-primary-50 text-primary-700">Facility</Badge>;
      case 'insurance':
        return <Badge variant="outline" className="bg-info-50 text-info-700">Insurance</Badge>;
      case 'broker':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Broker</Badge>;
      case 'government':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Government</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowViewDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
          <p className="text-sm text-gray-500">Manage client contracts and agreements</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-500">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.expiring}</p>
                <p className="text-sm text-gray-500">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
                <p className="text-sm text-gray-500">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-info-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBilled)}</p>
                <p className="text-sm text-gray-500">Billed to Date</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="broker">Broker</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Contract #</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Client</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Duration</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Value</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Billed</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-primary-600">{contract.contractNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{contract.clientName}</p>
                        <p className="text-sm text-gray-500">{contract.contactName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(contract.clientType)}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{formatDate(contract.startDate)}</p>
                        <p className="text-gray-500">to {formatDate(contract.endDate)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {formatCurrency(contract.totalValue)}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{formatCurrency(contract.billedAmount)}</p>
                        <p className="text-xs text-gray-500">
                          {Math.round((contract.billedAmount / contract.totalValue) * 100)}%
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(contract.status)}</td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewContract(contract)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-error-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Terminate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredContracts.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>No contracts found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Contract Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>
              {selectedContract?.contractNumber} - {selectedContract?.clientName}
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Client Type</Label>
                  <p className="mt-1">{getTypeBadge(selectedContract.clientType)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <p className="mt-1">{getStatusBadge(selectedContract.status)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Start Date</Label>
                  <p className="mt-1 font-medium">{formatDate(selectedContract.startDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">End Date</Label>
                  <p className="mt-1 font-medium">{formatDate(selectedContract.endDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Total Value</Label>
                  <p className="mt-1 font-medium text-lg">{formatCurrency(selectedContract.totalValue)}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Billed to Date</Label>
                  <p className="mt-1 font-medium text-lg">{formatCurrency(selectedContract.billedAmount)}</p>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Billing Terms</Label>
                <p className="mt-1">{selectedContract.terms}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Label className="text-gray-500">Primary Contact</Label>
                <p className="mt-1 font-medium">{selectedContract.contactName}</p>
                <p className="text-sm text-gray-600">{selectedContract.contactEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedContract.autoRenew ? 'default' : 'secondary'}>
                  {selectedContract.autoRenew ? 'Auto-Renew Enabled' : 'Manual Renewal'}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Contract Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Contract</DialogTitle>
            <DialogDescription>
              Create a new client contract
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input placeholder="Enter client name" />
              </div>
              <div className="space-y-2">
                <Label>Client Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facility">Facility</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Contract Value</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input placeholder="Primary contact" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input type="email" placeholder="contact@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Billing Terms</Label>
              <Textarea placeholder="Describe billing terms and conditions..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewDialog(false)}>
              Create Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

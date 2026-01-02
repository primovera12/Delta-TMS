'use client';

import * as React from 'react';
import {
  DollarSign,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  MapPin,
  Car,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Mock data
const pricingRules = [
  {
    id: '1',
    name: 'Standard Ambulatory',
    type: 'ambulatory',
    baseRate: 45.00,
    perMile: 2.50,
    waitTime: 0.50,
    minimumFare: 35.00,
    status: 'active',
    effectiveDate: '2025-01-01',
    description: 'Standard rate for ambulatory transport within city limits',
  },
  {
    id: '2',
    name: 'Wheelchair Transport',
    type: 'wheelchair',
    baseRate: 65.00,
    perMile: 3.00,
    waitTime: 0.75,
    minimumFare: 55.00,
    status: 'active',
    effectiveDate: '2025-01-01',
    description: 'Rate for wheelchair-accessible vehicle transport',
  },
  {
    id: '3',
    name: 'Stretcher Transport',
    type: 'stretcher',
    baseRate: 125.00,
    perMile: 4.50,
    waitTime: 1.00,
    minimumFare: 100.00,
    status: 'active',
    effectiveDate: '2025-01-01',
    description: 'Rate for stretcher/gurney transport',
  },
  {
    id: '4',
    name: 'Bariatric Transport',
    type: 'bariatric',
    baseRate: 150.00,
    perMile: 5.00,
    waitTime: 1.25,
    minimumFare: 125.00,
    status: 'active',
    effectiveDate: '2025-01-01',
    description: 'Rate for bariatric patient transport',
  },
  {
    id: '5',
    name: 'Weekend/Holiday Rate',
    type: 'surcharge',
    baseRate: 15.00,
    perMile: 0.50,
    waitTime: 0.25,
    minimumFare: 0,
    status: 'active',
    effectiveDate: '2025-01-01',
    description: 'Additional surcharge for weekend and holiday trips',
  },
  {
    id: '6',
    name: 'After Hours Rate',
    type: 'surcharge',
    baseRate: 20.00,
    perMile: 0.75,
    waitTime: 0.25,
    minimumFare: 0,
    status: 'active',
    effectiveDate: '2025-01-01',
    description: 'Additional surcharge for trips between 8PM and 6AM',
  },
];

const addOns = [
  { id: '1', name: 'Oxygen Equipment', price: 15.00, status: 'active' },
  { id: '2', name: 'Additional Attendant', price: 25.00, status: 'active' },
  { id: '3', name: 'Stair Chair', price: 35.00, status: 'active' },
  { id: '4', name: 'Two-Person Assist', price: 45.00, status: 'active' },
  { id: '5', name: 'Isolation Precautions', price: 20.00, status: 'active' },
];

const facilityContracts = [
  {
    id: '1',
    facility: 'Memorial Hospital',
    discount: 15,
    volumeThreshold: 100,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
  },
  {
    id: '2',
    facility: 'City Dialysis Center',
    discount: 20,
    volumeThreshold: 200,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
  },
  {
    id: '3',
    facility: 'Senior Care Facility',
    discount: 10,
    volumeThreshold: 50,
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
  },
];

const typeColors: Record<string, string> = {
  ambulatory: 'bg-success-100 text-success-700',
  wheelchair: 'bg-primary-100 text-primary-700',
  stretcher: 'bg-error-100 text-error-700',
  bariatric: 'bg-warning-100 text-warning-700',
  surcharge: 'bg-gray-100 text-gray-700',
};

export default function AdminPricingPage() {
  const [showRuleModal, setShowRuleModal] = React.useState(false);
  const [showAddOnModal, setShowAddOnModal] = React.useState(false);
  const [showContractModal, setShowContractModal] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Configuration</h1>
          <p className="text-sm text-gray-500">Manage rates, surcharges, and facility contracts</p>
        </div>
        <Button onClick={() => setShowRuleModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Rule
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="rates">
        <TabsList>
          <TabsTrigger value="rates">Base Rates</TabsTrigger>
          <TabsTrigger value="addons">Add-Ons</TabsTrigger>
          <TabsTrigger value="contracts">Facility Contracts</TabsTrigger>
        </TabsList>

        {/* Base Rates Tab */}
        <TabsContent value="rates" className="mt-6 space-y-4">
          {pricingRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[rule.type]}`}>
                        {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                      </span>
                      <Badge variant={rule.status === 'active' ? 'success' : 'secondary'}>
                        {rule.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{rule.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Base Rate</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ${rule.baseRate.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Per Mile</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ${rule.perMile.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Wait Time/Min</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ${rule.waitTime.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Minimum Fare</p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ${rule.minimumFare.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-error-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Add-Ons Tab */}
        <TabsContent value="addons" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Service Add-Ons</CardTitle>
              <Button size="sm" onClick={() => setShowAddOnModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-gray-100">
                {addOns.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{addon.name}</p>
                        <Badge variant={addon.status === 'active' ? 'success' : 'secondary'} size="sm">
                          {addon.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-semibold text-gray-900">
                        ${addon.price.toFixed(2)}
                      </p>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facility Contracts Tab */}
        <TabsContent value="contracts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facility Contracts</CardTitle>
              <Button size="sm" onClick={() => setShowContractModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contract
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Facility</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Discount</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Volume Threshold</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Period</th>
                      <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                      <th className="text-right p-4 font-medium text-gray-500 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilityContracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{contract.facility}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-semibold text-success-600">
                            {contract.discount}%
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-gray-600">{contract.volumeThreshold} trips/month</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600">
                            {contract.startDate} - {contract.endDate}
                          </p>
                        </td>
                        <td className="p-4">
                          <Badge variant={contract.status === 'active' ? 'success' : 'secondary'}>
                            {contract.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Pricing Rule Modal */}
      <Dialog open={showRuleModal} onOpenChange={setShowRuleModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Pricing Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input id="ruleName" placeholder="e.g., Standard Ambulatory" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ruleType">Type</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambulatory">Ambulatory</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair</SelectItem>
                  <SelectItem value="stretcher">Stretcher</SelectItem>
                  <SelectItem value="bariatric">Bariatric</SelectItem>
                  <SelectItem value="surcharge">Surcharge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="baseRate">Base Rate ($)</Label>
                <Input id="baseRate" type="number" step="0.01" placeholder="45.00" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="perMile">Per Mile ($)</Label>
                <Input id="perMile" type="number" step="0.01" placeholder="2.50" className="mt-1.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waitTime">Wait Time/Min ($)</Label>
                <Input id="waitTime" type="number" step="0.01" placeholder="0.50" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="minFare">Minimum Fare ($)</Label>
                <Input id="minFare" type="number" step="0.01" placeholder="35.00" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe this pricing rule..." className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="effectiveDate">Effective Date</Label>
              <Input id="effectiveDate" type="date" className="mt-1.5" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowRuleModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRuleModal(false)}>
              Save Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Add-On Modal */}
      <Dialog open={showAddOnModal} onOpenChange={setShowAddOnModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Service Add-On</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="addonName">Name</Label>
              <Input id="addonName" placeholder="e.g., Oxygen Equipment" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="addonPrice">Price ($)</Label>
              <Input id="addonPrice" type="number" step="0.01" placeholder="15.00" className="mt-1.5" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="addonActive">Active</Label>
              <Switch id="addonActive" defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowAddOnModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddOnModal(false)}>
              Save Add-On
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contract Modal */}
      <Dialog open={showContractModal} onOpenChange={setShowContractModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Facility Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="facility">Facility</Label>
              <Select>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memorial">Memorial Hospital</SelectItem>
                  <SelectItem value="dialysis">City Dialysis Center</SelectItem>
                  <SelectItem value="senior">Senior Care Facility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" placeholder="15" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="volume">Volume Threshold (trips/month)</Label>
              <Input id="volume" type="number" placeholder="100" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" className="mt-1.5" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowContractModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowContractModal(false)}>
              Save Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

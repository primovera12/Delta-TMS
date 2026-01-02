'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Upload,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Printer,
  Eye,
  Building2,
} from 'lucide-react';

// Mock tax documents
const mock1099s = [
  {
    id: 'TAX-2023',
    year: 2023,
    type: '1099-NEC',
    totalEarnings: 45678.50,
    status: 'available',
    generatedAt: '2024-01-15',
  },
  {
    id: 'TAX-2022',
    year: 2022,
    type: '1099-NEC',
    totalEarnings: 42156.25,
    status: 'available',
    generatedAt: '2023-01-15',
  },
  {
    id: 'TAX-2021',
    year: 2021,
    type: '1099-NEC',
    totalEarnings: 38945.00,
    status: 'available',
    generatedAt: '2022-01-15',
  },
];

const taxInfo = {
  ein: '12-3456789',
  businessName: 'Delta Medical Transport',
  businessAddress: '123 Medical Center Dr, Los Angeles, CA 90001',
};

const yearlyStats = {
  year: 2024,
  totalEarnings: 4523.50,
  trips: 145,
  miles: 3254,
  estimatedTax: 903.70,
};

export default function DriverTaxPage() {
  const [w9Submitted, setW9Submitted] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Documents</h1>
          <p className="text-gray-600">Access your tax forms and earnings statements</p>
        </div>
      </div>

      {/* W-9 Alert (if not submitted) */}
      {!w9Submitted && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">W-9 Required</p>
                  <p className="text-sm text-yellow-700">
                    Please submit your W-9 form to receive your 1099 at year end.
                  </p>
                </div>
              </div>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload W-9
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Year to Date Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">YTD Earnings</p>
                <p className="text-lg font-bold">${yearlyStats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Trips</p>
                <p className="text-lg font-bold">{yearlyStats.trips}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Business Miles</p>
                <p className="text-lg font-bold">{yearlyStats.miles.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Est. Quarterly Tax</p>
                <p className="text-lg font-bold">${yearlyStats.estimatedTax.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="1099">
        <TabsList>
          <TabsTrigger value="1099">1099 Forms</TabsTrigger>
          <TabsTrigger value="w9">W-9 Information</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
        </TabsList>

        <TabsContent value="1099" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Available 1099 Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mock1099s.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{form.type} - {form.year}</p>
                        <p className="text-sm text-gray-500">
                          Generated on {form.generatedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">${form.totalEarnings.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total Earnings</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2024 Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">2024 1099 Notice</p>
                  <p className="text-sm text-blue-700">
                    Your 2024 1099-NEC will be available by January 31, 2025.
                    Make sure your W-9 information is up to date.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="w9" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  W-9 Information
                </CardTitle>
                <Badge className={w9Submitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {w9Submitted ? 'On File' : 'Required'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {w9Submitted ? (
                <>
                  <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">W-9 On File</p>
                      <p className="text-sm text-green-700">
                        Your W-9 was submitted on January 2, 2024
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Legal Name</Label>
                      <Input value="John Smith" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>SSN (Last 4)</Label>
                      <Input value="***-**-6789" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value="456 Driver Lane, Los Angeles, CA 90002" disabled />
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Update W-9
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No W-9 on file</p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload W-9 Form
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Important Tax Information</p>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• As an independent contractor, you are responsible for paying quarterly estimated taxes</li>
                    <li>• Keep records of business-related expenses for potential deductions</li>
                    <li>• The IRS standard mileage rate for 2024 is 67 cents per mile</li>
                    <li>• Consult a tax professional for personalized advice</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Tax Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Use this information for your tax records and when filing quarterly estimated taxes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={taxInfo.businessName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>EIN</Label>
                  <Input value={taxInfo.ein} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Address</Label>
                <Input value={taxInfo.businessAddress} disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>IRS Form 1040-ES (Estimated Tax)</span>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>Self-Employment Tax Guide</span>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>Deductible Expenses Guide</span>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

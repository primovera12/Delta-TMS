'use client';

import * as React from 'react';
import {
  Calculator,
  MapPin,
  Car,
  Clock,
  DollarSign,
  Send,
  Download,
  RefreshCw,
  Plus,
  Minus,
  Users,
  Wheelchair,
  Stethoscope,
  Calendar,
  FileText,
  Copy,
  Check,
  ArrowRight,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface QuoteLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PricingRates {
  baseRate: number;
  perMileRate: number;
  waitTimeRate: number;
  wheelchairSurcharge: number;
  stretcherSurcharge: number;
  oxygenSurcharge: number;
  stairsSurcharge: number;
  afterHoursSurcharge: number;
}

const defaultRates: PricingRates = {
  baseRate: 25.00,
  perMileRate: 2.50,
  waitTimeRate: 0.50,
  wheelchairSurcharge: 15.00,
  stretcherSurcharge: 45.00,
  oxygenSurcharge: 10.00,
  stairsSurcharge: 5.00,
  afterHoursSurcharge: 20.00,
};

const transportTypes = [
  { id: 'ambulatory', label: 'Ambulatory', icon: Users, surcharge: 0 },
  { id: 'wheelchair', label: 'Wheelchair', icon: Wheelchair, surcharge: 15 },
  { id: 'stretcher', label: 'Stretcher', icon: Stethoscope, surcharge: 45 },
  { id: 'bariatric', label: 'Bariatric', icon: Users, surcharge: 35 },
];

export default function DispatcherPriceQuotePage() {
  const [pickupAddress, setPickupAddress] = React.useState('');
  const [dropoffAddress, setDropoffAddress] = React.useState('');
  const [transportType, setTransportType] = React.useState('ambulatory');
  const [estimatedMiles, setEstimatedMiles] = React.useState<number>(0);
  const [waitTime, setWaitTime] = React.useState<number>(0);
  const [isRoundTrip, setIsRoundTrip] = React.useState(false);
  const [isAfterHours, setIsAfterHours] = React.useState(false);
  const [includeOxygen, setIncludeOxygen] = React.useState(false);
  const [stairFlights, setStairFlights] = React.useState<number>(0);
  const [customerName, setCustomerName] = React.useState('');
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [quoteGenerated, setQuoteGenerated] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const calculateQuote = (): { lineItems: QuoteLineItem[]; total: number } => {
    const lineItems: QuoteLineItem[] = [];
    const multiplier = isRoundTrip ? 2 : 1;

    // Base rate
    lineItems.push({
      description: 'Base Rate',
      quantity: multiplier,
      unitPrice: defaultRates.baseRate,
      total: defaultRates.baseRate * multiplier,
    });

    // Mileage
    if (estimatedMiles > 0) {
      lineItems.push({
        description: 'Mileage',
        quantity: estimatedMiles * multiplier,
        unitPrice: defaultRates.perMileRate,
        total: estimatedMiles * defaultRates.perMileRate * multiplier,
      });
    }

    // Transport type surcharge
    const selectedType = transportTypes.find((t) => t.id === transportType);
    if (selectedType && selectedType.surcharge > 0) {
      lineItems.push({
        description: `${selectedType.label} Service`,
        quantity: multiplier,
        unitPrice: selectedType.surcharge,
        total: selectedType.surcharge * multiplier,
      });
    }

    // Wait time
    if (waitTime > 0) {
      lineItems.push({
        description: 'Wait Time',
        quantity: waitTime,
        unitPrice: defaultRates.waitTimeRate,
        total: waitTime * defaultRates.waitTimeRate,
      });
    }

    // Oxygen
    if (includeOxygen) {
      lineItems.push({
        description: 'Oxygen Equipment',
        quantity: multiplier,
        unitPrice: defaultRates.oxygenSurcharge,
        total: defaultRates.oxygenSurcharge * multiplier,
      });
    }

    // Stairs
    if (stairFlights > 0) {
      lineItems.push({
        description: 'Stair Assistance',
        quantity: stairFlights * multiplier,
        unitPrice: defaultRates.stairsSurcharge,
        total: stairFlights * defaultRates.stairsSurcharge * multiplier,
      });
    }

    // After hours
    if (isAfterHours) {
      lineItems.push({
        description: 'After Hours Surcharge',
        quantity: 1,
        unitPrice: defaultRates.afterHoursSurcharge,
        total: defaultRates.afterHoursSurcharge,
      });
    }

    const total = lineItems.reduce((sum, item) => sum + item.total, 0);
    return { lineItems, total };
  };

  const { lineItems, total } = calculateQuote();

  const handleCalculateDistance = async () => {
    // Simulate distance calculation
    if (pickupAddress && dropoffAddress) {
      const mockDistance = Math.floor(Math.random() * 20) + 5;
      setEstimatedMiles(mockDistance);
    }
  };

  const handleGenerateQuote = () => {
    setQuoteGenerated(true);
  };

  const handleSendQuote = () => {
    console.log('Sending quote to:', customerEmail);
    // Would send quote via email
  };

  const handleCopyQuote = () => {
    const quoteText = `
Quote for: ${customerName || 'Customer'}
Date: ${new Date().toLocaleDateString()}

From: ${pickupAddress}
To: ${dropoffAddress}
${isRoundTrip ? '(Round Trip)' : '(One Way)'}

Transport Type: ${transportTypes.find((t) => t.id === transportType)?.label}
Estimated Distance: ${estimatedMiles} miles

Line Items:
${lineItems.map((item) => `- ${item.description}: $${item.total.toFixed(2)}`).join('\n')}

Total: $${total.toFixed(2)}

${notes ? `Notes: ${notes}` : ''}
    `.trim();

    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPickupAddress('');
    setDropoffAddress('');
    setTransportType('ambulatory');
    setEstimatedMiles(0);
    setWaitTime(0);
    setIsRoundTrip(false);
    setIsAfterHours(false);
    setIncludeOxygen(false);
    setStairFlights(0);
    setCustomerName('');
    setCustomerEmail('');
    setNotes('');
    setQuoteGenerated(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Price Quote</h1>
          <p className="text-sm text-gray-500">
            Calculate and generate transportation quotes
          </p>
        </div>
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quote Form */}
        <div className="space-y-6">
          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-500" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pickup Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success-500" />
                  <Input
                    placeholder="Enter pickup address..."
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dropoff Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-error-500" />
                  <Input
                    placeholder="Enter dropoff address..."
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCalculateDistance}
                disabled={!pickupAddress || !dropoffAddress}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Distance
              </Button>
              {estimatedMiles > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Estimated Distance</span>
                  <span className="font-medium text-gray-900">{estimatedMiles} miles</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="roundTrip"
                  checked={isRoundTrip}
                  onCheckedChange={(checked) => setIsRoundTrip(checked === true)}
                />
                <Label htmlFor="roundTrip" className="cursor-pointer">Round Trip</Label>
              </div>
            </CardContent>
          </Card>

          {/* Service Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-info-500" />
                Service Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Transport Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {transportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          transportType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setTransportType(type.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${transportType === type.id ? 'text-primary-600' : 'text-gray-500'}`} />
                          <span className={`text-sm font-medium ${transportType === type.id ? 'text-primary-900' : 'text-gray-700'}`}>
                            {type.label}
                          </span>
                        </div>
                        {type.surcharge > 0 && (
                          <span className="text-xs text-gray-500">+${type.surcharge.toFixed(2)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="oxygen"
                    checked={includeOxygen}
                    onCheckedChange={(checked) => setIncludeOxygen(checked === true)}
                  />
                  <Label htmlFor="oxygen" className="cursor-pointer flex-1">
                    <span>Oxygen Equipment</span>
                    <span className="text-gray-500 ml-2">+${defaultRates.oxygenSurcharge.toFixed(2)}</span>
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="afterHours"
                    checked={isAfterHours}
                    onCheckedChange={(checked) => setIsAfterHours(checked === true)}
                  />
                  <Label htmlFor="afterHours" className="cursor-pointer flex-1">
                    <span>After Hours (6PM-6AM)</span>
                    <span className="text-gray-500 ml-2">+${defaultRates.afterHoursSurcharge.toFixed(2)}</span>
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stair Flights</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStairFlights(Math.max(0, stairFlights - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{stairFlights}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setStairFlights(stairFlights + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">@ ${defaultRates.stairsSurcharge.toFixed(2)}/flight</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Wait Time (minutes)</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWaitTime(Math.max(0, waitTime - 15))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{waitTime}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setWaitTime(waitTime + 15)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">@ ${defaultRates.waitTimeRate.toFixed(2)}/min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-success-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  placeholder="Enter customer name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="customer@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any special requirements or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-success-500" />
                Quote Summary
              </CardTitle>
              <CardDescription>
                {quoteGenerated ? (
                  <Badge className="bg-success-100 text-success-700">Quote Generated</Badge>
                ) : (
                  'Review and generate quote'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Summary */}
              {(pickupAddress || dropoffAddress) && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  {pickupAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-success-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{pickupAddress}</span>
                    </div>
                  )}
                  {pickupAddress && dropoffAddress && (
                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  {dropoffAddress && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-error-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{dropoffAddress}</span>
                    </div>
                  )}
                  {isRoundTrip && (
                    <Badge variant="secondary" className="mt-2">Round Trip</Badge>
                  )}
                </div>
              )}

              {/* Line Items */}
              <div className="space-y-2">
                {lineItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{item.description}</span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({item.quantity} x ${item.unitPrice.toFixed(2)})
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                {!quoteGenerated ? (
                  <Button className="w-full" onClick={handleGenerateQuote}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Quote
                  </Button>
                ) : (
                  <>
                    <Button className="w-full" onClick={handleSendQuote} disabled={!customerEmail}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Quote via Email
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={handleCopyQuote}>
                        {copied ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rate Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Base Rate</p>
                  <p className="font-medium">${defaultRates.baseRate.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Per Mile</p>
                  <p className="font-medium">${defaultRates.perMileRate.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Wait Time</p>
                  <p className="font-medium">${defaultRates.waitTimeRate.toFixed(2)}/min</p>
                </div>
                <div>
                  <p className="text-gray-500">Wheelchair</p>
                  <p className="font-medium">+${defaultRates.wheelchairSurcharge.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Stretcher</p>
                  <p className="font-medium">+${defaultRates.stretcherSurcharge.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">After Hours</p>
                  <p className="font-medium">+${defaultRates.afterHoursSurcharge.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

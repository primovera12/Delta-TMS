'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck,
  Car,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Plus,
  Loader2,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

interface InspectionItem {
  id: string;
  category: string;
  label: string;
  description: string;
  required: boolean;
  status: 'pending' | 'pass' | 'fail' | 'na';
  notes?: string;
  photo?: string;
}

interface InspectionCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  items: InspectionItem[];
  expanded: boolean;
}

const initialCategories: InspectionCategory[] = [
  {
    id: 'exterior',
    name: 'Exterior',
    icon: Car,
    expanded: true,
    items: [
      { id: 'tires', category: 'exterior', label: 'Tires', description: 'Check tread depth and pressure on all tires', required: true, status: 'pending' },
      { id: 'lights-front', category: 'exterior', label: 'Front Lights', description: 'Headlights, turn signals, parking lights', required: true, status: 'pending' },
      { id: 'lights-rear', category: 'exterior', label: 'Rear Lights', description: 'Brake lights, tail lights, reverse lights', required: true, status: 'pending' },
      { id: 'mirrors', category: 'exterior', label: 'Mirrors', description: 'All mirrors clean and properly adjusted', required: true, status: 'pending' },
      { id: 'windshield', category: 'exterior', label: 'Windshield', description: 'No cracks or chips that obstruct view', required: true, status: 'pending' },
      { id: 'body', category: 'exterior', label: 'Body Condition', description: 'Note any new dents, scratches, or damage', required: false, status: 'pending' },
    ],
  },
  {
    id: 'interior',
    name: 'Interior',
    icon: ClipboardCheck,
    expanded: false,
    items: [
      { id: 'seatbelts', category: 'interior', label: 'Seat Belts', description: 'All seat belts functional and accessible', required: true, status: 'pending' },
      { id: 'dashboard', category: 'interior', label: 'Dashboard Warnings', description: 'No warning lights illuminated', required: true, status: 'pending' },
      { id: 'horn', category: 'interior', label: 'Horn', description: 'Horn is working properly', required: true, status: 'pending' },
      { id: 'climate', category: 'interior', label: 'Climate Control', description: 'AC and heater functioning', required: true, status: 'pending' },
      { id: 'cleanliness', category: 'interior', label: 'Cleanliness', description: 'Interior is clean and presentable', required: true, status: 'pending' },
    ],
  },
  {
    id: 'wheelchair',
    name: 'Wheelchair Equipment',
    icon: ClipboardCheck,
    expanded: false,
    items: [
      { id: 'lift-ramp', category: 'wheelchair', label: 'Lift/Ramp', description: 'Operates smoothly, no unusual sounds', required: true, status: 'pending' },
      { id: 'securement', category: 'wheelchair', label: 'Securement Straps', description: 'All straps in good condition', required: true, status: 'pending' },
      { id: 'tie-downs', category: 'wheelchair', label: 'Tie-Downs', description: 'All tie-downs present and working', required: true, status: 'pending' },
      { id: 'lift-door', category: 'wheelchair', label: 'Lift Door Seal', description: 'Door seals properly when closed', required: true, status: 'pending' },
    ],
  },
  {
    id: 'safety',
    name: 'Safety Equipment',
    icon: AlertTriangle,
    expanded: false,
    items: [
      { id: 'first-aid', category: 'safety', label: 'First Aid Kit', description: 'Present and properly stocked', required: true, status: 'pending' },
      { id: 'fire-extinguisher', category: 'safety', label: 'Fire Extinguisher', description: 'Present and charged', required: true, status: 'pending' },
      { id: 'triangles', category: 'safety', label: 'Warning Triangles', description: 'Emergency triangles present', required: true, status: 'pending' },
      { id: 'flashlight', category: 'safety', label: 'Flashlight', description: 'Working flashlight available', required: false, status: 'pending' },
    ],
  },
];

export default function DriverInspectionPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<InspectionCategory[]>(initialCategories);
  const [odometer, setOdometer] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  // Calculate progress
  const progress = React.useMemo(() => {
    const allItems = categories.flatMap(c => c.items);
    const completed = allItems.filter(i => i.status !== 'pending').length;
    const required = allItems.filter(i => i.required);
    const requiredCompleted = required.filter(i => i.status !== 'pending').length;
    const requiredPassed = required.filter(i => i.status === 'pass' || i.status === 'na').length;
    const hasFails = allItems.some(i => i.status === 'fail');

    return {
      total: allItems.length,
      completed,
      percentage: Math.round((completed / allItems.length) * 100),
      requiredTotal: required.length,
      requiredCompleted,
      requiredPassed,
      hasFails,
      canSubmit: requiredCompleted === required.length && odometer.trim() !== '',
    };
  }, [categories, odometer]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId ? { ...c, expanded: !c.expanded } : c
      )
    );
  };

  const updateItemStatus = (categoryId: string, itemId: string, status: InspectionItem['status']) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map(i =>
                i.id === itemId ? { ...i, status } : i
              ),
            }
          : c
      )
    );
  };

  const handleSubmit = async () => {
    if (!progress.canSubmit) {
      setError('Please complete all required items and enter odometer reading');
      return;
    }

    if (progress.hasFails) {
      setShowConfirmation(true);
      return;
    }

    await submitInspection();
  };

  const submitInspection = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success - redirect to dashboard
      router.push('/driver');
    } catch (err) {
      setError('Failed to submit inspection. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pre-Trip Inspection</h1>
          <p className="text-sm text-gray-500">Complete inspection before starting trips</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Progress Card */}
      <Card className={progress.hasFails ? 'border-warning-200' : progress.percentage === 100 ? 'border-success-200' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Inspection Progress</span>
            <span className="text-sm text-gray-500">{progress.completed}/{progress.total} items</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                progress.hasFails ? 'bg-warning-500' : progress.percentage === 100 ? 'bg-success-500' : 'bg-primary-500'
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          {progress.hasFails && (
            <div className="mt-3 flex items-center gap-2 text-warning-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Some items have failed - please add notes</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="error">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Inspection Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const categoryProgress = category.items.filter(i => i.status !== 'pending').length;
          const categoryFails = category.items.filter(i => i.status === 'fail').length;

          return (
            <Card key={category.id}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    categoryFails > 0
                      ? 'bg-error-100'
                      : categoryProgress === category.items.length
                      ? 'bg-success-100'
                      : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      categoryFails > 0
                        ? 'text-error-600'
                        : categoryProgress === category.items.length
                        ? 'text-success-600'
                        : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {categoryProgress}/{category.items.length} completed
                      {categoryFails > 0 && ` • ${categoryFails} failed`}
                    </p>
                  </div>
                </div>
                {category.expanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {category.expanded && (
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border transition-colors ${
                          item.status === 'pass'
                            ? 'border-success-200 bg-success-50'
                            : item.status === 'fail'
                            ? 'border-error-200 bg-error-50'
                            : item.status === 'na'
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{item.label}</h4>
                              {item.required && (
                                <Badge variant="secondary" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={item.status === 'pass' ? 'primary' : 'ghost'}
                              onClick={() => updateItemStatus(category.id, item.id, 'pass')}
                              className={item.status === 'pass' ? 'bg-success-600 hover:bg-success-700' : ''}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={item.status === 'fail' ? 'destructive' : 'ghost'}
                              onClick={() => updateItemStatus(category.id, item.id, 'fail')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={item.status === 'na' ? 'secondary' : 'ghost'}
                              onClick={() => updateItemStatus(category.id, item.id, 'na')}
                              className="text-xs"
                            >
                              N/A
                            </Button>
                          </div>
                        </div>
                        {item.status === 'fail' && (
                          <div className="mt-3 pt-3 border-t border-error-200">
                            <Input
                              placeholder="Add notes about the issue..."
                              className="text-sm"
                              onChange={(e) => {
                                setCategories(prev =>
                                  prev.map(c =>
                                    c.id === category.id
                                      ? {
                                          ...c,
                                          items: c.items.map(i =>
                                            i.id === item.id ? { ...i, notes: e.target.value } : i
                                          ),
                                        }
                                      : c
                                  )
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Odometer & Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="odometer">Odometer Reading *</Label>
            <Input
              id="odometer"
              type="number"
              placeholder="Enter current odometer reading"
              className="mt-1.5"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other observations or notes..."
              className="mt-1.5"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!progress.canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Complete Inspection
            </>
          )}
        </Button>
      </div>

      {/* Confirmation Dialog for Failed Items */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning-600">
                <AlertTriangle className="h-5 w-5" />
                Submit with Failed Items?
              </CardTitle>
              <CardDescription>
                Some inspection items have failed. Operations will be notified and may require maintenance before trips can begin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">Failed items:</p>
              <ul className="space-y-1">
                {categories.flatMap(c => c.items).filter(i => i.status === 'fail').map(item => (
                  <li key={item.id} className="flex items-center gap-2 text-sm text-error-600">
                    <XCircle className="h-4 w-4" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="flex justify-end gap-3 p-4 border-t">
              <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                Go Back
              </Button>
              <Button variant="destructive" onClick={submitInspection} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Anyway'
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

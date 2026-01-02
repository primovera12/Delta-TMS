'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Palette,
  Image,
  Type,
  Save,
  Upload,
  Eye,
  RefreshCw,
} from 'lucide-react';

export default function SuperAdminBrandingPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding & White Label</h1>
          <p className="text-gray-600">Customize the platform appearance for your clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="custom">Custom CSS</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                Platform Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="Delta TMS" />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input defaultValue="Medical Transportation Made Simple" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Platform Description</Label>
                <Textarea
                  defaultValue="Delta TMS is a comprehensive transportation management system for medical and non-emergency transport providers."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@deltamed.com" />
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <Input defaultValue="1-800-DELTA-TMS" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">SEO & Social</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input defaultValue="Delta TMS - Medical Transportation Management" />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  defaultValue="Streamline your medical transportation operations with Delta TMS. Manage trips, drivers, and billing all in one place."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Social Share Image URL</Label>
                <Input placeholder="https://..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color Scheme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-600" />
                    <Input defaultValue="#2563eb" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-gray-600" />
                    <Input defaultValue="#4b5563" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-green-600" />
                    <Input defaultValue="#16a34a" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Success Color</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500" />
                    <Input defaultValue="#22c55e" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Warning Color</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500" />
                    <Input defaultValue="#eab308" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Error Color</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 rounded-lg bg-red-500" />
                    <Input defaultValue="#ef4444" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex gap-2">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded bg-green-100 text-green-800">Success</div>
                  <div className="px-3 py-1 rounded bg-yellow-100 text-yellow-800">Warning</div>
                  <div className="px-3 py-1 rounded bg-red-100 text-red-800">Error</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Image className="h-4 w-4" />
                Logo Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Main Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="w-32 h-12 bg-gray-100 rounded mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-400">Logo Preview</span>
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Recommended: 200x60px, PNG or SVG</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Logo (Dark Mode)</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-900">
                    <div className="w-32 h-12 bg-gray-700 rounded mx-auto mb-4 flex items-center justify-center">
                      <span className="text-gray-400">Logo Preview</span>
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">For dark backgrounds</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-400">ICO</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">32x32px, ICO or PNG</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>App Icon</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-400">ICON</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">512x512px, PNG</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Custom CSS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Styles</Label>
                <Textarea
                  className="font-mono text-sm"
                  placeholder="/* Add custom CSS here */
.custom-header {
  background-color: #your-color;
}"
                  rows={15}
                />
              </div>
              <p className="text-sm text-gray-500">
                Custom CSS will be applied globally across the platform. Use with caution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Custom JavaScript</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Header Scripts</Label>
                <Textarea
                  className="font-mono text-sm"
                  placeholder="<!-- Add scripts to be included in <head> -->"
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Footer Scripts</Label>
                <Textarea
                  className="font-mono text-sm"
                  placeholder="<!-- Add scripts to be included before </body> -->"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

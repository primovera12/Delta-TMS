'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from '@/components/ui/toast';
import {
  Car,
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  Settings,
  Unlink,
  Wifi,
  WifiOff,
  XCircle,
  Link2,
  AlertTriangle,
  Gauge,
  Navigation,
  Activity,
  Shield,
} from 'lucide-react';

interface BouncieConfig {
  id: string;
  isEnabled: boolean;
  isConfigured: boolean;
  clientId: string | null;
  clientSecretSet: boolean;
  authorizationCodeSet: boolean;
  accessTokenSet: boolean;
  tokenExpiresAt: string | null;
  enableRealTimeTracking: boolean;
  enableGeofencing: boolean;
  enableDiagnostics: boolean;
  enableDriverBehavior: boolean;
  enableMileageTracking: boolean;
  enableFuelMonitoring: boolean;
  enableMaintenanceAlerts: boolean;
  enableAutoStatusUpdate: boolean;
  webhookUrl: string | null;
  webhookEnabled: boolean;
  locationUpdateInterval: number;
  diagnosticsSyncInterval: number;
  geofenceRadiusMeters: number;
  syncStatus: string;
  syncError: string | null;
  lastSyncAt: string | null;
}

interface BouncieDevice {
  id: string;
  imei: string;
  nickname: string | null;
  status: string;
  isOnline: boolean;
  lastSeenAt: string | null;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  } | null;
  vehicleId: string | null;
  batteryVoltage: number | null;
  fuelLevelPercent: number | null;
  checkEngineLight: boolean;
  odometerMiles: number | null;
}

interface UnlinkedVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

export default function BouncieSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [config, setConfig] = useState<BouncieConfig | null>(null);
  const [devices, setDevices] = useState<BouncieDevice[]>([]);
  const [unlinkedVehicles, setUnlinkedVehicles] = useState<UnlinkedVehicle[]>([]);

  // Form state for credentials
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedDeviceImei, setSelectedDeviceImei] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [linking, setLinking] = useState(false);

  // Setup instructions collapsed state
  const [setupOpen, setSetupOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [configRes, devicesRes] = await Promise.all([
        fetch('/api/v1/admin/integrations/bouncie'),
        fetch('/api/v1/admin/integrations/bouncie/devices'),
      ]);

      if (configRes.ok) {
        const data = await configRes.json();
        setConfig(data.config);
      }

      if (devicesRes.ok) {
        const data = await devicesRes.json();
        setDevices(data.devices || []);
        setUnlinkedVehicles(data.unlinkedVehicles || []);
      }
    } catch (error) {
      toast.error('Failed to load Bouncie configuration');
    } finally {
      setLoading(false);
    }
  }

  async function handleTestConnection() {
    if (!clientId || !clientSecret || !authorizationCode) {
      toast.error('Please fill in all credential fields');
      return;
    }

    setTesting(true);
    try {
      const res = await fetch('/api/v1/admin/integrations/bouncie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          clientId,
          clientSecret,
          authorizationCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Connection successful! Found ${data.vehicleCount} vehicles.`);
        fetchData(); // Refresh config
      } else {
        toast.error(data.error || 'Connection failed');
      }
    } catch (error) {
      toast.error('Failed to test connection');
    } finally {
      setTesting(false);
    }
  }

  async function handleSyncDevices() {
    setSyncing(true);
    try {
      const res = await fetch('/api/v1/admin/integrations/bouncie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Synced ${data.synced} devices`);
        fetchData();
      } else {
        toast.error(data.errors?.join(', ') || 'Sync failed');
      }
    } catch (error) {
      toast.error('Failed to sync devices');
    } finally {
      setSyncing(false);
    }
  }

  async function handleSaveFeatures(updates: Partial<BouncieConfig>) {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/admin/integrations/bouncie', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        toast.success('Settings saved');
        fetchData();
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkDevice() {
    if (!selectedDeviceImei || !selectedVehicleId) return;

    setLinking(true);
    try {
      const res = await fetch(`/api/v1/admin/integrations/bouncie/devices/${selectedDeviceImei}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId: selectedVehicleId }),
      });

      if (res.ok) {
        toast.success('Device linked successfully');
        setLinkDialogOpen(false);
        setSelectedDeviceImei(null);
        setSelectedVehicleId('');
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to link device');
      }
    } catch (error) {
      toast.error('Failed to link device');
    } finally {
      setLinking(false);
    }
  }

  async function handleUnlinkDevice(imei: string) {
    try {
      const res = await fetch(`/api/v1/admin/integrations/bouncie/devices/${imei}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Device unlinked');
        fetchData();
      } else {
        toast.error('Failed to unlink device');
      }
    } catch (error) {
      toast.error('Failed to unlink device');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bouncie GPS Integration</h1>
          <p className="text-muted-foreground">
            Configure Bouncie OBD-II GPS tracking for your fleet (optional)
          </p>
        </div>
        <Badge
          variant={config?.syncStatus === 'CONNECTED' ? 'default' : 'secondary'}
          className="flex items-center gap-1"
        >
          {config?.syncStatus === 'CONNECTED' ? (
            <CheckCircle className="h-3 w-3" />
          ) : config?.syncStatus === 'ERROR' ? (
            <XCircle className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {config?.syncStatus || 'Not Connected'}
        </Badge>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-semibold">
                {config?.syncStatus || 'Disconnected'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Last Sync</p>
              <p className="text-lg font-semibold">
                {config?.lastSyncAt
                  ? new Date(config.lastSyncAt).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Devices</p>
              <p className="text-lg font-semibold">{devices.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-lg font-semibold">
                {devices.filter((d) => d.isOnline).length}
              </p>
            </div>
          </div>

          {config?.syncError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{config.syncError}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSyncDevices}
              disabled={syncing || !config?.isConfigured}
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Credentials
          </CardTitle>
          <CardDescription>
            Enter your Bouncie API credentials to enable GPS tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder={config?.clientId || 'Enter Client ID'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder={config?.clientSecretSet ? '••••••••' : 'Enter Client Secret'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authCode">Authorization Code</Label>
              <Input
                id="authCode"
                type="password"
                value={authorizationCode}
                onChange={(e) => setAuthorizationCode(e.target.value)}
                placeholder={
                  config?.authorizationCodeSet ? '••••••••' : 'Enter Authorization Code'
                }
              />
            </div>
          </div>

          <Button onClick={handleTestConnection} disabled={testing}>
            {testing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Test Connection
          </Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Features
          </CardTitle>
          <CardDescription>
            Enable or disable Bouncie features. The system works without Bouncie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-0.5">
              <Label className="text-base font-semibold">Enable Bouncie Integration</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all Bouncie features
              </p>
            </div>
            <Switch
              checked={config?.isEnabled ?? false}
              onCheckedChange={(checked) => handleSaveFeatures({ isEnabled: checked })}
              disabled={!config?.isConfigured}
            />
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Navigation className="h-5 w-5 text-blue-500" />
                <div>
                  <Label>Real-Time Tracking</Label>
                  <p className="text-xs text-muted-foreground">
                    GPS location updates
                  </p>
                </div>
              </div>
              <Switch
                checked={config?.enableRealTimeTracking ?? false}
                onCheckedChange={(checked) =>
                  handleSaveFeatures({ enableRealTimeTracking: checked })
                }
                disabled={!config?.isEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-green-500" />
                <div>
                  <Label>Geofencing</Label>
                  <p className="text-xs text-muted-foreground">
                    Auto-detect arrivals
                  </p>
                </div>
              </div>
              <Switch
                checked={config?.enableGeofencing ?? false}
                onCheckedChange={(checked) =>
                  handleSaveFeatures({ enableGeofencing: checked })
                }
                disabled={!config?.isEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 text-orange-500" />
                <div>
                  <Label>Vehicle Diagnostics</Label>
                  <p className="text-xs text-muted-foreground">
                    Battery, fuel, check engine
                  </p>
                </div>
              </div>
              <Switch
                checked={config?.enableDiagnostics ?? false}
                onCheckedChange={(checked) =>
                  handleSaveFeatures({ enableDiagnostics: checked })
                }
                disabled={!config?.isEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <Label>Driver Behavior</Label>
                  <p className="text-xs text-muted-foreground">
                    Speed, braking, acceleration
                  </p>
                </div>
              </div>
              <Switch
                checked={config?.enableDriverBehavior ?? false}
                onCheckedChange={(checked) =>
                  handleSaveFeatures({ enableDriverBehavior: checked })
                }
                disabled={!config?.isEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-cyan-500" />
                <div>
                  <Label>Mileage Tracking</Label>
                  <p className="text-xs text-muted-foreground">
                    Odometer readings
                  </p>
                </div>
              </div>
              <Switch
                checked={config?.enableMileageTracking ?? false}
                onCheckedChange={(checked) =>
                  handleSaveFeatures({ enableMileageTracking: checked })
                }
                disabled={!config?.isEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <Label>Maintenance Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Low battery, check engine
                  </p>
                </div>
              </div>
              <Switch
                checked={config?.enableMaintenanceAlerts ?? false}
                onCheckedChange={(checked) =>
                  handleSaveFeatures({ enableMaintenanceAlerts: checked })
                }
                disabled={!config?.isEnabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Devices
          </CardTitle>
          <CardDescription>
            Manage Bouncie devices and link them to your vehicles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {devices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No devices found</p>
              <p className="text-sm">Click &quot;Sync Devices&quot; to fetch from Bouncie</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Linked Vehicle</TableHead>
                  <TableHead>Diagnostics</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.imei}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{device.nickname || device.imei}</p>
                        <p className="text-xs text-muted-foreground">{device.imei}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={device.isOnline ? 'default' : 'secondary'}>
                        {device.isOnline ? (
                          <Wifi className="h-3 w-3 mr-1" />
                        ) : (
                          <WifiOff className="h-3 w-3 mr-1" />
                        )}
                        {device.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {device.vehicle ? (
                        <div>
                          <p className="font-medium">
                            {device.vehicle.year} {device.vehicle.make} {device.vehicle.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {device.vehicle.licensePlate}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not linked</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {device.checkEngineLight && (
                          <Badge variant="destructive" className="text-xs">
                            Check Engine
                          </Badge>
                        )}
                        {device.batteryVoltage !== null && device.batteryVoltage < 11.8 && (
                          <Badge variant="outline" className="text-xs text-yellow-600">
                            Low Battery
                          </Badge>
                        )}
                        {device.fuelLevelPercent !== null && device.fuelLevelPercent < 20 && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            Low Fuel
                          </Badge>
                        )}
                        {!device.checkEngineLight &&
                          (device.batteryVoltage === null || device.batteryVoltage >= 11.8) &&
                          (device.fuelLevelPercent === null || device.fuelLevelPercent >= 20) && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              OK
                            </Badge>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {device.lastSeenAt
                        ? new Date(device.lastSeenAt).toLocaleString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      {device.vehicle ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnlinkDevice(device.imei)}
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          Unlink
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDeviceImei(device.imei);
                            setLinkDialogOpen(true);
                          }}
                        >
                          <Link2 className="h-4 w-4 mr-1" />
                          Link
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Collapsible open={setupOpen} onOpenChange={setSetupOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Setup Instructions
                </CardTitle>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${setupOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  Go to{' '}
                  <a
                    href="https://bouncie.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    bouncie.dev
                  </a>{' '}
                  and create an account
                </li>
                <li>Create a new application in the developer portal</li>
                <li>Authorize your Bouncie devices for the application</li>
                <li>Copy the Client ID, Client Secret, and Authorization Code</li>
                <li>Paste the credentials above and click &quot;Test Connection&quot;</li>
                <li>Click &quot;Sync Devices&quot; to import your devices</li>
                <li>Link each device to a vehicle in your fleet</li>
              </ol>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Webhook URL</p>
                <code className="text-xs bg-background p-2 rounded block">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/webhooks/bouncie
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Configure this URL in your Bouncie developer portal for real-time updates.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Link Device Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Device to Vehicle</DialogTitle>
            <DialogDescription>
              Select a vehicle to link with this Bouncie device
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Device</Label>
              <p className="text-sm font-medium">
                {devices.find((d) => d.imei === selectedDeviceImei)?.nickname ||
                  selectedDeviceImei}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {unlinkedVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkDevice} disabled={!selectedVehicleId || linking}>
              {linking ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              Link Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

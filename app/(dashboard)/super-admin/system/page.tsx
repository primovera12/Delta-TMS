'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Server,
  Database,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Mock system data
const mockSystemStatus = {
  services: [
    { name: 'API Server', status: 'healthy', uptime: '99.98%', latency: '45ms', lastCheck: '30s ago' },
    { name: 'Web Server', status: 'healthy', uptime: '99.99%', latency: '12ms', lastCheck: '30s ago' },
    { name: 'Database (Primary)', status: 'healthy', uptime: '99.95%', latency: '8ms', lastCheck: '30s ago' },
    { name: 'Database (Replica)', status: 'healthy', uptime: '99.90%', latency: '15ms', lastCheck: '30s ago' },
    { name: 'Redis Cache', status: 'healthy', uptime: '99.99%', latency: '2ms', lastCheck: '30s ago' },
    { name: 'Email Service', status: 'warning', uptime: '98.50%', latency: '156ms', lastCheck: '30s ago' },
    { name: 'SMS Gateway', status: 'healthy', uptime: '99.80%', latency: '85ms', lastCheck: '30s ago' },
    { name: 'File Storage', status: 'healthy', uptime: '99.95%', latency: '28ms', lastCheck: '30s ago' },
  ],
  resources: {
    cpu: 42,
    memory: 68,
    disk: 45,
    network: 23,
  },
  database: {
    connections: 45,
    maxConnections: 100,
    queries: 1245,
    slowQueries: 3,
    size: '45.2 GB',
    tables: 128,
  },
  logs: [
    { time: '10:30:45', level: 'INFO', message: 'API request processed successfully' },
    { time: '10:30:42', level: 'WARN', message: 'Email service experiencing delays' },
    { time: '10:30:38', level: 'INFO', message: 'Cache hit rate: 94.5%' },
    { time: '10:30:35', level: 'INFO', message: 'Database backup started' },
    { time: '10:30:30', level: 'ERROR', message: 'Failed to connect to SMS gateway (retrying)' },
    { time: '10:30:25', level: 'INFO', message: 'User session created' },
  ],
};

export default function SuperAdminSystemPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'healthy') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'healthy') return 'bg-green-100 text-green-800';
    if (status === 'warning') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLogLevelColor = (level: string) => {
    if (level === 'INFO') return 'text-blue-600';
    if (level === 'WARN') return 'text-yellow-600';
    if (level === 'ERROR') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
          <p className="text-gray-600">Monitor system health and performance</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50 border-green-200">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <div>
          <p className="font-semibold text-green-800">All Systems Operational</p>
          <p className="text-sm text-green-600">Last updated: Just now</p>
        </div>
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="h-5 w-5 text-blue-500" />
              <span className="font-medium">CPU Usage</span>
            </div>
            <p className="text-2xl font-bold">{mockSystemStatus.resources.cpu}%</p>
            <Progress value={mockSystemStatus.resources.cpu} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <MemoryStick className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Memory Usage</span>
            </div>
            <p className="text-2xl font-bold">{mockSystemStatus.resources.memory}%</p>
            <Progress value={mockSystemStatus.resources.memory} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <HardDrive className="h-5 w-5 text-green-500" />
              <span className="font-medium">Disk Usage</span>
            </div>
            <p className="text-2xl font-bold">{mockSystemStatus.resources.disk}%</p>
            <Progress value={mockSystemStatus.resources.disk} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Network I/O</span>
            </div>
            <p className="text-2xl font-bold">{mockSystemStatus.resources.network}%</p>
            <Progress value={mockSystemStatus.resources.network} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="logs">Live Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="h-4 w-4" />
                Service Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSystemStatus.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-gray-500">Checked {service.lastCheck}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Uptime</p>
                        <p className="font-medium">{service.uptime}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Latency</p>
                        <p className="font-medium">{service.latency}</p>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Connections</span>
                      <span>{mockSystemStatus.database.connections}/{mockSystemStatus.database.maxConnections}</span>
                    </div>
                    <Progress
                      value={(mockSystemStatus.database.connections / mockSystemStatus.database.maxConnections) * 100}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Queries/min</p>
                      <p className="text-xl font-bold">{mockSystemStatus.database.queries}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Slow Queries</p>
                      <p className="text-xl font-bold text-yellow-600">{mockSystemStatus.database.slowQueries}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Storage Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Database Size</span>
                    <span className="font-medium">{mockSystemStatus.database.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tables</span>
                    <span className="font-medium">{mockSystemStatus.database.tables}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Backup</span>
                    <span className="font-medium">6 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Backup Size</span>
                    <span className="font-medium">12.4 GB</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Run Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Live System Logs
                </CardTitle>
                <Badge variant="outline">Auto-refresh: 5s</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                {mockSystemStatus.logs.map((log, index) => (
                  <div key={index} className="flex gap-4 py-1">
                    <span className="text-gray-500">{log.time}</span>
                    <span className={`w-12 ${getLogLevelColor(log.level)}`}>[{log.level}]</span>
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

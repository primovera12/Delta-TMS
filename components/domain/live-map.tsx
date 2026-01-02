'use client';

import * as React from 'react';
import { MapPin, Navigation, Car, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

interface Location {
  lat: number;
  lng: number;
}

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'on-trip' | 'offline';
  location: Location;
  currentTripId?: string;
}

interface Trip {
  id: string;
  pickup: Location;
  dropoff: Location;
  driverLocation?: Location;
  status: string;
}

interface LiveMapProps {
  drivers?: Driver[];
  trips?: Trip[];
  center?: Location;
  zoom?: number;
  onDriverClick?: (driver: Driver) => void;
  onTripClick?: (trip: Trip) => void;
  onRefresh?: () => void;
  className?: string;
  showControls?: boolean;
  height?: string;
}

// Mock map component - in production, integrate with Google Maps, Mapbox, or similar
export function LiveMap({
  drivers = [],
  trips = [],
  center = { lat: 29.7604, lng: -95.3698 },
  zoom = 12,
  onDriverClick,
  onTripClick,
  onRefresh,
  className,
  showControls = true,
  height = '400px',
}: LiveMapProps) {
  const [mapZoom, setMapZoom] = React.useState(zoom);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleZoomIn = () => setMapZoom((z) => Math.min(z + 1, 18));
  const handleZoomOut = () => setMapZoom((z) => Math.max(z - 1, 1));

  const availableDrivers = drivers.filter((d) => d.status === 'available');
  const onTripDrivers = drivers.filter((d) => d.status === 'on-trip');

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary-600" />
          Live Map
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            {availableDrivers.length} Available
          </Badge>
          <Badge variant="warning" size="sm">
            {onTripDrivers.length} On Trip
          </Badge>
          {onRefresh && (
            <Button variant="ghost" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 relative">
        {/* Map Placeholder - Replace with actual map integration */}
        <div
          style={{ height: isFullscreen ? '100vh' : height }}
          className="bg-gray-100 relative overflow-hidden"
        >
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Grid lines to simulate map */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="gray"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Driver Markers */}
          {drivers.map((driver, index) => (
            <div
              key={driver.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${20 + (index * 20) % 60}%`,
              }}
              onClick={() => onDriverClick?.(driver)}
            >
              <div
                className={cn(
                  'relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-transform hover:scale-110',
                  driver.status === 'available'
                    ? 'bg-success-500'
                    : driver.status === 'on-trip'
                    ? 'bg-warning-500'
                    : 'bg-gray-400'
                )}
              >
                <Car className="h-5 w-5 text-white" />
                {driver.status === 'on-trip' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-ping" />
                )}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                <span className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm">
                  {driver.name.split(' ')[0]}
                </span>
              </div>
            </div>
          ))}

          {/* Trip Markers */}
          {trips.map((trip, index) => (
            <React.Fragment key={trip.id}>
              {/* Pickup Marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${30 + (index * 10) % 40}%`,
                  top: `${30 + (index * 15) % 40}%`,
                }}
                onClick={() => onTripClick?.(trip)}
              >
                <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shadow-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
              {/* Dropoff Marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${50 + (index * 12) % 30}%`,
                  top: `${50 + (index * 18) % 30}%`,
                }}
                onClick={() => onTripClick?.(trip)}
              >
                <div className="w-8 h-8 rounded-full bg-error-500 flex items-center justify-center shadow-lg">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
            </React.Fragment>
          ))}

          {/* Map Controls */}
          {showControls && (
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="shadow-md"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="shadow-md"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="shadow-md"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Legend */}
          <div className="absolute left-4 bottom-4 bg-white rounded-lg shadow-md p-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Legend</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success-500" />
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning-500" />
                <span className="text-xs text-gray-600">On Trip</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-600">Offline</span>
              </div>
            </div>
          </div>

          {/* Center Info */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-lg">
              <p className="text-sm font-medium text-gray-700">Map Integration</p>
              <p className="text-xs text-gray-500 mt-1">
                Connect to Google Maps or Mapbox
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
              </p>
              <p className="text-xs text-gray-400">Zoom: {mapZoom}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

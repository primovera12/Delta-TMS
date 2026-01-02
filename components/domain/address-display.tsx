'use client';

import React from 'react';
import { MapPin, Phone, Building, ExternalLink, Edit2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AddressDisplayProps {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number | null;
  longitude?: number | null;
  contactName?: string | null;
  contactPhone?: string | null;
  placeName?: string | null;
  placeType?: string | null;
  instructions?: string | null;
  showMap?: boolean;
  editable?: boolean;
  onEdit?: () => void;
  compact?: boolean;
  className?: string;
}

export function AddressDisplay({
  addressLine1,
  addressLine2,
  city,
  state,
  zipCode,
  latitude,
  longitude,
  contactName,
  contactPhone,
  placeName,
  placeType,
  instructions,
  showMap = false,
  editable = false,
  onEdit,
  compact = false,
  className,
}: AddressDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const fullAddress = [
    addressLine1,
    addressLine2,
    `${city}, ${state} ${zipCode}`,
  ]
    .filter(Boolean)
    .join(', ');

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleOpenMaps = () => {
    const query = latitude && longitude
      ? `${latitude},${longitude}`
      : encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  if (compact) {
    return (
      <div className={cn('flex items-start gap-2', className)}>
        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          {placeName && <span className="font-medium">{placeName} - </span>}
          <span className="text-gray-700">{addressLine1}</span>
          {addressLine2 && <span className="text-gray-700">, {addressLine2}</span>}
          <span className="text-gray-500"> ({city}, {state})</span>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {placeType ? (
                <Building className="h-4 w-4 text-blue-600" />
              ) : (
                <MapPin className="h-4 w-4 text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {placeName && (
                <p className="font-semibold text-gray-900">{placeName}</p>
              )}
              {placeType && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mb-1 capitalize">
                  {placeType.replace('_', ' ')}
                </span>
              )}
              <p className="text-gray-900">{addressLine1}</p>
              {addressLine2 && <p className="text-gray-700">{addressLine2}</p>}
              <p className="text-gray-500">
                {city}, {state} {zipCode}
              </p>

              {(contactName || contactPhone) && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  {contactName && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contact:</span> {contactName}
                    </p>
                  )}
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {contactPhone}
                    </a>
                  )}
                </div>
              )}

              {instructions && (
                <div className="mt-2 p-2 bg-amber-50 rounded text-sm text-amber-800 border border-amber-100">
                  <span className="font-medium">Note: </span>
                  {instructions}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {editable && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleOpenMaps}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map preview */}
        {showMap && latitude && longitude && (
          <div className="mt-4 h-32 rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AddressDisplay;

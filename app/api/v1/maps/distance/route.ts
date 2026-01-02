import { NextRequest, NextResponse } from 'next/server';
import { calculateDistance } from '@/lib/services/address-service';

interface DistanceRequest {
  origin: {
    lat: number;
    lng: number;
  } | string;
  destination: {
    lat: number;
    lng: number;
  } | string;
  departureTime?: string;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
}

/**
 * POST /api/v1/maps/distance
 * Calculate distance and duration between two points
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as DistanceRequest;

    const { origin, destination, departureTime, avoidHighways, avoidTolls } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: 'Origin and destination are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    const options = {
      departureTime: departureTime ? new Date(departureTime) : undefined,
      avoidHighways,
      avoidTolls,
    };

    const result = await calculateDistance(origin, destination, apiKey, options);

    return NextResponse.json({
      success: true,
      data: {
        distanceMiles: Math.round(result.distanceMiles * 100) / 100,
        distanceMeters: result.distanceMeters,
        durationMinutes: Math.round(result.durationMinutes),
        durationSeconds: result.durationSeconds,
        durationInTraffic: result.durationInTraffic
          ? Math.round(result.durationInTraffic)
          : undefined,
      },
    });
  } catch (error) {
    console.error('Distance calculation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to calculate distance';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/maps/distance
 * Calculate distance using query parameters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const originLat = searchParams.get('originLat');
    const originLng = searchParams.get('originLng');
    const destLat = searchParams.get('destLat');
    const destLng = searchParams.get('destLng');

    if (!originLat || !originLng || !destLat || !destLng) {
      return NextResponse.json(
        { error: 'Origin and destination coordinates are required (originLat, originLng, destLat, destLng)' },
        { status: 400 }
      );
    }

    const origin = {
      lat: parseFloat(originLat),
      lng: parseFloat(originLng),
    };

    const destination = {
      lat: parseFloat(destLat),
      lng: parseFloat(destLng),
    };

    if (isNaN(origin.lat) || isNaN(origin.lng) || isNaN(destination.lat) || isNaN(destination.lng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_SERVER_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      );
    }

    const result = await calculateDistance(origin, destination, apiKey);

    return NextResponse.json({
      success: true,
      data: {
        distanceMiles: Math.round(result.distanceMiles * 100) / 100,
        distanceMeters: result.distanceMeters,
        durationMinutes: Math.round(result.durationMinutes),
        durationSeconds: result.durationSeconds,
      },
    });
  } catch (error) {
    console.error('Distance calculation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to calculate distance';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

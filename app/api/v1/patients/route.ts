import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Prisma, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

// GET /api/v1/patients - List patients
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const transportType = searchParams.get('transportType');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: Prisma.UserWhereInput = {
      role: 'PATIENT',
    };

    // Status filter
    if (status) {
      const statusMap: Record<string, UserStatus> = {
        active: 'ACTIVE',
        inactive: 'INACTIVE',
        suspended: 'SUSPENDED',
        pending: 'PENDING_VERIFICATION',
      };
      if (statusMap[status]) {
        where.status = statusMap[status];
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Transport type filter - filter by medical profile mobility aids
    if (transportType) {
      where.medicalProfile = {
        mobilityAids: {
          has: transportType,
        },
      };
    }

    // Get total count
    const total = await prisma.user.count({ where });

    // Get paginated patients
    const patients = await prisma.user.findMany({
      where,
      include: {
        medicalProfile: true,
        savedAddresses: {
          take: 1,
          where: { label: 'Home' },
        },
        tripsAsPassenger: {
          select: {
            trip: {
              select: {
                status: true,
                scheduledPickupTime: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format response
    const formattedPatients = patients.map((user) => {
      const trips = user.tripsAsPassenger.map(tp => tp.trip);
      const now = new Date();

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] || null,
        phone: user.phone,
        email: user.email,
        address: user.savedAddresses[0] ? {
          street: user.savedAddresses[0].addressLine1,
          city: user.savedAddresses[0].city,
          state: user.savedAddresses[0].state,
          zipCode: user.savedAddresses[0].zipCode,
          lat: user.savedAddresses[0].latitude,
          lng: user.savedAddresses[0].longitude,
        } : null,
        emergencyContact: user.medicalProfile ? {
          name: user.medicalProfile.emergencyContactName,
          relationship: user.medicalProfile.emergencyContactRelationship,
          phone: user.medicalProfile.emergencyContactPhone,
        } : null,
        insuranceProvider: user.medicalProfile?.insuranceProvider || null,
        medicaidNumber: user.medicalProfile?.medicaidNumber || null,
        medicareNumber: user.medicalProfile?.medicareNumber || null,
        defaultTransportType: user.medicalProfile?.mobilityAids?.[0] || 'ambulatory',
        specialNeeds: [
          ...(user.medicalProfile?.mobilityAids || []),
          ...(user.medicalProfile?.oxygenRequired ? ['oxygen'] : []),
          ...(user.medicalProfile?.ivRequired ? ['iv'] : []),
        ],
        notes: user.medicalProfile?.specialInstructions || null,
        status: user.status.toLowerCase().replace('_verification', ''),
        stats: {
          totalTrips: trips.length,
          upcomingTrips: trips.filter(t =>
            t.status === 'CONFIRMED' || t.status === 'ASSIGNED'
          ).length,
          cancelledTrips: trips.filter(t => t.status === 'CANCELLED').length,
        },
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      data: formattedPatients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/v1/patients - Create a new patient
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER', 'FACILITY_STAFF'];
    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if phone already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: body.phone },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this phone number already exists' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (body.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Create the patient user
    const newPatient = await prisma.user.create({
      data: {
        email: body.email || `${body.phone.replace(/\D/g, '')}@placeholder.com`,
        phone: body.phone,
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        passwordHash,
        role: 'PATIENT',
        status: 'ACTIVE',
        // Create medical profile if provided
        medicalProfile: body.medicalProfile || body.emergencyContact || body.insuranceProvider ? {
          create: {
            mobilityAids: body.defaultTransportType ? [body.defaultTransportType] : body.specialNeeds || [],
            wheelchairType: body.wheelchairType || null,
            oxygenRequired: body.specialNeeds?.includes('oxygen') || false,
            ivRequired: body.specialNeeds?.includes('iv') || false,
            emergencyContactName: body.emergencyContact?.name || null,
            emergencyContactPhone: body.emergencyContact?.phone || null,
            emergencyContactRelationship: body.emergencyContact?.relationship || null,
            insuranceProvider: body.insuranceProvider || null,
            medicaidNumber: body.medicaidNumber || null,
            medicareNumber: body.medicareNumber || null,
            specialInstructions: body.notes || null,
          },
        } : undefined,
        // Create home address if provided
        savedAddresses: body.address ? {
          create: {
            label: 'Home',
            addressLine1: body.address.street,
            city: body.address.city,
            state: body.address.state,
            zipCode: body.address.zipCode,
            latitude: body.address.lat || 0,
            longitude: body.address.lng || 0,
          },
        } : undefined,
      },
      include: {
        medicalProfile: true,
        savedAddresses: true,
      },
    });

    // Format response
    const formattedPatient = {
      id: newPatient.id,
      firstName: newPatient.firstName,
      lastName: newPatient.lastName,
      name: `${newPatient.firstName} ${newPatient.lastName}`,
      dateOfBirth: newPatient.dateOfBirth?.toISOString().split('T')[0] || null,
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.savedAddresses[0] ? {
        street: newPatient.savedAddresses[0].addressLine1,
        city: newPatient.savedAddresses[0].city,
        state: newPatient.savedAddresses[0].state,
        zipCode: newPatient.savedAddresses[0].zipCode,
      } : null,
      emergencyContact: newPatient.medicalProfile ? {
        name: newPatient.medicalProfile.emergencyContactName,
        relationship: newPatient.medicalProfile.emergencyContactRelationship,
        phone: newPatient.medicalProfile.emergencyContactPhone,
      } : null,
      status: 'active',
      stats: {
        totalTrips: 0,
        upcomingTrips: 0,
        cancelledTrips: 0,
      },
      createdAt: newPatient.createdAt.toISOString(),
      updatedAt: newPatient.updatedAt.toISOString(),
    };

    return NextResponse.json({ data: formattedPatient }, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

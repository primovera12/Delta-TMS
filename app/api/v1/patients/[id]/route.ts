import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/v1/patients/[id] - Get a specific patient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        medicalProfile: true,
        savedAddresses: {
          orderBy: { createdAt: 'desc' },
        },
        tripsAsPassenger: {
          take: 10,
          orderBy: { trip: { scheduledPickupTime: 'desc' } },
          include: {
            trip: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Format the response
    const patient = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] || null,
      status: user.status,
      role: user.role,
      address: user.savedAddresses.find((a: { label: string }) => a.label === 'Home') || null,
      savedAddresses: user.savedAddresses,
      medicalProfile: user.medicalProfile ? {
        mobilityStatus: user.medicalProfile.mobilityAids?.[0] || 'ambulatory',
        mobilityAids: user.medicalProfile.mobilityAids || [],
        wheelchairType: user.medicalProfile.wheelchairType,
        requiresOxygen: user.medicalProfile.oxygenRequired,
        requiresAttendant: !user.medicalProfile.canTransferIndependently,
        specialNeeds: user.medicalProfile.cognitiveNotes || '',
        allergies: user.medicalProfile.allergies || [],
        medications: user.medicalProfile.medications || [],
        medicalConditions: user.medicalProfile.medicalConditions || [],
      } : null,
      emergencyContact: user.medicalProfile?.emergencyContactName ? {
        name: user.medicalProfile.emergencyContactName,
        relationship: user.medicalProfile.emergencyContactRelationship,
        phone: user.medicalProfile.emergencyContactPhone,
      } : null,
      stats: {
        totalTrips: user.tripsAsPassenger.length,
        upcomingTrips: user.tripsAsPassenger.filter((tp: { trip: { status: string; scheduledPickupTime: Date } }) =>
          tp.trip.status === 'CONFIRMED' && new Date(tp.trip.scheduledPickupTime) > new Date()
        ).length,
        cancelledTrips: user.tripsAsPassenger.filter((tp: { trip: { status: string } }) => tp.trip.status === 'CANCELLED').length,
      },
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json({ data: patient });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/patients/[id] - Update a patient (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin permissions
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS_MANAGER', 'DISPATCHER'];
    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { profile, medicalProfile, emergencyContact } = body;

    // Update user profile
    if (profile) {
      await prisma.user.update({
        where: { id },
        data: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
          status: profile.status,
        },
      });
    }

    // Update medical profile (including emergency contact which is stored in medicalProfile)
    if (medicalProfile || emergencyContact) {
      const existingMedical = await prisma.medicalProfile.findUnique({
        where: { userId: id },
      });

      const medicalData: Record<string, unknown> = {};

      if (medicalProfile) {
        medicalData.mobilityAids = medicalProfile.mobilityAids ||
          (medicalProfile.mobilityStatus ? [medicalProfile.mobilityStatus] : []);
        medicalData.wheelchairType = medicalProfile.wheelchairType;
        medicalData.oxygenRequired = medicalProfile.requiresOxygen || false;
        medicalData.canTransferIndependently = !medicalProfile.requiresAttendant;
        medicalData.cognitiveNotes = medicalProfile.specialNeeds;
        medicalData.allergies = Array.isArray(medicalProfile.allergies)
          ? medicalProfile.allergies
          : medicalProfile.allergies?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
        medicalData.medications = Array.isArray(medicalProfile.medications)
          ? medicalProfile.medications
          : medicalProfile.medications?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
        medicalData.medicalConditions = medicalProfile.medicalConditions || [];
      }

      // Emergency contact is stored in MedicalProfile
      if (emergencyContact) {
        medicalData.emergencyContactName = emergencyContact.name;
        medicalData.emergencyContactRelationship = emergencyContact.relationship;
        medicalData.emergencyContactPhone = emergencyContact.phone;
      }

      if (existingMedical) {
        await prisma.medicalProfile.update({
          where: { userId: id },
          data: medicalData,
        });
      } else {
        await prisma.medicalProfile.create({
          data: {
            userId: id,
            ...medicalData,
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Patient updated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/patients/[id] - Deactivate a patient (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has admin permissions
    const allowedRoles = ['SUPER_ADMIN', 'ADMIN'];
    if (!allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // Soft delete - set status to INACTIVE
    await prisma.user.update({
      where: { id },
      data: {
        status: 'INACTIVE',
      },
    });

    return NextResponse.json({
      message: 'Patient deactivated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error deactivating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

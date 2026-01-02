import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/v1/patients/me - Get current user's patient profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        medicalProfile: true,
        savedAddresses: {
          orderBy: { createdAt: 'desc' },
        },
        emergencyContacts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format the response
    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] || null,
      address: user.savedAddresses.find(a => a.label === 'Home') || null,
      medicalProfile: user.medicalProfile ? {
        mobilityStatus: user.medicalProfile.mobilityAids?.[0] || 'ambulatory',
        mobilityAids: user.medicalProfile.mobilityAids || [],
        wheelchairType: user.medicalProfile.wheelchairType,
        requiresOxygen: user.medicalProfile.oxygenRequired,
        requiresAttendant: !user.medicalProfile.canTransferIndependently,
        specialNeeds: user.medicalProfile.cognitiveNotes || '',
        allergies: user.medicalProfile.allergies?.join(', ') || '',
        medications: user.medicalProfile.medications?.join(', ') || '',
        medicalConditions: user.medicalProfile.medicalConditions || [],
        weightLbs: user.medicalProfile.weightLbs,
        heightInches: user.medicalProfile.heightInches,
        hearingImpaired: user.medicalProfile.hearingImpaired,
        visuallyImpaired: user.medicalProfile.visuallyImpaired,
      } : null,
      emergencyContact: user.emergencyContacts[0] ? {
        name: user.emergencyContacts[0].name,
        relationship: user.emergencyContacts[0].relationship,
        phone: user.emergencyContacts[0].phone,
      } : null,
      notificationPreferences: {
        tripReminders: user.tripRemindersEnabled,
        smsNotifications: user.smsNotificationsEnabled,
        emailNotifications: user.emailNotificationsEnabled,
        reminderHours: user.reminderHoursBefore,
      },
      savedAddresses: user.savedAddresses,
    };

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/patients/me - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { profile, medicalProfile, emergencyContact, notificationPreferences } = body;

    // Update user profile
    if (profile) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
        },
      });

      // Update or create home address
      if (profile.address) {
        const existingHomeAddress = await prisma.savedAddress.findFirst({
          where: {
            userId: session.user.id,
            label: 'Home',
          },
        });

        if (existingHomeAddress) {
          await prisma.savedAddress.update({
            where: { id: existingHomeAddress.id },
            data: {
              addressLine1: profile.address.addressLine1 || profile.address.street,
              addressLine2: profile.address.addressLine2,
              city: profile.address.city,
              state: profile.address.state,
              zipCode: profile.address.zipCode,
              latitude: profile.address.latitude || profile.address.lat || 0,
              longitude: profile.address.longitude || profile.address.lng || 0,
            },
          });
        } else {
          await prisma.savedAddress.create({
            data: {
              userId: session.user.id,
              label: 'Home',
              addressLine1: profile.address.addressLine1 || profile.address.street,
              addressLine2: profile.address.addressLine2,
              city: profile.address.city,
              state: profile.address.state,
              zipCode: profile.address.zipCode,
              latitude: profile.address.latitude || profile.address.lat || 0,
              longitude: profile.address.longitude || profile.address.lng || 0,
            },
          });
        }
      }
    }

    // Update medical profile
    if (medicalProfile) {
      const existingMedical = await prisma.medicalProfile.findUnique({
        where: { userId: session.user.id },
      });

      const medicalData = {
        mobilityAids: medicalProfile.mobilityAids ||
          (medicalProfile.mobilityStatus ? [medicalProfile.mobilityStatus] : []),
        wheelchairType: medicalProfile.wheelchairType,
        oxygenRequired: medicalProfile.requiresOxygen || false,
        canTransferIndependently: !medicalProfile.requiresAttendant,
        cognitiveNotes: medicalProfile.specialNeeds,
        allergies: typeof medicalProfile.allergies === 'string'
          ? medicalProfile.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
          : medicalProfile.allergies || [],
        medications: typeof medicalProfile.medications === 'string'
          ? medicalProfile.medications.split(',').map((s: string) => s.trim()).filter(Boolean)
          : medicalProfile.medications || [],
        medicalConditions: medicalProfile.medicalConditions || [],
        weightLbs: medicalProfile.weightLbs,
        heightInches: medicalProfile.heightInches,
        hearingImpaired: medicalProfile.hearingImpaired || false,
        visuallyImpaired: medicalProfile.visuallyImpaired || false,
      };

      if (existingMedical) {
        await prisma.medicalProfile.update({
          where: { userId: session.user.id },
          data: medicalData,
        });
      } else {
        await prisma.medicalProfile.create({
          data: {
            userId: session.user.id,
            ...medicalData,
          },
        });
      }
    }

    // Update emergency contact
    if (emergencyContact) {
      const existingContact = await prisma.emergencyContact.findFirst({
        where: { userId: session.user.id },
        orderBy: { priority: 'asc' },
      });

      const contactData = {
        name: emergencyContact.name,
        relationship: emergencyContact.relationship,
        phone: emergencyContact.phone,
      };

      if (existingContact) {
        await prisma.emergencyContact.update({
          where: { id: existingContact.id },
          data: contactData,
        });
      } else {
        await prisma.emergencyContact.create({
          data: {
            userId: session.user.id,
            priority: 1,
            ...contactData,
          },
        });
      }
    }

    // Update notification preferences
    if (notificationPreferences) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          tripRemindersEnabled: notificationPreferences.tripReminders,
          smsNotificationsEnabled: notificationPreferences.smsNotifications,
          emailNotificationsEnabled: notificationPreferences.emailNotifications,
          reminderHoursBefore: notificationPreferences.reminderHours,
        },
      });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock patients data
const patients = [
  {
    id: 'PAT-001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1952-03-15',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    address: {
      street: '123 Main St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      lat: 29.7604,
      lng: -95.3698,
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '(555) 123-4568',
    },
    membershipId: 'MBR-00012345',
    insuranceProvider: 'Medicare',
    defaultTransportType: 'wheelchair',
    specialNeeds: ['wheelchair', 'oxygen'],
    notes: 'Hard of hearing, prefers written communication',
    status: 'active',
    facilityId: null,
    stats: {
      totalTrips: 45,
      upcomingTrips: 2,
      cancelledTrips: 1,
    },
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'PAT-002',
    firstName: 'Mary',
    lastName: 'Jones',
    dateOfBirth: '1948-07-22',
    phone: '(555) 234-5678',
    email: 'mary.jones@email.com',
    address: {
      street: '456 Oak Ave',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002',
      lat: 29.7555,
      lng: -95.3555,
    },
    emergencyContact: {
      name: 'Robert Jones',
      relationship: 'Son',
      phone: '(555) 234-5679',
    },
    membershipId: 'MBR-00012346',
    insuranceProvider: 'Medicaid',
    defaultTransportType: 'ambulatory',
    specialNeeds: [],
    notes: null,
    status: 'active',
    facilityId: null,
    stats: {
      totalTrips: 62,
      upcomingTrips: 3,
      cancelledTrips: 0,
    },
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'PAT-003',
    firstName: 'Robert',
    lastName: 'Brown',
    dateOfBirth: '1960-11-08',
    phone: '(555) 345-6789',
    email: 'robert.brown@email.com',
    address: {
      street: '789 Pine Rd',
      city: 'Houston',
      state: 'TX',
      zipCode: '77003',
      lat: 29.7508,
      lng: -95.4608,
    },
    emergencyContact: {
      name: 'Susan Brown',
      relationship: 'Wife',
      phone: '(555) 345-6780',
    },
    membershipId: 'MBR-00012347',
    insuranceProvider: 'Medicare',
    defaultTransportType: 'wheelchair',
    specialNeeds: ['wheelchair'],
    notes: 'Dialysis patient - MWF mornings',
    status: 'active',
    facilityId: 'FAC-001',
    stats: {
      totalTrips: 28,
      upcomingTrips: 1,
      cancelledTrips: 2,
    },
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2026-01-14T00:00:00Z',
  },
];

// GET /api/v1/patients - List patients
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const facilityId = searchParams.get('facilityId');
    const transportType = searchParams.get('transportType');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let filteredPatients = [...patients];

    // Apply filters
    if (status) {
      filteredPatients = filteredPatients.filter((p) => p.status === status);
    }
    if (facilityId) {
      filteredPatients = filteredPatients.filter((p) => p.facilityId === facilityId);
    }
    if (transportType) {
      filteredPatients = filteredPatients.filter(
        (p) => p.defaultTransportType === transportType
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = filteredPatients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower) ||
          p.phone.includes(search) ||
          p.membershipId?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = filteredPatients.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPatients = filteredPatients.slice(start, end);

    // Format response
    const formattedPatients = paginatedPatients.map((p) => ({
      ...p,
      name: `${p.firstName} ${p.lastName}`,
    }));

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

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newPatient = {
      id: `PAT-${String(patients.length + 1).padStart(3, '0')}`,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      emergencyContact: body.emergencyContact || null,
      membershipId: body.membershipId || null,
      insuranceProvider: body.insuranceProvider || null,
      defaultTransportType: body.defaultTransportType || 'ambulatory',
      specialNeeds: body.specialNeeds || [],
      notes: body.notes || null,
      status: 'active',
      facilityId: body.facilityId || null,
      stats: {
        totalTrips: 0,
        upcomingTrips: 0,
        cancelledTrips: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    patients.push(newPatient);

    return NextResponse.json(
      {
        data: {
          ...newPatient,
          name: `${newPatient.firstName} ${newPatient.lastName}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

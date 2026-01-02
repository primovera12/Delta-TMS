import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/v1/drivers/[id]/documents
 * Get all documents for a specific driver
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Implement database query with Prisma
    // const documents = await prisma.driverDocument.findMany({
    //   where: { driverId: id },
    //   orderBy: { expiryDate: 'asc' },
    // });

    // Mock data
    const documents = [
      {
        id: 'DOC-001',
        driverId: id,
        type: 'drivers_license',
        name: "Driver's License",
        status: 'valid',
        issuedDate: '2024-03-15',
        expiryDate: '2027-03-15',
        fileUrl: '/documents/driver-license.pdf',
        verifiedAt: '2024-03-15T10:00:00Z',
        verifiedBy: 'admin@example.com',
      },
      {
        id: 'DOC-002',
        driverId: id,
        type: 'medical_certificate',
        name: 'Medical Certificate',
        status: 'valid',
        issuedDate: '2025-06-20',
        expiryDate: '2026-06-20',
        fileUrl: '/documents/medical-cert.pdf',
        verifiedAt: '2025-06-21T09:00:00Z',
        verifiedBy: 'admin@example.com',
      },
      {
        id: 'DOC-003',
        driverId: id,
        type: 'background_check',
        name: 'Background Check',
        status: 'valid',
        issuedDate: '2024-03-15',
        expiryDate: '2026-03-15',
        fileUrl: '/documents/background-check.pdf',
        verifiedAt: '2024-03-16T14:00:00Z',
        verifiedBy: 'admin@example.com',
      },
      {
        id: 'DOC-004',
        driverId: id,
        type: 'drug_test',
        name: 'Drug Test Results',
        status: 'valid',
        issuedDate: '2025-02-01',
        expiryDate: '2026-02-01',
        fileUrl: '/documents/drug-test.pdf',
        verifiedAt: '2025-02-02T11:00:00Z',
        verifiedBy: 'admin@example.com',
      },
      {
        id: 'DOC-005',
        driverId: id,
        type: 'cpr_certification',
        name: 'CPR Certification',
        status: 'expiring_soon',
        issuedDate: '2024-01-25',
        expiryDate: '2026-01-25',
        fileUrl: '/documents/cpr-cert.pdf',
        verifiedAt: '2024-01-26T10:00:00Z',
        verifiedBy: 'admin@example.com',
      },
    ];

    // Calculate compliance status
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const enrichedDocuments = documents.map((doc) => {
      const expiryDate = new Date(doc.expiryDate);
      let status = 'valid';

      if (expiryDate < now) {
        status = 'expired';
      } else if (expiryDate < thirtyDaysFromNow) {
        status = 'expiring_soon';
      }

      return {
        ...doc,
        status,
        daysUntilExpiry: Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      };
    });

    const expiredCount = enrichedDocuments.filter((d) => d.status === 'expired').length;
    const expiringSoonCount = enrichedDocuments.filter((d) => d.status === 'expiring_soon').length;

    return NextResponse.json({
      success: true,
      data: {
        driverId: id,
        documents: enrichedDocuments,
        summary: {
          total: enrichedDocuments.length,
          valid: enrichedDocuments.filter((d) => d.status === 'valid').length,
          expiringSoon: expiringSoonCount,
          expired: expiredCount,
          isCompliant: expiredCount === 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching driver documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/drivers/[id]/documents
 * Upload a new document for a driver
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      type,
      name,
      issuedDate,
      expiryDate,
      fileUrl,
      notes,
    } = body;

    // Validate required fields
    if (!type || !name || !expiryDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, name, expiryDate' },
        { status: 400 }
      );
    }

    // Validate document type
    const validTypes = [
      'drivers_license',
      'medical_certificate',
      'background_check',
      'drug_test',
      'cpr_certification',
      'first_aid',
      'defensive_driving',
      'vehicle_inspection',
      'insurance',
      'other',
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid document type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // TODO: Implement with Prisma
    // const document = await prisma.driverDocument.create({
    //   data: {
    //     driverId: id,
    //     type,
    //     name,
    //     issuedDate: issuedDate ? new Date(issuedDate) : undefined,
    //     expiryDate: new Date(expiryDate),
    //     fileUrl,
    //     notes,
    //     status: 'pending_verification',
    //   },
    // });

    const newDocument = {
      id: `DOC-${Date.now()}`,
      driverId: id,
      type,
      name,
      status: 'pending_verification',
      issuedDate,
      expiryDate,
      fileUrl,
      notes,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newDocument,
      message: 'Document uploaded successfully. Pending verification.',
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/drivers/[id]/documents
 * Update document verification status (bulk)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { documentIds, action, notes } = body;

    if (!documentIds || !Array.isArray(documentIds) || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: documentIds (array), action' },
        { status: 400 }
      );
    }

    const validActions = ['verify', 'reject', 'request_update'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    // TODO: Implement with Prisma
    // const updated = await prisma.driverDocument.updateMany({
    //   where: {
    //     id: { in: documentIds },
    //     driverId: id,
    //   },
    //   data: {
    //     status: action === 'verify' ? 'verified' : action === 'reject' ? 'rejected' : 'update_requested',
    //     verifiedAt: action === 'verify' ? new Date() : undefined,
    //     verifiedBy: 'current_user_email', // Get from session
    //     verificationNotes: notes,
    //   },
    // });

    const statusMap: Record<string, string> = {
      verify: 'verified',
      reject: 'rejected',
      request_update: 'update_requested',
    };

    return NextResponse.json({
      success: true,
      message: `${documentIds.length} document(s) ${statusMap[action]}`,
      data: {
        updatedCount: documentIds.length,
        action,
        newStatus: statusMap[action],
      },
    });
  } catch (error) {
    console.error('Error updating documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update documents' },
      { status: 500 }
    );
  }
}

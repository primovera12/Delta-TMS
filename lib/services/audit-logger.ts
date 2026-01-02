/**
 * Audit Logger Service
 * Tracks user actions for compliance, security, and debugging purposes
 */

export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'ASSIGN'
  | 'UNASSIGN'
  | 'APPROVE'
  | 'REJECT'
  | 'CANCEL'
  | 'COMPLETE';

export type AuditResource =
  | 'trip'
  | 'patient'
  | 'driver'
  | 'vehicle'
  | 'facility'
  | 'user'
  | 'invoice'
  | 'payment'
  | 'document'
  | 'standing_order'
  | 'report'
  | 'setting'
  | 'notification';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  severity: AuditSeverity;
  description: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  metadata?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

export interface AuditLogOptions {
  includeChanges?: boolean;
  metadata?: Record<string, unknown>;
  severity?: AuditSeverity;
}

// In-memory store for development (replace with database in production)
const auditLogs: AuditEntry[] = [];

/**
 * Generate a unique ID for audit entries
 */
function generateAuditId(): string {
  return `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Determine severity based on action and resource
 */
function determineSeverity(action: AuditAction, resource: AuditResource): AuditSeverity {
  // Critical actions
  if (action === 'DELETE' && ['user', 'patient', 'facility'].includes(resource)) {
    return 'critical';
  }

  // High severity
  if (['DELETE', 'EXPORT'].includes(action)) {
    return 'high';
  }

  if (resource === 'payment' && ['CREATE', 'UPDATE'].includes(action)) {
    return 'high';
  }

  if (action === 'LOGIN' || action === 'LOGOUT') {
    return 'medium';
  }

  // Medium severity
  if (['CREATE', 'UPDATE', 'ASSIGN', 'APPROVE', 'REJECT'].includes(action)) {
    return 'medium';
  }

  return 'low';
}

/**
 * Format a description for the audit entry
 */
function formatDescription(
  action: AuditAction,
  resource: AuditResource,
  resourceId: string,
  userEmail: string
): string {
  const resourceName = resource.replace('_', ' ');

  switch (action) {
    case 'CREATE':
      return `${userEmail} created ${resourceName} ${resourceId}`;
    case 'READ':
      return `${userEmail} viewed ${resourceName} ${resourceId}`;
    case 'UPDATE':
      return `${userEmail} updated ${resourceName} ${resourceId}`;
    case 'DELETE':
      return `${userEmail} deleted ${resourceName} ${resourceId}`;
    case 'LOGIN':
      return `${userEmail} logged in`;
    case 'LOGOUT':
      return `${userEmail} logged out`;
    case 'EXPORT':
      return `${userEmail} exported ${resourceName} data`;
    case 'IMPORT':
      return `${userEmail} imported ${resourceName} data`;
    case 'ASSIGN':
      return `${userEmail} assigned ${resourceName} ${resourceId}`;
    case 'UNASSIGN':
      return `${userEmail} unassigned ${resourceName} ${resourceId}`;
    case 'APPROVE':
      return `${userEmail} approved ${resourceName} ${resourceId}`;
    case 'REJECT':
      return `${userEmail} rejected ${resourceName} ${resourceId}`;
    case 'CANCEL':
      return `${userEmail} cancelled ${resourceName} ${resourceId}`;
    case 'COMPLETE':
      return `${userEmail} completed ${resourceName} ${resourceId}`;
    default:
      return `${userEmail} performed ${action} on ${resourceName} ${resourceId}`;
  }
}

/**
 * Calculate changes between two objects
 */
function calculateChanges(
  before: Record<string, unknown>,
  after: Record<string, unknown>
): Record<string, { before: unknown; after: unknown }> {
  const changes: Record<string, { before: unknown; after: unknown }> = {};

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    // Skip internal fields
    if (key.startsWith('_') || key === 'updatedAt' || key === 'createdAt') {
      continue;
    }

    const beforeVal = before[key];
    const afterVal = after[key];

    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changes[key] = { before: beforeVal, after: afterVal };
    }
  }

  return changes;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  action: AuditAction,
  resource: AuditResource,
  resourceId: string,
  user: {
    id: string;
    email: string;
    role: string;
  },
  options: AuditLogOptions & {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    errorMessage?: string;
  } = {}
): Promise<AuditEntry> {
  const {
    before,
    after,
    includeChanges = true,
    metadata,
    severity,
    ipAddress,
    userAgent,
    success = true,
    errorMessage,
  } = options;

  const entry: AuditEntry = {
    id: generateAuditId(),
    timestamp: new Date(),
    action,
    resource,
    resourceId,
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    ipAddress,
    userAgent,
    severity: severity || determineSeverity(action, resource),
    description: formatDescription(action, resource, resourceId, user.email),
    metadata,
    success,
    errorMessage,
  };

  // Calculate changes if before and after are provided
  if (includeChanges && before && after) {
    entry.changes = calculateChanges(before, after);
  }

  // Store the audit log
  // TODO: Replace with database storage
  // await prisma.auditLog.create({ data: entry });
  auditLogs.push(entry);

  // Log critical events to console for immediate visibility
  if (entry.severity === 'critical') {
    console.warn('[AUDIT] Critical action:', JSON.stringify(entry, null, 2));
  }

  return entry;
}

/**
 * Query audit logs with filters
 */
export async function queryAuditLogs(filters: {
  startDate?: Date;
  endDate?: Date;
  action?: AuditAction;
  resource?: AuditResource;
  userId?: string;
  resourceId?: string;
  severity?: AuditSeverity;
  success?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ logs: AuditEntry[]; total: number }> {
  let results = [...auditLogs];

  // Apply filters
  if (filters.startDate) {
    results = results.filter((log) => log.timestamp >= filters.startDate!);
  }
  if (filters.endDate) {
    results = results.filter((log) => log.timestamp <= filters.endDate!);
  }
  if (filters.action) {
    results = results.filter((log) => log.action === filters.action);
  }
  if (filters.resource) {
    results = results.filter((log) => log.resource === filters.resource);
  }
  if (filters.userId) {
    results = results.filter((log) => log.userId === filters.userId);
  }
  if (filters.resourceId) {
    results = results.filter((log) => log.resourceId === filters.resourceId);
  }
  if (filters.severity) {
    results = results.filter((log) => log.severity === filters.severity);
  }
  if (filters.success !== undefined) {
    results = results.filter((log) => log.success === filters.success);
  }

  // Sort by timestamp descending
  results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const total = results.length;

  // Apply pagination
  if (filters.offset) {
    results = results.slice(filters.offset);
  }
  if (filters.limit) {
    results = results.slice(0, filters.limit);
  }

  return { logs: results, total };
}

/**
 * Get audit trail for a specific resource
 */
export async function getResourceAuditTrail(
  resource: AuditResource,
  resourceId: string,
  limit = 50
): Promise<AuditEntry[]> {
  const { logs } = await queryAuditLogs({
    resource,
    resourceId,
    limit,
  });
  return logs;
}

/**
 * Get user activity log
 */
export async function getUserActivityLog(
  userId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}
): Promise<AuditEntry[]> {
  const { logs } = await queryAuditLogs({
    userId,
    ...options,
  });
  return logs;
}

/**
 * Middleware helper to extract request info
 */
export function extractRequestInfo(request: Request): {
  ipAddress: string;
  userAgent: string;
} {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor?.split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return { ipAddress, userAgent };
}

/**
 * Create audit log for trip-specific actions
 */
export async function logTripAction(
  action: 'CREATE' | 'UPDATE' | 'CANCEL' | 'COMPLETE' | 'ASSIGN',
  tripId: string,
  user: { id: string; email: string; role: string },
  details?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    driverId?: string;
    reason?: string;
  }
): Promise<AuditEntry> {
  return createAuditLog(action, 'trip', tripId, user, {
    before: details?.before,
    after: details?.after,
    metadata: {
      driverId: details?.driverId,
      reason: details?.reason,
    },
  });
}

/**
 * Create audit log for authentication events
 */
export async function logAuthEvent(
  action: 'LOGIN' | 'LOGOUT',
  user: { id: string; email: string; role: string },
  request: Request,
  success: boolean,
  errorMessage?: string
): Promise<AuditEntry> {
  const { ipAddress, userAgent } = extractRequestInfo(request);

  return createAuditLog(action, 'user', user.id, user, {
    ipAddress,
    userAgent,
    success,
    errorMessage,
    severity: success ? 'medium' : 'high',
  });
}

/**
 * Create audit log for payment actions
 */
export async function logPaymentAction(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  paymentId: string,
  user: { id: string; email: string; role: string },
  amount?: number
): Promise<AuditEntry> {
  return createAuditLog(action, 'payment', paymentId, user, {
    metadata: { amount },
    severity: 'high',
  });
}

/**
 * Export audit logs for compliance
 */
export async function exportAuditLogs(
  filters: Parameters<typeof queryAuditLogs>[0],
  format: 'json' | 'csv' = 'json'
): Promise<string> {
  const { logs } = await queryAuditLogs({ ...filters, limit: 10000 });

  if (format === 'csv') {
    const headers = [
      'id',
      'timestamp',
      'action',
      'resource',
      'resourceId',
      'userId',
      'userEmail',
      'userRole',
      'severity',
      'description',
      'success',
      'errorMessage',
    ];

    const rows = logs.map((log) =>
      headers
        .map((h) => {
          const value = log[h as keyof AuditEntry];
          if (value instanceof Date) {
            return value.toISOString();
          }
          return JSON.stringify(value ?? '');
        })
        .join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  return JSON.stringify(logs, null, 2);
}

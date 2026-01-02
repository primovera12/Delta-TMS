import { NextResponse } from 'next/server';

/**
 * Standardized API error response
 */
export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

/**
 * Common error codes for API responses
 */
export const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  code: keyof typeof ErrorCodes,
  status: number,
  details?: Record<string, unknown>
): NextResponse<ApiError> {
  const response: ApiError = {
    error: message,
    code,
    ...(details && { details }),
  };

  return NextResponse.json(response, { status });
}

/**
 * Pre-defined error responses for common scenarios
 */
export const ApiErrors = {
  unauthorized: (message = 'Authentication required') =>
    createErrorResponse(message, 'UNAUTHORIZED', 401),

  forbidden: (message = 'You do not have permission to perform this action') =>
    createErrorResponse(message, 'FORBIDDEN', 403),

  notFound: (resource = 'Resource') =>
    createErrorResponse(`${resource} not found`, 'NOT_FOUND', 404),

  validationError: (message: string, details?: Record<string, unknown>) =>
    createErrorResponse(message, 'VALIDATION_ERROR', 400, details),

  conflict: (message: string) =>
    createErrorResponse(message, 'CONFLICT', 409),

  rateLimited: (retryAfter?: number) =>
    createErrorResponse(
      'Too many requests. Please try again later.',
      'RATE_LIMITED',
      429,
      retryAfter ? { retryAfter } : undefined
    ),

  internal: (error?: unknown) => {
    // Log the actual error but don't expose it to the client
    if (error) {
      console.error('Internal server error:', error);
    }
    return createErrorResponse(
      'An unexpected error occurred. Please try again.',
      'INTERNAL_ERROR',
      500
    );
  },

  serviceUnavailable: (message = 'Service temporarily unavailable') =>
    createErrorResponse(message, 'SERVICE_UNAVAILABLE', 503),
};

/**
 * Wrap an async API handler with error handling
 */
export function withErrorHandling<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ApiError>> {
  return handler().catch((error) => {
    return ApiErrors.internal(error);
  });
}

/**
 * Parse and validate request body with error handling
 */
export async function parseRequestBody<T>(
  request: Request,
  validator?: (data: unknown) => T
): Promise<{ data: T } | { error: NextResponse<ApiError> }> {
  try {
    const body = await request.json();

    if (validator) {
      try {
        const data = validator(body);
        return { data };
      } catch (validationError) {
        return {
          error: ApiErrors.validationError(
            validationError instanceof Error
              ? validationError.message
              : 'Invalid request body'
          ),
        };
      }
    }

    return { data: body as T };
  } catch {
    return {
      error: ApiErrors.validationError('Invalid JSON in request body'),
    };
  }
}

/**
 * Consistent API error response format and helpers.
 *
 * All API errors should use these utilities so consumers always receive:
 * { error, message, details?, statusCode }
 */

// ─── Error Response Shape ─────────────────────────────────

export interface ApiError {
  /** Machine-readable error code (e.g. "VALIDATION_ERROR", "NOT_FOUND") */
  error: string;
  /** Human-readable description */
  message: string;
  /** Optional structured details (validation field errors, etc.) */
  details?: unknown;
  /** HTTP status code included in the body for convenience */
  statusCode: number;
}

// ─── Factory Helpers ──────────────────────────────────────

export function badRequest(message: string, details?: unknown): ApiError {
  return { error: "BAD_REQUEST", message, details, statusCode: 400 };
}

export function validationError(details: unknown): ApiError {
  return {
    error: "VALIDATION_ERROR",
    message: "Request validation failed",
    details,
    statusCode: 400,
  };
}

export function unauthorized(message = "Unauthorized"): ApiError {
  return { error: "UNAUTHORIZED", message, statusCode: 401 };
}

export function forbidden(message = "Forbidden"): ApiError {
  return { error: "FORBIDDEN", message, statusCode: 403 };
}

export function notFound(resource = "Resource"): ApiError {
  return {
    error: "NOT_FOUND",
    message: `${resource} not found`,
    statusCode: 404,
  };
}

export function conflict(message: string): ApiError {
  return { error: "CONFLICT", message, statusCode: 409 };
}

export function rateLimited(): ApiError {
  return {
    error: "RATE_LIMITED",
    message: "Too many requests. Please try again later.",
    statusCode: 429,
  };
}

export function internalError(
  message = "An unexpected error occurred"
): ApiError {
  return { error: "INTERNAL_ERROR", message, statusCode: 500 };
}

// ─── Structured Logging ───────────────────────────────────

interface LogContext {
  path?: string;
  method?: string;
  statusCode?: number;
  error?: unknown;
  requestId?: string;
  [key: string]: unknown;
}

/**
 * Log a 5xx error with full stack trace and request context.
 * Structured as JSON for easy ingestion by Sentry/Axiom.
 */
export function logServerError(message: string, context: LogContext): void {
  const entry = {
    level: "error",
    timestamp: new Date().toISOString(),
    message,
    ...context,
    stack: context.error instanceof Error ? context.error.stack : undefined,
  };
  console.error(JSON.stringify(entry));
}

/**
 * Log a 4xx error at warn level with path and details.
 */
export function logClientError(message: string, context: LogContext): void {
  const entry = {
    level: "warn",
    timestamp: new Date().toISOString(),
    message,
    ...context,
  };
  console.warn(JSON.stringify(entry));
}

/**
 * Custom error class for handling operational (expected) errors gracefully.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.isOperational = true; // helps distinguish expected errors from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly details?: unknown,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }
  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }
  static conflict(message = 'Conflict') {
    return new ApiError(409, message, 'CONFLICT');
  }
}
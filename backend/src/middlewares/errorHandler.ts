// central error handling that always returns the same shape
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { ApiError } from '../utils/ApiError';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong';
  let details: unknown;

  if (err instanceof ApiError) {
    ({ statusCode, code, message, details } = err);
  } else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid request data';
    details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid data';
    details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    code = 'INVALID_ID';
    message = `Invalid ${err.path}`;
  } else if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    message = 'Resource already exists';
  }

  if (statusCode >= 500) logger.error(err instanceof Error ? err : String(err));

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : {}),
    },
  });
};
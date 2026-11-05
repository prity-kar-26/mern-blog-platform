// one consistent success shape
import { Response } from 'express';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>,
) => res.status(statusCode).json({ success: true, data, ...(meta && { meta }) });
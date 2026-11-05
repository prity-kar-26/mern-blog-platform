import { RequestHandler } from 'express';
import { ZodType } from 'zod';

interface ParsedRequest {
    body?: unknown;
    query?: unknown;
    params?: unknown;
}

export const validate =
    (schema: ZodType): RequestHandler =>
        (req, _res, next) => {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as ParsedRequest;

            if (parsed.body !== undefined) req.body = parsed.body;
            if (parsed.params !== undefined) req.params = parsed.params as typeof req.params;
            if (parsed.query !== undefined) {
                // Express 5 makes req.query a read-only getter, so it has to be redefined
                Object.defineProperty(req, 'query', { value: parsed.query, writable: true, configurable: true });
            }
            next();
        };
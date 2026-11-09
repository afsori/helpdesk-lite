import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Pabrik middleware validasi. Contoh:
 *   router.post('/tickets', validate({ body: createTicketSchema }), controller.create)
 *
 * - body   → hasil validasi MENIMPA req.body
 * - query  → disimpan di res.locals.query  (req.query read-only di Express 5)
 * - params → disimpan di res.locals.params
 *
 * Jika gagal, parse() melempar ZodError. Express 5 meneruskannya ke error handler,
 * yang mengubahnya menjadi 400 "Validasi gagal".
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (schemas.params) res.locals.params = schemas.params.parse(req.params);
    if (schemas.query) res.locals.query = schemas.query.parse(req.query);
    if (schemas.body) req.body = schemas.body.parse(req.body ?? {});
    next();
  };
}

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/http-error';

interface ErrorBody {
  statusCode: number;
  message: string;
  details?: unknown;
}

/** Error dari body-parser (express.json) membawa properti tambahan ini. */
function isBodyParserError(err: unknown): err is SyntaxError & { status: number; type: string } {
  return err instanceof SyntaxError && 'type' in err && (err as { type: unknown }).type === 'entity.parse.failed';
}

/**
 * Error handler terpusat. Express mengenalinya sebagai error handler karena
 * fungsinya punya 4 parameter (err, req, res, next). Harus dipasang PALING AKHIR.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  // Jika response sudah mulai dikirim, serahkan ke handler bawaan Express.
  if (res.headersSent) {
    next(err);
    return;
  }

  let body: ErrorBody;

  if (err instanceof HttpError) {
    body = { statusCode: err.statusCode, message: err.message };
    if (err.details !== undefined) body.details = err.details;
  } else if (err instanceof ZodError) {
    body = {
      statusCode: 400,
      message: 'Validasi gagal',
      details: err.issues.flatMap((issue) => {
        const prefix = issue.path.join('.');
        // Field yang tidak dikenal (dari .strict()) → satu detail per field.
        if (issue.code === 'unrecognized_keys') {
          return issue.keys.map((key) => ({
            field: prefix ? `${prefix}.${key}` : key,
            message: 'Field tidak dikenal',
          }));
        }
        return [{ field: prefix || '(root)', message: issue.message }];
      }),
    };
  } else if (isBodyParserError(err)) {
    body = { statusCode: 400, message: 'Body JSON tidak valid' };
  } else {
    // Error tak terduga: catat detailnya di server, tapi jangan bocorkan ke client.
    console.error('❌ Error tidak tertangani:', err);
    body = { statusCode: 500, message: 'Terjadi kesalahan pada server' };
  }

  res.status(body.statusCode).json(body);
}

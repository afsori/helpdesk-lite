import type { Request, Response } from 'express';

/**
 * Dipasang SETELAH semua route. Jika request sampai di sini,
 * berarti tidak ada route yang cocok.
 */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ statusCode: 404, message: 'Route tidak ditemukan' });
}

/**
 * Error "resmi" aplikasi. Lempar dari mana saja (service, controller, middleware),
 * error handler akan mengubahnya menjadi response JSON dengan status yang sesuai.
 *
 * Contoh: throw new HttpError(404, 'Tiket tidak ditemukan');
 */
export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

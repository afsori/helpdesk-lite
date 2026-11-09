// ⚠️ CONTOH SEMENTARA untuk menguji validasi. Folder modules/echo akan DIHAPUS di Langkah 5.
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validate';

export const echoRouter = Router();

const echoSchema = z
  .object({
    name: z.string().min(2),
  })
  .strict(); // field selain "name" ditolak

/**
 * @openapi
 * /echo:
 *   post:
 *     tags: [contoh]
 *     summary: (Sementara) Mengembalikan body yang dikirim, untuk menguji validasi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             additionalProperties: false
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Budi
 *     responses:
 *       200:
 *         description: Body valid, dikembalikan apa adanya
 *       400:
 *         description: Validasi gagal atau JSON rusak
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
echoRouter.post('/echo', validate({ body: echoSchema }), (req, res) => {
  res.json(req.body);
});

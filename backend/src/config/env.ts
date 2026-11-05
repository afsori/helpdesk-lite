import dotenv from 'dotenv';
import { z } from 'zod';

// Muat isi file .env ke process.env. quiet: true supaya dotenv tidak mencetak log sendiri.
dotenv.config({ quiet: true });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  DB_HOST: z.string().min(1, 'wajib diisi'),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().min(1, 'wajib diisi'),
  // Bawaan XAMPP: password root kosong, jadi string kosong diperbolehkan.
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1, 'wajib diisi'),

  JWT_SECRET: z.string().min(32, 'minimal 32 karakter'),
  JWT_EXPIRES_IN: z.string().min(1).default('1d'),

  CORS_ORIGIN: z.url('harus berupa URL, mis. http://localhost:4200').default('http://localhost:4200'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Konfigurasi .env tidak valid:');
  for (const issue of parsed.error.issues) {
    const key = issue.path.join('.');
    const message = issue.code === 'invalid_type' ? 'wajib diisi' : issue.message;
    console.error(`   - ${key}: ${message}`);
  }
  console.error('\nPeriksa file backend/.env (lihat .env.example sebagai contoh).\n');
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';

const app = express();

// ---- Middleware umum (urutan penting: dijalankan dari atas ke bawah) ----
app.use(helmet()); // 1. Pasang header keamanan HTTP
app.use(cors({ origin: env.CORS_ORIGIN })); // 2. Izinkan request dari frontend Angular
app.use(morgan('dev')); // 3. Catat setiap request di terminal
app.use(express.json()); // 4. Ubah body JSON menjadi objek di req.body

// ---- Routes ----
const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Semua route di apiRouter diberi prefix /api → GET /api/health
app.use('/api', apiRouter);

export default app;

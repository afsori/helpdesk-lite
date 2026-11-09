import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { setupSwagger } from './docs/swagger';
import { errorHandler } from './middlewares/error-handler';
import { notFound } from './middlewares/not-found';
import { echoRouter } from './modules/echo/echo.routes';
import { healthRouter } from './modules/health/health.routes';

const app = express();

// ---- 1. Middleware umum (urutan penting: dijalankan dari atas ke bawah) ----
app.use(helmet()); // Pasang header keamanan HTTP
app.use(cors({ origin: env.CORS_ORIGIN })); // Izinkan request dari frontend Angular
app.use(morgan('dev')); // Catat setiap request di terminal
app.use(express.json()); // Ubah body JSON menjadi objek di req.body

// ---- 2. Routes (semua diberi prefix /api) ----
const apiRouter = Router();
apiRouter.use(healthRouter);
apiRouter.use(echoRouter); // ⚠️ sementara, dihapus di Langkah 5
app.use('/api', apiRouter);

// ---- 3. Dokumentasi API → /api/docs ----
setupSwagger(app);

// ---- 4. Tidak ada route yang cocok → 404 ----
app.use(notFound);

// ---- 5. Error handler (WAJIB paling akhir) ----
app.use(errorHandler);

export default app;

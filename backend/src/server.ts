import { env } from './config/env';
import app from './app';

// File ini hanya bertugas menyalakan server.
// Di Express 5, callback listen menerima error jika server gagal start (mis. port sudah dipakai).
app.listen(env.PORT, (error?: Error) => {
  if (error) {
    console.error(`❌ Gagal menyalakan server di port ${env.PORT}: ${error.message}`);
    process.exit(1);
  }
  console.log(`🚀 Server berjalan di http://localhost:${env.PORT}`);
  console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
});

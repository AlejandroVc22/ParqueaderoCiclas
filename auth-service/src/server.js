require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const { seedAdmin } = require('./seed/admin.seed');

const PORT = process.env.PORT || 4001;

const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`[AUTH-SERVICE] Servicio activo en puerto ${PORT}`);
      console.log(`[AUTH-SERVICE] Endpoint salud: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('[AUTH-SERVICE] No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();

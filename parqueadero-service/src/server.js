require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 4002;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[PARQUEADERO-SERVICE] Servicio activo en puerto ${PORT}`);
      console.log(`[PARQUEADERO-SERVICE] Salud: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('[PARQUEADERO-SERVICE] No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();

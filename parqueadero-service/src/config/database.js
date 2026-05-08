const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuración Sequelize para MySQL.
 * Almacena las bicicletas en el ciclo-parqueadero.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'parqueadero_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
    },
  }
);

const connectDB = async (retries = 15, delayMs = 4000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('[PARQUEADERO-SERVICE] Conexión a MySQL establecida.');
      await sequelize.sync({ alter: true });
      console.log('[PARQUEADERO-SERVICE] Modelos sincronizados.');
      return;
    } catch (error) {
      console.error(
        `[PARQUEADERO-SERVICE] Intento ${attempt}/${retries} - Error MySQL:`,
        error.message
      );
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

module.exports = { sequelize, connectDB };

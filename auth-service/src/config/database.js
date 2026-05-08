const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Configuración de Sequelize para PostgreSQL.
 * Se utiliza para almacenar usuarios y datos de autenticación.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || 'auth_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dialect: 'postgres',
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

/**
 * Intenta conectar la base de datos con reintentos.
 * Necesario porque Postgres puede tardar en estar listo dentro de Docker.
 */
const connectDB = async (retries = 10, delayMs = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('[AUTH-SERVICE] Conexión a PostgreSQL establecida correctamente.');
      await sequelize.sync({ alter: true });
      console.log('[AUTH-SERVICE] Modelos sincronizados.');
      return;
    } catch (error) {
      console.error(
        `[AUTH-SERVICE] Intento ${attempt}/${retries} - Error conectando a PostgreSQL:`,
        error.message
      );
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};

module.exports = { sequelize, connectDB };

/**
 * config/database.js
 * Configuración de la instancia de Sequelize para conectarse a PostgreSQL.
 * Lee los parámetros de conexión desde las variables de entorno.
 */

const { Sequelize } = require('sequelize');

// Crear la instancia de Sequelize con las credenciales de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || 'medical_mvp',      // Nombre de la base de datos
  process.env.DB_USER || 'postgres',          // Usuario de PostgreSQL
  process.env.DB_PASSWORD || 'medical2024',   // Contraseña
  {
    host: process.env.DB_HOST || 'localhost',  // Host del servidor de BD
    port: process.env.DB_PORT || 5432,         // Puerto de PostgreSQL
    dialect: 'postgres',                       // Motor de base de datos

    // Opciones de logging: mostrar consultas solo en desarrollo
    logging: process.env.NODE_ENV === 'production' ? false : console.log,

    // Configuración del pool de conexiones
    pool: {
      max: 5,       // Máximo de conexiones simultáneas
      min: 0,       // Mínimo de conexiones en espera
      acquire: 30000, // Tiempo máximo (ms) para obtener una conexión
      idle: 10000    // Tiempo máximo (ms) que una conexión puede estar inactiva
    },

    // Zona horaria para las operaciones con fechas
    timezone: '-05:00', // Zona horaria de Colombia (UTC-5)

    // Opciones de definición de modelos por defecto
    define: {
      timestamps: true,    // Habilitar createdAt y updatedAt
      underscored: true,   // Usar snake_case en las columnas (created_at, updated_at)
      freezeTableName: true // No pluralizar los nombres de las tablas
    }
  }
);

module.exports = sequelize;

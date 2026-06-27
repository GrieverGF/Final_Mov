/**
 * config/database.js
 * Configuración de la instancia de Sequelize para conectarse a PostgreSQL.
 * Lee los parámetros de conexión desde las variables de entorno.
 */

const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DB_DIALECT === 'sqlite') {
  // Configuración para SQLite local (archivo físico database.sqlite)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
  console.log('ℹ️ Base de datos configurada para usar SQLite (local).');
} else {
  // Configuración estándar para PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME || 'medical_mvp',      // Nombre de la base de datos
    process.env.DB_USER || 'postgres',          // Usuario de PostgreSQL
    process.env.DB_PASSWORD || 'medical2024',   // Contraseña
    {
      host: process.env.DB_HOST || 'localhost',  // Host del servidor de BD
      port: process.env.DB_PORT || 5432,         // Puerto de PostgreSQL
      dialect: 'postgres',                       // Motor de base de datos
      logging: process.env.NODE_ENV === 'production' ? false : console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      timezone: '-05:00', // Zona horaria de Colombia
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  );
}

module.exports = sequelize;

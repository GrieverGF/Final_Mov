/**
 * server.js
 * Servidor principal de Express para el MVP de Controles Médicos.
 * Configura middleware, monta las rutas bajo /api y arranca el servidor.
 */

// Cargar variables de entorno antes que cualquier otra cosa
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const controlesRoutes = require('./routes/controles');
const configRoutes = require('./routes/config');

// Crear la aplicación de Express
const app = express();

// Puerto desde las variables de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// ==========================================
// Configuración de Middleware
// ==========================================

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Parser de JSON para el cuerpo de las solicitudes
app.use(express.json());

// Parser para datos URL-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// Logger HTTP de solicitudes en consola (formato dev para desarrollo)
app.use(morgan('dev'));

// ==========================================
// Montaje de Rutas
// ==========================================

// Ruta de verificación de salud del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({
    estado: 'activo',
    mensaje: 'El servidor de Controles Médicos está funcionando correctamente',
    fecha: new Date().toISOString()
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de pacientes
app.use('/api/pacientes', pacientesRoutes);

// Rutas de controles médicos
app.use('/api/controles', controlesRoutes);

// Rutas de configuración y estadísticas (solo administradores)
app.use('/api/config', configRoutes);

// ==========================================
// Manejo de rutas no encontradas (404)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe en esta API`
  });
});

// ==========================================
// Middleware de manejo de errores global
// ==========================================
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // Registrar el error en consola para depuración
  console.error('❌ Error del servidor:', err.message);
  console.error(err.stack);

  // Determinar el código de estado HTTP
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'production'
      ? 'Ocurrió un error inesperado. Intente de nuevo más tarde.'
      : err.message
  });
});

// ==========================================
// Iniciar el servidor
// ==========================================

/**
 * Conectar a la base de datos y arrancar el servidor.
 * Se autentica la conexión a PostgreSQL antes de escuchar solicitudes.
 */
const iniciarServidor = async () => {
  try {
    // Verificar la conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos con la base de datos (sin forzar en producción)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // Iniciar el servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor de Controles Médicos ejecutándose en el puerto ${PORT}`);
      console.log(`📋 Health check disponible en: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;

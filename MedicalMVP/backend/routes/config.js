/**
 * routes/config.js
 * Rutas de configuración y estadísticas del sistema.
 * Acceso restringido únicamente a usuarios con rol 'Administrador'.
 */

const express = require('express');
const { Usuario, Paciente, ControlMedico } = require('../models');
const verificarToken = require('../middleware/auth');
const verificarRol = require('../middleware/role');

const router = express.Router();

// Aplicar middleware de autenticación y autorización por rol
// Solo los administradores pueden acceder a estas rutas
router.use(verificarToken);
router.use(verificarRol(['Administrador']));

// ==========================================
// GET /api/config/stats
// Obtener estadísticas generales del sistema
// ==========================================
router.get('/stats', async (req, res) => {
  try {
    // Realizar las tres consultas de conteo en paralelo para mayor eficiencia
    const [totalPacientes, totalControles, totalUsuarios] = await Promise.all([
      Paciente.count(),
      ControlMedico.count(),
      Usuario.count()
    ]);

    res.status(200).json({
      mensaje: 'Estadísticas del sistema obtenidas exitosamente',
      estadisticas: {
        total_pacientes: totalPacientes,
        total_controles: totalControles,
        total_usuarios: totalUsuarios
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudieron obtener las estadísticas del sistema'
    });
  }
});

module.exports = router;

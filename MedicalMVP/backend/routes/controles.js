/**
 * routes/controles.js
 * Rutas para la gestión de controles médicos.
 * Permite listar, crear y consultar controles de signos vitales.
 * Todas las rutas están protegidas por autenticación JWT.
 */

const express = require('express');
const { ControlMedico, Paciente, Usuario } = require('../models');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de controles
router.use(verificarToken);

// ==========================================
// Atributos del profesional a incluir (sin contraseña)
// ==========================================
const atributosProfesional = ['id', 'nombre_completo', 'username', 'role'];

// ==========================================
// GET /api/controles
// Listar todos los controles médicos con información del paciente y profesional
// ==========================================
router.get('/', async (req, res) => {
  try {
    const controles = await ControlMedico.findAll({
      include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'cedula', 'nombre', 'apellido', 'comunidad']
        },
        {
          model: Usuario,
          as: 'profesional',
          attributes: atributosProfesional
        }
      ],
      order: [['fecha', 'DESC']] // Controles más recientes primero
    });

    res.status(200).json({
      mensaje: 'Listado de controles médicos obtenido exitosamente',
      total: controles.length,
      controles
    });

  } catch (error) {
    console.error('❌ Error al listar controles:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudieron obtener los controles médicos'
    });
  }
});

// ==========================================
// POST /api/controles
// Crear un nuevo control médico
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { paciente_id, presion_arterial, peso, temperatura, observaciones } = req.body;

    // Validar campos obligatorios
    if (!paciente_id || !presion_arterial || !peso || !temperatura) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Los campos paciente_id, presion_arterial, peso y temperatura son obligatorios'
      });
    }

    // Verificar que el paciente existe
    const paciente = await Paciente.findByPk(paciente_id);

    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
        mensaje: `No existe un paciente con el ID ${paciente_id}`
      });
    }

    // Crear el control médico con el usuario autenticado como profesional
    const nuevoControl = await ControlMedico.create({
      paciente_id,
      usuario_id: req.user.id,        // ID del profesional autenticado
      fecha: new Date(),               // Fecha y hora actual
      presion_arterial,
      peso,
      temperatura,
      observaciones: observaciones || null
    });

    // Obtener el control creado con las relaciones incluidas
    const controlCompleto = await ControlMedico.findByPk(nuevoControl.id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'cedula', 'nombre', 'apellido', 'comunidad']
        },
        {
          model: Usuario,
          as: 'profesional',
          attributes: atributosProfesional
        }
      ]
    });

    res.status(201).json({
      mensaje: 'Control médico registrado exitosamente',
      control: controlCompleto
    });

  } catch (error) {
    console.error('❌ Error al crear control médico:', error.message);

    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudo registrar el control médico'
    });
  }
});

// ==========================================
// GET /api/controles/:id
// Obtener un control médico específico por ID
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const control = await ControlMedico.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente'
        },
        {
          model: Usuario,
          as: 'profesional',
          attributes: atributosProfesional
        }
      ]
    });

    // Verificar que el control existe
    if (!control) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: `No se encontró un control médico con el ID ${id}`
      });
    }

    res.status(200).json({
      mensaje: 'Control médico encontrado',
      control
    });

  } catch (error) {
    console.error('❌ Error al obtener control médico:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudo obtener la información del control médico'
    });
  }
});

module.exports = router;

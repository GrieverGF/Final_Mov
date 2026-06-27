/**
 * routes/pacientes.js
 * Rutas para la gestión de pacientes en el sistema de controles médicos.
 * Todas las rutas están protegidas por autenticación JWT.
 */

const express = require('express');
const { Op } = require('sequelize');
const { sequelize, Paciente, ControlMedico, Usuario } = require('../models');
const verificarToken = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas de pacientes
router.use(verificarToken);

// ==========================================
// GET /api/pacientes
// Listar pacientes con búsqueda opcional y conteo de controles
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    // Construir condiciones de búsqueda
    const whereClause = {};

    // Si se proporciona un término de búsqueda, filtrar por cédula, nombre o apellido
    if (search) {
      whereClause[Op.or] = [
        { cedula: { [Op.iLike]: `%${search}%` } },
        { nombre: { [Op.iLike]: `%${search}%` } },
        { apellido: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Consultar pacientes con el conteo de controles médicos
    const pacientes = await Paciente.findAll({
      where: whereClause,
      attributes: {
        include: [
          // Subconsulta para contar los controles de cada paciente
          [
            sequelize.fn('COUNT', sequelize.col('controles.id')),
            'total_controles'
          ]
        ]
      },
      include: [
        {
          model: ControlMedico,
          as: 'controles',
          attributes: [] // No traer datos de controles, solo contar
        }
      ],
      group: ['Paciente.id'],
      order: [['nombre', 'ASC']]
    });

    res.status(200).json({
      mensaje: 'Listado de pacientes obtenido exitosamente',
      total: pacientes.length,
      pacientes
    });

  } catch (error) {
    console.error('❌ Error al listar pacientes:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudieron obtener los pacientes'
    });
  }
});

// ==========================================
// GET /api/pacientes/:id
// Obtener un paciente por ID con todos sus controles médicos
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar paciente con sus controles e información del profesional
    const paciente = await Paciente.findByPk(id, {
      include: [
        {
          model: ControlMedico,
          as: 'controles',
          order: [['fecha', 'DESC']], // Controles más recientes primero
          include: [
            {
              model: Usuario,
              as: 'profesional',
              attributes: ['id', 'nombre_completo', 'username', 'role']
              // Excluir la contraseña por seguridad
            }
          ]
        }
      ],
      order: [
        [{ model: ControlMedico, as: 'controles' }, 'fecha', 'DESC']
      ]
    });

    // Verificar que el paciente existe
    if (!paciente) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: `No se encontró un paciente con el ID ${id}`
      });
    }

    res.status(200).json({
      mensaje: 'Paciente encontrado',
      paciente
    });

  } catch (error) {
    console.error('❌ Error al obtener paciente:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudo obtener la información del paciente'
    });
  }
});

// ==========================================
// POST /api/pacientes
// Crear un nuevo paciente
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { cedula, nombre, apellido, fecha_nacimiento, genero, direccion, telefono, comunidad } = req.body;

    // Validar campos obligatorios
    if (!cedula || !nombre || !apellido) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Los campos cédula, nombre y apellido son obligatorios'
      });
    }

    // Verificar si ya existe un paciente con la misma cédula
    const pacienteExistente = await Paciente.findOne({ where: { cedula } });

    if (pacienteExistente) {
      return res.status(409).json({
        error: 'Paciente duplicado',
        mensaje: `Ya existe un paciente registrado con la cédula ${cedula}`
      });
    }

    // Crear el nuevo paciente
    const nuevoPaciente = await Paciente.create({
      cedula,
      nombre,
      apellido,
      fecha_nacimiento: fecha_nacimiento || null,
      genero: genero || null,
      direccion: direccion || null,
      telefono: telefono || null,
      comunidad: comunidad || null
    });

    res.status(201).json({
      mensaje: 'Paciente registrado exitosamente',
      paciente: nuevoPaciente
    });

  } catch (error) {
    console.error('❌ Error al crear paciente:', error.message);

    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    // Manejar error de unicidad (cédula duplicada)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'Paciente duplicado',
        mensaje: 'Ya existe un paciente con esa cédula'
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudo registrar el paciente'
    });
  }
});

module.exports = router;

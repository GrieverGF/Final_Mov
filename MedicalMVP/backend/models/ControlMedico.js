/**
 * models/ControlMedico.js
 * Modelo de Control Médico para registrar signos vitales de los pacientes.
 * Cada control está vinculado a un paciente y al profesional que lo registró.
 */

const { DataTypes } = require('sequelize');

/**
 * Define el modelo ControlMedico en la base de datos.
 * @param {import('sequelize').Sequelize} sequelize - Instancia de Sequelize
 * @returns {import('sequelize').Model} Modelo ControlMedico
 */
module.exports = (sequelize) => {
  const ControlMedico = sequelize.define('ControlMedico', {
    // Identificador único auto-incremental
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del control médico'
    },

    // Referencia al paciente (clave foránea)
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacientes',
        key: 'id'
      },
      comment: 'ID del paciente al que pertenece este control'
    },

    // Referencia al profesional que registró el control (clave foránea)
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      comment: 'ID del profesional de salud que registró el control'
    },

    // Fecha del control médico
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha y hora en que se realizó el control médico'
    },

    // Presión arterial (ej: "120/80")
    presion_arterial: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La presión arterial es obligatoria'
        }
      },
      comment: 'Presión arterial del paciente (formato sistólica/diastólica, ej: 120/80)'
    },

    // Peso en kilogramos
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'El peso debe ser un número decimal válido'
        },
        min: {
          args: [0.1],
          msg: 'El peso debe ser mayor a 0'
        }
      },
      comment: 'Peso del paciente en kilogramos (ej: 70.50)'
    },

    // Temperatura corporal en grados Celsius
    temperatura: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'La temperatura debe ser un número decimal válido'
        },
        min: {
          args: [30.0],
          msg: 'La temperatura parece ser demasiado baja'
        },
        max: {
          args: [45.0],
          msg: 'La temperatura parece ser demasiado alta'
        }
      },
      comment: 'Temperatura corporal en grados Celsius (ej: 36.5)'
    },

    // Observaciones adicionales del profesional de salud
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Observaciones clínicas adicionales del profesional de salud'
    }
  }, {
    tableName: 'controles_medicos',
    timestamps: true,
    comment: 'Tabla de controles médicos realizados a los pacientes'
  });

  return ControlMedico;
};

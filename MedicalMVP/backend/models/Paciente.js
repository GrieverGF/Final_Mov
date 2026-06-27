/**
 * models/Paciente.js
 * Modelo de Paciente para registrar información de pacientes rurales.
 * Incluye datos demográficos y la comunidad rural a la que pertenecen.
 */

const { DataTypes } = require('sequelize');

/**
 * Define el modelo Paciente en la base de datos.
 * @param {import('sequelize').Sequelize} sequelize - Instancia de Sequelize
 * @returns {import('sequelize').Model} Modelo Paciente
 */
module.exports = (sequelize) => {
  const Paciente = sequelize.define('Paciente', {
    // Identificador único auto-incremental
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del paciente'
    },

    // Número de cédula de ciudadanía (único por paciente)
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Ya existe un paciente registrado con esta cédula'
      },
      validate: {
        notEmpty: {
          msg: 'La cédula es obligatoria'
        }
      },
      comment: 'Número de cédula de ciudadanía del paciente'
    },

    // Nombre(s) del paciente
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es obligatorio'
        }
      },
      comment: 'Nombre(s) del paciente'
    },

    // Apellido(s) del paciente
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El apellido es obligatorio'
        }
      },
      comment: 'Apellido(s) del paciente'
    },

    // Fecha de nacimiento
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha de nacimiento del paciente (formato YYYY-MM-DD)'
    },

    // Género del paciente
    genero: {
      type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
      allowNull: true,
      comment: 'Género del paciente'
    },

    // Dirección de residencia
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Dirección de residencia del paciente'
    },

    // Número de teléfono de contacto
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Número de teléfono de contacto'
    },

    // Nombre de la comunidad rural (vereda, corregimiento, etc.)
    comunidad: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Nombre de la comunidad rural (vereda, corregimiento, caserío)'
    }
  }, {
    tableName: 'pacientes',
    timestamps: true,
    comment: 'Tabla de pacientes del sistema de controles médicos'
  });

  return Paciente;
};

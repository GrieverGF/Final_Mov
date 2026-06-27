/**
 * models/Usuario.js
 * Modelo de Usuario para la autenticación y gestión de profesionales de salud.
 * Incluye hash automático de contraseña y método de validación.
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

/**
 * Define el modelo Usuario en la base de datos.
 * @param {import('sequelize').Sequelize} sequelize - Instancia de Sequelize
 * @returns {import('sequelize').Model} Modelo Usuario
 */
module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    // Identificador único auto-incremental
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Identificador único del usuario'
    },

    // Nombre de usuario para iniciar sesión (debe ser único)
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este nombre de usuario ya está registrado'
      },
      validate: {
        notEmpty: {
          msg: 'El nombre de usuario no puede estar vacío'
        }
      },
      comment: 'Nombre de usuario para inicio de sesión'
    },

    // Contraseña hasheada con bcrypt
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña no puede estar vacía'
        }
      },
      comment: 'Contraseña del usuario (almacenada como hash bcrypt)'
    },

    // Nombre completo del profesional
    nombre_completo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre completo es obligatorio'
        }
      },
      comment: 'Nombre completo del profesional de salud'
    },

    // Rol del usuario en el sistema
    role: {
      type: DataTypes.ENUM('Administrador', 'Profesional de Salud'),
      allowNull: false,
      comment: 'Rol del usuario: Administrador o Profesional de Salud'
    },

    // Estado del usuario (activo/inactivo)
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Indica si el usuario está activo en el sistema'
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    comment: 'Tabla de usuarios del sistema de controles médicos',

    // ==========================================
    // Hooks del modelo
    // ==========================================
    hooks: {
      /**
       * Hook beforeCreate: hashea la contraseña antes de guardar el usuario.
       * Utiliza bcrypt con un factor de costo de 10 rondas.
       */
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },

      /**
       * Hook beforeUpdate: hashea la contraseña si fue modificada.
       */
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  // ==========================================
  // Métodos de instancia
  // ==========================================

  /**
   * Valida si la contraseña proporcionada coincide con el hash almacenado.
   * @param {string} password - Contraseña en texto plano a verificar
   * @returns {Promise<boolean>} true si la contraseña es correcta
   */
  Usuario.prototype.validarPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return Usuario;
};

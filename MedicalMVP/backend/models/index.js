/**
 * models/index.js
 * Archivo índice de modelos de Sequelize.
 * Importa todos los modelos, define las asociaciones entre ellos
 * y exporta todo junto con la instancia de Sequelize.
 */

const sequelize = require('../config/database');

// ==========================================
// Importar y registrar todos los modelos
// ==========================================
const Usuario = require('./Usuario')(sequelize);
const Paciente = require('./Paciente')(sequelize);
const ControlMedico = require('./ControlMedico')(sequelize);

// ==========================================
// Definir asociaciones entre modelos
// ==========================================

// Un Paciente tiene muchos Controles Médicos
Paciente.hasMany(ControlMedico, {
  foreignKey: 'paciente_id',
  as: 'controles',
  onDelete: 'CASCADE',  // Si se elimina el paciente, se eliminan sus controles
  onUpdate: 'CASCADE'
});

// Cada Control Médico pertenece a un Paciente
ControlMedico.belongsTo(Paciente, {
  foreignKey: 'paciente_id',
  as: 'paciente'
});

// Un Usuario (profesional) tiene muchos Controles Médicos registrados
Usuario.hasMany(ControlMedico, {
  foreignKey: 'usuario_id',
  as: 'controles',
  onDelete: 'RESTRICT',  // No permitir eliminar un usuario con controles registrados
  onUpdate: 'CASCADE'
});

// Cada Control Médico pertenece a un Usuario (profesional que lo registró)
ControlMedico.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'profesional'
});

// ==========================================
// Exportar modelos e instancia de Sequelize
// ==========================================
module.exports = {
  sequelize,
  Usuario,
  Paciente,
  ControlMedico
};

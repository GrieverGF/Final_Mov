/**
 * routes/auth.js
 * Rutas de autenticación para el sistema de controles médicos.
 * Maneja el inicio de sesión y la generación de tokens JWT.
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const router = express.Router();

// ==========================================
// POST /api/auth/login
// Iniciar sesión con usuario y contraseña
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se proporcionaron las credenciales
    if (!username || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Debe proporcionar nombre de usuario y contraseña'
      });
    }

    // Buscar el usuario por nombre de usuario
    const usuario = await Usuario.findOne({
      where: { username }
    });

    // Verificar que el usuario existe
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'El nombre de usuario o la contraseña son incorrectos'
      });
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      return res.status(401).json({
        error: 'Cuenta desactivada',
        mensaje: 'Su cuenta ha sido desactivada. Contacte al administrador.'
      });
    }

    // Verificar la contraseña usando el método de instancia del modelo
    const passwordValida = await usuario.validarPassword(password);

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'El nombre de usuario o la contraseña son incorrectos'
      });
    }

    // Crear el payload del token JWT
    const payload = {
      id: usuario.id,
      username: usuario.username,
      role: usuario.role
    };

    // Generar el token JWT con expiración de 24 horas
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    // Responder con el token y la información del rol
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      role: usuario.role,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre_completo: usuario.nombre_completo,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error.message);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Ocurrió un error al intentar iniciar sesión'
    });
  }
});

module.exports = router;

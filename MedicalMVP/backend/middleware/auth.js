/**
 * middleware/auth.js
 * Middleware de autenticación basado en JSON Web Tokens (JWT).
 * Verifica que cada solicitud protegida incluya un token válido
 * en el encabezado Authorization usando el esquema Bearer.
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el token JWT en el encabezado de la solicitud.
 * Si el token es válido, adjunta los datos del usuario decodificado a req.user.
 * Si no hay token o es inválido, responde con 401 (No autorizado).
 *
 * @param {import('express').Request} req - Objeto de solicitud
 * @param {import('express').Response} res - Objeto de respuesta
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 */
const verificarToken = (req, res, next) => {
  try {
    // Obtener el encabezado de autorización
    const authHeader = req.headers['authorization'];

    // Verificar que el encabezado existe
    if (!authHeader) {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'No se proporcionó un token de autenticación'
      });
    }

    // Extraer el token del esquema "Bearer <token>"
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    // Verificar y decodificar el token con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar los datos del usuario decodificado a la solicitud
    // Esto permite que las rutas posteriores accedan a req.user
    req.user = decoded;

    // Continuar con el siguiente middleware o controlador de ruta
    next();
  } catch (error) {
    // Manejar errores específicos de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        mensaje: 'Su sesión ha expirado. Por favor inicie sesión nuevamente.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido',
        mensaje: 'El token proporcionado no es válido.'
      });
    }

    // Error genérico de autenticación
    return res.status(401).json({
      error: 'Error de autenticación',
      mensaje: 'No se pudo verificar la identidad del usuario.'
    });
  }
};

module.exports = verificarToken;

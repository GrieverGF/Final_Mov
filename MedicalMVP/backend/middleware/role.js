/**
 * middleware/role.js
 * Middleware fábrica para verificación de roles de usuario.
 * Permite restringir el acceso a rutas según el rol del usuario autenticado.
 */

/**
 * Crea un middleware que verifica si el usuario tiene uno de los roles permitidos.
 * Debe usarse DESPUÉS del middleware de autenticación (auth.js),
 * ya que depende de req.user para obtener el rol del usuario.
 *
 * @param {string[]} rolesPermitidos - Array con los roles que tienen acceso
 * @returns {Function} Middleware de Express para verificar el rol
 *
 * @example
 * // Solo administradores pueden acceder
 * router.get('/stats', verificarRol(['Administrador']), controlador);
 *
 * // Administradores y profesionales pueden acceder
 * router.get('/datos', verificarRol(['Administrador', 'Profesional de Salud']), controlador);
 */
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado (req.user debe existir)
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        mensaje: 'Debe iniciar sesión antes de acceder a este recurso.'
      });
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acceso prohibido',
        mensaje: `Su rol (${req.user.role}) no tiene permisos para acceder a este recurso. Roles requeridos: ${rolesPermitidos.join(', ')}`
      });
    }

    // El usuario tiene el rol correcto, continuar
    next();
  };
};

module.exports = verificarRol;

const { verifyToken } = require('../utils/jwt.util');

/**
 * Middleware de autenticación.
 * Verifica el header Authorization: Bearer <token> y carga req.user.
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }
};

/**
 * Middleware de autorización por rol.
 * Uso: authorize('ADMIN') o authorize('ADMIN', 'USER')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado',
    });
  }
  if (!allowedRoles.includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para acceder a este recurso',
    });
  }
  return next();
};

module.exports = { authenticate, authorize };

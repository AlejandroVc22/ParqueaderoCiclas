const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ciclo-parqueadero-secret-key';

/**
 * Verifica el JWT emitido por el servicio de autenticación.
 * Ambos servicios comparten el mismo secreto vía variable de entorno.
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }
  if (!allowedRoles.includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para realizar esta acción',
    });
  }
  return next();
};

module.exports = { authenticate, authorize };

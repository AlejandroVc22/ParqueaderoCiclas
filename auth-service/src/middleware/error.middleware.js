/**
 * Middleware global de manejo de errores.
 * Convierte cualquier error lanzado en una respuesta JSON consistente.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[AUTH-SERVICE] Error:', err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
};

const notFoundHandler = (req, res) =>
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });

module.exports = { errorHandler, notFoundHandler };

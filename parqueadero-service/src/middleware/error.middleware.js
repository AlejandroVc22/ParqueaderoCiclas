const errorHandler = (err, req, res, next) => {
  console.error('[PARQUEADERO-SERVICE] Error:', err);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors?.map((e) => e.message) || [err.message],
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

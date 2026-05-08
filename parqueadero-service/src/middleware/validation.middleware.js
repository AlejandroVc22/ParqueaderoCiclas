const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
};

const createBicicletaValidator = [
  body('propietario').trim().notEmpty().withMessage('El propietario es obligatorio'),
  body('documento').trim().notEmpty().withMessage('El documento es obligatorio'),
  body('tipo_bicicleta').trim().notEmpty().withMessage('El tipo de bicicleta es obligatorio'),
  body('color').trim().notEmpty().withMessage('El color es obligatorio'),
  body('estado').optional().isIn(['PARQUEADA', 'RETIRADA']).withMessage('Estado inválido'),
  handleValidationErrors,
];

const updateBicicletaValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('propietario').optional().trim().notEmpty().withMessage('Propietario inválido'),
  body('documento').optional().trim().notEmpty().withMessage('Documento inválido'),
  body('tipo_bicicleta').optional().trim().notEmpty().withMessage('Tipo inválido'),
  body('color').optional().trim().notEmpty().withMessage('Color inválido'),
  body('estado').optional().isIn(['PARQUEADA', 'RETIRADA']).withMessage('Estado inválido'),
  handleValidationErrors,
];

const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  handleValidationErrors,
];

module.exports = {
  createBicicletaValidator,
  updateBicicletaValidator,
  idParamValidator,
};

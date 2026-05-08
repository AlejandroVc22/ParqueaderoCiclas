const { Router } = require('express');
const bicicletaController = require('../controllers/bicicleta.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  createBicicletaValidator,
  updateBicicletaValidator,
  idParamValidator,
} = require('../middleware/validation.middleware');

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// USER y ADMIN: solo lectura (estadísticas, listado y detalle)
router.get('/stats', (req, res, next) => bicicletaController.stats(req, res, next));
router.get('/', (req, res, next) => bicicletaController.list(req, res, next));
router.get('/:id', idParamValidator, (req, res, next) =>
  bicicletaController.getById(req, res, next)
);

// Solo ADMIN: crear, editar y eliminar bicicletas
router.post('/', authorize('ADMIN'), createBicicletaValidator, (req, res, next) =>
  bicicletaController.create(req, res, next)
);
router.put('/:id', authorize('ADMIN'), updateBicicletaValidator, (req, res, next) =>
  bicicletaController.update(req, res, next)
);
router.delete('/:id', authorize('ADMIN'), idParamValidator, (req, res, next) =>
  bicicletaController.delete(req, res, next)
);

module.exports = router;

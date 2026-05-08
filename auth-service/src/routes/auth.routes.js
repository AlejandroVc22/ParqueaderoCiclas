const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { registerValidator, loginValidator } = require('../middleware/validation.middleware');

const router = Router();

// Endpoints públicos
router.post('/register', registerValidator, (req, res, next) => authController.register(req, res, next));
router.post('/login', loginValidator, (req, res, next) => authController.login(req, res, next));

// Endpoints autenticados
router.get('/profile', authenticate, (req, res, next) => authController.profile(req, res, next));
router.get('/users/count', authenticate, (req, res, next) => authController.countUsers(req, res, next));
router.get('/users', authenticate, authorize('ADMIN'), (req, res, next) =>
  authController.listUsers(req, res, next)
);

// Endpoint interno para validar token (consumido por otros microservicios si lo desean)
router.get('/validate', authenticate, (req, res) =>
  res.status(200).json({ success: true, data: req.user })
);

module.exports = router;

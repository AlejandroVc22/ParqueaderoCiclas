const authService = require('../services/auth.service');

/**
 * Controlador de autenticación.
 * Solo coordina la entrada y salida HTTP.
 * La lógica vive en el servicio.
 */
class AuthController {
  async register(req, res, next) {
    try {
      const { nombre, correo, password, rol } = req.body;
      const result = await authService.register({ nombre, correo, password, rol });
      return res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { correo, password } = req.body;
      const result = await authService.login({ correo, password });
      return res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async profile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req, res, next) {
    try {
      const users = await authService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users,
        total: users.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async countUsers(req, res, next) {
    try {
      const total = await authService.countUsers();
      return res.status(200).json({
        success: true,
        data: { total },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

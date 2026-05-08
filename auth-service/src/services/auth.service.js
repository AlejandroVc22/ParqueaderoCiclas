const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');
const { toPublicUserDTO, toAuthResponseDTO } = require('../dtos/user.dto');

/**
 * Capa de servicio de autenticación.
 * Contiene la lógica de negocio: registrar, autenticar y obtener perfil.
 */
class AuthService {
  async register({ nombre, correo, password, rol }) {
    const existing = await userRepository.existsByEmail(correo);
    if (existing) {
      const err = new Error('El correo ya se encuentra registrado');
      err.statusCode = 409;
      throw err;
    }

    const hashed = await hashPassword(password);
    const allowedRoles = ['ADMIN', 'USER'];
    const finalRol = allowedRoles.includes(rol) ? rol : 'USER';

    const newUser = await userRepository.create({
      nombre,
      correo,
      password: hashed,
      rol: finalRol,
    });

    const token = generateToken({
      id: newUser.id,
      correo: newUser.correo,
      rol: newUser.rol,
    });

    return toAuthResponseDTO(newUser, token);
  }

  async login({ correo, password }) {
    const user = await userRepository.findByEmail(correo);
    if (!user) {
      const err = new Error('Credenciales inválidas');
      err.statusCode = 401;
      throw err;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      const err = new Error('Credenciales inválidas');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({
      id: user.id,
      correo: user.correo,
      rol: user.rol,
    });

    return toAuthResponseDTO(user, token);
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    return toPublicUserDTO(user);
  }

  async getAllUsers() {
    const users = await userRepository.findAll();
    return users.map(toPublicUserDTO);
  }

  async countUsers() {
    return userRepository.count();
  }
}

module.exports = new AuthService();

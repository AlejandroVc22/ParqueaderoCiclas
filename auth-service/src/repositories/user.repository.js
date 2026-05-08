const User = require('../models/user.model');

/**
 * Capa de acceso a datos para usuarios.
 * Toda interacción directa con el modelo se realiza aquí.
 */
class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findById(id) {
    return User.findByPk(id);
  }

  async findByEmail(correo) {
    return User.findOne({ where: { correo } });
  }

  async findAll() {
    return User.findAll({ order: [['createdAt', 'DESC']] });
  }

  async count() {
    return User.count();
  }

  async existsByEmail(correo) {
    const user = await User.findOne({ where: { correo } });
    return Boolean(user);
  }
}

module.exports = new UserRepository();

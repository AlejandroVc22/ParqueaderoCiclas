const { Op } = require('sequelize');
const Bicicleta = require('../models/bicicleta.model');

/**
 * Capa de acceso a datos para bicicletas.
 */
class BicicletaRepository {
  async create(data) {
    return Bicicleta.create(data);
  }

  async findAll(filter = {}) {
    const where = {};
    if (filter.estado) where.estado = filter.estado;
    if (filter.search) {
      where[Op.or] = [
        { propietario: { [Op.like]: `%${filter.search}%` } },
        { documento: { [Op.like]: `%${filter.search}%` } },
        { tipo_bicicleta: { [Op.like]: `%${filter.search}%` } },
        { color: { [Op.like]: `%${filter.search}%` } },
      ];
    }
    return Bicicleta.findAll({ where, order: [['createdAt', 'DESC']] });
  }

  async findById(id) {
    return Bicicleta.findByPk(id);
  }

  async update(id, data) {
    const bicicleta = await Bicicleta.findByPk(id);
    if (!bicicleta) return null;
    await bicicleta.update(data);
    return bicicleta;
  }

  async delete(id) {
    const bicicleta = await Bicicleta.findByPk(id);
    if (!bicicleta) return false;
    await bicicleta.destroy();
    return true;
  }

  async countByEstado(estado) {
    return Bicicleta.count({ where: { estado } });
  }

  async count() {
    return Bicicleta.count();
  }
}

module.exports = new BicicletaRepository();

const bicicletaRepository = require('../repositories/bicicleta.repository');
const { toBicicletaDTO } = require('../dtos/bicicleta.dto');

/**
 * Capa de servicios para bicicletas.
 * Centraliza la lógica de negocio del ciclo-parqueadero.
 */
class BicicletaService {
  async create(data) {
    const payload = {
      propietario: data.propietario,
      documento: data.documento,
      tipo_bicicleta: data.tipo_bicicleta,
      color: data.color,
      hora_ingreso: data.hora_ingreso || new Date(),
      hora_salida: data.hora_salida || null,
      estado: data.estado || 'PARQUEADA',
      observaciones: data.observaciones || null,
    };
    const bicicleta = await bicicletaRepository.create(payload);
    return toBicicletaDTO(bicicleta);
  }

  async list(filter = {}) {
    const items = await bicicletaRepository.findAll(filter);
    return items.map(toBicicletaDTO);
  }

  async getById(id) {
    const bicicleta = await bicicletaRepository.findById(id);
    if (!bicicleta) {
      const err = new Error('Bicicleta no encontrada');
      err.statusCode = 404;
      throw err;
    }
    return toBicicletaDTO(bicicleta);
  }

  async update(id, data) {
    const allowed = [
      'propietario',
      'documento',
      'tipo_bicicleta',
      'color',
      'hora_ingreso',
      'hora_salida',
      'estado',
      'observaciones',
    ];
    const sanitized = {};
    for (const key of allowed) {
      if (data[key] !== undefined) sanitized[key] = data[key];
    }

    // Si pasa a RETIRADA y no se envió hora_salida, registrar la actual.
    if (sanitized.estado === 'RETIRADA' && !sanitized.hora_salida) {
      sanitized.hora_salida = new Date();
    }

    const updated = await bicicletaRepository.update(id, sanitized);
    if (!updated) {
      const err = new Error('Bicicleta no encontrada');
      err.statusCode = 404;
      throw err;
    }
    return toBicicletaDTO(updated);
  }

  async delete(id) {
    const ok = await bicicletaRepository.delete(id);
    if (!ok) {
      const err = new Error('Bicicleta no encontrada');
      err.statusCode = 404;
      throw err;
    }
    return { id };
  }

  async getStats() {
    const [total, parqueadas, retiradas] = await Promise.all([
      bicicletaRepository.count(),
      bicicletaRepository.countByEstado('PARQUEADA'),
      bicicletaRepository.countByEstado('RETIRADA'),
    ]);
    return { total, parqueadas, retiradas };
  }
}

module.exports = new BicicletaService();

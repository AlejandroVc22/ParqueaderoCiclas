const bicicletaService = require('../services/bicicleta.service');

class BicicletaController {
  async create(req, res, next) {
    try {
      const result = await bicicletaService.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Bicicleta registrada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const { estado, search } = req.query;
      const data = await bicicletaService.list({ estado, search });
      return res.status(200).json({
        success: true,
        data,
        total: data.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await bicicletaService.getById(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await bicicletaService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Bicicleta actualizada correctamente',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await bicicletaService.delete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Bicicleta eliminada correctamente',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async stats(req, res, next) {
    try {
      const data = await bicicletaService.getStats();
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BicicletaController();

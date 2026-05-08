import { parqueaderoClient } from './axios.js';

export const listBicicletas = (params = {}) =>
  parqueaderoClient.get('/bicicletas', { params });

export const getBicicleta = (id) => parqueaderoClient.get(`/bicicletas/${id}`);

export const createBicicleta = (data) => parqueaderoClient.post('/bicicletas', data);

export const updateBicicleta = (id, data) =>
  parqueaderoClient.put(`/bicicletas/${id}`, data);

export const deleteBicicleta = (id) => parqueaderoClient.delete(`/bicicletas/${id}`);

export const getBicicletasStats = () => parqueaderoClient.get('/bicicletas/stats');

/**
 * DTOs del módulo de bicicletas.
 * Convierten instancias del modelo en objetos planos seguros.
 */
const toBicicletaDTO = (bicicleta) => {
  if (!bicicleta) return null;
  const plain = typeof bicicleta.toJSON === 'function' ? bicicleta.toJSON() : bicicleta;
  return {
    id: plain.id,
    propietario: plain.propietario,
    documento: plain.documento,
    tipo_bicicleta: plain.tipo_bicicleta,
    color: plain.color,
    hora_ingreso: plain.hora_ingreso,
    hora_salida: plain.hora_salida,
    estado: plain.estado,
    observaciones: plain.observaciones,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

module.exports = { toBicicletaDTO };

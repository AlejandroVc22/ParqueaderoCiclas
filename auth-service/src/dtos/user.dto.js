/**
 * Data Transfer Objects para el módulo de autenticación.
 * Sirven para sanitizar y dar forma a la información que sale del servicio.
 */

const toPublicUserDTO = (user) => {
  if (!user) return null;
  const plain = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return {
    id: plain.id,
    nombre: plain.nombre,
    correo: plain.correo,
    rol: plain.rol,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

const toAuthResponseDTO = (user, token) => ({
  user: toPublicUserDTO(user),
  token,
});

module.exports = {
  toPublicUserDTO,
  toAuthResponseDTO,
};

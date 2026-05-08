const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ciclo-parqueadero-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Genera un token JWT con el id, correo y rol del usuario.
 */
const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Verifica y decodifica un token JWT.
 */
const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { generateToken, verifyToken, JWT_SECRET };

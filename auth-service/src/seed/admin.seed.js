const userRepository = require('../repositories/user.repository');
const { hashPassword } = require('../utils/password.util');

/**
 * Crea un usuario administrador por defecto si no existe.
 * Las credenciales pueden configurarse vía variables de entorno.
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cicloparqueadero.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    const exists = await userRepository.existsByEmail(adminEmail);
    if (exists) {
      console.log('[AUTH-SERVICE] Admin por defecto ya existe.');
      return;
    }

    const hashed = await hashPassword(adminPassword);
    await userRepository.create({
      nombre: adminName,
      correo: adminEmail,
      password: hashed,
      rol: 'ADMIN',
    });

    console.log('========================================================');
    console.log('[AUTH-SERVICE] Admin por defecto creado:');
    console.log(`  Correo:     ${adminEmail}`);
    console.log(`  Contraseña: ${adminPassword}`);
    console.log('========================================================');
  } catch (error) {
    console.error('[AUTH-SERVICE] Error sembrando admin:', error.message);
  }
};

module.exports = { seedAdmin };

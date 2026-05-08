const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo User para PostgreSQL.
 * Almacena las credenciales y el rol del usuario.
 */
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío' },
        len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' },
      },
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: 'El correo ya está registrado' },
      validate: {
        isEmail: { msg: 'El correo no tiene un formato válido' },
        notEmpty: { msg: 'El correo no puede estar vacío' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'USER'),
      allowNull: false,
      defaultValue: 'USER',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;

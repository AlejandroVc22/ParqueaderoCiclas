const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modelo Bicicleta.
 * Representa una bicicleta dentro del ciclo-parqueadero.
 */
const Bicicleta = sequelize.define(
  'Bicicleta',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    propietario: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El propietario es obligatorio' },
        len: { args: [2, 120], msg: 'El propietario debe tener entre 2 y 120 caracteres' },
      },
    },
    documento: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El documento es obligatorio' },
      },
    },
    tipo_bicicleta: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El tipo de bicicleta es obligatorio' },
      },
    },
    color: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El color es obligatorio' },
      },
    },
    hora_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    hora_salida: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM('PARQUEADA', 'RETIRADA'),
      allowNull: false,
      defaultValue: 'PARQUEADA',
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'bicicletas',
    timestamps: true,
  }
);

module.exports = Bicicleta;

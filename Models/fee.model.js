const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Fee = sequelize.define("fee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  adminssionfee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Registractionfee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  feepermonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  coursename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courseduration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Fee;

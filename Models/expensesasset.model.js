const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const ExpensesAssest = sequelize.define("expensesasset", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  AssetType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AssetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AssetAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ExpensesAssest;

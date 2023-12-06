const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const ExpensesAssestType = sequelize.define("expensesassesttype", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AssetType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ExpensesAssestType;

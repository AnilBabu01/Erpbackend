const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Expenses = sequelize.define("expenses", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Expensestype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ExpensesAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  PayOption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MonthNO: {
    type: DataTypes.INTEGER,
    allowNull: false,
   
  },
});

module.exports = Expenses;

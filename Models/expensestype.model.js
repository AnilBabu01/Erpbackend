const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Expensestype = sequelize.define("expensestype", {
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
});

module.exports = Expensestype;

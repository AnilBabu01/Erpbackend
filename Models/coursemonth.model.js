const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Coursemonth = sequelize.define("coursemonth", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  noOfMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = Coursemonth;

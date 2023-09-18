const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Coursemonth = sequelize.define("coursemonth", {
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
  noOfMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = Coursemonth;

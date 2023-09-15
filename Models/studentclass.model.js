const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const StudentClass = sequelize.define("class", {
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
  typeoforganization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stidentclass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = StudentClass;

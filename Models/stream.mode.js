const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Stream = sequelize.define("stream", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Stream: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Class: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Stream;

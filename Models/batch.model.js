const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Batch = sequelize.define("Batch", {
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
  StartingTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EndingTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Batch;

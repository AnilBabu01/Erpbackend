const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Slider = sequelize.define("slider", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ImgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Dec: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Slider;

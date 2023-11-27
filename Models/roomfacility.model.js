const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Roomfacility = sequelize.define("roomfacility", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roomFacility: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Roomfacility;

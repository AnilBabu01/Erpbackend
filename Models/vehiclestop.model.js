const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const VehicleRoute = require("../Models/vehicleroute.model");
const VehicleStop = sequelize.define("vehiclestop", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  RouteId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FromRoute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ToRoute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = VehicleStop;

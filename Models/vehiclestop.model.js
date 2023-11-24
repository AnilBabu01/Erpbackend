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
    allowNull: false,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  StopName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StopStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue:false
  },
});

module.exports = VehicleStop;

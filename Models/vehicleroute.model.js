const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const VehicleStop = require("../Models/vehiclestop.model");
const VehicleRoute = sequelize.define("vehicleroute", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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

VehicleRoute.hasMany(VehicleStop, { primaryKey: "id" });
VehicleStop.belongsTo(VehicleRoute, { foreignKey: "RouteId" });

module.exports = VehicleRoute;

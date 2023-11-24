const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const VehicleDetails = sequelize.define("vehicledetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Vahicletype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  routeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  BusNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FualType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Color: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  GPSDeviceURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DriverId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = VehicleDetails;

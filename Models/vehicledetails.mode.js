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
  NoOfSheets: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  DriverId1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  DriverId2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  HelferId1: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  HelferId2: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  RealSheets: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
});

module.exports = VehicleDetails;

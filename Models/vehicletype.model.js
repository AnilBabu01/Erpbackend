const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const VehicleType = sequelize.define("vehicletype", {
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
});

module.exports = VehicleType;

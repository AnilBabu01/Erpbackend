const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Room = sequelize.define("roominhostel", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  hostelname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Facility: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FromRoom: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ToRoom: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PermonthFee: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Room;

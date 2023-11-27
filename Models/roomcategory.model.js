const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const RoomCategory = sequelize.define("roomcategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roomCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RoomCategory;

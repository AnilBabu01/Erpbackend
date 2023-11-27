const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const RoomHostel = sequelize.define("hostel", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  HostelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DescripTion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Hostelurl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RoomHostel;

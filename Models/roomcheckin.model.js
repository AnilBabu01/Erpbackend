const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const RoomCheckin = sequelize.define("roomcheckin", {
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
  hostelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  FacilityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  RoomNo: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  StudentName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  StudentClass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Section: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  SNO: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  StudentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ParentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CheckinDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  MobileNO: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = RoomCheckin;

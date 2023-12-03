const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const OtherFee = sequelize.define("otherfee", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fathername: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  batchname: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  PaidDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  PaidAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fathersid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SNO: {
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
  OtherFeeName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  FeeAmount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  DuesDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
  PaidStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = OtherFee;

const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const SchoolTransportFeeStatus = sequelize.define("schooltransportfeestatus", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PerMonthFee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  MonthName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Year: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Paiddate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paidStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  SrNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = SchoolTransportFeeStatus;

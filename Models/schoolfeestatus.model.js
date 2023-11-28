const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const SchoolFeeStatus = sequelize.define("schoolfeestatus", {
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
});

module.exports = SchoolFeeStatus;

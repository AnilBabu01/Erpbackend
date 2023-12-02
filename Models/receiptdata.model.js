const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const ReceiptData = sequelize.define("receiptdata", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  typeoforganization: {
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
  ReceiptNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Feetype: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Registration",
  },
  // PayForMonth: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  PaidDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  RollNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PaidAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
});

module.exports = ReceiptData;

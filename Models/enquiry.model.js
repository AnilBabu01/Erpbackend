const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Enquiry = sequelize.define("enquiry", {
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
    allowNull: false,
  },
  EnquiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  StudentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StudentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StudentEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Enquiry;

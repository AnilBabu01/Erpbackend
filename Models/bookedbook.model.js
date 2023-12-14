const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const BookedBook = sequelize.define("bookedbook", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courseorclass: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  studentid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rollnumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  IssueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ReturnDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  BookId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BookTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  auther: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bookfine: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  issueStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  returnStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  Session: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Section: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SrNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = BookedBook;

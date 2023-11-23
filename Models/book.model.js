const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");

const Book = sequelize.define("book", {
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  addDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new Date(),
  },
  issueStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = Book;

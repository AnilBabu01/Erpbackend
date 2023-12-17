const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Parent = sequelize.define("parent", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "parent",
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneno1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  whatsaapNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileurl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.TEXT,
  },
 
});

module.exports = Parent;

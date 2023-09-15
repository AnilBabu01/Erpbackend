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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ClientCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneno1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneno2: {
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
  logourl: {
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
  fathersName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  MathersName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fathersPhoneNo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Parent;

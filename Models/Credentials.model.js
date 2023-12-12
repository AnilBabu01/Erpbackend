const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Credential = sequelize.define("credentail", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "college",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Sendemail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  SendemailPassword: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  institutename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ClientCode: {
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
  certificatelogo: {
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
  Studentpassword: {
    type: DataTypes.TEXT,
    defaultValue: "Student",
  },
  Parentpassword: {
    type: DataTypes.TEXT,
    defaultValue: "Parent",
  },
  Employeepassword: {
    type: DataTypes.TEXT,
    defaultValue: "Employee",
  },
  newclient: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  Library: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  Transport: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  hostel: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  FrontOffice: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Credential;

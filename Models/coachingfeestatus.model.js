const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Coachingfeestatus = sequelize.define("coachingfeestatus", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
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
  Jan: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Feb: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Mar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  April: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  May: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  June: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  July: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Aug: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Sep: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Oct: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Nov: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Dec: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Jan2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Feb2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Mar2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  April2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  May2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  June2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  July2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Aug2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Sep2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Oct2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Nov2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Dec2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Jan3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Feb3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Mar3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  April3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  May3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  June3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  July3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Aug3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Sep3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Oct3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Nov3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
  Dec3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Dues"
  },
});

module.exports = Coachingfeestatus;

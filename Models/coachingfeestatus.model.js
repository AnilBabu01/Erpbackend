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
    allowNull: false,
  },
  Jan: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Feb: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Mar: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  April: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  May: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  June: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  July: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Aug: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Sep: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Oct: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Nov: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Dec: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Jan2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Feb2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Mar2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  April2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  May2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  June2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  July2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Aug2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Sep2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Oct2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Nov2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Dec2: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Jan3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Feb3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Mar3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  April3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  May3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  June3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  July3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Aug3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Sep3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Oct3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Nov3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
  Dec3: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"Does"
  },
});

module.exports = Coachingfeestatus;

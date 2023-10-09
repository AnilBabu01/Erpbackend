const { DataTypes } = require("sequelize");
const sequelize = require("../Helper/Connect");
const Question = sequelize.define("question", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  testId: {
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
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option4: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correctoption: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answeroption: { 
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:false
  },
  currectanswer: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:''
  },
});

module.exports = Question;
